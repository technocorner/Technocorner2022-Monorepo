import { json, NextFunction, Request, Response, Router } from "express";
import { FieldValue } from "firebase-admin/firestore";
import restrictRegist from "../../../../data/restrictRegist";
import asyncHandler from "../../../asyncHandler";
import firebase from "../../../firebase";
import randomId from "../../../randomId";
import validateDateReg from "./validateDateReg";
import validasiRegistrasi from "./validateUser";

const router = Router();

router.use(json());

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const pengguna = req.session!.ref;
    const kompetisi = req.headers.acara as string;
    const namaTim = (req.body.namaTim as string).trim();

    const dateReg = validateDateReg(kompetisi);
    if (!dateReg.status) {
      return res.json(dateReg);
    }

    let idTim = "";

    let random = false;
    do {
      idTim = randomId(5);
      const timDoc = await firebase
        .firestore()
        .collection(`acara/${kompetisi}/tim`)
        .doc(idTim)
        .get();
      if (!timDoc.exists) {
        random = true;
      }
    } while (!random);

    const penggunaRef = firebase
      .firestore()
      .collection("pengguna")
      .doc(pengguna);
    const penggunaDoc = await penggunaRef.get();

    if (!penggunaDoc.exists) {
      return res.json({
        success: false,
        body: { error: "Akun tidak ditemukan" },
      });
    }

    if (penggunaDoc.data()!.bekukan) {
      return res.json({
        success: false,
        body: {
          error:
            "Akun Anda dibekukan. Silakan hubungi panitia untuk informasi lebih lanjut.",
        },
      });
    }

    if (restrictRegist[kompetisi as keyof typeof restrictRegist]) {
      for (const [key, value] of Object.entries(
        restrictRegist[kompetisi as keyof typeof restrictRegist]
      )) {
        if (value !== penggunaDoc.data()![key]) {
          return res.json({
            success: false,
            body: {
              error: `Gagal melakukan registrasi: ${key} harus ${value}. Periksa identitas diri pada halaman profil.`,
            },
          });
        }
      }
    }

    const validasi = validasiRegistrasi(
      {
        foto: penggunaDoc.data()!.foto,
        status: penggunaDoc.data()!.status,
        instansi: penggunaDoc.data()!.instansi,
        identitas: penggunaDoc.data()!.identitas,
        whatsapp: penggunaDoc.data()!.whatsapp,
        acara: penggunaDoc.data()!.acara,
      },
      kompetisi
    );
    if (!validasi.success) {
      return res.json(validasi);
    }

    const data: {
      nama: string;
      peserta: Array<{
        id: string;
        ketua: boolean;
        syarat: { twibbon: string };
      }>;
      tahap: number;
      pembayaran: null;
      verifikasi: boolean;
      createTime: FieldValue;
      proposal?: string;
      video?: string;
    } = {
      nama: namaTim,
      peserta: [{ id: pengguna, ketua: true, syarat: { twibbon: "" } }],
      tahap: 0,
      pembayaran: null,
      verifikasi: false,
      createTime: FieldValue.serverTimestamp(),
    };

    if (kompetisi === "iot") {
      data.proposal = "";
      data.video = "";
    }

    const acaraCol = firebase.firestore().collection(`acara/${kompetisi}/tim`);
    const tim = await acaraCol.where("nama", "==", namaTim).get();

    if (!tim.empty) {
      return res.json({
        success: false,
        body: { error: "Nama tim sudah terdaftar" },
      });
    }

    firebase.firestore().runTransaction(async (t) => {
      try {
        const statAcaraRef = firebase
          .firestore()
          .collection("statistik")
          .doc("acara");
        const statAcaraDoc = await t.get(statAcaraRef);

        t.update(statAcaraRef, {
          ...statAcaraDoc.data(),
          [kompetisi]: {
            ...statAcaraDoc.data()![kompetisi],
            total: statAcaraDoc.data()![kompetisi].total + 1,
          },
        });

        t.set(acaraCol.doc(idTim), data);

        const acara = penggunaDoc.data()!.acara;
        acara.push({ kategori: kompetisi, id: idTim });

        t.update(penggunaRef, { acara });
      } catch (e) {
        next(e);
        throw e;
      }
    });

    return res.json({ success: true, body: { id: idTim } });
  })
);

export default router;

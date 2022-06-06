import { json, NextFunction, Request, Response, Router } from "express";
import restrictRegist from "../../../../data/restrictRegist";
import asyncHandler from "../../../asyncHandler";
import firebase from "../../../firebase";
import validateDateReg from "./validateDateReg";
import validasiRegistrasi from "./validateUser";

const router = Router();

router.use(json());

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const pengguna = req.session!.ref;
    const kompetisi = req.headers.acara as string;
    const idTim = req.body.idTim;

    const dateReg = validateDateReg(kompetisi);
    if (!dateReg.status) {
      return res.json(dateReg);
    }
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

    const timRef = firebase
      .firestore()
      .collection(`acara/${kompetisi}/tim`)
      .doc(idTim);
    const timDoc = await timRef.get();

    if (!timDoc.exists) {
      return res.json({
        success: false,
        body: { error: "ID tim tidak ditemukan" },
      });
    }

    if (timDoc.data()!.verifikasi) {
      return res.json({
        success: false,
        body: {
          error:
            "Pendaftaran tim sudah diverifikasi. Tidak dapat menambah anggota.",
        },
      });
    }

    const peserta = timDoc.data()!.peserta as Array<{
      id: string;
      ketua: boolean;
      syarat: { twibbon: string };
    }>;

    if (peserta.length >= 3) {
      return res.json({
        success: false,
        body: { error: "Batas jumlah peserta telah terpenuhi" },
      });
    }

    const data: {
      id: string;
      ketua: boolean;
      syarat: { twibbon: string };
    } = {
      id: pengguna,
      ketua: false,
      syarat: { twibbon: "" },
    };

    peserta.push(data);

    await firebase.firestore().runTransaction(async (t) => {
      try {
        t.update(timRef, { peserta });

        const acara = penggunaDoc.data()!.acara;
        acara.push({
          kategori: kompetisi,
          id: idTim,
        });

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

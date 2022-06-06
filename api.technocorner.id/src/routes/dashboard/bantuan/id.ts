import { Request, Response, Router } from "express";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";
import getFirestoreUrl from "../../../libs/firebase/getFirestoreUrl";
import timestampToDate from "../../../libs/timestampToDate";

const router = Router();

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const peran = req.session!.role;
    const tanyaRef = firebase
      .firestore()
      .collection("pertanyaan")
      .doc(req.params!.id);

    let pertanyaan: FirebaseFirestore.DocumentData | undefined;
    let balasan: Array<{
      id: string;
      isi: string;
      lampiran: Array<string>;
      pengguna: {
        id: string;
        nama: string;
        foto: string;
      };
      waktu: { tanggal: string; pukul: string };
    }> = [];

    const tanyaDoc = await tanyaRef.get();

    if (!tanyaDoc.exists) {
      return res.json({
        success: false,
        body: { error: "Pertanyaan tidak ditemukan" },
      });
    }

    const waktu = timestampToDate(tanyaDoc.data()!.waktu.toDate());
    const penggunaDoc = await firebase
      .firestore()
      .collection("pengguna")
      .doc(tanyaDoc.data()!.pengguna)
      .get();

    const foto = await getFirestoreUrl(
      `pengguna/foto/${penggunaDoc.data()!.foto}`
    );

    let lampiran: Array<string> = [];
    await Promise.all(
      (tanyaDoc.data()!.lampiran as Array<string>).map(async (l) => {
        lampiran.push(await getFirestoreUrl(`pertanyaan/lampiran/${l}`));
      })
    );

    pertanyaan = {
      id: tanyaDoc.id,
      judul: tanyaDoc.data()!.judul,
      isi: tanyaDoc.data()!.isi,
      label: tanyaDoc.data()!.label,
      lampiran,
      pengguna: {
        id: penggunaDoc.id,
        nama: penggunaDoc.data()!.nama,
        foto,
      },
      waktu,
      ditutup: tanyaDoc.data()!.ditutup,
    };

    const balasanDocs = await tanyaRef
      .collection("balasan")
      .orderBy("waktu", "asc")
      .get();
    const balasanData: Array<
      FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    > = [];
    balasanDocs.forEach((doc) => {
      balasanData.push(doc);
    });
    await Promise.all(
      balasanData.map(async (doc) => {
        const waktu = timestampToDate(doc.data().waktu.toDate());
        const penggunaDoc = await firebase
          .firestore()
          .collection("pengguna")
          .doc(doc.data()!.pengguna)
          .get();

        let foto = penggunaDoc.data()!.foto;
        if (
          !foto.includes("api.technocorner.id") &&
          !foto.includes("localhost")
        ) {
          foto = await getFirestoreUrl(
            `pengguna/foto/${penggunaDoc.data()!.foto}`
          );
        }

        let lampiran: Array<string> = [];
        await Promise.all(
          (doc.data()!.lampiran as Array<string>).map(async (l) => {
            lampiran.push(await getFirestoreUrl(`pertanyaan/lampiran/${l}`));
          })
        );

        balasan.push({
          id: doc.id,
          isi: doc.data()!.isi,
          lampiran,
          pengguna: {
            id: penggunaDoc.id,
            nama: penggunaDoc.data()!.nama,
            foto,
          },
          waktu,
        });
      })
    );

    balasan.sort((a, b) =>
      a.waktu.tanggal + a.waktu.pukul >= b.waktu.tanggal + b.waktu.pukul
        ? 1
        : -1
    );

    return res.json({ success: true, body: { pertanyaan, balasan, peran } });
  })
);

export default router;

import { Request, Response, Router } from "express";
import { Timestamp } from "firebase-admin/firestore";
import asyncHandler from "../../../asyncHandler";
import firebase from "../../../firebase";
import getFirestoreUrl from "../../../firebase/getFirestoreUrl";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const kategori = req.headers.acara;

    let pendaftaranData: Array<FirebaseFirestore.DocumentData> = [];
    let pendaftaranRef = firebase
      .firestore()
      .collection(`acara/${kategori}/peserta`)
      .orderBy("verifikasi")
      .orderBy("createTime", "desc");
    const pendaftaranDocs = await pendaftaranRef.get();
    pendaftaranDocs.forEach((doc) => pendaftaranData.push(doc.data()));

    let peserta: Array<{}> = [];

    if (kategori === "workshop") {
      await Promise.all(
        pendaftaranData.map(async (pendaftaran) => {
          const pendaftar: Array<{
            id: string;
            nama: string;
            whatsapp: string;
            instansi: string;
          }> = [];
          await Promise.all(
            (
              pendaftaran.peserta as Array<{ id: string; verifikasi: boolean }>
            ).map(async (p) => {
              const penggunaDoc = await firebase
                .firestore()
                .collection("pengguna")
                .doc(p.id)
                .get();
              pendaftar.push({
                id: penggunaDoc.id,
                nama: penggunaDoc.data()!.nama,
                whatsapp: penggunaDoc.data()!.whatsapp,
                instansi: penggunaDoc.data()!.instansi,
              });
            })
          );

          if (pendaftar.length > 0) {
            pendaftar.sort((a, b) =>
              a.nama > b.nama ? 1 : b.nama > a.nama ? -1 : 0
            );
          }

          let pembayaran = "";
          if (pendaftaran.pembayaran) {
            pembayaran = await getFirestoreUrl(
              `acara/${kategori}/peserta/pembayaran/${pendaftaran.pembayaran}`
            );
          }

          peserta.push({
            id: pendaftaran.id,
            peserta: pendaftar,
            pembayaran,
            verifikasi: pendaftaran.verifikasi,
            waktu: (pendaftaran.createTime as Timestamp).toMillis(),
          });
        })
      );
    } else if (kategori === "webinar") {
      await Promise.all(
        pendaftaranData.map(async (pendaftaran) => {
          const penggunaDoc = await firebase
            .firestore()
            .collection("pengguna")
            .doc(pendaftaran.peserta[0].id)
            .get();

          let poster: Array<string> = [];
          await Promise.all(
            (pendaftaran.peserta[0].syarat.poster as Array<string>).map(
              async (p) => {
                if (p) {
                  poster.push(
                    await getFirestoreUrl(
                      `acara/${kategori}/peserta/poster/${p}`
                    )
                  );
                }
              }
            )
          );

          peserta.push({
            idPendaftaran: pendaftaran.id,
            id: penggunaDoc.id,
            nama: penggunaDoc.data()!.nama,
            whatsapp: penggunaDoc.data()!.whatsapp,
            poster,
            instansi: penggunaDoc.data()!.instansi,
            verifikasi: pendaftaran.verifikasi,
            waktu: (pendaftaran.createTime as Timestamp).toMillis(),
          });
        })
      );
    }

    peserta.sort((a, b) => {
      const m = b as { nama: string; waktu: number };
      const n = a as { nama: string; waktu: number };

      if (m.waktu > n.waktu) {
        return 1;
      }
      if (n.waktu > m.waktu) {
        return -1;
      }

      if (m.nama > n.nama) {
        return 1;
      }
      if (n.nama > m.nama) {
        return -1;
      }

      return 0;
    });

    if (kategori === "workshop") {
      peserta.sort((a, b) => {
        const isABayar = (a as { pembayaran: string }).pembayaran.length > 0;
        const isBBayar = (b as { pembayaran: string }).pembayaran.length > 0;

        if (isABayar === isBBayar) {
          return 0;
        }
        if (isABayar) {
          return -1;
        }
        return 0;
      });
    }

    peserta.sort((a, b) =>
      (a as { verifikasi: boolean }).verifikasi ===
      (b as { verifikasi: boolean }).verifikasi
        ? 0
        : (a as { verifikasi: boolean }).verifikasi
        ? 1
        : -1
    );

    return res.json({ success: true, body: peserta });
  })
);

export default router;

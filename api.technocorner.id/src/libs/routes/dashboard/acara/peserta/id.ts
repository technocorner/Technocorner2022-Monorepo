import { Request, Response, Router } from "express";
import { Timestamp } from "firebase-admin/firestore";
import { workshop } from "../../../../../data/events";
import asyncHandler from "../../../../asyncHandler";
import firebase from "../../../../firebase";
import getFirestoreUrl from "../../../../firebase/getFirestoreUrl";
import rupiahFormatter from "../../../../rupiahFormatter";
import kirimEmail from "../../kirim-email";
import hapus from "./hapus";

const router = Router();

router.use("/hapus", hapus); // Not maintained
router.use("/kirim-email", kirimEmail);

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const pengguna = req.session!.ref as string;
    const peran = req.session!.role;
    const kategori = req.headers.acara;
    let id = req.params.id;

    const pesertaDoc = await firebase
      .firestore()
      .collection(`acara/${kategori}/peserta`)
      .doc(id)
      .get();

    if (!pesertaDoc.exists) {
      return res.json({
        success: false,
        body: { error: "Data tidak ditemukan" },
      });
    }

    let cancel = false;
    if (peran !== "admin") {
      if (
        kategori === "webinar" &&
        pengguna !== pesertaDoc.data()!.peserta[0].id
      ) {
        cancel = true;
      } else if (kategori === "workshop") {
        cancel = true;
        for (const peserta of pesertaDoc.data()!.peserta) {
          if (pengguna === peserta.id) {
            cancel = false;
            break;
          }
        }
      }
    }
    if (cancel) {
      return res.json({
        success: false,
        body: { error: "Tidak berhak mengakses data peserta" },
      });
    }

    if (kategori === "webinar") {
      const penggunaDoc = await firebase
        .firestore()
        .collection("pengguna")
        .doc(pesertaDoc.data()!.peserta[0].id)
        .get();

      let foto = penggunaDoc.data()!.foto;
      if (
        penggunaDoc.data()!.foto &&
        !(
          (penggunaDoc.data()!.foto as string).includes("technocorner.id") ||
          (penggunaDoc.data()!.foto as string).includes("localhost")
        )
      ) {
        foto = getFirestoreUrl("pengguna/foto/" + penggunaDoc.data()!.foto);
      }

      let identitas = penggunaDoc.data()!.identitas;
      if (identitas) {
        identitas = getFirestoreUrl(
          "pengguna/identitas/" + penggunaDoc.data()!.identitas
        );
      }

      let poster: Array<{ id: string; link: string }> = [];
      await Promise.all(
        (pesertaDoc.data()!.peserta[0].syarat.poster as Array<string>).map(
          async (p) => {
            if (p) {
              poster.push({
                id: p,
                link: await getFirestoreUrl(
                  `acara/${kategori}/peserta/poster/${p}`
                ),
              });
            }
          }
        )
      );

      const data: {
        idPendaftaran: string;
        id: string;
        foto: string;
        nama: string;
        email: string;
        status: string;
        instansi: string;
        identitas: string;
        whatsapp: string;
        syarat: { poster: Array<{ id: string; link: string }> };
        verifikasi: boolean;
        verifikasiEmailTerkirim?: boolean;
        verifikasiPendaftaran: boolean;
        peran: string;
      } = {
        idPendaftaran: pesertaDoc.id,
        id: penggunaDoc.id,
        foto: await foto,
        nama: penggunaDoc.data()!.nama,
        email: penggunaDoc.data()!.email,
        status: penggunaDoc.data()!.status,
        instansi: penggunaDoc.data()!.instansi,
        identitas: await identitas,
        whatsapp: penggunaDoc.data()!.whatsapp,
        syarat: { poster },
        verifikasi: penggunaDoc.data()!.verifikasi,
        verifikasiPendaftaran: pesertaDoc.data()!.verifikasi,
        peran,
      };

      if (peran === "admin") {
        data.verifikasiEmailTerkirim =
          pesertaDoc.data()!.verifikasiEmailTerkirim;
      }

      return res.json({
        success: true,
        body: data,
      });
    }

    if (kategori === "workshop") {
      let penggunaKode: Array<{
        id: string;
        nama: string;
        verifikasi: boolean;
        pembayar: boolean;
      }> = [];
      let poster: Array<{ id: string; link: string }> = [];
      await Promise.all(
        (
          pesertaDoc.data()!.peserta as Array<{
            id: string;
            pembayar?: boolean;
            syarat: { poster: Array<string> };
          }>
        ).map(async (p, index) => {
          const penggunaDoc = await firebase
            .firestore()
            .collection("pengguna")
            .doc(p.id)
            .get();

          penggunaKode.push({
            id: penggunaDoc.id,
            nama: penggunaDoc.data()!.nama,
            verifikasi: penggunaDoc.data()!.verifikasi,
            pembayar: pesertaDoc.data()!.peserta[index].pembayar,
          });

          if (
            (peran === "admin" && pesertaDoc.data()!.peserta.length === 1) ||
            pengguna === p.id
          ) {
            await Promise.all(
              (p.syarat.poster as Array<string>).map(async (p) => {
                poster.push({
                  id: p,
                  link: await getFirestoreUrl(
                    `acara/${kategori}/peserta/poster/${p}`
                  ),
                });
              })
            );
          }
        })
      );

      penggunaKode.sort((a, b) =>
        a.pembayar === b.pembayar ? 0 : a.pembayar ? -1 : 1
      );

      let pembayaran: any = "";
      if (pesertaDoc.data()!.pembayaran) {
        pembayaran = getFirestoreUrl(
          `acara/workshop/peserta/pembayaran/${pesertaDoc.data()!.pembayaran}`
        );
      }

      const date = Date.now();

      const referral =
        (pesertaDoc.data()!.createTime as Timestamp).toMillis() >=
          workshop.registration[1].date[0].getTime() &&
        date >= workshop.registration[1].date[0].getTime() &&
        date < workshop.registration[1].date[1].getTime();

      let biaya = 20000;

      if (referral) {
        for (const peserta of penggunaKode) {
          if (peran === "admin" || pengguna === peserta.id) {
            if (
              date >= workshop.registration[0].date[0].getTime() &&
              date < workshop.registration[0].date[1].getTime()
            ) {
              biaya = 20000;
            } else if (
              date >= workshop.registration[1].date[0].getTime() &&
              date < workshop.registration[1].date[1].getTime()
            ) {
              biaya = 35000;
              const banyakPengguna = penggunaKode.length;
              if (banyakPengguna === 2) {
                biaya = 30000;
              } else if (banyakPengguna >= 3 && banyakPengguna < 5) {
                biaya = 25000;
              } else if (banyakPengguna >= 5) {
                biaya = 20000;
              } else if (
                banyakPengguna === 1 &&
                pesertaDoc.data()!.peserta[0].syarat.poster.length >= 4
              ) {
                biaya = 30000;
              }
            }
            break;
          }
        }
      }

      const data: {
        id: string;
        biaya: string;
        pembayaran: string;
        syarat: {
          poster: Array<{
            id: string;
            link: string;
          }>;
        };
        verifikasi: boolean;
        verifikasiEmailTerkirim?: boolean;
        penggunaKode: Array<{
          id: string;
          nama: string;
          verifikasi: boolean;
          pembayar: boolean;
        }>;
        pengguna: string;
        peran: string;
        referral: boolean;
      } = {
        id: pesertaDoc.id,
        biaya: rupiahFormatter.format(biaya * penggunaKode.length),
        pembayaran: await pembayaran,
        syarat: { poster },
        verifikasi: pesertaDoc.data()!.verifikasi,
        penggunaKode,
        pengguna,
        peran,
        referral,
      };

      if (peran === "admin") {
        data.verifikasiEmailTerkirim =
          pesertaDoc.data()!.verifikasiEmailTerkirim;
      }

      return res.json({
        success: true,
        body: data,
      });
    }

    return res.json({
      success: false,
      body: { error: "Permintaan tidak valid" },
    });
  })
);

export default router;

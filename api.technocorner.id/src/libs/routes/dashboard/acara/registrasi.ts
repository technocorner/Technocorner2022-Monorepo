import { json, NextFunction, Request, Response, Router } from "express";
import { FieldValue } from "firebase-admin/firestore";
import asyncHandler from "../../../asyncHandler";
import validasiRegistrasi from "../kompetisi/validateUser";
import firebase from "../../../firebase";
import randomId from "../../../randomId";
import { events, webinar, workshop } from "../../../../data/events";

const router = Router();

router.use(json());

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const date = Date.now();
    const pengguna = req.session!.ref;
    const acara = req.headers.acara;

    let id = "";
    let notOpen = { status: false, date: new Date() };
    let isClosed = false;
    switch (acara) {
      case "webinar":
        if (date < webinar.registration[0].date[0].getTime()) {
          notOpen = { status: true, date: webinar.registration[0].date[0] };
        } else if (date >= webinar.registration[0].date[1].getTime()) {
          isClosed = true;
        }

        id = randomId(32);

        break;
      case "workshop":
        if (date < workshop.registration[0].date[0].getTime()) {
          notOpen = { status: true, date: workshop.registration[0].date[0] };
        } else if (date >= workshop.registration[1].date[1].getTime()) {
          isClosed = true;
        }

        if (req.body.kode) {
          id = req.body.kode;
        } else {
          id = randomId(5);
        }

        break;
      default:
        return res.json({
          success: false,
          body: { error: "Permintaan tidak valid" },
        });
    }

    // DELETE THIS
    // notOpen.status = false;

    if (notOpen.status) {
      const title = events.find((e) => e.id === acara)!.name;

      const hari = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
      ][notOpen.date.getDay()];
      const tanggal = `${notOpen.date.getDate()} ${
        [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ][notOpen.date.getMonth()]
      } ${notOpen.date.getFullYear()}`;

      return res.json({
        success: false,
        body: {
          error: `Mohon maaf, pendaftaran belum dibuka. Pendaftaran ${title} akan dibuka mulai ${hari}, ${tanggal} pukul ${notOpen.date.toLocaleTimeString(
            "id"
          )}`,
        },
      });
    }

    if (isClosed) {
      return res.json({
        success: false,
        body: {
          error:
            "Mohon maaf, pendaftaran telah ditutup. Sampai bertemu di Technocorner 2023!",
        },
      });
    }

    await firebase.firestore().runTransaction(async (t) => {
      try {
        const penggunaRef = firebase
          .firestore()
          .collection("pengguna")
          .doc(pengguna);
        const penggunaDoc = await t.get(penggunaRef);

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

        const validasi = validasiRegistrasi(
          {
            foto: penggunaDoc.data()!.foto,
            status: penggunaDoc.data()!.status,
            instansi: penggunaDoc.data()!.instansi,
            identitas: penggunaDoc.data()!.identitas,
            whatsapp: penggunaDoc.data()!.whatsapp,
            acara: penggunaDoc.data()!.acara,
          },
          acara
        );
        if (!validasi.success) {
          return res.json(validasi);
        }

        const statAcaraRef = firebase
          .firestore()
          .collection("statistik")
          .doc("acara");
        const statAcaraDoc = await t.get(statAcaraRef);

        const acaraRef = firebase
          .firestore()
          .collection(`acara/${acara}/peserta`)
          .doc(id);

        let data: {
          id: string;
          pembayaran?: null;
          verifikasi: boolean;
          peserta: Array<{
            id: string;
            syarat: { poster: Array<string> };
            pembayar?: boolean;
          }>;
          createTime: FieldValue;
        };
        if (acara === "webinar" || (acara === "workshop" && !req.body.kode)) {
          data = {
            id,
            verifikasi: false,
            peserta: [{ id: pengguna, syarat: { poster: [] } }],
            createTime: FieldValue.serverTimestamp(),
          };

          if (acara === "workshop") {
            data.pembayaran = null;
            data.peserta[0].pembayar = true;
          }

          t.set(acaraRef, data);
        } else {
          const pesertaDoc = await t.get(acaraRef);

          if (!pesertaDoc.exists) {
            return res.json({
              success: false,
              body: { error: "Kode referral tidak ditemukan" },
            });
          }

          if (pesertaDoc.data()!.verifikasi) {
            return res.json({
              success: false,
              body: {
                error: `Pendaftaran dengan kode referral ${id} sudah diverifikasi. Kode referral tidak dapat digunakan lagi.`,
              },
            });
          }

          if (acara === "workshop" && req.body.kode) {
            const acaraDoc = await acaraRef.get();

            if (acaraDoc.data()!.peserta[0].syarat.poster.length > 0) {
              return res.json({
                success: false,
                body: {
                  error:
                    "Tidak dapat menggunakan kode referral karena pendaftar pertama telah mengunggah poster",
                },
              });
            }
          }

          const peserta: Array<{
            id: string;
            syarat: { poster: Array<string> };
            pembayar: boolean;
          }> = pesertaDoc.data()!.peserta;

          if (peserta.length >= 5) {
            return res.json({
              success: false,
              body: { error: "Batas pengguna kode referral telah terpenuhi" },
            });
          }

          peserta.push({
            id: pengguna,
            syarat: { poster: [] },
            pembayar: false,
          });
          t.update(acaraRef, { peserta });
        }

        const penggunaAcara = penggunaDoc.data()!.acara;
        penggunaAcara.push({ kategori: acara, id });

        t.update(penggunaRef, { acara: penggunaAcara });

        t.update(statAcaraRef, {
          ...statAcaraDoc.data(),
          [acara]: {
            ...statAcaraDoc.data()![acara],
            total: statAcaraDoc.data()![acara].total + 1,
          },
        });
      } catch (e) {
        next(e);
        throw e;
      }
    });

    return res.json({ success: true, body: { id } });
  })
);

export default router;

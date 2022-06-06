import { json, NextFunction, Request, Response, Router } from "express";
import { FieldValue } from "firebase-admin/firestore";
import { iot } from "../../../data/events";
import asyncHandler from "../../asyncHandler";
import firebase from "../../firebase";

const router = Router();

router.use((req, res, next) => {
  if (req.session!.role !== "admin") {
    return res.status(403).json({
      success: false,
      body: { error: "Tidak berhak melakukan tindakan" },
    });
  }
  next();
});

router.use(json());

router.put(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const kategori = req.headers.acara as string;
    const tipePeserta = req.headers.tipePeserta;
    const id = req.body.id;
    const verifikasi = req.body.verifikasi;
    const date = Date.now();

    const acaraRef = firebase
      .firestore()
      .collection(`acara/${kategori}/${tipePeserta}`)
      .doc(id);
    const acaraDoc = await acaraRef.get();

    if (!acaraDoc.exists) {
      return res.status(404).json({
        success: false,
        body: { error: "Data tidak ditemukan" },
      });
    }

    if (acaraDoc.data()!.tahanVerifikasi ? true : false) {
      return res.json({
        success: false,
        body: { error: "Verifikasi belum diajukan oleh pendaftar" },
      });
    }

    const peserta: Array<{ id: string } & string> = acaraDoc.data()!.peserta;

    if (verifikasi) {
      let cancel = false;
      switch (kategori) {
        case "iot":
        case "eec":
        case "lf":
        case "tp":
          const iotNeedPayment = date >= iot.registration[1].date[0].getTime();
          const iotNeedVideo = date >= iot.phase[2].date[0].getTime();

          for (const p of acaraDoc.data()!.peserta as Array<{
            syarat: { twibbon: string };
          }>) {
            if (!p.syarat.twibbon) {
              cancel = true;
              break;
            }
          }

          if (cancel) {
            break;
          }

          if (kategori !== "iot" || (kategori === "iot" && iotNeedPayment)) {
            if (!acaraDoc.data()!.pembayaran) {
              cancel = true;
            }
          }

          if (cancel) {
            break;
          }

          if (kategori === "iot") {
            if (!acaraDoc.data()!.proposal) {
              cancel = true;
            }
            if (iotNeedVideo && !acaraDoc.data()!.video) {
              cancel = true;
            }
          }
          break;
        case "workshop":
          if (!acaraDoc.data()!.pembayaran) {
            cancel = true;
          }
          break;
        case "webinar":
          if (
            (acaraDoc.data()!.peserta[0].syarat.poster as Array<string>)
              .length === 0
          ) {
            cancel = true;
          }
          break;
      }

      if (cancel) {
        return res.status(400).json({
          success: false,
          body: { error: "Data pendaftaran belum lengkap" },
        });
      }

      for (const p of peserta) {
        const verifikasiPeserta = (
          await firebase.firestore().collection("pengguna").doc(p.id).get()
        ).data()!.verifikasi;

        if (!verifikasiPeserta) {
          return res.status(400).json({
            success: false,
            body: {
              error: "Identitas peserta belum seluruhnya terverifikasi",
            },
          });
        }
      }
    }

    await firebase.firestore().runTransaction(async (t) => {
      try {
        const statAcaraRef = firebase
          .firestore()
          .collection("statistik")
          .doc("acara");
        const statAcaraDoc = await t.get(statAcaraRef);

        t.update(statAcaraRef, {
          ...statAcaraDoc.data(),
          [kategori]: {
            ...statAcaraDoc.data()![kategori],
            verifikasi:
              statAcaraDoc.data()![kategori].verifikasi +
              (verifikasi
                ? kategori === "workshop"
                  ? peserta.length
                  : 1
                : kategori === "workshop"
                ? peserta.length
                : -1),
          },
        });

        t.update(acaraRef, { verifikasi });

        if (!verifikasi) {
          await acaraRef.update({
            verifikasiEmailTerkirim: FieldValue.delete(),
          });
        }
      } catch (e) {
        next(e);
        throw e;
      }
    });

    return res.json({ success: true });
  })
);

export default router;

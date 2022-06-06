import { json, Request, Response, Router } from "express";
import { iot } from "../../../../data/events";
import asyncHandler from "../../../../libs/asyncHandler";
import firebase from "../../../../libs/firebase";
import { verifyUri } from "../../../../libs/verifyUri";

const router = Router();

router.use(json());

router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const kategori = req.headers.acara;
    const tipePeserta = req.headers.tipePeserta;
    const videoUri = req.body.videoUri;

    if (Date.now() < iot.registration[1].date[0].getTime()) {
      return res.json({
        success: false,
        body: { error: "Masa pengumpulan video belum dimulai" },
      });
    } else if (Date.now() >= iot.registration[1].date[1].getTime()) {
      return res.json({
        success: false,
        body: { error: "Masa pengumpulan video telah berakhir" },
      });
    }

    if (!verifyUri(videoUri)) {
      return res.json({
        success: false,
        body: { error: "Tautan video tidak valid" },
      });
    }

    const timRef = firebase
      .firestore()
      .collection(`acara/${kategori}/${tipePeserta}`)
      .doc(id);
    const timDoc = await timRef.get();

    if (!timDoc.exists) {
      return res.json({
        success: false,
        body: { error: "ID tim tidak ditemukan" },
      });
    }

    await timRef.update({ video: videoUri });

    return res.json({ success: true });
  })
);

export default router;

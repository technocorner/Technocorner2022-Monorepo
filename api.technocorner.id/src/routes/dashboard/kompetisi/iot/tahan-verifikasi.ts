import { json, Request, Response, Router } from "express";
import { firestore } from "firebase-admin";
import asyncHandler from "../../../../libs/asyncHandler";
import firebase from "../../../../libs/firebase";

const router = Router();

router.use(json());

router.put(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const acara = req.headers.acara;
    const tipePeserta = req.headers.tipePeserta;
    const id = req.body.id;
    const tahanVerifikasi = req.body.tahanVerifikasi;

    await firebase
      .firestore()
      .collection(`acara/${acara}/${tipePeserta}`)
      .doc(id)
      .update({
        tahanVerifikasi: tahanVerifikasi
          ? tahanVerifikasi
          : firestore.FieldValue.delete(),
      });

    return res.json({ success: true });
  })
);

export default router;

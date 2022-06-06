import { json, Request, Response, Router } from "express";
import { firestore } from "firebase-admin";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";

const router = Router();

router.use(json());

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.body.id;
    const receiverType = req.body.tipePenerima;
    const to = req.body.tujuan;
    const title = req.body.judul;
    const body = req.body.isi;

    await firebase
      .firestore()
      .collection(`pengumuman/${receiverType}/${to}`)
      .doc(id)
      .create({
        createTime: firestore.FieldValue.serverTimestamp(),
        judul: title,
        isi: body,
      });

    return res.json({ success: true });
  })
);

router.delete(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const receiverType = req.body.tipePenerima;
    const receiver = req.body.penerima;
    const id = req.body.id;

    await firebase
      .firestore()
      .collection(`pengumuman/${receiverType}/${receiver}`)
      .doc(id)
      .delete({ exists: true });

    return res.json({ success: true });
  })
);

export default router;

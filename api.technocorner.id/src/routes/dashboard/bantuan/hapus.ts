import { json, Request, Response, Router } from "express";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";

const router = Router();

router.use(json());

router.delete(
  "/balasan",
  asyncHandler(async (req: Request, res: Response) => {
    const idBantuan = req.body.idBantuan;
    const idBalasan = req.body.idBalasan;

    await firebase
      .firestore()
      .collection(`pertanyaan/${idBantuan}/balasan`)
      .doc(idBalasan)
      .delete();

    return res.json({ success: true });
  })
);

router.delete(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const idBantuan = req.body.idBantuan;

    const balasanDocs = await firebase
      .firestore()
      .collection(`pertanyaan/${idBantuan}/balasan`)
      .get();
    balasanDocs.forEach((doc) => {
      firebase.firestore().batch().delete(doc.ref);
    });
    await firebase.firestore().batch().commit();

    await firebase.firestore().collection("pertanyaan").doc(idBantuan).delete();

    return res.json({ success: true });
  })
);

export default router;

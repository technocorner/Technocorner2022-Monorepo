import Router, { json, Request, Response } from "express";
import asyncHandler from "../../../../asyncHandler";
import firebase from "../../../../firebase";

const router = Router();

router.use(json());

router.put(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const kompetisi = req.headers.acara;
    const id = req.body.id;
    const tahap = req.body.tahap;

    const timRef = firebase
      .firestore()
      .collection(`acara/${kompetisi}/tim`)
      .doc(id);

    const timDoc = await timRef.get();

    if (!timDoc.exists) {
      return res.json({
        success: false,
        body: { error: "ID tim tidak ditemukan" },
      });
    }

    // if (!timDoc.data()!.verifikasi) {
    //   return res.json({
    //     success: false,
    //     body: { error: "Tim belum terverifikasi" },
    //   });
    // }

    await timRef.update({ tahap });

    return res.json({ success: true });
  })
);

export default router;

import { json, Request, Response, Router } from "express";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";

const router = Router();

router.use(json());

router.put(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.body.id;
    const verifikasi = req.body.verifikasi;

    const penggunaRef = firebase.firestore().collection("pengguna").doc(id);

    const pengguna = (await penggunaRef.get()).data();

    if (
      !pengguna!.foto ||
      (pengguna!.foto as string).includes("technocorner") ||
      (pengguna!.foto as string).includes("localhost") ||
      !pengguna!.identitas ||
      !pengguna!.instansi ||
      !pengguna!.status ||
      !pengguna!.whatsapp
    ) {
      return res.json({
        success: false,
        body: { error: "Data pengguna belum lengkap" },
      });
    }

    await penggunaRef.update({ verifikasi });

    return res.json({ success: true });
  })
);

export default router;

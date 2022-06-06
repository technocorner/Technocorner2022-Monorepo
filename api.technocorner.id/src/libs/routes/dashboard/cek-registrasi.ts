import { Request, Response, Router } from "express";
import asyncHandler from "../../asyncHandler";
import firebase from "../../firebase";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const pengguna = req.session!.ref;
    const kategori = req.headers.acara;

    const acaras: Array<{ kategori: string; id: string }> = (
      await firebase.firestore().collection("pengguna").doc(pengguna).get()
    ).data()!.acara;

    const acara = acaras.find((a) => a.kategori === kategori);

    if (acara) {
      return res.json({ success: true, body: { id: acara.id } });
    } else {
      return res.json({ success: false });
    }
  })
);

export default router;

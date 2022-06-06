import { Request, Response, Router } from "express";
import asyncHandler from "../../libs/asyncHandler";
import firebase from "../../libs/firebase";
import getUserPhoto from "../../libs/routes/dashboard/getUserPhoto";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.session!.ref) {
      return res.json({ success: false });
    }

    const id = req.session!.ref;

    const penggunaDoc = await firebase
      .firestore()
      .collection("pengguna")
      .doc(id)
      .get();

    if (!penggunaDoc.exists) {
      return res.json({ success: false });
    }

    const pengguna = penggunaDoc.data();

    return res.json({
      success: true,
      body: {
        photo: await getUserPhoto(pengguna!.foto),
        name: pengguna!.nama,
        email: pengguna!.email,
        role: pengguna!.peran,
      },
    });
  })
);

export default router;

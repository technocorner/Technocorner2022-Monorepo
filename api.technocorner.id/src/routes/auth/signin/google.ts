import { json, Request, Response, Router } from "express";
import asyncHandler from "../../../libs/asyncHandler";
import registerUser from "../../../libs/routes/auth/registerUser";
import firebase from "../../../libs/firebase";

const router = Router();

router.use(json());

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const googleId = req.body.googleId;
    const email = req.body.email;
    const name = req.body.name;
    const photo = req.body.photo;

    let penggunaDoc = await firebase
      .firestore()
      .collection("pengguna")
      .doc(email)
      .get();

    let role = "";

    if (penggunaDoc.exists) {
      if (!penggunaDoc.data()!.googleId) {
        req.session = null;
        return res.json({
          success: false,
          body: {
            error: `Email ini sudah digunakan untuk melakukan pendaftaran. Silakan masuk menggunakan kata sandi.`,
          },
        });
      }
      if (penggunaDoc.data()!.googleId !== googleId) {
        req.session = null;
        return res.json({
          success: false,
          body: { error: "Permintaan tidak valid" },
        });
      }

      role = penggunaDoc.data()!.peran;
    }

    if (!penggunaDoc.exists) {
      const reg = await registerUser({
        nama: name,
        email,
        googleId,
        foto: photo,
        sandi: "",
      });

      if (!reg.success) {
        req.session = null;
        return res.json({
          success: false,
          body: {
            error: "Gagal melakukan pendaftaran menggunakan akun Google",
          },
        });
      }

      role = reg.body.peran;
    }

    req.session!.ref = email;
    req.session!.role = role;
    return res.json({ success: true });
  })
);

export default router;

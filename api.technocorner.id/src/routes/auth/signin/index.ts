import { Router, json, Request, Response } from "express";
import csrf from "csurf";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";
import { decrypt } from "../../../libs/cryptograph";
import google from "./google";

const router = Router();

router.use("/google", google);

router.use(json(), csrf());

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const email = req.body.email;
    const sandi = req.body.sandi;

    const penggunaDoc = await firebase
      .firestore()
      .collection("pengguna")
      .doc(email)
      .get();

    if (!penggunaDoc.exists) {
      req.session = null;
      return res.json({
        success: false,
        body: { error: "Akun tidak terdaftar" },
      });
    }

    if (penggunaDoc.data()!.googleId && !penggunaDoc.data()!.sandi) {
      req.session = null;
      return res.json({
        success: false,
        body: { error: "Silakan masuk menggunakan akun Google" },
      });
    }

    const sandiPengguna = decrypt(penggunaDoc.data()!.sandi);

    if (sandiPengguna !== sandi) {
      req.session = null;
      return res.json({ success: false, body: { error: "Sandi salah" } });
    }

    req.session!.ref = penggunaDoc.data()!.email;
    req.session!.role = penggunaDoc.data()!.peran;
    return res.json({ success: true });
  })
);

export default router;

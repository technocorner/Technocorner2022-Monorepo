import { Router, json, Request, Response } from "express";
import csrf from "csurf";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";
import randomId from "../../../libs/randomId";
import { encrypt } from "../../../libs/cryptograph";
import sendMail from "../../../libs/routes/auth/sendMail";
import verify from "./verify";
import { server } from "../../../data/server";
import { FieldValue } from "firebase-admin/firestore";

const router = Router();

router.use("/verify", verify);

router.use(json(), csrf());

router.use((req, res, next) => {
  req.session = null;
  next();
});

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const nama = req.body.nama;
    const email = req.body.email;

    const penggunaDoc = await firebase
      .firestore()
      .collection("pengguna")
      .doc(email)
      .get();

    if (penggunaDoc.exists) {
      return res.json({
        success: false,
        body: { error: "Email sudah terdaftar" },
      });
    }

    const id = randomId(6);
    const sandi = encrypt(req.body.sandi);
    const data = { createTime: FieldValue.serverTimestamp(), id, nama, sandi };

    await firebase.firestore().collection("pendaftar").doc(email).set(data);

    const encrypted = encrypt(id);
    const verifyLink = `${server}/auth/signup/verify/${Object.values(
      encrypted
    ).join("")}`;

    const mailOptions = {
      to: email,
      subject: `[Technocorner] ${id} adalah kode verifikasi akun Technocorner kamu`,
      text: `Verifikasi Akun Technocorner\n\nHalo ${nama},\n\nUntuk melakukan verifikasi akun, silakan gunakan kode berikut.\n\n${id}\n\nKamu juga bisa melakukan verifikasi dengan menuju link di bawah ini.\n\n${verifyLink}\n\nKode verifikasi ini hanya berlaku selama dua jam.\n\nJika kamu tidak melakukan pendaftaran akun, mohon abaikan email ini.`,
      html: `<h2>Verifikasi Akun Technocorner</h2><p>Halo ${nama},</p><p>Untuk melakukan verifikasi akun, silakan gunakan kode berikut.</p><p style="font-size:1.5rem">${id}</p><p>Kamu juga bisa melakukan verifikasi dengan cara klik <a href="${verifyLink}" target="_blank">Verifikasi Akun</a> atau dengan menuju link di bawah ini.</p><p style="word-break:break-all">${verifyLink}</p><p>Kode verifikasi ini hanya berlaku selama dua jam.</p><p>Jika kamu tidak melakukan pendaftaran akun, mohon abaikan email ini.</p>`,
      attachments: ["logo.png"],
    };

    await sendMail(mailOptions, (sent) => {
      if (sent.success) {
        return res.json({ success: true });
      } else {
        console.log(sent.body?.error);
        return res.json({
          success: false,
          body: { error: sent.body?.error?.message },
        });
      }
    });
  })
);

export default router;

import { json, Request, Response, Router } from "express";
import csrf from "csurf";
import asyncHandler from "../../../libs/asyncHandler";
import sendMail from "../../../libs/routes/auth/sendMail";
import { encrypt } from "../../../libs/cryptograph";
import firebase from "../../../libs/firebase";
import randomId from "../../../libs/randomId";
import { server } from "../../../data/server";
import newPassword from "./new";
import verify from "./verify";

const router = Router();

router.use("/verify", verify);
router.use("/new", newPassword);

router.use(json(), csrf());

router.use((req, res, next) => {
  req.session = null;
  next();
});

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const email = req.body.email;

    const penggunaDoc = await firebase
      .firestore()
      .collection("pengguna")
      .doc(email)
      .get();

    if (!penggunaDoc.exists) {
      return res.json({
        success: false,
        body: { error: "Akun tidak terdaftar" },
      });
    }

    const id = randomId(6);

    await firebase.firestore().collection("reset-sandi").doc(email).set({ id });

    const nama = penggunaDoc.data()!.nama;

    const encrypted = encrypt(id);
    const verifyLink = `${server}/auth/reset-password/verify/${Object.values(
      encrypted
    ).join("")}`;

    const mailOptions = {
      to: email,
      subject: `[Technocorner] Kode verifikasi reset kata sandi`,
      text: `Verifikasi Reset Kata Sandi\n\nHalo ${nama},\n\nUntuk melakukan verifikasi reset kata sandi, silakan gunakan kode berikut.\n\n${id}\n\nKamu juga bisa melakukan verifikasi dengan menuju link di bawah ini.\n\n${verifyLink}\n\nKode verifikasi ini hanya berlaku selama 10 menit.\n\nJika kamu tidak melakukan reset kata sandi, mohon abaikan email ini.`,
      html: `<h2>Verifikasi Reset Kata Sandi</h2><p>Halo ${nama},</p><p>Untuk melakukan verifikasi reset kata sandi, silakan gunakan kode berikut.</p><p style="font-size:1.5rem">${id}</p><p>Kamu juga bisa melakukan verifikasi dengan cara klik <a href="${verifyLink}" target="_blank">Verifikasi Reset Kata Sandi</a> atau dengan menuju link di bawah ini.</p><p style="word-break:break-all">${verifyLink}</p><p>Kode verifikasi ini hanya berlaku selama 10 menit.</p><p>Jika kamu tidak melakukan reset kata sandi, mohon abaikan email ini.</p>`,
      attachments: ["logo.png"],
    };

    await sendMail(mailOptions, (sent) => {
      if (sent.success) {
        return res.json({ success: true });
      } else {
        return res.json({
          success: false,
          body: { error: sent.body?.error },
        });
      }
    });
  })
);

export default router;

import { json, Request, Response, Router } from "express";
import csrf from "csurf";
import asyncHandler from "../../../../libs/asyncHandler";
import { encrypt } from "../../../../libs/cryptograph";
import firebase from "../../../../libs/firebase";
import sendMail from "../../../../libs/routes/auth/sendMail";
import verifyUserResetPassword from "../../../../libs/routes/auth/verifyUserResetPassword";

const router = Router();

router.use(json(), csrf());

router.use((req, res, next) => {
  req.session = null;
  next();
});

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const code = req.body.kode;
    const email = req.body.email;

    console.log(code, email);

    const result = await verifyUserResetPassword(code);

    await firebase.firestore().collection("reset-sandi").doc(email).delete();

    if (!result.success) {
      return res.json({
        success: false,
        body: {
          error:
            "Penggantian sandi gagal. Silakan ulangi dari langkah pertama.",
        },
      });
    }

    const sandi = encrypt(req.body.sandiBaru);

    await firebase
      .firestore()
      .collection("pengguna")
      .doc(email)
      .update({ sandi });

    res.json({ success: true });

    const penggunaDoc = await firebase
      .firestore()
      .collection("pengguna")
      .doc(email)
      .get();

    const nama = penggunaDoc.data()!.nama;

    const mailOptions = {
      to: email,
      subject: `[Technocorner] Sandi akun Technocorner kamu telah diubah`,
      text: `Pemberitahuan Perubahan Sandi\n\nHalo ${nama},\n\nKata sandi akun Technocorner kamu baru saja diubah. Jika kamu merasa tidak melakukan hal tersebut, kamu dapat menghubungi kami dengan mengirim surel ke kontak@technocorner.id agar kamu dapat kembali memperoleh akses ke akun Technocorner kamu.`,
      html: `<h2>Pemberitahuan Perubahan Sandi</h2><p>Halo ${nama},</p><p>Kata sandi akun Technocorner kamu baru saja diubah. Jika kamu merasa tidak melakukan hal tersebut, kamu dapat menghubungi kami dengan mengirim surel ke <a href:"mailto:kontak@technocorner.id">kontak@technocorner.id</a> agar kamu dapat kembali memperoleh akses ke akun Technocorner kamu.</p>`,
      attachments: ["logo.png"],
    };

    await sendMail(mailOptions, (sent) => {
      if (sent.success) {
        return true;
      } else {
        throw sent.body?.error;
      }
    });
  })
);

export default router;

import { Router, Request, Response, json } from "express";
import nodemailer from "nodemailer";
import asyncHandler from "../../asyncHandler";
import firebase from "../../firebase";

const router = Router();

router.use(json());

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const acara = req.headers.acara;
    const acaraId = req.body.acaraId;
    const to = req.body.to;
    const subject = req.body.subject;
    const text = req.body.text;
    const html = req.body.html;
    const attachments = req.body.attachments as Array<string>;

    let format = "peserta";
    switch (acara) {
      case "eec":
      case "iot":
      case "lf":
      case "tp":
        format = "tim";
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "technocorner2022",
        pass: "aauuzqaloavmyjyp",
      },
    });

    const mailOptions = {
      from: {
        name: "Technocorner UGM",
        address: "noreply@technocorner.id",
      },
      to,
      subject,
      text,
      html,
      attachments: attachments.map((a) => {
        const path = __dirname + `/../../../assets/${a}`;
        return {
          filename: a,
          path,
          cid: a,
        };
      }),
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, body: { error: error.message } });
      }

      await firebase
        .firestore()
        .collection(`acara/${acara}/${format}`)
        .doc(acaraId)
        .update({ verifikasiEmailTerkirim: true });

      return res.json({ success: true });
    });
  })
);

export default router;

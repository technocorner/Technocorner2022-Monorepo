import nodemailer from "nodemailer";
import { main } from "../../../data/client";

export default async (
  {
    to,
    subject,
    text,
    html,
    attachments,
  }: {
    to: string;
    subject: string;
    text: string;
    html: string;
    attachments: Array<string>;
  },
  callback: (sent: { success: boolean; body?: { error: Error | null } }) => void
) => {
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
    text: `${text}\n\n\nTerima kasih,\ndeveloper@Technocorner`,
    html: `<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,minimum-scale=1,maximum-scale=1,user-scalable=0"><style type="text/css">.body{background-color:#f5f5f5;width:100%;height:100%;padding:2rem}.main{width:30rem;margin:auto;border:1px solid #d3d3d3}hr{border:1px solid #d3d3d3}@media only screen and (max-width:30rem){.body{background-color:#fff;padding:0}.main{width:100%}}</style></head><body style="margin:0"><div class="body"><div class="main"><div style="background-color:#fff;padding:1.25rem 2rem"><a href="${main}" style="text-decoration: inherit; color: inherit;"><img src="cid:logo.png" style="width:3rem"></a><hr style="margin:1rem 0">${html}<br><p style="margin-bottom:0">Terima kasih,</p><p style="margin-top:0">developer@Technocorner</p></div></div></div></body></html>`,
    attachments: attachments.map((a) => {
      const path = __dirname + `/../../../assets/${a}`;
      return {
        filename: a,
        path,
        cid: a,
      };
    }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callback({ success: false, body: { error } });
    }

    callback({ success: true });
  });
};

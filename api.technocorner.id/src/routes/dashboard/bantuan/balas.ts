import { json, Request, Response, Router } from "express";
import multer from "multer";
import { FieldValue } from "@google-cloud/firestore";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";
import randomId from "../../../libs/randomId";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  upload.array("lampiran"),
  asyncHandler(async (req: Request, res: Response) => {
    const pengguna = req.session!.ref;
    const isi = req.body.isi;

    const bekukan = (
      await firebase.firestore().collection("pengguna").doc(pengguna).get()
    ).data()!.bekukan;

    if (bekukan) {
      return res.json({
        success: false,
        body: { error: "Akun Anda dibekukan" },
      });
    }

    const lampiran: Array<string> = [];

    if (req.files && req.files.length) {
      (req.files as Array<{ mimetype: string; buffer: Buffer }>).forEach(
        (file) => {
          const fileName = randomId(32);
          const blob = firebase
            .storage()
            .bucket()
            .file("pertanyaan/lampiran/" + fileName);
          const blobWriter = blob.createWriteStream({
            metadata: { contentType: file.mimetype },
          });

          blobWriter.on("error", (error) => {
            return res.json({ success: false, body: { error } });
          });

          blobWriter.end(file.buffer);

          lampiran.push(fileName);
        }
      );
    }

    const id = req.body.id;
    const idBalasan = randomId(7);
    const balasan = {
      id: idBalasan,
      pengguna,
      waktu: FieldValue.serverTimestamp(),
      isi,
      lampiran,
    };

    await firebase
      .firestore()
      .collection(`pertanyaan/${id}/balasan`)
      .doc(idBalasan)
      .set(balasan);

    return res.json({ success: true });
  })
);

export default router;

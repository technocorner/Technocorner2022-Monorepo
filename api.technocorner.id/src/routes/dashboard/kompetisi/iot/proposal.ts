import { Request, Response, Router } from "express";
import multer from "multer";
import config from "../../../../data/config";
import { iot } from "../../../../data/events";
import asyncHandler from "../../../../libs/asyncHandler";
import firebase from "../../../../libs/firebase";
import randomId from "../../../../libs/randomId";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.put(
  "/:id",
  upload.single("proposal"),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const kategori = req.headers.acara;
    const tipePeserta = req.headers.tipePeserta;

    if (Date.now() < iot.registration[0].date[0].getTime()) {
      return res.json({
        success: false,
        body: { error: "Masa pengunggahan proposal belum dimulai" },
      });
    } else if (Date.now() >= iot.registration[0].date[1].getTime()) {
      return res.json({
        success: false,
        body: { error: "Masa pengunggahan proposal telah berakhir" },
      });
    }

    const timRef = firebase
      .firestore()
      .collection(`acara/${kategori}/${tipePeserta}`)
      .doc(id);
    const timDoc = await timRef.get();

    if (!timDoc.exists) {
      return res.json({
        success: false,
        body: { error: "ID tim tidak ditemukan" },
      });
    }

    let proposal = "";

    if (req.file) {
      // check file type and size
      console.log(req.file.size, config.limit.pdf[1]);
      if (
        config.type.pdf.filter((t) => req.file!.mimetype === t).length === 0
      ) {
        const tipe = config.type.pdf.join(" / ");
        return res.json({
          success: false,
          body: { error: `Berkas harus bertipe ${tipe}` },
        });
      }
      if (
        req.file.size < config.limit.pdf[0] ||
        req.file.size > config.limit.pdf[1]
      ) {
        const size = config.limit.pdf;
        return res.json({
          success: false,
          body: {
            error: `Berkas harus berukuran antara ${
              size[0] / 1024
            } kilobyte hingga ${size[1] / (1024 * 1024)} megabytes`,
          },
        });
      }

      // remove previous file
      if (timDoc.data()!.proposal) {
        await firebase
          .storage()
          .bucket()
          .file(
            `acara/${kategori}/${tipePeserta}/proposal/${
              timDoc.data()!.proposal
            }`
          )
          .delete();
      }

      // upload new file
      const fileName = randomId(32);

      const blob = firebase
        .storage()
        .bucket()
        .file(`acara/${kategori}/${tipePeserta}/proposal/${fileName}`);

      const blobWriter = blob.createWriteStream({
        metadata: { contentType: req.file.mimetype },
      });

      blobWriter.on("error", (error) => {
        return res.json({ success: false, body: { error } });
      });

      blobWriter.on("finish", async () => {
        proposal = fileName;
        await timRef.update({ proposal });
        return res.json({ success: true });
      });

      blobWriter.end(req.file.buffer);
    } else {
      return res.json({
        success: false,
        body: { error: "Tidak ada berkas terunggah" },
      });
    }
  })
);

export default router;

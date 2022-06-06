import { Request, Response, Router } from "express";
import multer from "multer";
import config from "../../../data/config";
import asyncHandler from "../../asyncHandler";
import firebase from "../../firebase";
import randomId from "../../randomId";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.put(
  "/:id",
  upload.single("pembayaran"),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const kategori = req.headers.acara;
    const tipePeserta = req.headers.tipePeserta;

    const timRef = firebase
      .firestore()
      .collection(`acara/${kategori}/${tipePeserta}`)
      .doc(id);
    const timDoc = await timRef.get();

    if (timDoc.data()!.verifikasi) {
      return res.json({
        success: false,
        body: {
          error:
            "Pendaftaran telah terverifikasi. Tidak dapat mengubah bukti pembayaran.",
        },
      });
    }

    let pembayaran = "";

    if (req.file) {
      // check file type and size
      if (
        config.type.image.filter((t) => req.file!.mimetype === t).length === 0
      ) {
        const tipe = config.type.image.join(" / ");
        return res.json({
          success: false,
          body: { error: `Berkas harus bertipe ${tipe}` },
        });
      }
      if (
        req.file.size < config.limit.image[0] ||
        req.file.size > config.limit.image[1]
      ) {
        const size = config.limit.image;
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
      if (timDoc.data()!.pembayaran) {
        await firebase
          .storage()
          .bucket()
          .file(
            `acara/${kategori}/${tipePeserta}/pembayaran/${
              timDoc.data()!.pembayaran
            }`
          )
          .delete();
      }

      // upload new file
      const fileName = randomId(32);

      const blob = firebase
        .storage()
        .bucket()
        .file(`acara/${kategori}/${tipePeserta}/pembayaran/${fileName}`);

      const blobWriter = blob.createWriteStream({
        metadata: { contentType: req.file.mimetype },
      });

      blobWriter.on("error", (error) => {
        return res.json({ success: false, body: { error } });
      });

      blobWriter.on("finish", async () => {
        pembayaran = fileName;
        await timRef.update({ pembayaran });
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

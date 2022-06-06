import { Request, Response, Router } from "express";
import multer from "multer";
import config from "../../../../../data/config";
import asyncHandler from "../../../../asyncHandler";
import firebase from "../../../../firebase";
import randomId from "../../../../randomId";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.put(
  "/:id",
  upload.single("poster"),
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const pengguna = req.session!.ref;
    const kategori = req.headers.acara;
    const tipePeserta = req.headers.tipePeserta;

    let orderPoster = req.body.order;
    let idPoster = req.body.idPoster ? req.body.idPoster : "";

    const acaraRef = firebase
      .firestore()
      .collection(`acara/${kategori}/${tipePeserta}`)
      .doc(id);
    const acaraDoc = await acaraRef.get();

    if (
      kategori === "workshop" &&
      (acaraDoc.data()!.peserta as Array<object>).length > 1
    ) {
      return res.json({
        success: false,
        body: {
          error:
            "Tidak dapat mengunggah bukti share poster karena kode referral telah digunakan untuk melakukan pendaftaran",
        },
      });
    }

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
      const indexPeserta = (
        acaraDoc.data()!.peserta as Array<{ id: string }>
      ).findIndex((p) => pengguna === p.id);
      if (indexPeserta < 0) {
        return res.json({
          success: false,
          body: { error: "Penserta tidak ditemukan" },
        });
      }
      let indexPoster = (
        acaraDoc.data()!.peserta[indexPeserta].syarat.poster as Array<string>
      ).findIndex((p) => idPoster === p);
      if (indexPoster >= 0) {
        await firebase
          .storage()
          .bucket()
          .file(
            `acara/${kategori}/${tipePeserta}/poster/${
              acaraDoc.data()!.peserta[indexPeserta].syarat.poster[indexPoster]
            }`
          )
          .delete();
      } else {
        indexPoster = orderPoster;
      }

      // upload new file
      const fileName = randomId(32);
      const blob = firebase
        .storage()
        .bucket()
        .file(`acara/${kategori}/${tipePeserta}/poster/${fileName}`);
      const blobWriter = blob.createWriteStream({
        metadata: { contentType: req.file.mimetype },
      });
      blobWriter.on("error", (error) => {
        return res.json({ success: false, body: { error } });
      });
      blobWriter.end(req.file.buffer);

      const peserta = acaraDoc.data()!.peserta;
      peserta[indexPeserta].syarat.poster[indexPoster] = fileName;

      await acaraRef.update({ peserta });

      return res.json({ success: true });
    }

    return res.json({
      success: false,
      body: { error: "Tidak ada berkas terunggah" },
    });
  })
);

export default router;

import { Request, Response, Router } from "express";
import id from "./id";
import balas from "./balas";
import status from "./status";
import hapus from "./hapus";
import faq from "./faq";
import firebase from "../../../libs/firebase";
import config from "../../../data/config";
import randomId from "../../../libs/randomId";
import { FieldValue } from "firebase-admin/firestore";
import asyncHandler from "../../../libs/asyncHandler";
import multer from "multer";

const router = Router();

router.use("/id", id);
router.use("/balas", balas);
router.use("/status", status);
router.use("/hapus", hapus);
router.use("/faq", faq);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 3 },
});

router.post(
  "/",
  upload.array("lampiran"),
  asyncHandler(async (req: Request, res: Response) => {
    const pengguna = req.session!.ref;
    const id = req.body.id;
    const judul = req.body.judul;
    const label = Number(req.body.label);
    const waktu = FieldValue.serverTimestamp();
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

    let lampiran: Array<string> = [];

    if (req.files && req.files.length) {
      for (const file of req.files as Array<{
        mimetype: string;
        buffer: Buffer;
        size: number;
      }>) {
        if (!file.mimetype.includes("image/")) {
          return res.json({
            success: false,
            body: { error: "Berkas harus bertipe image/*" },
          });
        }
        if (
          file.size < config.limit.image[0] &&
          file.size > config.limit.image[1]
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
      }
    }

    for (const file of req.files as Array<{
      mimetype: string;
      buffer: Buffer;
    }>) {
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

    const data = {
      id,
      judul,
      label,
      waktu,
      pengguna,
      isi,
      lampiran,
      ditutup: false,
    };

    await firebase.firestore().collection("pertanyaan").doc(id).set(data);

    return res.json({ success: true, body: { id } });
  })
);

router.get("/", async (req, res) => {
  const role = req.session!.role;
  const page = Number(req.query.p);
  const label = req.query.label as string;
  const query = req.query.q as string;
  const bantuan: Array<FirebaseFirestore.DocumentData> = [];

  if (role === "admin") {
    const bantuanDocs = await firebase
      .firestore()
      .collection("pertanyaan")
      .orderBy("ditutup", "asc")
      .orderBy("waktu", "desc")
      .get();
    bantuanDocs.forEach((doc) => {
      const dJudul = doc.data()!.judul as string;
      const dIsi = doc.data()!.isi as string;
      const dLabel = doc.data()!.label as string;

      if (
        (dJudul.toLowerCase().indexOf(query) !== -1 ||
          dIsi.toLowerCase().indexOf(query) !== -1) &&
        (label === "all" ? true : label === dLabel)
      ) {
        bantuan.push({
          id: doc.id,
          judul: doc.data()!.judul,
          isi: doc.data()!.isi,
          label: doc.data()!.label,
          ditutup: doc.data()!.ditutup,
        });
      }
    });

    return res.json({
      success: true,
      body: {
        page: {
          pos: page,
          from: page * 10 + 1,
          until:
            (page + 1) * 10 < bantuan.length ? (page + 1) * 10 : bantuan.length,
          total: bantuan.length,
        },
        questions: bantuan,
      },
    });
  } else if (role === "pengguna") {
    const pengguna = req.session!.ref;
    const bantuanDocs = await firebase
      .firestore()
      .collection("pertanyaan")
      .where("pengguna", "==", pengguna)
      .orderBy("waktu", "desc")
      .get();
    bantuanDocs.forEach((doc) =>
      bantuan.push({
        id: doc.id,
        judul: doc.data()!.judul,
        isi: doc.data()!.isi,
        label: doc.data()!.label,
      })
    );

    console.log(pengguna, bantuan);

    return res.json({ success: true, body: bantuan });
  }
});

export default router;

import { json, Request, Response, Router } from "express";
import multer from "multer";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";
import randomId from "../../../libs/randomId";
import { encrypt } from "../../../libs/cryptograph";
import config from "../../../data/config";
import getUserPhoto from "../../../libs/routes/dashboard/getUserPhoto";
import getUserIdentity from "../../../libs/routes/dashboard/getUserIdentity";

const router = Router();

router.get(
  "/",
  json(),
  asyncHandler(async (req: Request, res: Response) => {
    const email = req.session!.ref;
    const pengguna = (
      await firebase.firestore().collection("pengguna").doc(email).get()
    ).data();

    return res.json({
      success: true,
      body: {
        photo: await getUserPhoto(pengguna!.foto),
        name: pengguna!.nama,
        email: pengguna!.email,
        status: pengguna!.status,
        agency: pengguna!.instansi,
        identity: await getUserIdentity(pengguna!.identitas),
        whatsapp: pengguna!.whatsapp,
        suspended: pengguna!.bekukan,
        verified: pengguna!.verifikasi,
      },
    });
  })
);

const upload = multer({ storage: multer.memoryStorage() });

router.put(
  "/",
  upload.array("attachments"),
  asyncHandler(async (req: Request, res: Response) => {
    const email = req.session!.ref;
    const penggunaRef = firebase.firestore().collection("pengguna").doc(email);
    const penggunaDoc = await penggunaRef.get();

    const nama = req.body.name;
    let sandi = req.body.password;
    if (sandi) {
      sandi = encrypt(req.body.password);
    } else {
      sandi = penggunaDoc.data()!.sandi;
    }
    const status = req.body.status;
    const instansi = req.body.agency;
    const whatsapp = req.body.whatsapp;

    let foto = "";
    let identitas = "";

    let uploadResolve: () => void, uploadReject;
    const uploaded = new Promise((resolve, reject) => {
      uploadResolve = () => resolve(true);
      uploadReject = () => reject("Upload promise rejected");
    });
    if (req.files && req.files.length) {
      let attachments: Array<string>;
      if (typeof req.body.attachmentsDetail === "string") {
        attachments = Array(req.body.attachmentsDetail);
      } else {
        attachments = req.body.attachmentsDetail;
      }
      await Promise.all(
        attachments.map(async (type, index) => {
          // check file type and size
          if (
            config.type.image.filter(
              (t) =>
                (req.files as Array<{ mimetype: string }>)[index].mimetype === t
            ).length === 0
          ) {
            const tipe = config.type.image.join(" / ");
            return res.json({
              success: false,
              body: { error: `Berkas harus bertipe ${tipe}` },
            });
          }
          if (
            (req.files as Array<{ size: number }>)[index].size <
              config.limit.image[0] ||
            (req.files as Array<{ size: number }>)[index].size >
              config.limit.image[1]
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

          let tipe: string;
          if (type === "photo") {
            tipe = "foto";
          } else if (type === "identity") {
            tipe = "identitas";
          } else {
            return res.json({
              success: false,
              body: { error: "Form tidak valid" },
            });
          }

          // remove previous file
          const prevFile = penggunaDoc.data()![tipe];
          let del = false;
          if (
            tipe === "foto" &&
            !(
              prevFile.includes("technocorner.id") ||
              prevFile.includes("localhost") ||
              prevFile.includes("googleusercontent.com")
            )
          ) {
            del = true;
          } else if (tipe === "identitas" && prevFile) {
            del = true;
          }
          if (del) {
            await firebase
              .storage()
              .bucket()
              .file(`pengguna/${tipe}/${prevFile}`)
              .delete();
          }

          // upload new file
          const fileName = randomId(32);

          const blob = firebase
            .storage()
            .bucket()
            .file(`pengguna/${tipe}/${fileName}`);

          const blobWriter = blob.createWriteStream({
            metadata: {
              contentType: (req.files as Array<{ mimetype: string }>)[index]
                .mimetype,
            },
          });

          blobWriter.on("error", (error) => {
            return res.json({ success: false, body: { error } });
          });

          blobWriter.on("finish", () => {
            uploadResolve();
          });

          blobWriter.end(
            (req.files as Array<{ buffer: Buffer }>)[index].buffer
          );

          if (tipe === "foto") {
            foto = fileName;
          } else if (tipe === "identitas") {
            identitas = fileName;
          }
        })
      );
    }

    if (!foto && penggunaDoc.data()!.foto) {
      foto = penggunaDoc.data()!.foto;
    }

    if (!identitas && penggunaDoc.data()!.identitas) {
      identitas = penggunaDoc.data()!.identitas;
    }

    const data = {
      foto,
      nama,
      sandi,
      status,
      instansi,
      identitas,
      whatsapp,
    };

    await firebase.firestore().collection("pengguna").doc(email).update(data);

    if (req.files && req.files.length) {
      if ((await uploaded) === true) {
        return res.json({ success: true });
      } else {
        console.log("promise false", uploaded);
      }
    } else {
      return res.json({ success: true });
    }
  })
);

export default router;

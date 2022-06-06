import { Request, Response, Router } from "express";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";
import id from "./id";
import verifikasi from "./verifikasi";
import bekukan from "./bekukan";
import hapus from "./hapus";
import ubahPeran from "./ubah-peran";
import eksporData from "../../../libs/routes/dashboard/unduh-data";

const router = Router();

router.use("/id", id);
router.use("/verifikasi", verifikasi);
router.use("/bekukan", bekukan);
router.use("/hapus", hapus);
router.use("/ubah-peran", ubahPeran);
router.use(
  "/unduh-data",
  (req, res, next) => {
    req.headers.kategori = "pengguna";
    next();
  },
  eksporData
);

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    let pengguna: Array<FirebaseFirestore.DocumentData> = [];

    const penggunaDocs = await firebase
      .firestore()
      .collection("pengguna")
      .orderBy("peran", "desc")
      .orderBy("bekukan")
      .orderBy("verifikasi")
      .orderBy("createTime", "desc")
      .orderBy("nama")
      .get();

    penggunaDocs.forEach((doc) => {
      pengguna.push({
        id: doc.id,
        nama: doc.data()!.nama,
        email: doc.data()!.email,
        whatsapp: doc.data()!.whatsapp,
        peran: doc.data()!.peran,
        bekukan: doc.data()!.bekukan,
        verifikasi: doc.data()!.verifikasi,
      });
    });

    return res.json({ success: true, body: pengguna });
  })
);
export default router;

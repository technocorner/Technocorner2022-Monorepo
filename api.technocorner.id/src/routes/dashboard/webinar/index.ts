import { Router } from "express";
import cekRegistrasi from "../../../libs/routes/dashboard/cek-registrasi";
import registrasi from "../../../libs/routes/dashboard/acara/registrasi";
import poster from "../../../libs/routes/dashboard/acara/peserta/poster";
import peserta from "../../../libs/routes/dashboard/acara/peserta/id";
import daftar from "../../../libs/routes/dashboard/acara/daftar";
import verifikasi from "../../../libs/routes/dashboard/verifikasi";
import verifyAdmin from "../../../libs/routes/auth/verifyAdmin";
import eksporData from "../../../libs/routes/dashboard/unduh-data";

const router = Router();

router.use(
  "/unduh-data",
  (req, res, next) => {
    req.headers.kategori = "webinar";
    next();
  },
  eksporData
);

router.use((req, res, next) => {
  req.headers.acara = "webinar";
  next();
});

router.use("/registrasi", registrasi);
router.use("/cek-registrasi", cekRegistrasi);
router.use("/peserta", peserta);

router.use((req, res, next) => {
  req.headers.tipePeserta = "peserta";
  next();
});

router.use("/poster", poster);
router.use("/verifikasi", verifikasi);

router.use(verifyAdmin);

router.use("/", daftar);

export default router;

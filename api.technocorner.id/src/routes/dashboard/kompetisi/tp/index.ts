import { Router } from "express";
import registrasiAnggota from "../../../../libs/routes/dashboard/kompetisi/registrasi-anggota";
import registrasiTim from "../../../../libs/routes/dashboard/kompetisi/registrasi-tim";
import cekRegistrasi from "../../../../libs/routes/dashboard/cek-registrasi";
import tim from "../../../../libs/routes/dashboard/kompetisi/tim/id";
import daftar from "../../../../libs/routes/dashboard/kompetisi/daftar";
import pembayaran from "../../../../libs/routes/dashboard/pembayaran";
import verifikasi from "../../../../libs/routes/dashboard/verifikasi";
import ubahTahap from "../../../../libs/routes/dashboard/kompetisi/tim/ubah-tahap";
import verifyAdmin from "../../../../libs/routes/auth/verifyAdmin";
import twibbon from "../../../../libs/routes/dashboard/kompetisi/tim/twibbon";
import eksporData from "../../../../libs/routes/dashboard/unduh-data";

const router = Router();

router.use(
  "/unduh-data",
  (req, res, next) => {
    req.headers.kategori = "tp";
    next();
  },
  eksporData
);

router.use((req, res, next) => {
  req.headers.acara = "tp";
  next();
});

router.use("/registrasi-anggota", registrasiAnggota);
router.use("/registrasi-tim", registrasiTim);
router.use("/cek-registrasi", cekRegistrasi);
router.use("/tim", tim);

router.use((req, res, next) => {
  req.headers.tipePeserta = "tim";
  next();
});

router.use("/pembayaran", pembayaran);
router.use("/twibbon", twibbon);
router.use("/verifikasi", verifikasi);

router.use(verifyAdmin);

router.use("/ubah-tahap", ubahTahap);
router.use("/", daftar);

export default router;

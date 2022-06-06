import { Router } from "express";
import verifySignIn from "../../libs/routes/dashboard/verifyUserCred";
import beranda from "./beranda";
import profil from "./profil";
import kompetisi from "./kompetisi";
import workshop from "./workshop";
import webinar from "./webinar";
import bantuan from "./bantuan";
import pengguna from "./pengguna";
import info from "./info";
import verifyAdmin from "../../libs/routes/auth/verifyAdmin";

const router = Router();

router.use(verifySignIn);

router.use("/beranda", beranda);
router.use("/profil", profil);
router.use("/kompetisi", kompetisi);
router.use("/workshop", workshop);
router.use("/webinar", webinar);
router.use("/bantuan", bantuan);
router.use("/info", info);

router.use(verifyAdmin);

router.use("/pengguna", pengguna);

export default router;

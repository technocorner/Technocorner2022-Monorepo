import { Router } from "express";
import eec from "./eec";
import iot from "./iot";
import lf from "./lf";
import tp from "./tp";

const router = Router();

router.use("/eec", eec);
router.use("/iot", iot);
router.use("/lf", lf);
router.use("/tp", tp);

export default router;

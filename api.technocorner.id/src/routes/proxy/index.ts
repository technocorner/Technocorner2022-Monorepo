import Router from "express";
import request from "request";
import { decrypt } from "../../libs/cryptograph";

const router = Router();

router.use("/", (req, res) => {
  const decryptor = req.url.substring(1, 67);
  const encrypted = req.url.substring(67).split("?")[0];
  const url = decrypt({ encrypted, decryptor });
  return req.pipe(request(url)).pipe(res);
});

export default router;

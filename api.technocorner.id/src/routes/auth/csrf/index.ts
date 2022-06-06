import { Router } from "express";
import csrf from "csurf";

const router = Router();

router.get("/", csrf(), (req, res) => {
  res.json({ success: true, body: { _csrf: req.csrfToken() } });
});

export default router;

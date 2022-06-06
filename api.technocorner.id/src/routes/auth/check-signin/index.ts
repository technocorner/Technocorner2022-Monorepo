import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  if (!req.session!.ref) {
    req.session = null;
    return res.json({ success: true, body: false });
  }

  return res.json({ success: true, body: true });
});

export default router;

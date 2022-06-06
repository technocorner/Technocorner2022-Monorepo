import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  req.session = null;
  return res.json({ success: true });
});

export default router;

import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  return res.json({ success: true, body: { session: req.session } });
});

export default router;

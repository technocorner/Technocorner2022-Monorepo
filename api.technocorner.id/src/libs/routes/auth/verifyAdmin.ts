import Router from "express";

const router = Router();

router.use((req, res, next) => {
  if (req.session!.role !== "admin") {
    return res.json({
      success: false,
      body: { error: "Tidak berhak mengakses data" },
    });
  }
  next();
});

export default router;

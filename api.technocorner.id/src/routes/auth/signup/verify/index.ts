import { json, Request, Response, Router } from "express";
import csrf from "csurf";
import asyncHandler from "../../../../libs/asyncHandler";
import verifyUserSignup from "../../../../libs/routes/auth/verifyUserSignup";
import encrypted from "./encrypted";

const router = Router();

router.use(json(), csrf());

router.use((req, res, next) => {
  req.session = null;
  next();
});

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const code = req.body.kode;

    const result = await verifyUserSignup(code);

    if (!result.success) {
      return res.json(result);
    }

    return res.json({ success: true });
  })
);

router.use("/", encrypted);

export default router;

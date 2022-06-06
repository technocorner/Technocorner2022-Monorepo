import { json, Request, Response, Router } from "express";
import csrf from "csurf";
import encrypted from "./encrypted";
import asyncHandler from "../../../../libs/asyncHandler";
import verifyUserResetPassword from "../../../../libs/routes/auth/verifyUserResetPassword";

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

    const result = await verifyUserResetPassword(code);

    if (!result.success) {
      return res.json(result);
    }

    return res.json({ success: true });
  })
);

router.use("/", encrypted);

export default router;

import { NextFunction, Request, Response, Router } from "express";
import { main } from "../../../data/client";
import asyncHandler from "../../asyncHandler";

const router = Router();

router.use(
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!(req.session!.ref && req.session!.role)) {
      return res.json({ success: false, redirect: `${main}/auth/signin` });
    }
    next();
  })
);

export default router;

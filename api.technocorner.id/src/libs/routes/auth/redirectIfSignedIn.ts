import { NextFunction, Request, Response, Router } from "express";
import firebase from "../../firebase";
import { dash } from "../../../data/client";
import asyncHandler from "../../asyncHandler";

const router = Router();

router.use(
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (req.session!.ref) {
      const penggunaDoc = await firebase
        .firestore()
        .collection("pengguna")
        .doc(req.session!.ref)
        .get();
      if (penggunaDoc.exists) {
        return res.redirect(dash);
      }
    }

    req.session!.ref = null;
    next();
  })
);

export default router;

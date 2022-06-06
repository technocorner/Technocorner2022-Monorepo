import { json, Request, Response, Router } from "express";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";

const router = Router();

router.use(json());

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const peran = req.body.peran;
    const email = req.body.email;

    await firebase
      .firestore()
      .collection("pengguna")
      .doc(email)
      .update({ peran });

    return res.json({ success: true });
  })
);

export default router;

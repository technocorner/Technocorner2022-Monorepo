import { json, Request, Response, Router } from "express";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";

const router = Router();

router.use(json());

router.put(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.body.id;
    const bekukan = req.body.bekukan;
    await firebase
      .firestore()
      .collection("pengguna")
      .doc(id)
      .update({ bekukan });

    return res.json({ success: true });
  })
);

export default router;

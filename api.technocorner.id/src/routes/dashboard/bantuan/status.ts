import { json, Request, Response, Router } from "express";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";

const router = Router();

router.use(json());

router.put(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    console.log("executed");
    const id = req.body.id;
    const status = req.body.status;

    await firebase
      .firestore()
      .collection("pertanyaan")
      .doc(id)
      .update({ ditutup: status });

    return res.json({ success: true });
  })
);

export default router;

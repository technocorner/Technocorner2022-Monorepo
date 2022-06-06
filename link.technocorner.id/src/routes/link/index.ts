import Router, { Request, Response } from "express";
import asyncHandler from "../../libs/asyncHandler";
import firebase from "../../libs/firebase";

const router = Router();

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    let tautanPanjang = "";

    const longUri = await firebase
      .firestore()
      .collection("tautanPendek")
      .doc(id)
      .get();

    if (longUri.exists) {
      tautanPanjang = longUri.data()!.tautanPanjang;
    } else {
      const longUri = await firebase
        .firestore()
        .collection("linktree/link/data")
        .doc(id)
        .get();
      if (longUri.exists) {
        tautanPanjang = longUri.data()!.tautanPanjang;
      }
    }

    if (!tautanPanjang) {
      return res.status(404).send("404 (Not Found)");
    }

    return res.redirect(tautanPanjang);
  })
);

export default router;

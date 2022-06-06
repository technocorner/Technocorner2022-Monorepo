import Router, { json, Request, Response } from "express";
import asyncHandler from "../../libs/asyncHandler";
import verifyAdmin from "../../libs/routes/auth/verifyAdmin";
import firebase from "../../libs/firebase/link";
import { verifyCustomUri, verifyUri } from "../../libs/verifyUri";

const router = Router();

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const longUri = await firebase
      .firestore()
      .collection("tautanPendek")
      .doc(id)
      .get();

    if (!longUri.exists) {
      return res.status(404).json({
        success: false,
        body: { error: "Tautan tidak ditemukan" },
      });
    }

    return res.redirect(longUri.data()!.tautanPanjang);
  })
);

router.use(verifyAdmin);

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const allUrisDocs = await firebase
      .firestore()
      .collection("tautanPendek")
      .get();

    const allUris: Array<{
      reserved: boolean;
      tautanPanjang: string;
      tautanPendek: string;
    }> = [];

    allUrisDocs.forEach((uri) => {
      allUris.push({
        reserved: uri.data()!.reserved,
        tautanPanjang: uri.data()!.tautanPanjang,
        tautanPendek: uri.id,
      });
    });

    return res.json({ success: true, body: allUris });
  })
);

router.use(json());

router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const tautanPanjang = req.body.tautanPanjang;
    const tautanPendek = req.body.tautanPendek;

    if (!verifyUri(tautanPanjang)) {
      return res.json({
        success: false,
        body: { error: "Tautan panjang tidak valid" },
      });
    } else if (!verifyCustomUri(tautanPendek)) {
      return res.json({
        success: false,
        body: { error: "Tautan pendek tidak valid" },
      });
    }

    const linksRef = firebase
      .firestore()
      .collection("tautanPendek")
      .doc(tautanPendek);

    const links = await linksRef.get();

    let reserved = false;
    if (links.exists) {
      reserved = links.data()!.reserved;
    }

    await linksRef.set({ reserved, tautanPanjang });

    return res.json({ success: true });
  })
);

router.delete(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const tautanPendek = req.body.tautanPendek;

    const linksRef = firebase
      .firestore()
      .collection("tautanPendek")
      .doc(tautanPendek);

    const links = await linksRef.get();

    if (links.exists && links.data()!.reserved) {
      return res.json({
        success: false,
        body: { error: "Tautan ini tidak dapat dihapus" },
      });
    }

    await linksRef.delete({ exists: true });

    return res.json({ success: true });
  })
);

export default router;

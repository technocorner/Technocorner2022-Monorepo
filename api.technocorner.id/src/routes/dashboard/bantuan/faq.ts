import { Request, Response, Router } from "express";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const faqDocs = await firebase
      .firestore()
      .collection("pertanyaan")
      .where("faq", "==", true)
      .get();

    const faqs: FirebaseFirestore.DocumentData = [];
    faqDocs.forEach((faq) =>
      faqs.push({
        id: faq.id,
        judul: faq.data()!.judul,
        isi: faq.data()!.isi,
        label: faq.data()!.label,
      })
    );

    return res.json({ success: true, body: faqs });
  })
);

export default router;

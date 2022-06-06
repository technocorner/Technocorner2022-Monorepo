import { Request, Response, Router } from "express";
import asyncHandler from "../../../asyncHandler";
import firebase from "../../../firebase";
import { Timestamp } from "@google-cloud/firestore";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    let query = req.query.q;
    let label = req.query.label;
    let waktuTerakhir = Number(req.query.waktuAkhir);

    let bantuan: Array<FirebaseFirestore.DocumentData> = [];

    if (query || label) {
      let bantuanDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;
      bantuanDocs = await firebase
        .firestore()
        .collection("pertanyaan")
        .orderBy("waktu", "desc")
        .get();

      if (label) {
        bantuanDocs.forEach((doc) => {
          if (doc.data().label === label) {
            bantuan.push(doc.data());
          }
        });
      }

      if (query) {
        let bantuanDocsFiltered: Array<FirebaseFirestore.DocumentData> = bantuan
          ? bantuan
          : [];
        const regex = new RegExp(query as string, "i");
        if (bantuanDocsFiltered.length) {
          bantuan = [];
          bantuanDocsFiltered.forEach((doc) => {
            if (regex.test(doc.judul) || regex.test(doc.isi)) {
              bantuan.push(doc.data());
            }
          });
        } else {
          bantuanDocs.forEach((doc) => {
            if (regex.test(doc.data().judul) || regex.test(doc.data().isi)) {
              bantuan.push(doc.data());
            }
          });
        }
      }

      let bantuanDocsFiltered: Array<FirebaseFirestore.DocumentData> = bantuan;
      bantuan = [];
      let counter = 0;
      if (waktuTerakhir) {
        bantuanDocsFiltered.forEach((doc) => {
          if (doc.waktu.toMillis() > waktuTerakhir && counter < 10) {
            bantuan.push({ ...doc, waktu: doc.waktu.toMillis() });
            ++counter;
          }
        });
      } else {
        bantuanDocsFiltered.forEach((doc) => {
          if (counter < 10) {
            bantuan.push({ ...doc, waktu: doc.waktu.toMillis() });
          }
          ++counter;
        });
      }
    } else {
      let bantuanDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;
      if (waktuTerakhir) {
        const waktu = Timestamp.fromMillis(waktuTerakhir);
        bantuanDocs = await firebase
          .firestore()
          .collection("pertanyaan")
          .orderBy("waktu", "desc")
          .startAfter(waktu)
          .limit(10)
          .get();
      } else {
        bantuanDocs = await firebase
          .firestore()
          .collection("pertanyaan")
          .orderBy("waktu", "desc")
          .limit(10)
          .get();
      }
      bantuanDocs.forEach((doc) =>
        bantuan.push({ ...doc.data(), waktu: doc.data().waktu.toMillis() })
      );
    }

    return res.json(bantuan);
  })
);

export default router;

import { Request, Response, Router } from "express";
import { eec, iot, lf, tp } from "../../../../data/events";
import asyncHandler from "../../../asyncHandler";
import firebase from "../../../firebase";
import getFirestoreUrl from "../../../firebase/getFirestoreUrl";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const kompetisi = req.headers.acara;
    let bayar: boolean;
    if (kompetisi === "iot") {
      bayar = false;
      const date = Date.now();
      const index = iot.registration.findIndex(
        (reg) => date >= reg.date[0].getTime() && date < reg.date[1].getTime()
      );
      if (index >= 0 && iot.registration[index].price) {
        bayar = true;
      } else if (
        index === -1 &&
        date >= iot.registration.at(-1)!.date[1].getTime()
      ) {
        bayar = true;
      }
    } else {
      bayar = true;
    }
    let tim: Array<FirebaseFirestore.DocumentData> = [];

    const timDocs = await firebase
      .firestore()
      .collection(`acara/${kompetisi}/tim`)
      .orderBy("tahap", "desc")
      .orderBy("verifikasi")
      .orderBy("pembayaran", "desc")
      .orderBy("createTime", "desc")
      .orderBy("nama")
      .get();
    timDocs.forEach((doc) => {
      let tahap = "";
      switch (kompetisi) {
        case "iot":
          tahap = iot.phase[doc.data()!.tahap].name;
          break;
        case "eec":
          tahap = eec.phase[doc.data()!.tahap].name;
          break;
        case "lf":
          tahap = lf.phase[doc.data()!.tahap].name;
          break;
        case "tp":
          tahap = tp.phase[doc.data()!.tahap].name;
          break;
      }
      const timData: {
        id: string;
        nama: string;
        email: string;
        tahap: string;
        bayar: boolean;
        pembayaran: string;
        tahanVerifikasi: boolean;
        verifikasi: boolean;
        proposal?: string;
        video?: string;
      } = {
        id: doc.id,
        nama: doc.data()!.nama,
        email: doc.data()!.peserta[0].id,
        tahap,
        bayar,
        tahanVerifikasi: doc.data()!.tahanVerifikasi ? true : false,
        pembayaran: doc.data()!.pembayaran,
        verifikasi: doc.data()!.verifikasi,
      };
      if (kompetisi === "iot") {
        timData.proposal = doc.data()!.proposal;
        timData.video = doc.data()!.video;
      }
      tim.push(timData);
    });

    await Promise.all(
      tim.map(async (t) => {
        if (t.pembayaran) {
          t.pembayaran = await getFirestoreUrl(
            `acara/${kompetisi}/tim/pembayaran/${t.pembayaran}`
          );
        }

        if (kompetisi === "iot" && t.proposal) {
          t.proposal = await getFirestoreUrl(
            `acara/${kompetisi}/tim/proposal/${t.proposal}`
          );
        }
      })
    );

    return res.json({ success: true, body: tim });
  })
);

export default router;

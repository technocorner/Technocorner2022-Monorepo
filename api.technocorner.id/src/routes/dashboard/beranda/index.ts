import { Request, Response, Router } from "express";
import {
  eec,
  events,
  iot,
  lf,
  tp,
  webinar,
  workshop,
} from "../../../data/events";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";
import timestampToDate from "../../../libs/timestampToDate";
import pengumuman from "./pengumuman";

const router = Router();

router.use("/pengumuman", pengumuman);

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const date = Date.now();
    const pengumuman: Array<FirebaseFirestore.DocumentData> = [];
    const rundown: { [key: string]: any } = {};
    const allRundown: Array<{
      show: boolean;
      category: string;
      content: string;
      date: Array<Date>;
    }> = [];

    if (req.session!.role === "pengguna") {
      {
        const pengumumanDocs = await firebase
          .firestore()
          .collection("pengumuman/pengguna/0semua")
          .orderBy("createTime", "desc")
          .get();
        pengumumanDocs.forEach((doc) =>
          pengumuman.push({
            penerima: "Semua peserta",
            judul: doc.data()!.judul,
            isi: doc.data()!.isi,
          })
        );
      }

      const penggunaDoc = await firebase
        .firestore()
        .collection("pengguna")
        .doc(req.session!.ref)
        .get();

      {
        const pengumumanDocs = await firebase
          .firestore()
          .collection(`pengumuman/pengguna/${req.session!.ref}`)
          .orderBy("createTime", "desc")
          .get();
        pengumumanDocs.forEach((doc) =>
          pengumuman.push({
            penerima: penggunaDoc.data()!.nama,
            judul: doc.data()!.judul,
            isi: doc.data()!.isi,
          })
        );
      }

      await Promise.all(
        (penggunaDoc.data()!.acara as Array<{ kategori: string }>).map(
          async (a) => {
            const pengumumanDocs = await firebase
              .firestore()
              .collection(`pengumuman/acara/${a.kategori}`)
              .orderBy("createTime", "desc")
              .get();
            pengumumanDocs.forEach((doc) =>
              pengumuman.push({
                penerima: events.find((e) => e.id === a.kategori)!.name,
                judul: doc.data()!.judul,
                isi: doc.data()!.isi,
              })
            );
          }
        )
      );

      let acara: Array<{ id: string; kategori: string; nama?: string }> = [];

      const acaraCategory: Array<string> = [];
      await Promise.all(
        (
          penggunaDoc.data()!.acara as Array<{ id: string; kategori: string }>
        ).map(async (a) => {
          if (a.kategori !== "workshop" && a.kategori !== "webinar") {
            const tim = await firebase
              .firestore()
              .collection(`acara/${a.kategori}/tim`)
              .doc(a.id)
              .get();
            acara.push({
              id: a.id,
              kategori: a.kategori,
              nama: tim.data()!.nama,
            });
          } else {
            acara.push({ id: a.id, kategori: a.kategori });
          }
          acaraCategory.push(a.kategori);
        })
      );

      acara.sort((a, b) => (a.kategori < b.kategori ? -1 : 1));

      acaraCategory.forEach((c) => {
        switch (c) {
          case "iot":
            allRundown.push(...iot.timeline);
            break;
          case "eec":
            allRundown.push(...eec.timeline);
            break;
          case "tp":
            allRundown.push(...tp.timeline);
            break;
          case "lf":
            allRundown.push(...lf.timeline);
            break;
          case "webinar":
            allRundown.push(...webinar.timeline);
            break;
          case "workshop":
            allRundown.push(...workshop.timeline);
            break;
        }
      });

      allRundown.sort((a, b) => (a.date[0] < b.date[0] ? -1 : 1));

      allRundown.forEach((doc) => {
        if (!doc.show || date > doc.date[1].getTime()) {
          return;
        }

        const ldate = timestampToDate(doc.date[0]);
        const tanggal = ldate.tanggal;
        const waktu = ldate.pukul;
        const data = { label: doc.category, isi: doc.content, waktu };

        if (rundown[tanggal]) {
          rundown[tanggal].push(data);
        } else {
          rundown[tanggal] = [data];
        }
      });

      return res.json({ success: true, body: { pengumuman, acara, rundown } });
    }

    if (req.session!.role === "admin") {
      const pengumumanCols = await firebase
        .firestore()
        .collection("pengumuman")
        .doc("pengguna")
        .listCollections();

      await Promise.all(
        pengumumanCols.map(async (p) => {
          const pengumumanDocs = await p.orderBy("createTime", "desc").get();
          pengumumanDocs.forEach((doc) => {
            if (p.id === "0semua") {
              pengumuman.push({
                id: doc.id,
                penerima: "Semua peserta",
                judul: doc.data()!.judul,
                isi: doc.data()!.isi,
              });
            } else {
              pengumuman.push({
                id: doc.id,
                penerima: p.id,
                judul: doc.data()!.judul,
                isi: doc.data()!.isi,
              });
            }
          });
        })
      );

      await Promise.all(
        ["iot", "eec", "lf", "tp", "workshop", "webinar"].map(async (a) => {
          const pengumumanDocs = await firebase
            .firestore()
            .collection(`pengumuman/acara/${a}`)
            .orderBy("createTime", "desc")
            .get();
          pengumumanDocs.forEach((doc) =>
            pengumuman.push({
              id: doc.id,
              penerima: events.find((e) => e.id === a)!.name,
              judul: doc.data()!.judul,
              isi: doc.data()!.isi,
            })
          );
        })
      );

      const statCol = firebase.firestore().collection("statistik");
      const statAcara = (await statCol.doc("acara").get()).data();
      const statTanya = (await statCol.doc("pertanyaan").get()).data();

      allRundown.push(...iot.timeline);
      allRundown.push(...eec.timeline);
      allRundown.push(...lf.timeline);
      allRundown.push(...tp.timeline);
      allRundown.push(...webinar.timeline);
      allRundown.push(...workshop.timeline);

      allRundown.sort((a, b) => (a.date[0] < b.date[0] ? -1 : 1));

      allRundown.forEach((doc) => {
        if (date > doc.date[1].getTime()) {
          return;
        }

        const ldate = timestampToDate(doc.date[0]);
        const tanggal = ldate.tanggal;
        const waktu = ldate.pukul;
        const data = { label: doc.category, isi: doc.content, waktu };

        if (rundown[tanggal]) {
          rundown[tanggal].push(data);
        } else {
          rundown[tanggal] = [data];
        }
      });

      return res.json({
        success: true,
        body: { pengumuman, statAcara, statTanya, rundown },
      });
    }
  })
);

export default router;

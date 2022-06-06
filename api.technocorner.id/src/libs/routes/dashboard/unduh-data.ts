import { Request, Response, Router } from "express";
import writeXlsxFile, { Stream } from "write-excel-file/node";
import asyncHandler from "../../asyncHandler";
import firebase from "../../firebase";
import schema from "../../../data/skemaDataSpreadsheetTim";
import getFirestoreUrl from "../../firebase/getFirestoreUrl";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const kategori = req.headers.kategori;
    let dataDocs: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;
    switch (kategori) {
      case "iot":
        dataDocs = await firebase
          .firestore()
          .collection("/acara/iot/tim")
          .orderBy("tahap", "desc")
          .orderBy("verifikasi")
          .orderBy("createTime", "desc")
          .orderBy("nama")
          .get();
        break;
      case "eec":
        dataDocs = await firebase
          .firestore()
          .collection("/acara/eec/tim")
          .orderBy("tahap", "desc")
          .orderBy("verifikasi")
          .orderBy("createTime", "desc")
          .orderBy("nama")
          .get();
        break;
      case "lf":
        dataDocs = await firebase
          .firestore()
          .collection("/acara/lf/tim")
          .orderBy("tahap", "desc")
          .orderBy("verifikasi")
          .orderBy("createTime", "desc")
          .orderBy("nama")
          .get();
        break;
      case "tp":
        dataDocs = await firebase
          .firestore()
          .collection("/acara/tp/tim")
          .orderBy("tahap", "desc")
          .orderBy("verifikasi")
          .orderBy("createTime", "desc")
          .orderBy("nama")
          .get();
        break;
      case "workshop":
        dataDocs = await firebase
          .firestore()
          .collection("/acara/workshop/peserta")
          .orderBy("verifikasi")
          .orderBy("createTime", "desc")
          .get();
        break;
      case "webinar":
        dataDocs = await firebase
          .firestore()
          .collection("/acara/webinar/peserta")
          .orderBy("verifikasi")
          .orderBy("createTime", "desc")
          .get();
        break;
      case "pengguna":
        dataDocs = await firebase
          .firestore()
          .collection("/pengguna")
          .orderBy("peran", "desc")
          .orderBy("bekukan")
          .orderBy("verifikasi")
          .orderBy("createTime", "desc")
          .orderBy("nama")
          .get();
        break;
      default:
        return res.json({
          success: false,
          body: { error: "Permintaan tidak valid" },
        });
    }

    const dataPendaftaran: Array<FirebaseFirestore.DocumentData> = [];
    dataDocs.forEach((d) => dataPendaftaran.push(d.data()));

    const data: Array<{
      no: number;
      namaTim: string;
      asalInstansi: string;
      pembayaran: string;
      nama0: string;
      email0: string;
      whatsapp0: string;
      nama1: string;
      email1: string;
      whatsapp1: string;
      nama2: string;
      email2: string;
      whatsapp2: string;
      verifikasi: boolean;
      verifikasiEmailTerkirim: boolean;
    }> = [];

    switch (kategori) {
      case "iot":
      case "eec":
      case "lf":
      case "tp":
        await Promise.all(
          dataPendaftaran.map(async (d, index) => {
            const peserta = [
              {
                nama: "-",
                email: "-",
                whatsapp: "-",
                instansi: "-",
                ketua: false,
              },
              {
                nama: "-",
                email: "-",
                whatsapp: "-",
                instansi: "-",
                ketua: false,
              },
              {
                nama: "-",
                email: "-",
                whatsapp: "-",
                instansi: "-",
                ketua: false,
              },
            ];
            await Promise.all(
              d.peserta.map(
                async (
                  p: {
                    id: string;
                    ketua: boolean;
                    syarat: { twibbon: string };
                  },
                  index: number
                ) => {
                  const penggunaDoc = await firebase
                    .firestore()
                    .collection("pengguna")
                    .doc(p.id)
                    .get();
                  peserta[index].nama = penggunaDoc.data()!.nama
                    ? penggunaDoc.data()!.nama
                    : "-";
                  peserta[index].email = penggunaDoc.data()!.email
                    ? penggunaDoc.data()!.email
                    : "-";
                  peserta[index].whatsapp = penggunaDoc.data()!.whatsapp
                    ? penggunaDoc.data()!.whatsapp
                    : "-";
                  peserta[index].instansi = penggunaDoc.data()!.instansi
                    ? penggunaDoc.data()!.instansi
                    : "-";
                  peserta[index].ketua = p.ketua ? true : false;
                }
              )
            );

            peserta.sort((a, b) =>
              a.ketua === b.ketua ? 0 : a.ketua ? -1 : 1
            );

            const dPendaftaran = {
              no: index + 1,
              namaTim: d.nama,
              asalInstansi: peserta[0].instansi,
              pembayaran: d.pembayaran
                ? await getFirestoreUrl(
                    `acara/${kategori}/tim/pembayaran/${d.pembayaran}`
                  )
                : "-",
              nama0: peserta[0].nama,
              email0: peserta[0].email,
              whatsapp0: peserta[0].whatsapp,
              nama1: peserta[1].nama,
              email1: peserta[1].email,
              whatsapp1: peserta[1].whatsapp,
              nama2: peserta[2].nama,
              email2: peserta[2].email,
              whatsapp2: peserta[2].whatsapp,
              verifikasi: d.verifikasi ? true : false,
              verifikasiEmailTerkirim: d.verifikasiEmailTerkirim ? true : false,
            };

            data.push(dPendaftaran);
          })
        );
        break;
      case "workshop":
      case "webinar":
        break;
      case "pengguna":
        break;
    }

    data.sort((a, b) => a.no - b.no);

    const fileStream = await writeXlsxFile(data as any, { schema });

    res.attachment(`${kategori}.xlsx`);
    return (fileStream as Stream).pipe(res as any);
  })
);

export default router;

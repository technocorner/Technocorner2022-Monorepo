import { Request, Response, Router } from "express";
import { eec, iot, lf, tp } from "../../../../../data/events";
import asyncHandler from "../../../../asyncHandler";
import firebase from "../../../../firebase";
import getFirestoreUrl from "../../../../firebase/getFirestoreUrl";
import rupiahFormatter from "../../../../rupiahFormatter";
import hapusPeserta from "./hapus-peserta";
import hapusTim from "./hapus-tim";
import kirimEmail from "../../kirim-email";

const router = Router();

router.use("/hapus-peserta", hapusPeserta); // Not maintained
router.use("/hapus-tim", hapusTim); // Not maintained
router.use("/kirim-email", kirimEmail);

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const pengguna = req.session!.ref;
    const peran = req.session!.role;
    const kompetisi = req.headers.acara;
    const id = req.params.id;

    const timDoc = await firebase
      .firestore()
      .collection(`acara/${kompetisi}/tim`)
      .doc(id)
      .get();

    if (!timDoc.exists) {
      return res.json({
        success: false,
        body: { error: "Tim tidak ditemukan" },
      });
    }

    let twibbon = "";
    const peserta: Array<{
      id: string;
      nama: string;
      ketua: boolean;
      verifikasi: string;
      syarat?: { twibbon: string };
    }> = [];
    await Promise.all(
      (
        timDoc.data()!.peserta as Array<{
          id: string;
          ketua: boolean;
          syarat: { twibbon: string };
        }>
      ).map(async (a) => {
        const pesertaDoc = await firebase
          .firestore()
          .collection("pengguna")
          .doc(a.id)
          .get();

        let tw = "";
        if (a.syarat && a.syarat.twibbon) {
          tw = a.syarat.twibbon;
        }
        if (tw) {
          tw = await getFirestoreUrl(`acara/${kompetisi}/tim/twibbon/${tw}`);
        }
        peserta.push({
          id: pesertaDoc.id,
          nama: pesertaDoc.data()!.nama,
          ketua: a.ketua,
          verifikasi: pesertaDoc.data()!.verifikasi,
          syarat: { twibbon: tw },
        });

        if (pengguna === pesertaDoc.id && a.syarat && a.syarat.twibbon) {
          twibbon = await getFirestoreUrl(
            `acara/${kompetisi}/tim/twibbon/${a.syarat.twibbon}`
          );
        }
      })
    );

    {
      let access = false;
      if (peran === "admin") {
        access = true;
      } else {
        peserta.forEach((a) => {
          if (pengguna === a.id) {
            access = true;
          }
        });
      }
      if (!access) {
        return res.json({
          success: false,
          body: { error: "Tidak berhak mengakses data tim" },
        });
      }
    }

    peserta.sort((a, b) => (a.ketua === b.ketua ? 0 : a.ketua ? -1 : 1));

    let pembayaran = "";
    if (timDoc.data()!.pembayaran) {
      pembayaran = await getFirestoreUrl(
        `acara/${kompetisi}/tim/pembayaran/${timDoc.data()!.pembayaran}`
      );
    }

    let proposal = "",
      video = "";
    if (kompetisi === "iot") {
      if (timDoc.data()!.proposal) {
        proposal = await getFirestoreUrl(
          `acara/${kompetisi}/tim/proposal/${timDoc.data()!.proposal}`
        );
      }
      if (timDoc.data()!.video) {
        video = timDoc.data()!.video;
      }
    }

    const date = Date.now();

    let bayar = false;
    // let bayar = true;
    let tahap: {
      idTahapTim: number;
      tahapTim: string;
      idTahapJadwal: number;
      semuaTahap: Array<string>;
    } = { idTahapTim: 0, tahapTim: "", idTahapJadwal: 0, semuaTahap: [] };
    let biaya = 0;
    let index = 0;
    switch (kompetisi) {
      case "iot":
        // Memasukkan semua nama tahapan
        iot.phase.forEach((p) => {
          tahap.semuaTahap.push(p.name);
        });

        // Mencari tahap registrasi saat ini menurut tanggal sekarang
        index = iot.registration.findIndex(
          (reg) => date >= reg.date[0].getTime() && date < reg.date[1].getTime()
        );

        // Jika timeline telah selesai, maka digunakan tahapan terakhir
        if (
          index === -1 &&
          date >=
            iot.registration[iot.registration.length - 1].date[1].getTime()
        ) {
          index = iot.registration.length - 1;
        }

        // Mengeset biaya awal, yaitu nol rupiah
        biaya = iot.registration[0].price;

        // Apabila lolos dan masuk ke tahap penyisihan 2, maka dikenakan biaya
        if (timDoc.data()!.tahap >= 2 && index >= 0) {
          biaya = iot.registration[index].price;
        }

        // Untuk memudahkan frontend. Jika ada biaya, maka bayar = true;
        if (biaya) {
          bayar = true;
        }

        // Mencari tahap kompetisi saat ini menurut tanggal sekarang
        if (date >= iot.phase[0].date[0].getTime()) {
          index = iot.phase.findIndex(
            (phase) => date < phase.date[1].getTime()
          );
          if (index === -1) {
            index = eec.phase.length - 1;
          }
          if (date < iot.phase[index].date[0].getTime()) {
            --index;
          }
        }

        // Jika timeline telah selesai, maka digunakan tahapan terakhir
        if (index < 0 && date >= iot.phase.at(-1)!.date[1].getTime()) {
          index = iot.phase.length - 1;
        }

        // Memasukkan data
        if (index >= 0) {
          tahap.idTahapJadwal = index;
          tahap.idTahapTim = timDoc.data()!.tahap;
          tahap.tahapTim = iot.phase[timDoc.data()!.tahap].name;
        }
        break;
      case "eec":
        // Memasukkan semua nama tahapan
        eec.phase.forEach((p) => {
          tahap.semuaTahap.push(p.name);
        });

        // Mencari tahap registrasi saat ini menurut tanggal sekarang
        index = eec.registration.findIndex(
          (reg) => date >= reg.date[0].getTime() && date < reg.date[1].getTime()
        );

        // Jika timeline telah selesai, maka digunakan tahapan terakhir
        if (
          index === -1 &&
          date >=
            eec.registration[eec.registration.length - 1].date[1].getTime()
        ) {
          index = eec.registration.length - 1;
        }

        // Mengeset biaya
        biaya = eec.registration[0].price;

        // Untuk memudahkan frontend. Jika ada biaya, maka bayar = true;
        if (biaya) {
          bayar = true;
        }

        // Mencari tahap kompetisi saat ini menurut tanggal sekarang
        if (date >= eec.phase[0].date[0].getTime()) {
          index = eec.phase.findIndex(
            (phase) => date < phase.date[1].getTime()
          );
          if (index === -1) {
            index = eec.phase.length - 1;
          }
          if (date < eec.phase[index].date[0].getTime()) {
            --index;
          }
        }

        // Jika timeline telah selesai, maka digunakan tahapan terakhir
        if (index < 0 && date >= eec.phase.at(-1)!.date[1].getTime()) {
          index = eec.phase.length - 1;
        }

        // Memasukkan data
        if (index >= 0) {
          tahap.idTahapJadwal = index;
          tahap.idTahapTim = timDoc.data()!.tahap;
          tahap.tahapTim = eec.phase[timDoc.data()!.tahap].name;
        }
        break;
      case "lf":
        // Memasukkan semua nama tahapan
        lf.phase.forEach((p) => {
          tahap.semuaTahap.push(p.name);
        });

        // Mencari tahap registrasi saat ini menurut tanggal sekarang
        index = lf.registration.findIndex(
          (reg) => date >= reg.date[0].getTime() && date < reg.date[1].getTime()
        );

        // Jika timeline telah selesai, maka digunakan tahapan terakhir
        if (
          index === -1 &&
          date >= lf.registration[lf.registration.length - 1].date[1].getTime()
        ) {
          index = lf.registration.length - 1;
        }

        // Mengeset biaya
        biaya = lf.registration[0].price;

        // Untuk memudahkan frontend. Jika ada biaya, maka bayar = true;
        if (biaya) {
          bayar = true;
        }

        // Mencari tahap kompetisi saat ini menurut tanggal sekarang
        if (date >= lf.phase[0].date[0].getTime()) {
          index = lf.phase.findIndex((phase) => date < phase.date[1].getTime());
          if (index === -1) {
            index = eec.phase.length - 1;
          }
          if (date < lf.phase[index].date[0].getTime()) {
            --index;
          }
        }

        // Jika timeline telah selesai, maka digunakan tahapan terakhir
        if (index < 0 && date >= lf.phase.at(-1)!.date[1].getTime()) {
          index = lf.phase.length - 1;
        }

        // Memasukkan data
        if (index >= 0) {
          tahap.idTahapJadwal = index;
          tahap.idTahapTim = timDoc.data()!.tahap;
          tahap.tahapTim = lf.phase[timDoc.data()!.tahap].name;
        }
        break;
      case "tp":
        // Memasukkan semua nama tahapan
        tp.phase.forEach((p) => {
          tahap.semuaTahap.push(p.name);
        });

        // Mencari tahap registrasi saat ini menurut tanggal sekarang
        index = tp.registration.findIndex(
          (reg) => date >= reg.date[0].getTime() && date < reg.date[1].getTime()
        );

        // Jika timeline telah selesai, maka digunakan tahapan terakhir
        if (
          index === -1 &&
          date >= tp.registration[tp.registration.length - 1].date[1].getTime()
        ) {
          index = tp.registration.length - 1;
        }

        // Mengeset biaya
        biaya = tp.registration[0].price;

        // Untuk memudahkan frontend. Jika ada biaya, maka bayar = true;
        if (biaya) {
          bayar = true;
        }

        // Mencari tahap kompetisi saat ini menurut tanggal sekarang
        if (date >= tp.phase[0].date[0].getTime()) {
          index = tp.phase.findIndex((phase) => date < phase.date[1].getTime());
          if (index === -1) {
            index = eec.phase.length - 1;
          }
          if (date < tp.phase[index].date[0].getTime()) {
            --index;
          }
        }

        // Jika timeline telah selesai, maka digunakan tahapan terakhir
        if (index < 0 && date >= tp.phase.at(-1)!.date[1].getTime()) {
          index = tp.phase.length - 1;
        }

        // Memasukkan data
        if (index >= 0) {
          tahap.idTahapJadwal = index;
          tahap.idTahapTim = timDoc.data()!.tahap;
          tahap.tahapTim = tp.phase[timDoc.data()!.tahap].name;
        }
        break;
    }

    const data: {
      id: string;
      nama: string;
      biaya: string;
      tahap: {
        idTahapTim: number;
        tahapTim: string;
        idTahapJadwal: number;
        semuaTahap: Array<string>;
      };
      semuaTahap?: Array<string>;
      bayar: boolean;
      pembayaran: string;
      tahanVerifikasi: boolean;
      verifikasi: boolean;
      verifikasiEmailTerkirim?: boolean;
      peserta: Array<{
        id: string;
        nama: string;
        ketua: boolean;
        verifikasi: string;
        syarat?: { twibbon: string };
      }>;
      pengguna: string;
      proposal: string;
      video: string;
      syarat: { twibbon: string };
      peran: string;
    } = {
      id: timDoc.id,
      nama: timDoc.data()!.nama,
      biaya: rupiahFormatter.format(biaya),
      tahap,
      bayar,
      pembayaran,
      tahanVerifikasi: timDoc.data()!.tahanVerifikasi,
      verifikasi: timDoc.data()!.verifikasi,
      peserta,
      pengguna,
      proposal,
      video,
      syarat: { twibbon },
      peran,
    };

    if (peran === "admin") {
      data.verifikasiEmailTerkirim = timDoc.data()!.verifikasiEmailTerkirim;
    }

    return res.json({
      success: true,
      body: data,
    });
  })
);

export default router;

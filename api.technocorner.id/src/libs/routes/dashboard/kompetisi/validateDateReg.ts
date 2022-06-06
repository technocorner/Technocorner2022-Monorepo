import { eec, events, iot, lf, tp } from "../../../../data/events";

export default (kompetisi: string) => {
  const date = Date.now();
  let title = events.find((e) => e.id === kompetisi)!.name;

  let notOpen = { status: false, date: new Date() };
  let isClosed = false;
  switch (kompetisi) {
    case "eec":
      if (date < eec.registration[0].date[0].getTime()) {
        notOpen = { status: true, date: eec.registration[0].date[0] };
      } else if (date >= eec.registration[0].date[1].getTime()) {
        isClosed = true;
      }
      break;
    case "iot":
      if (date < iot.registration[0].date[0].getTime()) {
        notOpen = { status: true, date: iot.registration[0].date[0] };
      } else if (date >= iot.registration[0].date[1].getTime()) {
        isClosed = true;
      }
      break;
    case "tp":
      if (date < tp.registration[0].date[0].getTime()) {
        notOpen = { status: true, date: tp.registration[0].date[0] };
      } else if (date >= tp.registration[0].date[1].getTime()) {
        isClosed = true;
      }
      break;
    case "lf":
      if (date < lf.registration[0].date[0].getTime()) {
        notOpen = { status: true, date: lf.registration[0].date[0] };
      } else if (date >= lf.registration[0].date[1].getTime()) {
        isClosed = true;
      }
      break;
  }

  let hari = "";
  let tanggal = "";
  if (notOpen.status) {
    hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][
      notOpen.date.getDay()
    ];
    tanggal = `${notOpen.date.getDate()} ${
      [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ][notOpen.date.getMonth()]
    } ${notOpen.date.getFullYear()}`;
  }

  let error = "";
  if (notOpen.status) {
    error = `Mohon maaf, pendaftaran belum dibuka. Pendaftaran ${title} akan dibuka mulai ${hari}, ${tanggal} pukul ${notOpen.date.toLocaleTimeString(
      "id"
    )}`;
  } else if (isClosed) {
    error =
      "Mohon maaf, pendaftaran telah ditutup. Sampai bertemu di Technocorner 2023!";
  }

  if (notOpen.status || isClosed) {
    return { status: false, body: { error } };
  }

  return { status: true };
};

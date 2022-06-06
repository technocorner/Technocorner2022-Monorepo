import { dataAcara } from "./dataAcara";

const dataTimeline = [
  {
    show: true,
    content: "Pendaftaran",
    date: "7 Februari - 6 Maret",
    category: "IoT",
  },
  {
    show:
      Date.now() >=
      dataAcara.find((a) => a.id === "IoT").extendRegistrationFrom.getTime(),
    content: "Perpanjangan Pendaftaran",
    date: "7 Maret - 13 Maret",
    category: "IoT",
  },
  {
    show: true,
    content: "Pengumuman Lolos Seleksi Tahap Pertama",
    date: "23 Maret",
    category: "IoT",
  },
  {
    show: true,
    content: "Pengumpulan Video Demonstrasi",
    date: "23 Maret - 11 April",
    category: "IoT",
  },
  {
    show: true,
    content: "Pengumuman 10 Finalis",
    date: "7 Mei",
    category: "IoT",
  },
  {
    show: true,
    content: "Technical Meeting Persiapan Final",
    date: "9 Mei",
    category: "IoT",
  },
  {
    show: true,
    content: "Babak Final",
    date: "15 Mei",
    category: "IoT",
  },
  {
    show: true,
    content: "Pendaftaran",
    date: "14 Februari - 13 Maret",
    category: "EEC",
  },
  {
    show:
      Date.now() >=
      dataAcara.find((a) => a.id === "EEC").extendRegistrationFrom.getTime(),
    content: "Perpanjangan Pendaftaran",
    date: "14 Maret - 20 Maret",
    category: "EEC",
  },
  {
    show: true,
    content: "Babak Penyisihan",
    date: "11 Mei",
    category: "EEC",
  },
  {
    show: true,
    content: "Babak Semifinal",
    date: "14 Mei",
    category: "EEC",
  },
  {
    show: true,
    content: "Babak Grandfinal",
    date: "15 Mei",
    category: "EEC",
  },
  {
    show: true,
    content: "Pendaftaran",
    date: "21 Februari - 28 April",
    category: "TP",
  },
  {
    show:
      Date.now() >=
      dataAcara.find((a) => a.id === "TP").extendRegistrationFrom.getTime(),
    content: "Perpanjangan Pendaftaran",
    date: "29 April - 6 Mei",
    category: "TP",
  },
  {
    show: true,
    content: "Technical Meeting",
    date: "14 Mei",
    category: "TP",
  },
  {
    show: true,
    content: "Pelaksanaan Kompetisi",
    date: "21 Mei",
    category: "TP",
  },
  {
    show: true,
    content: "Pendaftaran",
    date: "21 Februari - 28 April",
    category: "LF",
  },
  {
    show:
      Date.now() >=
      dataAcara.find((a) => a.id === "LF").extendRegistrationFrom.getTime(),
    content: "Perpanjangan Pendaftaran",
    date: "29 April - 6 Mei",
    category: "LF",
  },
  {
    show: true,
    content: "Technical Meeting",
    date: "14 Mei",
    category: "LF",
  },
  {
    show: true,
    content: "Kompetisi Hari Pertama",
    date: "21 Mei",
    category: "LF",
  },
  {
    show: true,
    content: "Kompetisi Hari Kedua",
    date: "22 Mei",
    category: "LF",
  },
  {
    show: true,
    content: "Pendaftaran",
    date: "14 April - 19 Mei",
    category: "Webinar",
  },
  {
    show: true,
    content: "Hari Pelaksanaan",
    date: "21 Mei",
    category: "Webinar",
  },
  {
    show: true,
    content: "Pendaftaran",
    date: "9 April - 20 April",
    category: "Workshop",
  },
  {
    show:
      Date.now() >=
      dataAcara
        .find((a) => a.id === "Workshop")
        .extendRegistrationFrom.getTime(),
    content: "Perpanjangan Pendaftaran",
    date: "21 April - 13 Mei",
    category: "Workshop",
  },
  {
    show: true,
    content: "Pelaksanaan Hari Pertama",
    date: "14 Mei",
    category: "Workshop",
  },
  {
    show: true,
    content: "Pelaksanaan Hari Kedua",
    date: "15 Mei",
    category: "Workshop",
  },
];

export { dataTimeline };

export const events = [
  { id: "eec", name: "Electrical Engineering Competition" },
  { id: "iot", name: "IoT Development Competition" },
  { id: "lf", name: "Line Follower" },
  { id: "tp", name: "Transporter" },
  { id: "workshop", name: "Workshop" },
  { id: "webinar", name: "Webinar" },
];

export const eec = {
  registration: [
    {
      price: 50000,
      date: [
        new Date("February 14, 2022 00:00:00 GMT+7"),
        new Date("Mart 21, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
  phase: [
    {
      name: "Masa Pendaftaran",
      date: [
        new Date("February 14, 2022 00:00:00 GMT+7"),
        new Date("Mart 21, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Penyisihan",
      date: [
        new Date("May 11, 2022 00:00:00 GMT+7"),
        new Date("May 12, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Semifinal",
      date: [
        new Date("May 14, 2022 00:00:00 GMT+7"),
        new Date("May 15, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Grandfinal",
      date: [
        new Date("May 15, 2022 00:00:00 GMT+7"),
        new Date("May 16, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
  timeline: [
    {
      show: true,
      category: "EEC",
      content: "Masa Pendaftaran",
      date: [
        new Date("February 14, 2022 00:00:00 GMT+7"),
        new Date("Mart 14, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "EEC",
      content: "Batas Pendaftaran",
      date: [
        new Date(new Date("Mart 14, 2022 00:00:00 GMT+7").getTime() - 1),
        new Date(new Date("Mart 14, 2022 00:00:00 GMT+7").getTime() - 1),
      ],
    },
    {
      show: Date.now() >= new Date("Mart 14, 2022 00:00:00 GMT+7").getTime(),
      category: "EEC",
      content: "Perpanjangan Pendaftaran",
      date: [
        new Date("Mart 14, 2022 00:00:00 GMT+7"),
        new Date("Mart 20, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: Date.now() >= new Date("Mart 14, 2022 00:00:00 GMT+7").getTime(),
      category: "EEC",
      content: "Batas Pendaftaran",
      date: [
        new Date(new Date("Mart 20, 2022 00:00:00 GMT+7").getTime() - 1),
        new Date(new Date("Mart 20, 2022 00:00:00 GMT+7").getTime() - 1),
      ],
    },
    {
      show: true,
      category: "EEC",
      content: "Babak Penyisihan",
      date: [
        new Date("May 11, 2022 00:00:00 GMT+7"),
        new Date("May 12, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "EEC",
      content: "Babak Semifinal",
      date: [
        new Date("May 14, 2022 00:00:00 GMT+7"),
        new Date("May 15, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "EEC",
      content: "Babak Final",
      date: [
        new Date("May 14, 2022 00:00:00 GMT+7"),
        new Date("May 15, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
};

export const iot = {
  registration: [
    {
      price: 0,
      date: [
        new Date("February 7, 2022 00:00:00 GMT+7"),
        new Date("Mart 14, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      //Lolos seleksi berkas. Selanjutnya seleksi video.
      price: 75000,
      date: [
        new Date("Mart 23, 2022 00:00:00 GMT+7"),
        new Date("April 12, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
  phase: [
    {
      name: "Masa Pendaftaran",
      date: [
        new Date("February 7, 2022 00:00:00 GMT+7"),
        new Date("Mart 14, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Penyisihan 1",
      date: [
        new Date("February 7, 2022 00:00:00 GMT+7"),
        new Date("Mart 23, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Penyisihan 2",
      date: [
        new Date("Mart 23, 2022 00:00:00 GMT+7"),
        new Date("April 12, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Grandfinal",
      date: [
        new Date("May 22, 2022 00:00:00 GMT+7"),
        new Date("May 23, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
  timeline: [
    {
      show: true,
      category: "IoT",
      content: "Masa Pendaftaran",
      date: [
        new Date("February 7, 2022 00:00:00 GMT+7"),
        new Date("Mart 7, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "IoT",
      content: "Batas Pendaftaran",
      date: [
        new Date(new Date("Mart 7, 2022 00:00:00 GMT+7").getTime() - 1),
        new Date(new Date("Mart 7, 2022 00:00:00 GMT+7").getTime() - 1),
      ],
    },
    {
      show: Date.now() >= new Date("Mart 7, 2022 00:00:00 GMT+7").getTime(),
      category: "IoT",
      content: "Perpanjangan Pendaftaran",
      date: [
        new Date("Mart 7, 2022 00:00:00 GMT+7"),
        new Date("Mart 14, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: Date.now() >= new Date("Mart 7, 2022 00:00:00 GMT+7").getTime(),
      category: "IoT",
      content: "Batas Pendaftaran",
      date: [
        new Date(new Date("Mart 14, 2022 00:00:00 GMT+7").getTime() - 1),
        new Date(new Date("Mart 14, 2022 00:00:00 GMT+7").getTime() - 1),
      ],
    },
    {
      show: true,
      category: "IoT",
      content: "Pengumuman Lolos Seleksi Tahap Pertama",
      date: [
        new Date("Mart 23, 2022 00:00:00 GMT+7"),
        new Date("Mart 24, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "IoT",
      content: "Pengumpulan Video Demonstrasi",
      date: [
        new Date("Mart 23, 2022 00:00:00 GMT+7"),
        new Date("April 9, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "IoT",
      content: "Pengumuman 10 Finalis",
      date: [
        new Date("May 7, 2022 00:00:00 GMT+7"),
        new Date("May 8, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "IoT",
      content: "TM Persiapan Final",
      date: [
        new Date("May 9, 2022 00:00:00 GMT+7"),
        new Date("May 10, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "IoT",
      content: "Babak Final",
      date: [
        new Date("May 15, 2022 00:00:00 GMT+7"),
        new Date("May 16, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
};

export const tp = {
  registration: [
    {
      price: 75000,
      date: [
        new Date("February 21, 2022 00:00:00 GMT+7"),
        new Date("May 7, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
  phase: [
    {
      name: "Masa Pendaftaran",
      date: [
        new Date("February 21, 2022 00:00:00 GMT+7"),
        new Date("May 7, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Penyisihan",
      date: [
        new Date("May 21, 2022 00:00:00 GMT+7"),
        new Date("May 22, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Semifinal",
      date: [
        new Date("May 21, 2022 00:00:00 GMT+7"),
        new Date("May 22, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Final",
      date: [
        new Date("May 21, 2022 00:00:00 GMT+7"),
        new Date("May 22, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
  timeline: [
    {
      show: true,
      category: "Transporter",
      content: "Masa Pendaftaran",
      date: [
        new Date("February 21, 2022 00:00:00 GMT+7"),
        new Date("April 29, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "Transporter",
      content: "Batas Pendaftaran",
      date: [
        new Date(new Date("April 29, 2022 00:00:00 GMT+7").getTime() - 1),
        new Date(new Date("April 29, 2022 00:00:00 GMT+7").getTime() - 1),
      ],
    },
    {
      show: Date.now() >= new Date("April 29, 2022 00:00:00 GMT+7").getTime(),
      category: "Transporter",
      content: "Perpanjangan Pendaftaran",
      date: [
        new Date("April 29, 2022 00:00:00 GMT+7"),
        new Date("May 7, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: Date.now() >= new Date("April 29, 2022 00:00:00 GMT+7").getTime(),
      category: "Transporter",
      content: "Batas Pendaftaran",
      date: [
        new Date(new Date("May 7, 2022 00:00:00 GMT+7").getTime() - 1),
        new Date(new Date("May 7, 2022 00:00:00 GMT+7").getTime() - 1),
      ],
    },
    {
      show: true,
      category: "Transporter",
      content: "Technical Meeting",
      date: [
        new Date("May 14, 2022 00:00:00 GMT+7"),
        new Date("May 15, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "Transporter",
      content: "Pelaksanaan Kompetisi",
      date: [
        new Date("May 21, 2022 00:00:00 GMT+7"),
        new Date("May 22, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
};

export const lf = {
  registration: [
    {
      price: 75000,
      date: [
        new Date("February 21, 2022 00:00:00 GMT+7"),
        new Date("May 7, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
  phase: [
    {
      name: "Registrasi",
      date: [
        new Date("February 21, 2022 00:00:00 GMT+7"),
        new Date("May 7, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Penyisihan",
      date: [
        new Date("May 21, 2022 00:00:00 GMT+7"),
        new Date("May 22, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Semifinal",
      date: [
        new Date("May 22, 2022 00:00:00 GMT+7"),
        new Date("May 23, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Final",
      date: [
        new Date("May 22, 2022 00:00:00 GMT+7"),
        new Date("May 23, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
  timeline: [
    {
      show: true,
      category: "Line Follower",
      content: "Masa Pendaftaran",
      date: [
        new Date("February 21, 2022 00:00:00 GMT+7"),
        new Date("April 29, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "Line Follower",
      content: "Batas Pendaftaran",
      date: [
        new Date(new Date("April 29, 2022 00:00:00 GMT+7").getTime() - 1),
        new Date(new Date("April 29, 2022 00:00:00 GMT+7").getTime() - 1),
      ],
    },
    {
      show: Date.now() >= new Date("April 29, 2022 00:00:00 GMT+7").getTime(),
      category: "Line Follower",
      content: "Perpanjangan Pendaftaran",
      date: [
        new Date("April 29, 2022 00:00:00 GMT+7"),
        new Date("May 7, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: Date.now() >= new Date("April 29, 2022 00:00:00 GMT+7").getTime(),
      category: "Line Follower",
      content: "Batas Pendaftaran",
      date: [
        new Date(new Date("May 7, 2022 00:00:00 GMT+7").getTime() - 1),
        new Date(new Date("May 7, 2022 00:00:00 GMT+7").getTime() - 1),
      ],
    },
    {
      show: true,
      category: "Line Follower",
      content: "Technical Meeting",
      date: [
        new Date("May 14, 2022 00:00:00 GMT+7"),
        new Date("May 15, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "Line Follower",
      content: "Kompetisi Hari Pertama",
      date: [
        new Date("May 21, 2022 00:00:00 GMT+7"),
        new Date("May 22, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "Line Follower",
      content: "Kompetisi Hari Kedua",
      date: [
        new Date("May 22, 2022 00:00:00 GMT+7"),
        new Date("May 23, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
};

export const workshop = {
  registration: [
    {
      price: 20000,
      date: [
        new Date("April 9, 2022 00:00:00 GMT+7"),
        new Date("April 21, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      price: 35000,
      date: [
        new Date("April 21, 2022 00:00:00 GMT+7"),
        new Date("May 14, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
  phase: [
    {
      name: "Registrasi",
      date: [
        new Date("April 9, 2022 00:00:00 GMT+7"),
        new Date("May 14, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Pelaksanaan Hari 1",
      date: [
        new Date("May 14, 2022 00:00:00 GMT+7"),
        new Date("May 15, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Pelaksanaan Hari 2",
      date: [
        new Date("May 15, 2022 00:00:00 GMT+7"),
        new Date("May 16, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
  timeline: [
    {
      show: true,
      category: "Workshop",
      content: "Masa Pendaftaran",
      date: [
        new Date("April 9, 2022 00:00:00 GMT+7"),
        new Date("April 21, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "Workshop",
      content: "Batas Pendaftaran",
      date: [
        new Date(new Date("April 21, 2022 00:00:00 GMT+7").getTime() - 1),
        new Date(new Date("April 21, 2022 00:00:00 GMT+7").getTime() - 1),
      ],
    },
    {
      show: Date.now() >= new Date("April 21, 2022 00:00:00 GMT+7").getTime(),
      category: "Workshop",
      content: "Perpanjangan Pendaftaran",
      date: [
        new Date("April 21, 2022 00:00:00 GMT+7"),
        new Date("May 14, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: Date.now() >= new Date("April 21, 2022 00:00:00 GMT+7").getTime(),
      category: "Workshop",
      content: "Batas Pendaftaran",
      date: [
        new Date(new Date("May 8, 2022 00:00:00 GMT+7").getTime() - 1),
        new Date(new Date("May 14, 2022 00:00:00 GMT+7").getTime() - 1),
      ],
    },
    {
      show: true,
      category: "Workshop",
      content: "Pelaksanaan Hari Pertama",
      date: [
        new Date("May 14, 2022 00:00:00 GMT+7"),
        new Date("May 15, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "Workshop",
      content: "Pelaksanaan Hari Kedua",
      date: [
        new Date("May 15, 2022 00:00:00 GMT+7"),
        new Date("May 16, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
};

export const webinar = {
  registration: [
    {
      price: 0,
      date: [
        new Date("April 14, 2022 00:00:00 GMT+7"),
        new Date("May 20, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
  phase: [
    {
      name: "Registrasi",
      date: [
        new Date("April 14, 2022 00:00:00 GMT+7"),
        new Date("May 20, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      name: "Pelaksanaan",
      date: [
        new Date("May 21, 2022 00:00:00 GMT+7"),
        new Date("May 22, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
  timeline: [
    {
      show: true,
      category: "Webinar",
      content: "Masa Pendaftaran",
      date: [
        new Date("April 14, 2022 00:00:00 GMT+7"),
        new Date("May 13, 2022 00:00:00 GMT+7"),
      ],
    },
    {
      show: true,
      category: "Webinar",
      content: "Hari Pelaksanaan",
      date: [
        new Date("May 21, 2022 00:00:00 GMT+7"),
        new Date("May 22, 2022 00:00:00 GMT+7"),
      ],
    },
  ],
};

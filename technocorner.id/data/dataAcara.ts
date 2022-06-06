import client from "./client";

const dataAcara = [
  {
    id: "IoT",
    name: "iot",
    title: "Internet of Things Development Competition",
    shortTitle: "IoT",
    content:
      "Internet of Things (IoT) Development Competition merupakan kompetisi pengembangan perangkat berbasis IoT. Inovasi-inovasi dari kompetisi IoT Technocorner 2022 diharapkan akan aplikatif dan bermanfaat. Subtema yang diangkat dalam lomba IoT Technocorner 2022 meliputi rumah cerdas, industri rumah tangga, medis, pendidikan, transportasi, agrikultur, lingkungan, fasilitas publik, energi terbarukan, dan mitigasi bencana.",
    registration: [
      new Date("February 7, 2022 00:00:00 GMT+7"),
      new Date("Mart 14, 2022 00:00:00 GMT+7"),
    ],
    extendRegistrationFrom: new Date("Mart 7, 2022 00:00:00 GMT+7"),
    linkbuku: "https://link.technocorner.id/JuknisIoT",
    linkdaftar: `${client.dash}/kompetisi/iot`,
    logo: "/images/Homepage/iot.webp",
    category: "logo",
  },
  {
    id: "EEC",
    name: "eec",
    title: "Electrical Engineering Competition",
    shortTitle: "EEC",
    content:
      "Electrical Engineering Competition (EEC) merupakan sebuah kompetisi serupa olimpiade di bidang matematika, fisika, dan komputer. Peserta EEC adalah tim dari siswa/i SMA/sederajat se-Indonesia. Tim tersebut berisi tiga orang siswa/i dari asal sekolah yang sama. Kompetisi ini dilakukan dalam tiga babak yaitu Penyisihan, Semifinal, dan Final. Babak semifinal diikuti oleh 15 tim terbaik dari babak penyisihan. Kemudian, 3 tim terbaik pada babak semifinal akan maju ke babak final.",
    registration: [
      new Date("February 14, 2022 00:00:00 GMT+7"),
      new Date("Mart 21, 2022 00:00:00 GMT+7"),
    ],
    extendRegistrationFrom: new Date("Mart 14, 2022 00:00:00 GMT+7"),
    linkbuku: "https://link.technocorner.id/JuknisEEC",
    linkdaftar: `${client.dash}/kompetisi/eec`,
    logo: "/images/Homepage/eec.webp",
    category: "logo",
  },
  {
    id: "TP",
    name: "transporter",
    title: "Transporter Competition",
    shortTitle: "Transporter",
    content:
      "Transporter Technocorner 2022 merupakan pertandingan robot yang dilakukan secara daring dengan memindahkan kubus ke zona yang telah ditentukan sesuai dengan peraturan pertandingan. Robot yang digunakan adalah robot yang dikendalikan menggunakan remote control.",
    registration: [
      new Date("February 21, 2022 00:00:00 GMT+7"),
      new Date("May 7, 2022 00:00:00 GMT+7"),
    ],
    extendRegistrationFrom: new Date("April 29, 2022 00:00:00 GMT+7"),
    linkbuku: "https://link.technocorner.id/JuknisTP",
    linkdaftar: `${client.dash}/kompetisi/tp`,
    logo: "/images/Homepage/tp.webp",
    category: "logo",
  },
  {
    id: "LF",
    name: "linefollower",
    title: "Line Follower Competition",
    shortTitle: "Line Follower",
    content:
      "Line Follower Technocorner 2022 merupakan sebuah perlombaan robot line follower yang dilaksanakan secara daring dan terbuka untuk umum. Line follower merupakan sebuah robot rakitan yang bertujuan untuk dapat bergerak mengikuti garis secara otomatis dengan bantuan mikrokontroler maupun bahasa pemrograman.",
    registration: [
      new Date("February 21, 2022 00:00:00 GMT+7"),
      new Date("May 7, 2022 00:00:00 GMT+7"),
    ],
    extendRegistrationFrom: new Date("April 29, 2022 00:00:00 GMT+7"),
    linkbuku: "https://link.technocorner.id/JuknisLF",
    linkdaftar: `${client.dash}/kompetisi/lf`,
    logo: "/images/Homepage/lf.webp",
    category: "logo",
  },
  {
    id: "Webinar",
    name: "webinar",
    title: "Webinar Nasional",
    shortTitle: "Webinar",
    content:
      'Technocorner mengadakan webinar berskala nasional dengan tema "Revive The Nation Through Optimizing Technology and Digitalization". Tema tersebut diangkat dengan dasar kondisi pandemi Covid-19 yang mulai mereda dan mulai membawa harapan berkurangnya batasan mobilitas masyarakat. Hal tersebut turut mendorong transformasi dan inovasi berkelanjutan di bidang teknologi agar proses adaptasi kali kedua ini tidak menjadi kendala dalam beraktivitas. Webinar Technocorner akan membahas perkembangan dan inovasi teknologi pada lima bidang berbeda, yaitu ekonomi, pendidikan, kesehatan, cyber security, dan artificial intelligence.',
    registration: [
      new Date("April 14, 2022 00:00:00 GMT+7"),
      new Date("May 20, 2022 00:00:00 GMT+7"),
    ],
    linkbuku: "https://link.technocorner.id/JuknisWebinar",
    linkdaftar: `${client.dash}/webinar`,
    logo: "/images/Homepage/webinar.webp",
    category: "logo",
  },
  {
    id: "Workshop",
    name: "workshop",
    title: "Workshop Robotika",
    shortTitle: "Workshop",
    content:
      "Technocorner 2022 berupaya memperkenalkan serta meningkatkan pemahaman dan kesadaran masyarakat Indonesia mengenai pesatnya transformasi teknologi saat masa pemulihan setelah pandemi di Indonesia. Kegiatan ini diharapkan dapat memberikan wawasan dan menjadi pendorong semangat masyarakat dalam memajukan, mengembangkan, dan mengaplikasikan IPTEK sekaligus menyusun strategi teknologi untuk memulihkan bangsa Indonesia setelah pandemi, serta dapat membangun generasi penerus bangsa yang kreatif dan kompetitif.",
    registration: [
      new Date("April 9, 2022 00:00:00 GMT+7"),
      new Date("May 14, 2022 00:00:00 GMT+7"),
    ],
    extendRegistrationFrom: new Date("April 21, 2022 00:00:00 GMT+7"),
    linkbuku: "https://link.technocorner.id/JuknisWorkshop",
    linkdaftar: `${client.dash}/workshop`,
    logo: "/images/Homepage/workshop.webp",
    category: "logo",
  },
];
export { dataAcara };

import { eec, events, iot, lf, tp, webinar, workshop } from "../../data/events";

export default function RegistrationNotYetOpen({ id }: { id: string }) {
  let title = events.find((e) => e.id === id)!.name;

  let date = new Date();

  switch (id) {
    case "iot":
      date = iot.registration[0].date[0];
      break;
    case "eec":
      date = eec.registration[0].date[0];
      break;
    case "lf":
      date = lf.registration[0].date[0];
      break;
    case "tp":
      date = tp.registration[0].date[0];
      break;
    case "workshop":
      date = workshop.registration[0].date[0];
      break;
    case "webinar":
      date = webinar.registration[0].date[0];
      break;
  }

  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][
    date.getDay()
  ];
  const tanggal = `${date.getDate()} ${
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
    ][date.getMonth()]
  } ${date.getFullYear()}`;

  return (
    <div className="block w-fit p-4 sm:px-10 sm:py-8 m-auto space-y-2 sm:space-y-4 text-center rounded-3xl transform-gpu bg-gradient-to-b from-white-default to-white-default/50 drop-shadow-xl backdrop-blur-[20px]">
      <span className="!text-5xl sm:!text-9xl text-red-default material-icons">
        error
      </span>
      <p className="font-[GothamBook] sm:text-lg">
        Pendaftaran {title} akan dibuka mulai {hari}, {tanggal} pukul{" "}
        {date.toLocaleTimeString("id")}
      </p>
    </div>
  );
}

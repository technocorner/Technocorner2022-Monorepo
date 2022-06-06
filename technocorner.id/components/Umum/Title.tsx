import { dataAcara } from "../../data/dataAcara";
import Image from "next/image";
import { toastError } from "../../libs/toast";

export default function Title({ name }: { name: string }) {
  const item = dataAcara.find((a) => a.id === name);

  const date = Date.now();
  const openRegistration = date >= item!.registration[0].getTime();
  const extendRegistration = item!.extendRegistrationFrom
    ? date >= item!.extendRegistrationFrom.getTime() &&
      date < item!.registration[1].getTime()
    : false;
  const closeRegistration = date >= item!.registration[1].getTime();

  function pendaftaranDitutup() {
    toastError(
      "Mohon maaf, pendaftaran telah ditutup. Sampai bertemu di Technocorner 2023!"
    );
  }

  function pendaftaranBelumDibuka() {
    const date = item!.registration[0];
    const hari = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ][date.getDay()];
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

    toastError(
      `Mohon maaf, pendaftaran belum dibuka. Pendaftaran akan dibuka mulai ${hari}, ${tanggal} pukul ${date.toLocaleTimeString(
        "id"
      )}`
    );
  }

  return (
    <div className="overflow-x-hidden	min-h-screen bg-gradient-to-b to-cstmdarkestgreen from-cstmblue px-4 md:px-24 lg:px-36 grid gap-2 sm:gap-4  content-center text-center ">
      {item && (
        <div key={item.id} className="grid gap-2 md:gap-3 2xl:gap-4">
          <div className="w-36 lg:w-48 xl:w-60 2xl:w-72 block m-auto text-center">
            <Image src={item.logo} width={400} height={400} alt={item.title} />
          </div>
          <div className="font-mechano text-md md:text-2xl lg:text-4xl 2xl:text-5xl text-cstmwhite">
            {item.title}
          </div>
          <div className="text-center font-gothambook text-xs xl:text-sm 2xl:text-base text-cstmwhite">
            {item.content}
          </div>
          <div className="font-bold text-2xs md:text-xs xl:text-base 2xl:text-lg text-cstmwhite flex justify-center gap-4 lg:gap-8">
            {name !== "Webinar" && name !== "Workshop" && (
              <a
                className="w-28 sm:w-32 lg:w-36 xl:w-48 px-4 py-1 duration-500 rounded-xl transform hover:scale-105 bg-cstmbtnlightgreen hover:bg-cstmlightgreen text-cstmwhite"
                href={item.linkbuku}
                target="_blank"
                rel="noreferrer"
              >
                Buku Panduan
              </a>
            )}
            {openRegistration && !closeRegistration ? (
              <a
                className="w-28 sm:w-32 lg:w-36 xl:w-48 px-4 py-1 duration-500 rounded-xl transform hover:scale-105 bg-cstmbtnlightred hover:bg-cstmred text-cstmwhite"
                href={item.linkdaftar}
              >
                Daftar Sekarang!
              </a>
            ) : (
              <>
                {!openRegistration && !closeRegistration && (
                  <button
                    className="font-bold px-4 py-1 duration-500 rounded-xl bg-cstmbtnlightred hover:bg-grey-unClick text-cstmwhite"
                    onClick={pendaftaranBelumDibuka}
                  >
                    Pendaftaran Belum Dibuka
                  </button>
                )}
                {openRegistration && closeRegistration && (
                  <button
                    className="font-bold px-4 py-1 duration-500 rounded-xl bg-cstmbtnlightred hover:bg-grey-unClick text-cstmwhite"
                    onClick={pendaftaranDitutup}
                  >
                    Pendaftaran Telah Ditutup
                  </button>
                )}
              </>
            )}
          </div>
          {!openRegistration && (
            <p className="text-xs xl:text-sm 2xl:text-base text-cstmbtnlightred">
              Pendaftaran dibuka pada tanggal{" "}
              {item.registration[0].toLocaleDateString("id")}
            </p>
          )}
          {extendRegistration && (
            <p className="text-xs xl:text-sm 2xl:text-base text-cstmbtnlightred">
              Perpanjangan pendaftaran hingga tanggal{" "}
              {new Date(item.registration[1].getTime() - 1).toLocaleDateString(
                "id"
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

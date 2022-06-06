import Link from "next/link";
import { useRouter } from "next/router";
import { eec, iot, lf, tp } from "../../../../data/events";

export default function User({
  title,
  cabang,
}: {
  title: string;
  cabang: string;
}) {
  const router = useRouter();
  const date = Date.now();
  let openRegistration = false;
  switch (cabang) {
    case "iot":
      openRegistration = date >= iot.registration[0].date[0].getTime();
      break;
    case "eec":
      openRegistration = date >= eec.registration[0].date[0].getTime();
      break;
    case "lf":
      openRegistration = date >= lf.registration[0].date[0].getTime();
      break;
    case "tp":
      openRegistration = date >= tp.registration[0].date[0].getTime();
      break;
  }

  return (
    <div className="flex-grow flex flex-col">
      <h1 className="font-[GothamBold] text-2xl">Kompetisi</h1>
      <div className="mt-8 lg:my-auto lg:pb-14 flex gap-8 lg:gap-16 flex-col items-center justify-center">
        <h2 className="font-[Gotham] text-xl lg:text-3xl text-center">{title}</h2>
        <div className="flex justify-center items-center flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-16">
          <Link href={`${router.asPath}/registrasi-tim`}>
            <a className="flex transform-gpu bg-gradient-to-r from-green-default to-green-light/70 backdrop-blur-[5px] text-white-light outline outline-2 outline-white-light justify-center items-center w-44 md:w-72 px-3 md:px-8 py-7 md:py-14 rounded-2xl text-2xl md:text-4xl md:leading-normal text-center hover:cursor-pointer">
              Daftar sebagai ketua tim
            </a>
          </Link>
          <Link href={`${router.asPath}/registrasi-anggota`}>
            <a className="flex transform-gpu bg-gradient-to-r from-red-default to-red-light/70 backdrop-blur-[5px] text-white-light outline outline-2 outline-white-light justify-center items-center w-44 md:w-72 px-3 md:px-8 py-7 md:py-14 rounded-2xl text-2xl md:text-4xl md:leading-normal text-center hover:cursor-pointer">
              Daftar sebagai anggota tim
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

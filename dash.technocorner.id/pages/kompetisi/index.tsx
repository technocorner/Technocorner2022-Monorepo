import Link from "next/link";
import { useRouter } from "next/router";
import HtmlHead from "../../components/main/HtmlHead";
import competitions from "../../data/competitions.json";

export default function Kompetisi() {
  const router = useRouter();

  return (
    <>
      <HtmlHead title="Kompetisi" />
      <h1 className="font-[GothamBold] text-2xl">Kompetisi</h1>
      <div className="mt-8 lg:my-auto lg:pb-14 flex gap-8 lg:gap-16 flex-col items-center justify-center">
        <h2 className="font-[Gotham] text-xl lg:text-3xl text-center">
          Pilih Cabang Kompetisi
        </h2>
        <div className="flex gap-5 lg:gap-5 xl:gap-10 flex-row flex-wrap justify-center font-[CAMechano] text-xs sm:text-lg text-center">
          {Object.keys(competitions).map((c) => (
            <Link href={`${router.pathname}/${c}`} key={c}>
              <a className="w-5/12 lg:w-1/5 p-4 flex flex-col items-center gap-8 rounded-3xl transform-gpu bg-gradient-to-b from-white-default to-white-default/50 drop-shadow-xl backdrop-blur">
                <img
                  className="flex-grow"
                  src={`/assets/main/${c}.svg`}
                  alt={c}
                />
                <p className="flex-none mt-auto">
                  {(competitions as { [key: string]: string })[c]}
                </p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

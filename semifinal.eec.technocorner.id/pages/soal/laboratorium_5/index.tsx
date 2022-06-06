import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import HtmlHead from "../../../components/HtmlHead";
import labs from "../../../data/labs";
import { LabNumber } from "../../../interfaces";
import { getData } from "../../../libs/fetch";
import { toastError } from "../../../libs/toast";

export default function soal() {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const interval = setInterval(() => {
        (async () => {
          const res = await getData(`/lab/${LabNumber.Lab5}`);

          if (!res.json) {
            toastError(`Akses ${labs[LabNumber.Lab5 - 1].title} telah ditutup`);
            router.replace("/");
          }
        })();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <>
      <HtmlHead
        title="Lab 5"
        description="Lab 5 semifinal kompetisi EEC yang diselenggarakan oleh Technocorner. Semifinal ini akan diadakan pada tanggal 19-20 April 2022."
      />
      <div>
        <h1 className="font-bold text-2xl">
          Lab 5 - Laboratorium Jaringan Komputer
        </h1>
      </div>
      <div className="mt-12 px-4 md:px-12 lg:px-24">
        <div className="flex flex-col justify-center items-center bg-white-light rounded-xl px-8 py-6 gap-4 drop-shadow-xl">
          <div className=" text-2xl">
            Menuju platform competitive programming
          </div>
          <a
            href="https://cp.technocorner.id"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className=" w-64 duration-300 transform hover:-translate-y-2 hover:drop-shadow-lg focus:ring-4 focus:outline-none focus:ring-green-light w-fit px-8 py-4 justify-center text-center bg-cstmgreen text-cstmwhite text-white-default mt-8 text-2xl rounded-xl">
              Let's go!
            </button>
          </a>
        </div>
      </div>
    </>
  );
}

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HtmlHead from "../../../components/HtmlHead";
import apiServer from "../../../data/apiServer";
import labs from "../../../data/labs";
import { LabNumber, ModalType } from "../../../interfaces";
import { getData } from "../../../libs/fetch";
import { toastError } from "../../../libs/toast";

export default function soal({
  setModal,
}: {
  setModal: React.Dispatch<React.SetStateAction<ModalType>>;
}) {
  const router = useRouter();
  const [questionLink, _] = useState(
    `${apiServer[0]}/question?lab=${LabNumber.Lab2}&time=${Date.now()}`
  );

  useEffect(() => {
    if (router.isReady) {
      const interval = setInterval(() => {
        (async () => {
          const res = await getData(`/lab/${LabNumber.Lab2}`);

          if (!res.json) {
            toastError(`Akses ${labs[LabNumber.Lab2 - 1].title} telah ditutup`);
            router.replace("/");
          }
        })();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [router.isReady]);

  function showModal() {
    setModal(ModalType.Lab2);
  }

  return (
    <>
      <HtmlHead
        title="Lab 1"
        description="Lab 1 semifinal kompetisi EEC yang diselenggarakan oleh Technocorner. Semifinal ini akan diadakan pada tanggal 19-20 April 2022."
      />
      <div>
        <h1 className="font-bold text-2xl">
          Lab 2 - Laboratorium Sistem Frekuensi Tinggi
        </h1>
      </div>
      <div className="mt-12 px-4 md:px-12 lg:px-24">
        <div className="flex bg-white-light h-screen rounded-xl px-6 py-6 drop-shadow-xl">
          <iframe
            className="flex"
            src={questionLink}
            title="Soal Lab 1"
            height="100%"
            width="100%"
          />
        </div>
        <div className="flex mt-3 justify-center">
          <button
            onClick={showModal}
            className="duration-300 transform hover:-translate-y-2 hover:drop-shadow-lg focus:ring-4 focus:outline-none focus:ring-green-light w-fit px-8 py-4 justify-center text-center bg-cstmgreen text-cstmwhite text-white-default mt-8 text-2xl rounded-xl"
          >
            Kumpul lembar jawaban
          </button>
        </div>
      </div>
    </>
  );
}

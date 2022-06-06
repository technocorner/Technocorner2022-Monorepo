import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HtmlHead from "../../components/main/HtmlHead";
import { getData } from "../../lib/method";

export default function Bantuan() {
  const router = useRouter();
  const initFaqs: Array<{
    id: string;
    judul: string;
    isi: string;
    label: string;
  }> = [];
  const [faqs, setFaqs] = useState(initFaqs);

  useEffect(() => {
    (async () => {
      const res = await getData("/dashboard/bantuan/faq");
      if (res.success) {
        setFaqs(res.body);
      }
    })();
  }, []);

  return (
    <>
      <HtmlHead title="Bantuan" />
      <div className="flex-grow flex flex-col font-[GothamBook]">
        <h1 className="font-[GothamBold] text-2xl">Pusat Bantuan</h1>
        <div className="mt-8 p-8 flex-grow rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
          <h2 className="mt-4 mb-10 font-[Gotham] text-center text-[18px] lg:text-2xl">
            Temukan Jawaban Pertanyaanmu di Sini
          </h2>
          <div className="w-2/3 mx-auto mb-16 flex justify-between items-center text-sm bg-white-light border-[1px] border-[#AAAAAA] px-[13px] py-2 font-sans rounded-md">
            <input
              className="flex-grow px-2 text-[#767676] leading-8 outline-none"
              placeholder="Cari Pertanyaan"
            />
            <button className="flex-none bg-[#04BFAD] text-[#FFFFFF] rounded-full px-[11px] py-[5px]">
              Cari
            </button>
          </div>
          <h3 className="mb-6 text-center text-[18px] lg:text-2xl font-[Gotham]">
            Pertanyaan Umum (FAQ)
          </h3>
          <div className="space-y-[35px] flex flex-col place-items-start text-[14px] lg:text-[16px]">
            {faqs.map((faq) => (
              <Link href={`${router.pathname}/${faq.id}`} key={faq.judul}>
                <a className=" flex flex-col place-items-start">
                  <p className="font-[GothamBold]">{faq.judul}</p>
                  <p>{faq.isi}</p>
                  <p className="text-[#606060]">#{faq.label}</p>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

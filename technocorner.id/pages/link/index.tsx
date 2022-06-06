import Image from "next/image";
import Link from "next/link";
import { getData } from "../../libs/method";
import HtmlHead from "../../components/HtmlHead";

interface LinkTree {
  data: {
    links: Array<{
      judul: string;
      tautanPendek: string;
      warnaTeks: string;
      warnaLatar: string;
    }>;
    settings: {
      judulProfil: string;
      bio: string;
      warnaTeksProfil: string;
      warnaLatar: string;
      warnaBackdrop: string;
      backdropBlurLatar: number;
      transparansiTombol: number;
      bulatanTombol: number;
      backdropBlurTombol: number;
      fotoProfil: string;
      gambarLatar: string;
    };
  };
}

export default function LinkTree({ data }: LinkTree) {
  return (
    <>
      <HtmlHead
        title="Tautan"
        description="Kumpulan tautan penting seputar Technocorner"
      />
      <div
        className="min-h-screen bg-center"
        style={{
          objectFit: "cover",
          backgroundColor: data.settings.warnaLatar
            ? data.settings.warnaLatar
            : "#FFFFFF",
          backgroundImage:
            data.settings.gambarLatar && `url('${data.settings.gambarLatar}')`,
        }}
      >
        <div
          style={{
            backgroundColor: data.settings.warnaBackdrop,
            backdropFilter: `blur(${
              data.settings.backdropBlurLatar.toString() !== ""
                ? data.settings.backdropBlurLatar
                : 0
            }px)`,
          }}
        >
          <div className="w-full sm:w-[600px] lg:w-[680px] px-3 mx-auto flex flex-col items-center gap-4">
            <div className="mt-9 mb-4 flex flex-col">
              <img
                className="w-24 h-24 mx-auto rounded-full object-cover"
                src={data.settings.fotoProfil}
              />
              <h1
                className="mt-4 mx-auto font-bold text-center"
                style={{
                  color: data.settings.warnaTeksProfil
                    ? data.settings.warnaTeksProfil
                    : "#000000",
                }}
              >
                {data.settings.judulProfil}
              </h1>
              <h2
                className="max-w-[] mx-auto text-sm text-center"
                style={{
                  color: data.settings.warnaTeksProfil
                    ? data.settings.warnaTeksProfil
                    : "#000000",
                }}
              >
                {data.settings.bio}
              </h2>
            </div>
            {data.links.map((d, index) => (
              <a
                className="w-full py-[16px] text-center break-words"
                key={index}
                style={{
                  backgroundColor: d.warnaLatar ? d.warnaLatar : "#000000",
                  color: d.warnaTeks ? d.warnaTeks : "#FFFFFF",
                  opacity:
                    data.settings.transparansiTombol.toString() !== ""
                      ? data.settings.transparansiTombol
                      : "1",
                  borderRadius: `${
                    data.settings.bulatanTombol.toString() !== ""
                      ? data.settings.bulatanTombol
                      : 0
                  }px`,
                  backdropFilter: `blur(${
                    data.settings.backdropBlurTombol.toString() !== ""
                      ? data.settings.backdropBlurTombol
                      : 0
                  }px)`,
                }}
                href={d.tautanPendek}
              >
                {d.judul}
              </a>
            ))}
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <a href="https://www.tiktok.com/@technocornerugm">
                <Image src="/images/Layout/Tiktok.svg" width={32} height={32} />
              </a>
              <a href="https://www.instagram.com/technocornerugm/">
                <Image
                  src="/images/Layout/Instagram.svg"
                  width={32}
                  height={32}
                />
              </a>
              <a href="https://www.linkedin.com/company/technocorner-ugm-2021/">
                <Image
                  src="/images/Layout/Linkedin.svg"
                  width={32}
                  height={32}
                />
              </a>
              <a href="https://www.youtube.com/c/Technocorner">
                <Image
                  src="/images/Layout/Youtube.svg"
                  width={32}
                  height={32}
                />
              </a>
              <a href="https://twitter.com/technocornerugm">
                <Image
                  src="/images/Layout/Twitter.svg"
                  width={32}
                  height={32}
                />
              </a>
              <a href="https://www.facebook.com/TechnocornerUGM">
                <Image
                  src="/images/Layout/Facebook.svg"
                  width={32}
                  height={32}
                />
              </a>
              <a href="http://line.me/ti/p/@kdo2899c">
                <Image
                  src="/images/Layout/Line-white.svg"
                  width={32}
                  height={32}
                />
              </a>
            </div>
            <Link href="/">
              <a className="mt-20 pb-8 flex gap-2 items-center mx-auto">
                <img
                  className="h-10 object-contain"
                  loading="lazy"
                  src="/images/Homepage/Hero.svg"
                />
                <div className="font-mechsuit text-xs md:text-sm">
                  Technocorner
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const res = await getData("/linktree");

  if (!res.success) {
    return { notFound: true };
  }

  return { props: { data: res.body } };
};

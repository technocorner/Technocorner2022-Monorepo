import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getData, postData } from "../../libs/method";
import client from "../../data/client";
import HtmlHead from "../../components/HtmlHead";
import Background from "../../components/auth/Background";
import Input from "../../components/auth/Input";
import logoTC from "../../public/assets/logo.svg";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toastError, toastLoading } from "../../libs/toast";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  const [step, setStep] = useState(router.query ? 0 : router.query);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (router.query.step === "1" || router.query.step === "2") {
      setStep(Number(router.query.step));
      if (router.query.email) {
        setEmail(router.query.email as string);
      }
      if (router.query.code) {
        setCode(router.query.code as string);
      }
    } else if (router.query.step) {
      router.replace("/auth/reset-password");
    }
    router.beforePopState(({ url }) => {
      const params = url.match(/(?<=\?).*/)?.toString();
      let queries: { step?: string; email?: string } = {};
      if (params) {
        queries = JSON.parse(
          '{"' +
            decodeURI(params)
              .replace(/"/g, '\\"')
              .replace(/&/g, '","')
              .replace(/=/g, '":"') +
            '"}'
        );
      }
      if (queries.step) {
        setStep(Number(queries.step));
      } else {
        setStep(0);
      }
      return true;
    });
    return () => router.beforePopState(() => true);
  }, [router.isReady]);

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const loadingToast = toastLoading();

    const _csrf = (await getData("/auth/csrf")).body._csrf;

    if (step === 0) {
      const target = event.target as typeof event.target & {
        email: { value: string };
      };
      const email = target.email.value.trim().toLowerCase();

      const res = await postData("/auth/reset-password", { email, _csrf });

      toast.dismiss(loadingToast);
      if (!res.success) {
        return toastError(
          res.body && res.body.error ? res.body.error : "Terjadi galat"
        );
      }

      setEmail(email);
      setStep(1);
    } else if (step === 1) {
      const target = event.target as typeof event.target & {
        kode: { value: string };
      };
      const kode = target.kode.value.trim();

      const res = await postData("/auth/reset-password/verify", {
        kode,
        _csrf,
      });

      toast.dismiss(loadingToast);
      if (!res.success) {
        return toastError(
          res.body && res.body.error ? res.body.error : "Terjadi galat"
        );
      }

      setCode(kode);
      setStep(2);
    } else if (step === 2) {
      const target = event.target as typeof event.target & {
        sandi: { value: string };
      };
      const sandiBaru = target.sandi.value;

      const res = await postData("/auth/reset-password/new", {
        kode: code,
        email,
        sandiBaru,
        _csrf,
      });

      toast.dismiss(loadingToast);
      if (!res.success) {
        return toastError(
          res.body && res.body.error ? res.body.error : "Terjadi galat"
        );
      }

      return router.push(client.main + "/auth/verified");
    }

    router.push(
      `/auth/reset-password?step=${
        router.query.step ? Number(router.query.step) + 1 : 1
      }`
    );
  }

  return (
    <>
      <HtmlHead
        title="Reset Kata Sandi"
        description="Reset kata sandi akun Technocorner"
      />
      <Background />
      <div
        className="w-screen h-screen absolute flex items-center justify-center text-sm sm:text-base"
        key={step}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.75 }}
        >
          <div className="flex gap-5 flex-col items-center justify-center text-white-light">
            <Link href="/">
              <a className="flex items-center gap-6">
                <div className="w-8 sm:w-12">
                  <Image
                    src={logoTC}
                    alt="Logo Technocorner"
                    layout="intrinsic"
                  />
                </div>
                <p className="font-['Mechsuit'] text-sm sm:text-2xl">
                  TECHNOCORNER
                </p>
              </a>
            </Link>
            <div className="w-11/12 sm:w-[30rem] mt-10 p-4 sm:p-10 flex flex-col items-center transform-gpu backdrop-blur-[20px] bg-[rgba(252,252,252,0.07)] rounded-3xl border border-[rgba(240,240,240,0.3)]">
              {step === 0 && (
                <p className="font-['CAMechano'] text-lg sm:text-[1.5rem]">
                  RESET KATA SANDI
                </p>
              )}
              {step === 1 && (
                <p className="font-['CAMechano'] text-lg sm:text-[1.5rem]">
                  VERIFIKASI RESET KATA SANDI
                </p>
              )}
              {step === 2 && (
                <p className="font-['CAMechano'] text-lg sm:text-[1.5rem]">
                  KATA SANDI BARU
                </p>
              )}
              {step === 0 && (
                <p className="mt-2 sm:mt-4">
                  Masukkan alamat email kamu dan kami akan mengirimkan email
                  verifikasi permintaan reset kata sandi.
                </p>
              )}
              {step === 1 && (
                <p className="mt-2 sm:mt-4">
                  Periksa kotak masuk email kamu lalu masukkan kode verifikasi
                  permintaan reset kata sandi. Jika perlu, periksa juga kotak
                  spam.
                </p>
              )}
              {step === 2 && (
                <>
                  <p className="mt-2 sm:mt-4">
                    Buat kata sandi baru untuk akun:
                  </p>
                  <p>{email}</p>
                </>
              )}
              <form
                className="mt-2 sm:mt-4 w-full flex flex-col"
                onSubmit={submitHandler}
              >
                {step === 0 && (
                  <Input name="email" placeholder="Alamat email" />
                )}
                {step === 1 && (
                  <Input name="kode" placeholder="Kode verifikasi" />
                )}
                {step === 2 && (
                  <Input name="sandi" placeholder="Kata sandi baru" />
                )}
                <button
                  className="w-full mt-6 py-2 rounded-full bg-[#04BFAD] font-[Gotham] sm:leading-7"
                  type="submit"
                >
                  {step === 0 && "Reset"}
                  {step === 1 && "Kirim"}
                  {step === 2 && "Ubah Sandi"}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (ctx.req.cookies.session) {
    return { redirect: { destination: client.dash, permanent: false } };
  }

  return { props: {} };
};

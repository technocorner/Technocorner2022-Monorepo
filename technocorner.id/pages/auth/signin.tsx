import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  useGoogleLogin,
} from "react-google-login";
import { getData, postData } from "../../libs/method";
import HtmlHead from "../../components/HtmlHead";
import Background from "../../components/auth/Background";
import Input from "../../components/auth/Input";
import logoTC from "../../public/assets/logo.svg";
import logoGoogle from "../../public/assets/auth/logo_google.svg";
import client from "../../data/client";
import { toastError, toastLoading } from "../../libs/toast";

export default function Signin() {
  const router = useRouter();

  const { signIn } = useGoogleLogin({
    clientId: process.env.NEXT_PUBLIC_googleClientId as string,
    scope: "openid",
    cookiePolicy: "single_host_origin",
    onSuccess,
    onFailure,
  });

  async function onSuccess(
    resAuth: GoogleLoginResponse | GoogleLoginResponseOffline
  ) {
    const loadingToast = toastLoading();

    const res = await postData("/auth/signin/google", {
      googleId: (resAuth as GoogleLoginResponse).profileObj.googleId,
      email: (resAuth as GoogleLoginResponse).profileObj.email,
      name: (resAuth as GoogleLoginResponse).profileObj.name,
      photo: (resAuth as GoogleLoginResponse).profileObj.imageUrl,
    });

    toast.dismiss(loadingToast);
    if (!res.success) {
      return toastError(
        res.body && res.body.error ? res.body.error : "Terjadi galat"
      );
    }

    router.replace(client.dash);
  }

  function onFailure(res: any) {
    toastError(res.error);
  }

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const loadingToast = toastLoading();

    const _csrf = (await getData("/auth/csrf")).body._csrf;
    const target = event.target as typeof event.target & {
      email: { value: string };
      sandi: { value: string };
    };
    const email = target.email.value.trim().toLowerCase();
    const sandi = target.sandi.value;

    const res = await postData("/auth/signin", { email, sandi, _csrf });

    toast.dismiss(loadingToast);
    if (!res.success) {
      return toastError(
        res.body && res.body.error ? res.body.error : "Terjadi galat"
      );
    }

    router.replace(client.dash);
  }

  return (
    <>
      <HtmlHead title="Masuk" description="Masuk ke dasbor akun Technocorner" />
      <Background />
      <div className="w-screen h-screen absolute flex items-center justify-center text-sm sm:text-base">
        <motion.div
          className="w-full sm:w-fit"
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
            <div className="w-11/12 sm:w-[30rem] p-4 sm:p-10 flex flex-col items-center transform-gpu backdrop-blur-[20px] bg-[rgba(252,252,252,0.07)] rounded-3xl border border-[rgba(240,240,240,0.3)]">
              <p className="font-['CAMechano'] text-lg sm:text-[1.5rem]">
                MASUK
              </p>
              <form
                className="mt-2 sm:mt-4 w-full flex flex-col"
                onSubmit={submitHandler}
              >
                <Input name="email" placeholder="Alamat email" />
                <Input name="sandi" placeholder="Kata sandi" />
                <div className="mt-1 flex justify-center gap-1">
                  <p>Lupa kata sandi?</p>
                  <Link href="/auth/reset-password">
                    <a className="text-[#04BFAD]">Reset</a>
                  </Link>
                </div>
                <button
                  className="w-full mt-6 py-2 rounded-full bg-[#04BFAD] font-[Gotham] sm:leading-7"
                  type="submit"
                >
                  Masuk
                </button>
              </form>
              <button
                className="w-full mt-4 py-2 flex items-center justify-center gap-2 rounded-full bg-white-light font-[Gotham] text-black-default sm:leading-7"
                type="button"
                onClick={signIn}
              >
                <div className="w-6 h-6">
                  <Image
                    src={logoGoogle}
                    alt="Logo Google"
                    layout="intrinsic"
                  />
                </div>
                Masuk dengan Google
              </button>
            </div>
            <div className="flex gap-1">
              <p>Belum punya akun?</p>
              <Link href="/auth/signup">
                <a className="text-[#04BFAD]">Daftar</a>
              </Link>
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

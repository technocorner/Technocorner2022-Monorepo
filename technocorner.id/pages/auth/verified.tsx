import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion";
import HtmlHead from "../../components/HtmlHead";
import Background from "../../components/auth/Background";
import logoTC from "../../public/assets/logo.svg";
import client from "../../data/client";
import Link from "next/link";

export default function Verified() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace(client.main + "/auth/signin");
    }, 3000);
  }, []);

  return (
    <>
      <HtmlHead
        title="Terverifikasi"
        description="Akun Technocorner Terverifikasi"
      />
      <Background />
      <div className="w-screen h-screen absolute flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.75 }}
        >
          <div className="flex flex-col items-center justify-center text-white-light">
            <Link href="/">
              <a className="flex items-center gap-6">
                <div className="w-12">
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
            <div className="w-[30rem] mt-10 p-10 flex flex-col items-center transform-gpu backdrop-blur-[20px] bg-[rgba(252,252,252,0.07)] rounded-3xl border border-[rgba(240,240,240,0.3)]">
              <p className="font-['CAMechano'] text-[1.5rem]">TERVERIFIKASI</p>
              <p className="mt-3">
                Verifikasi berhasil. Kamu akan segera dialihkan menuju halaman
                signin.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

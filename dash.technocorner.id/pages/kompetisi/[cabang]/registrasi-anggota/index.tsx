import { useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import competitions from "../../../../data/competitions.json";
import UserData from "../../../../components/pages/UserData";
import { getData, postData } from "../../../../lib/method";
import { toastError, toastLoading, toastSuccess } from "../../../../lib/toast";
import toast from "react-hot-toast";
import { events } from "../../../../data/events";
import HtmlHead from "../../../../components/main/HtmlHead";
import { isRegistOpen } from "../../../../lib/isRegistOpenClose";

const RegistrasiAnggotaPage = ({
  title,
  cabang,
}: {
  email: string;
  title: string;
  cabang: string;
}) => {
  const router = useRouter();
  const [notFilled, setNotFilled] = useState({ idTim: false });

  useEffect(() => {
    if (router.isReady) {
      if (!isRegistOpen(cabang)) {
        router.replace("/kompetisi");
        return;
      }
      (async () => {
        const timRes = await getData(
          `/dashboard/kompetisi/${cabang}/cek-registrasi`
        );
        if (timRes.success) {
          return router.replace("/");
        }
      })();
    }
  }, [cabang, router.isReady]);

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const loadingToast = toastLoading();

    const target = event.target as typeof event.target & {
      idTim: { value: string };
    };

    let notFilled = { idTim: false };
    if (!target.idTim.value.trim()) {
      notFilled.idTim = true;
    }
    if (Object.values(notFilled).findIndex((v) => v === true) >= 0) {
      setNotFilled(notFilled);
      toast.dismiss(loadingToast);
      return toastError("Data pendaftaran belum lengkap");
    }

    const res = await postData(
      `/dashboard/kompetisi/${cabang}/registrasi-anggota`,
      { idTim: target.idTim.value.trim() }
    );

    toast.dismiss(loadingToast);
    if (res.success) {
      toastSuccess("Pendaftaran berhasil");
    } else {
      return toastError(
        res.body && res.body.error ? res.body.error : "Terjadi galat"
      );
    }

    router.replace(`/kompetisi/${cabang}/tim/${res.body.id}`);
  }

  return (
    <>
      <HtmlHead
        title={`Registrasi Anggota Tim ${
          events.find((e) => e.id === cabang)!.name
        }`}
      />
      <h1 className="font-[GothamBold] text-2xl">{title}</h1>
      <form
        className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light"
        onSubmit={submitHandler}
      >
        <p className="mb-4 font-[Gotham] text-lg md:text-xl">
          Bergabung dengan Tim
        </p>
        <div className="flex flex-col gap-3">
          <p className="text-lg">Data Tim</p>
          <input
            className={`mb-4 w-full px-3 py-2 border border-slate-400 rounded-md placeholder-slate-400 focus:outline-none ${
              notFilled.idTim
                ? "!border-red-default ring-red-default ring-1"
                : "focus:border-teal-400 focus:ring-teal-400 focus:ring-1"
            }`}
            name="idTim"
            placeholder="Masukkan ID tim *"
            autoComplete="off"
            onChange={() => {
              if (notFilled.idTim) {
                setNotFilled((prevData) => {
                  return { ...prevData, idTim: false };
                });
              }
            }}
          />
        </div>
        <div className="mt-2 flex flex-col gap-3">
          <p className="text-lg">Data Anggota Tim</p>
          <UserData />
        </div>
        <div className="flex justify-end gap-5">
          <Link href="/profil">
            <a className="px-5 py-1 rounded-2xl bg-green-default text-white-light">
              Ubah data
            </a>
          </Link>
          <button className="px-5 py-1 rounded-2xl bg-red-default text-white-light">
            Gabung
          </button>
        </div>
      </form>
    </>
  );
};

export default RegistrasiAnggotaPage;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Object.keys(competitions).map((c) => {
      return { params: { cabang: c } };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const title = (competitions as { [key: string]: string })[
    ctx.params!.cabang as string
  ];

  if (!title) {
    return { notFound: true };
  }

  return {
    props: { title, cabang: ctx.params!.cabang },
  };
};

import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import HtmlHead from "../components/HtmlHead";
import client from "../data/client";
import { postData } from "../libs/fetch";
import statusCode from "../libs/statusCode";
import { selectAuth, set } from "../libs/store/auth";
import { useAppSelector, useAppDispatch } from "../libs/store/storeHooks";
import { toastError } from "../libs/toast";
import { toastLoading } from "../libs/toast";

export default function SignIn() {
  const router = useRouter();
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (router.isReady) {
      if (auth.teamName && auth.userName && auth.role) {
        router.replace("/");
      }
    }
  }, [router.isReady]);

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const loadingToast = toastLoading();

    const target = event.target as typeof event.target & {
      id: { value: string };
      email: { value: string };
    };

    const id = target.id.value;
    const email = target.email.value;

    const res = await postData("/auth/signin", { id, email });

    toast.dismiss(loadingToast);
    if (res.status === statusCode.OK && res.json) {
      dispatch(set(res.json));
      router.replace("/");
    } else {
      toastError(res.json && res.json.error ? res.json.error : "Terjadi galat");
    }
  }

  return (
    <>
      <HtmlHead
        title="Masuk"
        description="Masuk semifinal kompetisi EEC yang diselenggarakan oleh Technocorner. Semifinal ini akan diadakan pada tanggal 19-20 April 2022."
      />
      <div className="absolute w-screen h-screen top-0 left-0 flex justify-center items-center transform-gpu bg-slate-200">
        <div className="w-11/12 sm:w-96 p-4 sm:p-6 flex flex-col items-center transform-gpu bg-slate-50 rounded-3xl border border-black">
          <p className="font-bold">MASUK</p>
          <form
            onSubmit={submitHandler}
            className="mt-2 sm:mt-4 w-full flex flex-col text-xs"
          >
            <div>
              <p className="font-bold">
                ID Tim{" "}
                <span className="font-normal text-black-light/70">
                  (Dapat dilihat pada laman dasbor tim)
                </span>
              </p>
              <input
                name="id"
                type="text"
                placeholder="Masukkan ID tim"
                required
                className="w-full my-1 sm:my-2 py-0.5 sm:py-2.5 px-3 border-2 focus-within:border-sky-500 rounded-xl bg-transparent outline-none autofill:caret-white"
              />
            </div>
            <div>
              <p className="font-bold">Email</p>
              <input
                name="email"
                type="text"
                placeholder="Masukkan email anggota tim"
                required
                className="w-full my-1 sm:my-2 py-0.5 sm:py-2.5 px-3 border-2 focus-within:border-sky-500 rounded-xl bg-transparent outline-none autofill:caret-white"
              />
            </div>
            <button
              className="w-full mt-4 py-1.5 rounded-full bg-[#04BFAD] sm:leading-7 font-bold text-white-default"
              type="submit"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

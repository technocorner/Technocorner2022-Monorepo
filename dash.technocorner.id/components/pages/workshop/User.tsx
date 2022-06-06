import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { workshop } from "../../../data/events";
import { postData } from "../../../lib/method";
import { toastError, toastLoading } from "../../../lib/toast";
import UserData from "../UserData";

export default function User() {
  const router = useRouter();
  const date = Date.now();
  const referral =
    date >= workshop.registration[1].date[0].getTime() &&
    date < workshop.registration[1].date[1].getTime();
  // const referral = true;

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const loadingToast = toastLoading();

    const target = event.target as typeof event.target & {
      kodeReferral: { value: string };
    };

    const res = await postData("/dashboard/workshop/registrasi", {
      kode:
        target.kodeReferral && target.kodeReferral.value.trim()
          ? target.kodeReferral.value.trim()
          : "",
    });

    toast.dismiss(loadingToast);
    if (!res.success) {
      return toastError(res.body.error);
    }

    router.replace(`${router.asPath}/peserta/${res.body.id}`);
  }

  return (
    <>
      <h1 className="font-[GothamBold] text-xl md:text-2xl">
        Pendaftaran Workshop
      </h1>
      <form
        className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light"
        onSubmit={submitHandler}
      >
        <p className="mb-4 font-[Gotham] text-lg md:text-xl">Data Peserta</p>
        {referral && (
          <div className="flex flex-col gap-3">
            <p className="text-lg">Kode Referral</p>
            <input
              className="mb-4 block w-full px-3 py-2 bg-white border border-slate-400 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-teal-400 block focus:ring-1"
              name="kodeReferral"
              placeholder="Kode referral (jika ada)"
              autoComplete="off"
            />
          </div>
        )}
        <UserData />
        <div className="flex justify-end gap-5">
          <Link href="/profil">
            <a className="px-5 py-1 rounded-2xl bg-green-default text-white-light">
              Ubah data
            </a>
          </Link>
          <button
            className="px-5 py-1 rounded-2xl bg-red-default text-white-light"
            type="submit"
          >
            Daftar
          </button>
        </div>
      </form>
    </>
  );
}

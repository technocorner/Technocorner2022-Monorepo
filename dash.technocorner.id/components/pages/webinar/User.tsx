import Link from "next/link";
import { useRouter } from "next/router";
import { postData } from "../../../lib/method";
import { toastError } from "../../../lib/toast";
import UserData from "../UserData";

export default function User() {
  const router = useRouter();

  async function registerHandler() {
    const res = await postData("/dashboard/webinar/registrasi", {});

    if (!res.success) {
      return toastError(res.body.error);
    }

    router.replace(`${router.asPath}/peserta/${res.body.id}`);
  }

  return (
    <>
      <div className="flex-grow">
        <h1 className="font-[GothamBold] text-2xl">Pendaftaran Webinar</h1>
        <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
          <div className="mb-4">
            <h2 className="mb-4 font-[Gotham] text-lg md:text-xl">
              Data Peserta
            </h2>
            <UserData />
          </div>
          <div className="w-fit ml-auto flex gap-5">
            <Link href="/profil">
              <a className="px-5 py-1 rounded-2xl bg-green-default text-white-light">
                Ubah data
              </a>
            </Link>
            <button
              className="px-5 py-1 rounded-2xl bg-red-default text-white-light"
              onClick={registerHandler}
            >
              Daftar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

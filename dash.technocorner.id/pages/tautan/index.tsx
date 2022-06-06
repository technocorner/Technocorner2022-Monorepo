import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteData, getData, postData } from "../../lib/method";
import { toastError, toastLoading, toastSuccess } from "../../lib/toast";
import HtmlHead from "../../components/main/HtmlHead";
import link from "../../data/link";

const initData: Array<{
  reserved: boolean;
  tautanPanjang: string;
  tautanPendek: string;
}> = [];

export default function Profil({ role }: { role: string }) {
  const router = useRouter();
  const [data, setData] = useState(initData);
  const [notFilled, setNotFilled] = useState({
    tautanPanjang: false,
    tautanPendek: false,
  });

  useEffect(() => {
    if (role && router.isReady && role !== "admin") {
      router.replace("/");
    }
  }, [role, router.isReady]);

  async function refreshData() {
    const res = await getData("/ln");
    if (!res.success) {
      return toastError(res.body.error);
    }
    setData(res.body);
  }

  useEffect(() => {
    (async () => {
      refreshData();
    })();
  }, []);

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const loadingToast = toastLoading();

    const target = event.target as typeof event.target & {
      tautanPanjang: { value: string };
      tautanPendek: { value: string };
    };

    let notFilled = { tautanPanjang: false, tautanPendek: false };
    let cancel = false;
    if (!target.tautanPanjang.value) {
      notFilled.tautanPanjang = true;
      cancel = true;
    }
    if (!target.tautanPendek.value) {
      notFilled.tautanPendek = true;
      cancel = true;
    }
    if (cancel) {
      setNotFilled(notFilled);
      toast.dismiss(loadingToast);
      toastError("Data form belum lengkap");
      return;
    }

    const tautanPanjang = target.tautanPanjang.value;
    const tautanPendek = target.tautanPendek.value;

    if (!verifyUri(tautanPanjang)) {
      toast.dismiss(loadingToast);
      notFilled.tautanPanjang = true;
      setNotFilled(notFilled);
      return toastError("Tautan panjang tidak valid");
    } else if (!verifyCustomUri(tautanPendek)) {
      toast.dismiss(loadingToast);
      notFilled.tautanPendek = true;
      setNotFilled(notFilled);
      return toastError("Tautan pendek tidak valid");
    }

    const res = await postData("/ln", { tautanPanjang, tautanPendek });

    toast.dismiss(loadingToast);
    if (res.success) {
      target.tautanPanjang.value = "";
      target.tautanPendek.value = "";
      refreshData();
      toastSuccess("Berhasil memperpendek tautan");
    } else {
      toastError(res.body.error);
    }
  }

  async function deleteLink(tautanPendek: string) {
    const loadingToast = toastLoading();

    const res = await deleteData("/ln", { tautanPendek });

    toast.dismiss(loadingToast);
    if (res.success) {
      setData((prevData) =>
        prevData.filter((l) => l.tautanPendek !== tautanPendek)
      );
      toastSuccess("Berhasil menghapus tautan");
    } else {
      toastError(res.body.error);
    }
  }

  return (
    <>
      <HtmlHead title="Tautan" />
      <h1 className="font-[GothamBold] text-2xl">Tautan</h1>
      <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
        <h2 className="mb-3 font-[Gotham] text-lg md:text-xl">
          Buat Tautan Pendek
        </h2>
        <form className="flex flex-col gap-4" onSubmit={submitHandler}>
          <div
            className={`px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400 ${
              notFilled.tautanPanjang ? "!border-red-default" : ""
            }`}
          >
            <label className="block px-1.5 text-sm text-black-default/75">
              Tautan Panjang <span className="text-red-default">*</span>
            </label>
            <input
              className="w-full bg-transparent px-1.5 py-0.5 outline-none"
              name="tautanPanjang"
              onChange={() => {
                if (notFilled.tautanPanjang) {
                  setNotFilled((prevData) => {
                    return { ...prevData, tautanPanjang: false };
                  });
                }
              }}
              placeholder="Masukkan tautan panjang"
              autoComplete="off"
            />
          </div>
          <div
            className={`px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400 ${
              notFilled.tautanPendek ? "!border-red-default" : ""
            }`}
          >
            <label className="block px-1.5 text-sm text-black-default/75">
              Tautan Pendek <span className="text-red-default">*</span>
            </label>
            <div className="flex px-1.5 py-0.5">
              <span>link.technocorner.id/</span>
              <input
                className="w-full bg-transparent outline-none"
                name="tautanPendek"
                onChange={() => {
                  if (notFilled.tautanPendek) {
                    setNotFilled((prevData) => {
                      return { ...prevData, tautanPendek: false };
                    });
                  }
                }}
                placeholder="Masukkan tautan pendek"
                autoComplete="off"
              />
            </div>
          </div>
          <button
            className="w-fit ml-auto px-7 py-1.5 bg-green-default rounded-full text-white-light"
            type="submit"
          >
            Simpan
          </button>
        </form>
      </div>
      <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
        <h2 className="mb-3 font-[Gotham] text-lg md:text-xl">
          Daftar Tautan Pendek
        </h2>
        {!data ||
          (!data.length && <p className="text-center">Tidak ada data</p>)}
        {data && data.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {data.map((d) => (
              <div
                className="flex p-3.5 text-left border border-black-lighter rounded-xl"
                key={d.tautanPendek}
              >
                <div className="flex-grow min-w-0">
                  <a
                    className="block min-w-0 font-bold hover:underline truncate"
                    href={`${link}/${d.tautanPendek}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    title={`${link}/${d.tautanPendek}`}
                  >
                    {d.tautanPendek}
                  </a>
                  <p className="min-w-0 truncate" title={d.tautanPanjang}>
                    {d.tautanPanjang}
                  </p>
                </div>
                {!d.reserved && (
                  <div className="flex items-center ml-2 space-y-2.5">
                    <button
                      className="block hover:text-red-400 material-icons-outlined"
                      onClick={() => deleteLink(d.tautanPendek)}
                    >
                      delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function verifyUri(uri: string) {
  const regex =
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=\*]*)/;
  const match = uri.match(regex);
  if (match && match[0] === uri) {
    return true;
  }
  return false;
}

function verifyCustomUri(uri: string) {
  const regex = /[-a-zA-Z0-9_]*/;
  const match = uri.match(regex);
  if (match && match[0] === uri) {
    return true;
  }
  return false;
}

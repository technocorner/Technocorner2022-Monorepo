import { useRouter } from "next/router";
import server from "../../data/server";
import { useEffect, useState } from "react";
import { getData, postData, putData } from "../../lib/method";
import { toastError, toastLoading, toastSuccess } from "../../lib/toast";
import HtmlHead from "../../components/main/HtmlHead";
import toast from "react-hot-toast";
import config from "../../data/config";
import Loading from "../../components/pages/Loading";
import client from "../../data/client";
import Link from "next/link";

const initData: {
  pertanyaan: {
    id: string;
    judul: string;
    label: string;
    waktu: { tanggal: string; pukul: string };
    pengguna: { id: string; foto: string; nama: string };
    isi: string;
    lampiran: Array<string>;
    ditutup: boolean;
  };
  balasan: Array<{
    id: string;
    pengguna: { id: string; foto: string; nama: string };
    waktu: { tanggal: string; pukul: string };
    isi: string;
    lampiran: Array<string>;
  }>;
  peran: string;
} = {
  pertanyaan: {
    id: "",
    judul: "",
    label: "",
    waktu: { tanggal: "", pukul: "" },
    pengguna: { id: "", foto: "", nama: "" },
    isi: "",
    lampiran: [],
    ditutup: false,
  },
  balasan: [],
  peran: "pengguna",
};
const initNotFilled = { isi: false };
const initAttachments: Array<File> = [];

export default function BantuanId() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(initData);
  const [notFilled, setNotFilled] = useState(initNotFilled);
  const [attachments, setAttachments] = useState(initAttachments);

  async function refreshData() {
    const id = router.asPath.split("/").at(-1);

    const res = await getData(`/dashboard/bantuan/id/${id}`);
    if (res.success) {
      setData(res.body);
      setLoading(false);
    } else {
      toastError(res.body.error ? res.body.error : "Terjadi galat");
    }
  }

  useEffect(() => {
    if (router.isReady) {
      (async () => {
        refreshData();
      })();
    }
  }, [router.isReady]);

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const loadingToast = toastLoading();

    const target = event.target as typeof event.target & {
      balasan: { value: string };
      lampiran: { files: FileList };
    };
    const id = router.query.id as string;
    const isi = target.balasan.value;
    const files = attachments;

    let notFilled = {
      isi: false,
    };
    if (!isi) {
      notFilled.isi = true;
    }
    if (Object.values(notFilled).findIndex((v) => v === true) >= 0) {
      setNotFilled(notFilled);
      toast.dismiss(loadingToast);
      return toastError("Data form belum lengkap");
    }

    if (files.length > 3) {
      toast.dismiss(loadingToast);
      return toastError("Batas lampiran adalah tiga buah berkas");
    }

    for (const file of files) {
      if (!file.type.includes("image/")) {
        toast.dismiss(loadingToast);
        return toastError("Berkas harus bertipe image/*");
      }
      if (
        file.size < config.limit.image[0] &&
        file.size > config.limit.image[1]
      ) {
        const size = config.limit.image;
        toast.dismiss(loadingToast);
        return toastError(
          `Berkas harus berukuran antara ${size[0] / 1024} kilobyte hingga ${
            size[1] / (1024 * 1024)
          } megabytes`
        );
      }
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("isi", isi);
    for (const file of files) {
      formData.append("lampiran", file);
    }

    const res = await (async () => {
      for (let api of server) {
        const res = await (
          await fetch(`${api}/dashboard/bantuan/balas`, {
            method: "POST",
            body: formData,
            credentials: "include",
          })
        ).json();
        return res;
      }
    })();

    if (!res.success) {
      return alert(res.body.error);
    }

    refreshData();
  }

  async function changeStatusHandler() {
    const loadingToast = toastLoading();

    const status = !data.pertanyaan.ditutup;

    const res = await putData("/dashboard/bantuan/status", {
      id: data.pertanyaan.id,
      status,
    });

    toast.dismiss(loadingToast);
    if (res.success) {
      setData((prev) => {
        const data = { ...prev };
        data.pertanyaan.ditutup = status;
        return data;
      });
      toastSuccess(
        status ? "Pertanyaan berhasil ditutup" : "Pertanyaan berhasil dibuka"
      );
    } else {
      toast.dismiss(loadingToast);
      toastError(res.body && res.body.error ? res.body.error : "Terjadi galat");
    }
  }

  return loading ? (
    <Loading />
  ) : (
    <>
      <HtmlHead title="Bantuan" />
      <div className="flex-grow flex flex-col">
        <h1 className="font-[GothamBold] text-2xl">Pusat Bantuan</h1>
        <div className="mt-8 p-8 flex-grow rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px]">
          <div className="flex gap-3">
            <Link
              href={`${client.dash}/pengguna/${data.pertanyaan.pengguna.id}`}
            >
              <a>
                <img
                  className="flex-none rounded-full w-8 h-8 sm:w-12 sm:h-12 object-cover"
                  src={data.pertanyaan.pengguna.foto}
                  alt={data.pertanyaan.pengguna.id}
                />
              </a>
            </Link>
            <div className="flex-1">
              <div className="flex gap-2">
                <h2 className="flex-1 font-[Gotham] text-lg">
                  {data.pertanyaan.judul}
                </h2>
                {data.peran === "admin" ? (
                  <button
                    className={`hidden md:block rounded-full px-4 py-0.5 ${
                      data.pertanyaan.ditutup
                        ? "bg-green-default"
                        : "bg-red-default"
                    } font-sans text-white-light`}
                    type="button"
                    onClick={changeStatusHandler}
                  >
                    {data.pertanyaan.ditutup
                      ? "Buka pertanyaan"
                      : "Tutup pertanyaan"}
                  </button>
                ) : (
                  <p className="hidden md:block rounded-full px-4 py-0.5 bg-red-default font-sans text-white-light">
                    Pertanyaan ditutup
                  </p>
                )}
              </div>
              {data.peran === "admin" ? (
                <Link
                  href={`${client.dash}/pengguna/${data.pertanyaan.pengguna.id}`}
                >
                  <a className="font-bold text-sm">
                    {data.pertanyaan.pengguna.nama}
                  </a>
                </Link>
              ) : (
                <p className="font-bold text-sm">
                  {data.pertanyaan.pengguna.nama}
                </p>
              )}
              <p className="text-sm">
                {data.pertanyaan.waktu.tanggal} {data.pertanyaan.waktu.pukul}
              </p>
              <p className="text-sm text-[#606060]">#{data.pertanyaan.label}</p>
              <p className="mt-2">{data.pertanyaan.isi}</p>
              {data.pertanyaan.lampiran.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.pertanyaan.lampiran.map((l) => (
                    <a
                      className="rounded-lg"
                      href={l}
                      target="_blank"
                      rel="noreferrer noopener"
                      key={l}
                    >
                      <img
                        className="h-[4.5rem] max-w-[8rem] rounded-lg"
                        src={l}
                        alt="Lampiran"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          {data.balasan.length > 0 && (
            <>
              <p className="mt-6 mb-4 font-[Gotham] text-lg">Balasan</p>
              <div className="flex flex-col gap-3">
                {data.balasan.map((bls) => (
                  <div
                    className="flex gap-3"
                    key={bls.waktu.tanggal + bls.waktu.pukul}
                  >
                    {data.peran === "admin" ? (
                      <Link href={`${client.dash}/pengguna/${bls.pengguna.id}`}>
                        <a>
                          <img
                            className="flex-none rounded-full w-8 h-8 sm:w-12 sm:h-12 object-cover"
                            src={bls.pengguna.foto}
                            alt={bls.pengguna.id}
                          />
                        </a>
                      </Link>
                    ) : (
                      <img
                        className="flex-none rounded-full w-8 h-8 sm:w-12 sm:h-12 object-cover"
                        src={bls.pengguna.foto}
                        alt={bls.pengguna.id}
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-sm">{bls.pengguna.nama}</p>
                      <p className="text-sm">
                        {bls.waktu.tanggal} {bls.waktu.pukul}
                      </p>
                      <p className="mt-2">{bls.isi}</p>
                      {bls.lampiran.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {bls.lampiran.map((l) => (
                            <a
                              className="rounded-lg"
                              href={l}
                              target="_blank"
                              rel="noreferrer noopener"
                              key={l}
                            >
                              <img
                                className="h-[4.5rem] max-w-[8rem] rounded-lg"
                                src={l}
                                alt="Lampiran"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {!data.pertanyaan.ditutup && (
            <form
              className="mt-8 flex gap-1 flex-col"
              encType="multipart/form-data"
              onSubmit={submitHandler}
            >
              <div>
                <p>Isi Balasan</p>
                <textarea
                  className={`mt-1 w-full px-3 py-2 border border-slate-400 rounded-md placeholder-slate-400 focus:outline-none ${
                    notFilled.isi
                      ? "!border-red-default ring-red-default ring-1"
                      : "focus:border-teal-400 focus:ring-teal-400 focus:ring-1"
                  }`}
                  name="balasan"
                />
              </div>
              <div>
                <p>Lampiran</p>
                {attachments.length > 0 && (
                  <div className="mt-1 flex gap-2">
                    {Array.from(attachments).map((f, index) => (
                      <div className="relative" key={index}>
                        <button
                          className="right-0 material-icons-outlined absolute bg-white-default/50 rounded-bl"
                          type="button"
                          onClick={() => {
                            setAttachments((prev) =>
                              [...prev].filter((f, i) => index !== i)
                            );
                          }}
                        >
                          clear
                        </button>
                        <img
                          className="h-[4.5rem] max-w-[8rem] rounded-lg"
                          src={URL.createObjectURL(f)}
                          alt={f.name}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-1 relative flex items-center">
                  <input
                    id="lampiranUpload"
                    name="lampiran"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      if (event.target.files) {
                        setAttachments((prev) => [
                          ...prev,
                          ...Array.from(event.target.files!),
                        ]);
                      }
                    }}
                    multiple
                    hidden
                  />
                  <label
                    className="bg-white-light rounded-md border border-slate-400 px-3 py-1 cursor-pointer"
                    htmlFor="lampiranUpload"
                  >
                    Unggah lampiran
                  </label>
                </div>
              </div>
              <button
                className="w-fit ml-auto rounded-full px-4 py-0.5 bg-green-default font-sans text-white-light"
                type="submit"
              >
                Kirim
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
function loadingToast(loadingToast: any) {
  throw new Error("Function not implemented.");
}

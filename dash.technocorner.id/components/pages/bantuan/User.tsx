import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import config from "../../../data/config";
import { getData, postFormData } from "../../../lib/method";
import randomId from "../../../lib/randomId";
import { toastError, toastLoading, toastSuccess } from "../../../lib/toast";

const initData: Array<{
  id: string;
  judul: string;
  isi: string;
  label: string;
}> = [];
const initNotFilled = { judul: false, isi: false, label: false };
const initAttachments: Array<File> = [];

export default function User() {
  const [data, setData] = useState(initData);
  const [notFilled, setNotFilled] = useState(initNotFilled);
  const [attachments, setAttachments] = useState(initAttachments);

  useEffect(() => {
    (async () => {
      const res = await getData("/dashboard/bantuan");
      if (res.success) {
        setData(res.body);
      } else {
        return toastError(res.body.error ? res.body.error : "Terjadi galat");
      }
    })();
  }, []);

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const loadingToast = toastLoading();

    const target = event.target as typeof event.target & {
      judul: { value: string };
      isi: { value: string };
      label: { value: string };
      lampiran: { files: FileList; value: string };
    };

    const id = randomId(32);
    const judul = target.judul.value;
    const isi = target.isi.value;
    const label = target.label.value;
    const files = target.lampiran.files;

    let notFilled = {
      judul: false,
      isi: false,
      label: false,
    };
    if (!judul) {
      notFilled.judul = true;
    }
    if (!isi) {
      notFilled.isi = true;
    }
    if (!label) {
      notFilled.label = true;
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

    for (const file of Object.values(files)) {
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
    formData.append("judul", judul);
    formData.append("isi", isi);
    formData.append("label", label);
    for (const file of Object.values(files)) {
      formData.append("lampiran", file);
    }

    const res = await postFormData("/dashboard/bantuan", formData);

    toast.dismiss(loadingToast);
    if (res.success) {
      setData((prevData) => [{ id, judul, isi, label }, ...prevData]);
      target.judul.value = "";
      target.isi.value = "";
      target.lampiran.value = "";
      target.label.value = "umum";
      toastSuccess("Berhasil mengirim pertanyaan");
    } else {
      return toastError(res.body.error);
    }
  }

  return (
    <div className="flex-grow flex gap-7">
      <div className="flex-grow">
        <h1 className="font-[GothamBold] text-2xl">Pusat Bantuan</h1>
        {data.length > 0 && (
          <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
            <h2 className="mb-4 font-[Gotham] text-xl">Daftar Pertanyaan</h2>
            <div className="flex flex-col gap-3">
              {data.map((d) => (
                <Link href={`/bantuan/${d.id}`} key={d.id}>
                  <a className="p-4 bg-white-dark/50 rounded-xl hover:bg-white-dark">
                    <h3 className="truncate font-[GothamBold]">{d.judul}</h3>
                    <p className="line-clamp-2">{d.isi}</p>
                    <p className="text-sm text-[#606060]">#{d.label}</p>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-[Gotham] text-xl">Ajukan Pertanyaan</h2>
          </div>
          <form className="space-y-1" onSubmit={submitHandler}>
            <div>
              <p>Judul Pertanyaan</p>
              <input
                className={`mt-1 w-full px-3 py-2 border border-slate-400 rounded-md placeholder-slate-400 focus:outline-none ${
                  notFilled.judul
                    ? "!border-red-default ring-red-default ring-1"
                    : "focus:border-teal-400 focus:ring-teal-400 focus:ring-1"
                }`}
                type="text"
                name="judul"
                autoComplete="off"
                onChange={() => {
                  if (notFilled.judul) {
                    setNotFilled((prevData) => {
                      return { ...prevData, judul: false };
                    });
                  }
                }}
              />
            </div>
            <div>
              <p>Isi Pertanyaan</p>
              <textarea
                className={`inline mt-1 w-full px-3 py-2 border border-slate-400 rounded-md placeholder-slate-400 focus:outline-none ${
                  notFilled.isi
                    ? "!border-red-default ring-red-default ring-1"
                    : "focus:border-teal-400 focus:ring-teal-400 focus:ring-1"
                }`}
                name="isi"
                autoComplete="off"
                onChange={() => {
                  if (notFilled.isi) {
                    setNotFilled((prevData) => {
                      return { ...prevData, isi: false };
                    });
                  }
                }}
              ></textarea>
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
            <div>
              <p>Label</p>
              <div
                className={`w-fit mt-1 px-2 rounded-md bg-white-light border border-slate-400 shadow-sm ${
                  notFilled.label
                    ? "!border-red-default ring-red-default ring-1"
                    : "focus:border-teal-400 focus:ring-teal-400 focus:ring-1"
                }`}
              >
                <select
                  className="py-1.5 bg-white-light focus:outline-none"
                  name="label"
                  onChange={() => {
                    if (notFilled.isi) {
                      setNotFilled((prevData) => {
                        return { ...prevData, isi: false };
                      });
                    }
                  }}
                >
                  <option value="umum">Umum</option>
                  <option value="iot">IoT</option>
                  <option value="eec">EEC</option>
                  <option value="lf">Line Follower</option>
                  <option value="tp">Transporter</option>
                  <option value="workshop">Workshop</option>
                  <option value="webinar">Webinar</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="px-5 py-1 rounded-2xl bg-green-default text-white-light"
                type="submit"
              >
                Kirim
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getData, putFormData } from "../../lib/method";
import Loading from "../../components/pages/Loading";
import toast from "react-hot-toast";
import config from "../../data/config";
import { toastError, toastLoading, toastSuccess } from "../../lib/toast";
import HtmlHead from "../../components/main/HtmlHead";

let data = {
  photo: "",
  name: "",
  email: "",
  status: "",
  agency: "",
  identity: "",
  whatsapp: "",
  suspended: false,
  verified: false,
};
let userPhoto = "";
const filePickerName = {
  photo: "",
  identity: "",
};

export default function Profil({ role }: { role: string }) {
  const router = useRouter();
  const [forceRender, setForceRender] = useState(0);
  const [inputError, setInputError] = useState({
    photo: false,
    name: false,
    status: false,
    agency: false,
    identity: false,
    whatsapp: false,
  });
  const [changed, setChanged] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function refreshData() {
    const res = await getData("/dashboard/profil");
    if (res.success) {
      data = res.body;
      setForceRender((prev) => prev + 1);
    } else {
      return toastError(
        res.body && res.body.error ? res.body.error : "Terjadi galat"
      );
    }
  }

  useEffect(() => {
    if (router.isReady && role === "admin") {
      (async () => {
        return router.replace("/");
      })();
    }
  }, [router.isReady, role]);

  useEffect(() => {
    (async () => {
      refreshData();
    })();
  }, []);

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!changed) {
      return toastError("Tidak ada perubahan data");
    }

    const loadingToast = toastLoading();
    setSubmitting(true);

    const target = event.target as typeof event.target & {
      photo: { files: FileList; value: string };
      name: { value: string };
      email: { value: string };
      status: { value: string };
      agency: { value: string };
      identity: { files: FileList; value: string };
      whatsapp: { value: string };
      password: { value: string };
    };

    const inputError = {
      photo: false,
      name: false,
      status: false,
      agency: false,
      identity: false,
      whatsapp: false,
    };

    // Check length of photo URL. Default is approximately less than 200 characters.
    // Google photos approximately more than 210 characters.
    // Uploaded photos approximately more than 800 characters.
    if (data.photo.length < 200 && !target.photo.files[0]) {
      inputError.photo = true;
    }
    if (!target.name.value) {
      inputError.name = true;
    }
    if (!target.status.value) {
      inputError.status = true;
    }
    if (!target.agency.value) {
      inputError.agency = true;
    }
    if (!data.identity && !target.identity.files[0]) {
      inputError.identity = true;
    }
    if (!target.whatsapp.value) {
      inputError.whatsapp = true;
    }
    if (Object.values(inputError).findIndex((v) => v === true) >= 0) {
      toast.dismiss(loadingToast);
      setInputError(inputError);
      setSubmitting(false);
      return toastError("Data form belum lengkap");
    }

    let notValid = { type: false, size: false };
    if (
      target.photo.files.length > 0 &&
      config.type.image.filter((t) => target.photo.files[0].type === t)
        .length === 0
    ) {
      inputError.photo = true;
      notValid.type = true;
    }
    if (
      target.identity.files.length > 0 &&
      config.type.image.filter((t) => target.identity.files[0].type === t)
        .length === 0
    ) {
      inputError.identity = true;
      notValid.type = true;
    }
    if (
      target.photo.files.length > 0 &&
      (target.photo.files[0].size < config.limit.image[0] ||
        target.photo.files[0].size > config.limit.image[1])
    ) {
      inputError.photo = true;
      notValid.size = true;
    }
    if (
      target.identity.files.length > 0 &&
      (target.identity.files[0].size < config.limit.image[0] ||
        target.identity.files[0].size > config.limit.image[1])
    ) {
      inputError.identity = true;
      notValid.size = true;
    }

    if (Object.values(notValid).findIndex((v) => v === true) >= 0) {
      setInputError(inputError);

      if (notValid.type) {
        const tipe = config.type.image.join(" / ");
        toast.dismiss(loadingToast);
        setSubmitting(false);
        return toastError(`Berkas harus bertipe ${tipe}`);
      }

      if (notValid.size) {
        const size = config.limit.image;
        toast.dismiss(loadingToast);
        setSubmitting(false);
        return toastError(
          `Berkas harus berukuran antara ${size[0] / 1024} kilobyte hingga ${
            size[1] / (1024 * 1024)
          } megabytes`
        );
      }
    }

    const formData = new FormData();
    if (target.photo.files[0]) {
      formData.append("attachments", target.photo.files[0]);
      formData.append("attachmentsDetail", "photo");
    }
    if (target.identity.files[0]) {
      formData.append("attachments", target.identity.files[0]);
      formData.append("attachmentsDetail", "identity");
    }
    (
      ["name", "email", "status", "agency", "whatsapp", "password"] as const
    ).forEach((t) =>
      formData.append(
        t,
        t === "password" ? target[t].value : target[t].value.trim()
      )
    );

    const res = await putFormData("/dashboard/profil", formData);

    toast.dismiss(loadingToast);
    setSubmitting(false);
    if (res.success) {
      setChanged(false);
      toastSuccess("Berhasil memperbarui data");
      router.reload();
    } else {
      return toastError(
        res.body && res.body.error ? res.body.error : "Terjadi galat"
      );
    }
  }

  return (
    <>
      <HtmlHead title="Profil" />
      {!data.email ? (
        <Loading />
      ) : (
        <div className="flex-grow font-[GothamBook]">
          <h1 className="font-[GothamBold] text-2xl">Profil</h1>
          <form
            className="mt-8 p-8 flex-grow flex flex-col md:flex-row gap-6 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light"
            onSubmit={submitHandler}
          >
            <div className="relative md:w-1/4 h-fit flex flex-col items-center">
              <img
                className={`w-full max-h-96 object-cover rounded-xl border-2 border-transparent ${
                  inputError.photo && "!border-red-default"
                }`}
                src={userPhoto ? userPhoto : data.photo}
                alt={data.name}
                referrerPolicy="no-referrer"
                onError={() => (userPhoto = data.photo + "?" + Date.now())}
              />
              {!data.verified && (
                <>
                  <div className="w-1/2 min-w-max absolute -bottom-3">
                    <input
                      id="photoUpload"
                      name="photo"
                      type="file"
                      accept={config.type.image.join(", ")}
                      onChange={(event) => {
                        if (!data.verified) {
                          if (inputError.photo) {
                            setInputError((prev) => {
                              return { ...prev, photo: false };
                            });
                          }
                          if (!changed) {
                            setChanged(true);
                          }
                          if (
                            event.target.files &&
                            event.target.files!.length
                          ) {
                            filePickerName.photo = event.target.files[0].name;
                          } else {
                            filePickerName.photo = "";
                          }
                          setForceRender((prev) => prev + 1);
                        }
                      }}
                      hidden
                    />
                    <label
                      htmlFor="photoUpload"
                      className="block w-full px-2 py-1 bg-green-default rounded-full font-sans text-sm text-white-light text-center cursor-pointer"
                    >
                      Ubah Foto *
                    </label>
                  </div>
                  <span className="w-full px-2 absolute -bottom-10 truncate">
                    {filePickerName.photo}
                  </span>
                </>
              )}
            </div>
            <div className="md:w-3/4">
              <div className="flex flex-col">
                {data.suspended && (
                  <p className="mb-2 text-center">
                    <span className="text-red-default">Akun dibekukan.</span>{" "}
                    Silakan hubungi panitia untuk informasi lebih lanjut.
                  </p>
                )}
                {data.verified && (
                  <p className="mb-2 text-center">
                    <span className="text-green-default">
                      Akun telah terverifikasi.
                    </span>{" "}
                    Pengguna tidak dapat mengubah data selain mengganti kata
                    sandi.
                  </p>
                )}
                {changed && (
                  <p className="mb-2 text-center text-red-default">
                    Perubahan belum tersimpan.
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4 font-sans">
                <div
                  className={`px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400 ${
                    inputError.name && "!border-red-default"
                  }`}
                >
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Nama Lengkap <span className="text-red-default">*</span>
                  </label>
                  <input
                    className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                    name="name"
                    value={data.name ? data.name : ""}
                    onChange={(event) => {
                      if (!data.verified) {
                        if (inputError.name) {
                          setInputError((prev) => {
                            return { ...prev, name: false };
                          });
                        }
                        if (!changed) {
                          setChanged(true);
                        }
                        data.name = event.target.value;
                        setForceRender((prev) => prev + 1);
                      }
                    }}
                    placeholder="Nama lengkap"
                    autoComplete="off"
                  />
                </div>
                <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-red-default">
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Email (tidak dapat diubah){" "}
                    <span className="text-red-default">*</span>
                  </label>
                  <input
                    className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                    name="email"
                    value={data.email ? data.email : ""}
                    onChange={() => {}}
                    placeholder="Alamat email"
                    autoComplete="off"
                  />
                </div>
                <div
                  className={`px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400 ${
                    inputError.status && "!border-red-default"
                  }`}
                >
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Status <span className="text-red-default">*</span>
                  </label>
                  <select
                    className="w-full bg-transparent px-0.5 py-0.5 outline-none"
                    name="status"
                    value={data.status ? data.status : ""}
                    onChange={(event) => {
                      if (!data.verified) {
                        if (inputError.status) {
                          setInputError((prev) => {
                            return { ...prev, status: false };
                          });
                        }
                        if (!changed) {
                          setChanged(true);
                        }
                        data.status = event.target.value;
                        setForceRender((prev) => prev + 1);
                      }
                    }}
                  >
                    {!data.verified && (
                      <>
                        {!data.status && (
                          <option value="">Status peserta</option>
                        )}
                        <option value="Mahasiswa">Mahasiswa</option>
                        <option value="Siswa">Siswa</option>
                        <option value="Umum">Umum</option>
                      </>
                    )}
                    {data.verified && (
                      <option value={data.status}>{data.status}</option>
                    )}
                  </select>
                </div>
                <div
                  className={`px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400 ${
                    inputError.agency && "!border-red-default"
                  }`}
                >
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Asal Instansi <span className="text-red-default">*</span>
                  </label>
                  <input
                    className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                    name="agency"
                    value={data.agency ? data.agency : ""}
                    onChange={(event) => {
                      if (!data.verified) {
                        if (inputError.agency) {
                          setInputError((prev) => {
                            return { ...prev, agency: false };
                          });
                        }
                        if (!changed) {
                          setChanged(true);
                        }
                        data.agency = event.target.value;
                        setForceRender((prev) => prev + 1);
                      }
                    }}
                    placeholder="Asal instansi"
                    autoComplete="off"
                  />
                </div>
                <div
                  className={`px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400 ${
                    inputError.identity && "!border-red-default"
                  }`}
                >
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Kartu Identitas (Kartu Pelajar/KTP){" "}
                    <span className="text-red-default">*</span>
                  </label>
                  <div className="px-1.5 py-0.5 flex flex-col gap-1">
                    {data.identity && (
                      <a
                        className="hover:underline"
                        href={data.identity}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Lihat kartu identitas terunggah
                      </a>
                    )}
                    {!data.verified && (
                      <div className="relative flex gap-2 items-center">
                        <input
                          id="identityUpload"
                          name="identity"
                          type="file"
                          accept={config.type.image.join(", ")}
                          onChange={(event) => {
                            if (!data.verified) {
                              if (inputError.identity) {
                                setInputError((prev) => {
                                  return { ...prev, identity: false };
                                });
                              }
                              if (!changed) {
                                setChanged(true);
                              }
                              if (
                                event.target.files &&
                                event.target.files!.length
                              ) {
                                filePickerName.identity =
                                  event.target.files[0].name;
                              } else {
                                filePickerName.identity = "";
                              }
                              setForceRender((prev) => prev + 1);
                            }
                          }}
                          hidden
                        />
                        <label
                          htmlFor="identityUpload"
                          className="flex-none rounded-full border border-green-default px-3 py-0.5 text-sm text-green-default cursor-pointer"
                        >
                          Unggah kartu identitas
                        </label>
                        <span className="min-w-0 truncate">
                          {filePickerName.identity}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400 ${
                    inputError.whatsapp && "!border-red-default"
                  }`}
                >
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Nomor WhatsApp <span className="text-red-default">*</span>
                  </label>
                  <input
                    className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                    name="whatsapp"
                    type="number"
                    min="0"
                    value={data.whatsapp ? data.whatsapp : ""}
                    onChange={(event) => {
                      if (!data.verified) {
                        if (inputError.whatsapp) {
                          setInputError((prev) => {
                            return { ...prev, whatsapp: false };
                          });
                        }
                        if (!changed) {
                          setChanged(true);
                        }
                        data.whatsapp = event.target.value;
                        setForceRender((prev) => prev + 1);
                      }
                    }}
                    placeholder="Nomor WhatsApp (contoh: 6285641644444)"
                    autoComplete="off"
                  />
                </div>
                <div className="px-2 py-1.5 bg-white-light rounded-md border-2 border-transparent focus-within:border-teal-400">
                  <label className="block px-1.5 text-sm text-black-default/75">
                    Ubah Kata Sandi
                  </label>
                  <input
                    className="w-full bg-transparent px-1.5 py-0.5 outline-none"
                    type="password"
                    name="password"
                    placeholder="Abaikan jika tidak bermaksud mengubah kata sandi"
                    autoComplete="off"
                  />
                </div>
                {!submitting ? (
                  <button
                    className="w-fit ml-auto px-7 py-1 sm:py-1.5 bg-green-default rounded-full text-white-light"
                    type="submit"
                  >
                    Simpan Perubahan
                  </button>
                ) : (
                  <p className="w-fit ml-auto px-7 py-1 sm:py-1.5 bg-green-default rounded-full text-white-light">
                    Menyimpan...
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

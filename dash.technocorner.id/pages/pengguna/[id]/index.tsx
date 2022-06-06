import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { getData, putData } from "../../../lib/method";
import { toastError, toastLoading, toastSuccess } from "../../../lib/toast";
import HtmlHead from "../../../components/main/HtmlHead";

export default function Profil({ role }: { role: string }) {
  const router = useRouter();

  const initData: {
    id: string;
    photo: string;
    name: string;
    email: string;
    status: string;
    agency: string;
    identity: string;
    whatsapp: string;
    suspend: boolean;
    verification: boolean;
    events: Array<{ id: string; category: string; name: string }>;
    role: string;
  } = {
    id: "",
    photo: "",
    name: "Memuat...",
    email: "Memuat...",
    status: "",
    agency: "Memuat...",
    identity: "",
    whatsapp: "Memuat...",
    suspend: false,
    verification: false,
    events: [],
    role: "",
  };
  const [data, setData] = useState(initData);

  useEffect(() => {
    if (role && router.isReady && role !== "admin") {
      router.replace("/");
    }
  }, [role, router.isReady]);

  useEffect(() => {
    if (router.isReady) {
      const id = router.asPath.split("/").at(-1);

      (async () => {
        const res = await getData(`/dashboard/pengguna/id/${id}`);
        if (res.success) {
          setData(res.body);
        }
      })();
    }
  }, [router.isReady]);

  async function verifyHandler() {
    const loadingToast = toastLoading();
    const verifikasi = !data.verification;
    const res = await putData("/dashboard/pengguna/verifikasi", {
      id: data.id,
      verifikasi,
    });
    toast.dismiss(loadingToast);
    if (res.success) {
      setData((prevData) => {
        return { ...prevData, verification: verifikasi };
      });
      toastSuccess(
        verifikasi ? "Verifikasi berhasil" : "Pembatalan verifikasi berhasil"
      );
    } else {
      toastError(res.body.error);
    }
  }

  async function suspendHandler() {
    const loadingToast = toastLoading();
    const res = await putData("/dashboard/pengguna/bekukan", {
      id: data.id,
      bekukan: !data.suspend,
    });
    toast.dismiss(loadingToast);
    if (res.success) {
      setData((prevData) => {
        return { ...prevData, suspend: !data.suspend };
      });
      toastSuccess(!data.suspend ? "Akun dinonaktifkan" : "Akun diaktifkan");
    } else {
      toastError(res.body.error);
    }
  }

  return (
    <>
      <HtmlHead title="Pengguna" />
      <h1 className="font-[GothamBold] text-2xl">Profil</h1>
      <div className="mt-8 p-8 flex flex-col md:flex-row gap-6 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
        <div className="md:w-1/4 h-fit flex flex-col items-center">
          <img
            className="w-full max-h-96 object-cover rounded-xl"
            src={data.photo}
            alt={data.name}
          />
        </div>
        <div className="md:w-3/4 flex flex-col gap-4 font-sans">
          {data.role === "admin" && (
            <p className="text-center">
              Ini adalah akun dengan role <b>Admin</b>
            </p>
          )}
          <div>
            <p className="font-bold">Nama Lengkap</p>
            <p className="truncate">{data.name}</p>
          </div>
          <div>
            <p className="font-bold">Email</p>
            <p className="truncate">{data.email}</p>
          </div>
          {data.role === "pengguna" && (
            <>
              <div>
                <p className="font-bold">Status</p>
                <p className={!data.status ? "text-red-default" : ""}>
                  {data.status ? data.status : "Data tidak ditemukan"}
                </p>
              </div>
              <div>
                <p className="font-bold">Asal Instansi</p>
                <p
                  className={`truncate ${
                    !data.agency ? "text-red-default" : ""
                  }`}
                >
                  {data.agency ? data.agency : "Data tidak ditemukan"}
                </p>
              </div>
              <div>
                <p className="font-bold">Kartu Identitas (Kartu Pelajar/KTP)</p>
                {data.identity ? (
                  <a
                    className="hover:underline"
                    href={data.identity}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Lihat kartu identitas terunggah
                  </a>
                ) : (
                  <p className="text-red-default">Data tidak ditemukan</p>
                )}
              </div>
              <div>
                <p className="font-bold">Nomor WhatsApp</p>
                <p
                  className={`truncate ${
                    !data.whatsapp ? "text-red-default" : ""
                  }`}
                >
                  {data.whatsapp ? data.whatsapp : "Data tidak ditemukan"}
                </p>
              </div>
              <div>
                <p className="font-bold">Verifikasi</p>
                {data.verification ? (
                  <p className="flex gap-1 text-green-default">
                    <span className="material-icons-outlined">check</span>{" "}
                    Identitas terverifikasi
                  </p>
                ) : (
                  <p className="flex gap-1 text-red-default">
                    <span className="material-icons-outlined">close</span>{" "}
                    Identitas belum terverifikasi
                  </p>
                )}
              </div>
              <div>
                <p className="font-bold">Kegiatan yang diikuti</p>
                {data.events.length === 0 && (
                  <p className="truncate text-red-default">
                    Pengguna belum mendaftar kegiatan manapun
                  </p>
                )}
                {data.events.map((e, index) => {
                  let link = "";
                  switch (e.category) {
                    case "webinar":
                    case "workshop":
                      link = `/${e.category}/peserta/${e.id}`;
                      break;
                    default:
                      link = `/kompetisi/${e.category}/tim/${e.id}`;
                  }
                  return (
                    <a
                      className="block hover:underline"
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {e.name} ({e.id})
                    </a>
                  );
                })}
              </div>
              <div className="sm:ml-auto flex flex-col sm:flex-row gap-2 sm:gap-5">
                <button
                  className={`px-7 py-1 sm:py-1.5 rounded-full text-white-light ${
                    data.verification ? "bg-red-default" : "bg-green-default"
                  }`}
                  onClick={verifyHandler}
                >
                  {data.verification ? "Batalkan verifikasi" : "Verifikasi"}
                </button>
                <button
                  className={`px-7 py-1 sm:py-1.5 rounded-full text-white-light ${
                    data.suspend ? "bg-green-default" : "bg-red-default"
                  }`}
                  onClick={suspendHandler}
                >
                  {data.suspend ? "Aktifkan Akun" : "Nonaktifkan Akun"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getData, postData, putData, putFormData } from "../../../lib/method";
import toast from "react-hot-toast";
import Loading from "../../../components/pages/Loading";
import config from "../../../data/config";
import {
  toastError,
  toastLoading,
  toastSendMail,
  toastSuccess,
} from "../../../lib/toast";
import HtmlHead from "../../../components/main/HtmlHead";
import client from "../../../data/client";

const initData: {
  idPendaftaran: string;
  id: string;
  foto: string;
  nama: string;
  email: string;
  status: string;
  instansi: string;
  identitas: string;
  whatsapp: string;
  syarat: { poster: Array<{ id: ""; link: "" }> };
  verifikasi: boolean;
  verifikasiEmailTerkirim: boolean;
  verifikasiPendaftaran: boolean;
  peran: string;
} = {
  idPendaftaran: "",
  id: "",
  foto: "",
  nama: "Memuat...",
  email: "Memuat...",
  status: "Memuat...",
  instansi: "Memuat...",
  identitas: "Memuat...",
  whatsapp: "Memuat...",
  syarat: { poster: [] },
  verifikasi: false,
  verifikasiEmailTerkirim: false,
  verifikasiPendaftaran: false,
  peran: "pengguna",
};

const WebinarIdPage = () => {
  const router = useRouter();
  const [data, setData] = useState(initData);
  const [query, setQuery] = useState({ id: "" });
  const [forceRender, setForceRender] = useState(0);

  async function refreshData(id: string) {
    const res = await getData(`/dashboard/webinar/peserta/${id}`);
    if (res.success) {
      setData(res.body);
    } else {
      console.log(res);
      router.replace("/webinar");
    }
  }

  useEffect(() => {
    if (Object.keys(router.query).length) {
      const { id } = router.query;
      setQuery({ id: id as string });

      (async () => {
        refreshData(id as string);
      })();
    }
  }, [router.isReady]);

  async function uploadHandler(
    event: React.ChangeEvent<HTMLInputElement>,
    order: number
  ) {
    if (!event.target.files![0]) {
      return;
    }

    const loadingToast = toastLoading();

    if (
      config.type.image.filter((t) => event.target.files![0].type === t)
        .length === 0
    ) {
      const tipe = config.type.image.join(" / ");
      toast.dismiss(loadingToast);
      return toastError(`Berkas harus bertipe ${tipe}`);
    } else if (
      event.target.files![0].size < config.limit.image[0] ||
      event.target.files![0].size > config.limit.image[1]
    ) {
      const size = config.limit.image;
      toast.dismiss(loadingToast);
      return toastError(
        `Berkas harus berukuran antara ${size[0] / 1024} kilobyte hingga ${
          size[1] / (1024 * 1024)
        } megabytes`
      );
    }

    const formData = new FormData();

    formData.append("order", order.toString());
    if (data.syarat.poster.length > order) {
      formData.append("idPoster", data.syarat.poster[order].id);
    }
    formData.append("poster", event.target.files![0]);

    const res = await putFormData(
      `/dashboard/webinar/poster/${query.id}`,
      formData
    );

    if (res.success) {
      refreshData(query.id);
    }

    toast.dismiss(loadingToast);
    if (res.success) {
      toastSuccess("Berhasil mengunggah berkas");
    } else {
      return toastError(res.body.error);
    }
  }

  async function verifyHandler(type: string) {
    const loadingToast = toastLoading();

    let link = "";
    let id = "";
    let verifikasi = false;
    let verify = "";

    switch (type) {
      case "identitas":
        link = "/dashboard/pengguna/verifikasi";
        id = data.id;
        verifikasi = !data.verifikasi;
        verify = "verifikasi";
        break;
      case "pendaftaran":
        link = "/dashboard/webinar/verifikasi";
        id = data.idPendaftaran;
        verifikasi = !data.verifikasiPendaftaran;
        verify = "verifikasiPendaftaran";
        break;
    }
    const res = await putData(link, { id, verifikasi });

    toast.dismiss(loadingToast);
    if (res.success) {
      const newData = { ...data } as { [key: string]: any };
      newData[verify] = verifikasi;
      if (verify === "verifikasiPendaftaran" && !verifikasi) {
        newData.verifikasiEmailTerkirim = false;
      }
      setData(newData as typeof data);
      toastSuccess(
        verifikasi
          ? `Verifikasi ${type} berhasil`
          : `Pembatalan verifikasi ${type} berhasil`
      );
    } else {
      toastError(res.body.error);
    }
  }

  async function sendMail() {
    const loadingToast = toastSendMail(data.nama, data.email);

    const res = await postData(`/dashboard/webinar/peserta/kirim-email/`, {
      acaraId: data.idPendaftaran,
      to: data.email,
      subject: "[Technocorner] Pemberitahuan Verifikasi Pendaftaran",
      text: `Pemberitahuan Verifikasi Pendaftaran\n\nHalo ${data.nama},\n\nkami dari panitia Technocorner UGM 2022 ingin mengonfirmasi bahwa kamu telah valid terdaftar pada Webinar Technocorner 2022. Informasi lebih lanjut mengenai Webinar dan informasi lainnya akan kami hubungi melalui email ini.\n\nTerima kasih.`,
      html: `<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,minimum-scale=1,maximum-scale=1,user-scalable=0"><style type="text/css">.body{background-color:#f5f5f5;width:100%;height:100%;padding:2rem}.main{width:30rem;margin:auto;border:1px solid #d3d3d3}hr{border:1px solid #d3d3d3}@media only screen and (max-width:30rem){.body{background-color:#fff;padding:0}.main{width:100%}}</style></head><body style="margin:0"><div class="body"><div class="main"><div style="background-color:#fff;padding:1.25rem 2rem"><div style="display:flex;justify-content:center"><a href="${client.main}" style="text-decoration:inherit;color:inherit;margin-left:auto;margin-right:auto"><img src="cid:logo.png" style="width:3rem"></a></div><hr style="margin:1rem 0"><h1 style="text-align:center;font-size:larger">Pemberitahuan Verifikasi Pendaftaran</h1><p style="margin-top:2rem;text-align:justify">Halo ${data.nama},<br><br>kami dari panitia Technocorner UGM 2022 ingin mengonfirmasi bahwa kamu telah valid terdaftar pada <b>Webinar Technocorner 2022</b>. Informasi lebih lanjut mengenai Webinar dan informasi lainnya akan kami hubungi melalui email ini.<br><br>Terima kasih.</p><hr style="margin:1rem 0"><div style="width:100%"><img src="cid:footerLogo.png" style="display:block;width:12.5rem;margin-left:auto;margin-right:auto"><div style="font-size:smaller;margin-top:1rem;text-align:center">Website : <a href="${client.main}" style="text-decoration:underline;color:inherit">technocorner.id</a> | Line : <a href="http://ugm.id/LineOfficial" style="text-decoration:underline;color:inherit">ugm.id/LineOfficial</a> | Instagram : <a href="https://instagram.com/technocornerugm" style="text-decoration:underline;color:inherit">@technocornerugm</a> | Facebook : <a href="https://facebook.com/TechnocornerUGM" style="text-decoration:underline;color:inherit">Technocorner UGM</a> | Twitter : <a href="https://twitter.com/technocornerUGM" style="text-decoration:underline;color:inherit">@technocornerUGM</a> | Youtube : <a href="https://youtube.com/Technocorner" style="text-decoration:underline;color:inherit">Technocorner</a> | TikTok : <a href="https://tiktok.com/@technocornerugm" style="text-decoration:underline;color:inherit">@technocornerugm</a></div></div></div></div></div></body></html>`,
      attachments: ["logo.png", "footerLogo.png"],
    });

    toast.dismiss(loadingToast);

    if (res.success) {
      data.verifikasiEmailTerkirim = true;
      setForceRender((prev) => prev + 1);
      toastSuccess(
        `Berhasil mengirimkan email ke ${data.nama} (${data.email})`
      );
    } else {
      toastError(`Gagal mengirimkan email ke ${data.nama} (${data.email})`);
    }
  }

  return (
    <>
      <HtmlHead title="Webinar" />
      {!data.idPendaftaran ? (
        <Loading />
      ) : (
        <>
          <h1 className="font-[GothamBold] text-2xl">Data Peserta Webinar</h1>
          <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
            <p className="mb-3 font-[Gotham] text-lg md:text-xl">
              Data Pendaftaran
            </p>
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-bold">ID Peserta</p>
                <p>{data.idPendaftaran}</p>
              </div>
              <div>
                <p className="font-bold">Nama Peserta</p>
                <p>{data.nama}</p>
              </div>
              <div>
                <p className="font-bold">Email</p>
                <p>{data.email}</p>
              </div>
              <div>
                <p className="font-bold">Status</p>
                <p>{data.status}</p>
              </div>
              <div>
                <p className="font-bold">Kartu Identitas</p>
                <a
                  className="hover:underline"
                  href={data.identitas}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Lihat kartu identitas terunggah
                </a>
              </div>
              <div>
                <p className="font-bold">Nomor WhatsApp</p>
                <p>{data.whatsapp}</p>
              </div>
              <div>
                <p className="font-bold">Verifikasi Identitas</p>
                <div className="flex gap-4">
                  {data.verifikasi ? (
                    <p className="flex items-center gap-1 text-green-default">
                      <span className="material-icons-outlined">check</span>{" "}
                      Terverifikasi
                    </p>
                  ) : (
                    <p className="flex items-center gap-1 text-red-default">
                      <span className="material-icons-outlined">close</span>{" "}
                      Belum terverifikasi
                    </p>
                  )}
                  {data.peran === "admin" && (
                    <button
                      className={`relative left-0 rounded-full border px-3 py-0.5 text-sm ${
                        data.verifikasi
                          ? "border-red-default text-red-default"
                          : "border-green-default text-green-default"
                      }`}
                      onClick={() => verifyHandler("identitas")}
                    >
                      {data.verifikasi ? "Hapus verifikasi" : "Verifikasi"}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <p className="flex gap-2 font-bold">
                  Bukti Share Poster (1 IG Story)
                  <a
                    className="material-icons-outlined"
                    href={`https://link.technocorner.id/PosterWebinar`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    link
                  </a>
                </p>
                <div className="flex flex-col gap-1">
                  {data.syarat.poster.length > 0 ? (
                    data.syarat.poster.map((p, index) => (
                      <a
                        className="hover:underline"
                        href={p.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        key={p.id}
                      >
                        Lihat bukti share poster
                      </a>
                    ))
                  ) : (
                    <p className="flex items-center gap-1 text-red-default">
                      <span className="material-icons-outlined">close</span>{" "}
                      Belum mengunggah bukti share poster
                    </p>
                  )}
                  {data.peran === "pengguna" && !data.verifikasiPendaftaran && (
                    <div className="relative flex items-center">
                      <label className="absolute z-10 cursor-pointer rounded-full">
                        <input
                          className="file:w-0 file:m-0 file:px-0 file:py-1 file:border-0 text-sm invisible"
                          name="poster"
                          type="file"
                          accept={config.type.image.join(", ")}
                          onChange={(event) => uploadHandler(event, 0)}
                        />
                      </label>
                      <button className="relative left-0 rounded-full border border-green-default px-3 py-0.5 text-sm text-green-default">
                        Unggah bukti share poster
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="font-bold">Verifikasi Pendaftaran</p>
                <div className="flex gap-4">
                  {data.verifikasiPendaftaran ? (
                    <p className="flex items-center gap-1 text-green-default">
                      <span className="material-icons-outlined">check</span>{" "}
                      Terverifikasi
                    </p>
                  ) : data.syarat.poster.length > 0 ? (
                    <p className="flex items-center gap-1">
                      <span className="material-icons-outlined">autorenew</span>
                      {data.peran === "pengguna"
                        ? "Dalam proses"
                        : "Menunggu"}{" "}
                      verifikasi
                    </p>
                  ) : (
                    <p className="flex items-center gap-1 text-red-default">
                      <span className="material-icons-outlined">close</span>{" "}
                      Data pendaftaran belum lengkap
                    </p>
                  )}
                  {data.peran === "admin" && data.syarat.poster.length > 0 && (
                    <>
                      <button
                        className={`relative left-0 rounded-full border px-3 py-0.5 text-sm ${
                          data.verifikasiPendaftaran
                            ? "border-red-default text-red-default"
                            : "border-green-default text-green-default"
                        }`}
                        onClick={() => verifyHandler("pendaftaran")}
                      >
                        {data.verifikasiPendaftaran
                          ? "Hapus verifikasi"
                          : "Verifikasi"}
                      </button>
                      {data.verifikasiPendaftaran && (
                        <button
                          className={`w-fit flex items-center gap-1 rounded-full border px-3 py-0.5 text-sm ${
                            data.verifikasiEmailTerkirim
                              ? "border-green-default text-green-default"
                              : "border-black-default"
                          }`}
                          onClick={sendMail}
                          title={
                            data.verifikasiEmailTerkirim
                              ? "Email sudah dikirim"
                              : "Email belum dikirim"
                          }
                        >
                          {data.verifikasiEmailTerkirim
                            ? "Email pemberitahuan verifikasi sudah dikirim"
                            : "Kirim email pemberitahuan verifikasi"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default WebinarIdPage;

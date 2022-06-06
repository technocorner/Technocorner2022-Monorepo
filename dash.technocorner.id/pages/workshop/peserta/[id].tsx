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
import { toastInfo } from "../../../lib/toastInfo";

const initData: {
  id: string;
  biaya: string;
  pembayaran: string;
  syarat: { poster: Array<{ id: string; link: string }> };
  verifikasi: boolean;
  verifikasiEmailTerkirim: boolean;
  penggunaKode: Array<{
    id: string;
    nama: string;
    pembayaran: string;
    verifikasi: boolean;
  }>;
  pengguna: string;
  peran: string;
  referral: boolean;
} = {
  id: "",
  biaya: "",
  pembayaran: "",
  syarat: { poster: [] },
  verifikasi: false,
  verifikasiEmailTerkirim: false,
  penggunaKode: [],
  pengguna: "",
  peran: "",
  referral: false,
};

const WorkshopPage = () => {
  const router = useRouter();
  const [data, setData] = useState(initData);
  const [query, setQuery] = useState({ id: "" });
  const [forceRender, setForceRender] = useState(0);

  async function refreshData(id: string) {
    const res = await getData(`/dashboard/workshop/peserta/${id}`);
    if (res.success) {
      console.log(res.body.syarat.poster.length);
      setData(res.body);
    } else {
      console.log(res);
      router.replace("/workshop");
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
    type: string,
    order?: number
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

    if (type === "poster") {
      formData.append("order", order!.toString());
      if (data.syarat.poster.length > order!) {
        formData.append("idPoster", data.syarat.poster[order!].id);
      }
    }
    formData.append(type, event.target.files![0]);

    const res = await putFormData(
      `/dashboard/workshop/${type}/${query.id}`,
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

  async function verifyHandler(id: string, verifikasi: boolean) {
    const loadingToast = toastLoading();
    const res = await putData(`/dashboard/workshop/verifikasi`, {
      id,
      verifikasi: !verifikasi,
    });

    toast.dismiss(loadingToast);
    if (res.success) {
      const newData = { ...data };
      newData.verifikasi = !verifikasi;
      if (!verifikasi) {
        newData.verifikasiEmailTerkirim = false;
      }
      setData(newData);
      toastSuccess(
        !verifikasi ? "Verifikasi berhasil" : "Pembatalan verifikasi berhasil"
      );
    } else {
      toastError(res.body.error);
    }
  }

  async function sendMail() {
    const loadingToast = toastSendMail(
      data.penggunaKode[0].nama,
      data.penggunaKode[0].id
    );

    const res = await postData(`/dashboard/workshop/peserta/kirim-email/`, {
      acaraId: data.id,
      to: data.penggunaKode[0].id,
      subject: "[Technocorner] Pemberitahuan Verifikasi Pendaftaran",
      text: `Pemberitahuan Verifikasi Pendaftaran\n\nHalo ${data.penggunaKode[0].nama},\n\nkami dari panitia Technocorner UGM 2022 ingin mengonfirmasi bahwa kamu telah valid terdaftar pada Workshop Technocorner 2022. Informasi lebih lanjut mengenai Workshop dan informasi lainnya akan kami hubungi melalui email ini.\n\nTerima kasih.`,
      html: `<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,minimum-scale=1,maximum-scale=1,user-scalable=0"><style type="text/css">.body{background-color:#f5f5f5;width:100%;height:100%;padding:2rem}.main{width:30rem;margin:auto;border:1px solid #d3d3d3}hr{border:1px solid #d3d3d3}@media only screen and (max-width:30rem){.body{background-color:#fff;padding:0}.main{width:100%}}</style></head><body style="margin:0"><div class="body"><div class="main"><div style="background-color:#fff;padding:1.25rem 2rem"><div style="display:flex;justify-content:center"><a href="${client.main}" style="text-decoration:inherit;color:inherit;margin-left:auto;margin-right:auto"><img src="cid:logo.png" style="width:3rem"></a></div><hr style="margin:1rem 0"><h1 style="text-align:center;font-size:larger">Pemberitahuan Verifikasi Pendaftaran</h1><p style="margin-top:2rem;text-align:justify">Halo ${data.penggunaKode[0].nama},<br><br>kami dari panitia Technocorner UGM 2022 ingin mengonfirmasi bahwa kamu telah valid terdaftar pada <b>Workshop Technocorner 2022</b>. Informasi lebih lanjut mengenai Workshop dan informasi lainnya akan kami hubungi melalui email ini.<br><br>Terima kasih.</p><hr style="margin:1rem 0"><div style="width:100%"><img src="cid:footerLogo.png" style="display:block;width:12.5rem;margin-left:auto;margin-right:auto"><div style="font-size:smaller;margin-top:1rem;text-align:center">Website : <a href="${client.main}" style="text-decoration:underline;color:inherit">technocorner.id</a> | Line : <a href="http://ugm.id/LineOfficial" style="text-decoration:underline;color:inherit">ugm.id/LineOfficial</a> | Instagram : <a href="https://instagram.com/technocornerugm" style="text-decoration:underline;color:inherit">@technocornerugm</a> | Facebook : <a href="https://facebook.com/TechnocornerUGM" style="text-decoration:underline;color:inherit">Technocorner UGM</a> | Twitter : <a href="https://twitter.com/technocornerUGM" style="text-decoration:underline;color:inherit">@technocornerUGM</a> | Youtube : <a href="https://youtube.com/Technocorner" style="text-decoration:underline;color:inherit">Technocorner</a> | TikTok : <a href="https://tiktok.com/@technocornerugm" style="text-decoration:underline;color:inherit">@technocornerugm</a></div></div></div></div></div></body></html>`,
      attachments: ["logo.png", "footerLogo.png"],
    });

    toast.dismiss(loadingToast);

    if (res.success) {
      data.verifikasiEmailTerkirim = true;
      setForceRender((prev) => prev + 1);
      toastSuccess(
        `Berhasil mengirimkan email ke ${data.penggunaKode[0].nama} (${data.penggunaKode[0].id})`
      );
    } else {
      toastError(
        `Gagal mengirimkan email ke ${data.penggunaKode[0].nama} (${data.penggunaKode[0].id})`
      );
    }
  }

  function registrationHelper() {
    toastInfo(`Biaya normal: Rp35.000
    Biaya khusus (pilih salah satu):
    - Share poster di story IG dan tiga grup minimal anggota masing-masing 30 orang untuk mendapatkan biaya Rp30.000
    - Membagikan kode referral:
      • 2 orang Rp60.000
      • 3 orang Rp75.000
      • 5 orang Rp100.000`);
  }

  function payHelper() {
    toastInfo(`Silakan melakukan pembayaran sesuai dengan nominal yang ditentukan dari cabang lomba atau kegiatan yang diikuti ke:
    - 0083 0111 2967 506 (BRI) a.n. Calula Annisa M, atau
    - 081310439454 (Gopay) a.n. Andriansyah Rafi Rahmadhian.`);
  }

  return (
    <>
      <HtmlHead title="Workshop" />
      {!data.id ? (
        <Loading />
      ) : (
        <>
          <p className="font-[GothamBold] text-xl md:text-2xl">
            Data Peserta Workshop
          </p>
          <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
            <p className="mb-3 font-[Gotham] text-lg md:text-xl">
              Data Pendaftaran
            </p>
            <div className="flex flex-col gap-3">
              {data.peran === "admin" && (
                <div>
                  <p className="font-bold">Gelombang Pendaftaran</p>
                  <p>{!data.referral ? "Batch 1" : "Batch 2"}</p>
                </div>
              )}
              {data.referral && (
                <>
                  {data.syarat.poster.length === 0 && (
                    <div>
                      <p className="font-bold">Kode Referral</p>
                      <p>{data.id}</p>
                    </div>
                  )}
                  {!data.pembayaran && (
                    <div>
                      <p className="font-bold">Tata Cara Pendaftaran</p>
                      <button
                        className="hover:underline"
                        onClick={registrationHelper}
                      >
                        Lihat cara mendaftar
                      </button>
                    </div>
                  )}
                  {data.penggunaKode.length === 1 &&
                    (data.peran === "admin" ||
                      data.pengguna ===
                        (data.penggunaKode[0] as { id: string }).id) && (
                      <div>
                        <p className="flex gap-2 font-bold">
                          Bukti Share Poster (1 IG Story, 3 Share Grup)
                          <a
                            className="material-icons-outlined"
                            href="https://link.technocorner.id/PosterWorkshop"
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
                                Lihat bukti share poster ke-{index + 1}
                              </a>
                            ))
                          ) : (
                            <p className="flex gap-1 text-red-default">
                              <span className="material-icons-outlined">
                                close
                              </span>{" "}
                              Belum mengunggah bukti share poster
                            </p>
                          )}
                          {data.peran === "pengguna" &&
                            !data.verifikasi &&
                            [0, 1, 2, 3].map(
                              (id, index) =>
                                index <= data.syarat.poster.length && (
                                  <div
                                    className="relative flex items-center"
                                    key={id}
                                  >
                                    <label className="absolute z-10 cursor-pointer rounded-full">
                                      <input
                                        className="file:w-0 file:m-0 file:px-0 file:py-1 file:border-0 text-sm invisible"
                                        name="poster"
                                        type="file"
                                        accept={config.type.image.join(", ")}
                                        onChange={(event) =>
                                          uploadHandler(event, "poster", id)
                                        }
                                      />
                                    </label>
                                    <button className="relative left-0 rounded-full border border-green-default px-3 py-0.5 text-sm text-green-default">
                                      Unggah bukti share poster ke-{id + 1}
                                    </button>
                                  </div>
                                )
                            )}
                        </div>
                      </div>
                    )}
                </>
              )}
              {data.penggunaKode.length > 0 &&
                (data.peran === "admin" ||
                  data.pengguna ===
                    (data.penggunaKode[0] as { id: string }).id) && (
                  <>
                    <div>
                      <div className="flex gap-1 items-center">
                        <p className="font-bold">Biaya Pendaftaran</p>
                        <button
                          className="material-icons-outlined hover:text-blue-light"
                          onClick={payHelper}
                          title="Informasi pembayaran"
                        >
                          help_outline
                        </button>
                      </div>
                      <p>
                        {data.biaya}
                        {data.referral &&
                          ` (${data.penggunaKode.length} orang)`}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold">Bukti Pembayaran</p>
                      <div className="w-fit flex flex-col gap-1">
                        {data.pembayaran ? (
                          <a
                            className="hover:underline"
                            href={data.pembayaran}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            Lihat bukti pembayaran
                          </a>
                        ) : (
                          <p className="flex gap-1 text-red-default">
                            <span className="material-icons-outlined">
                              close
                            </span>{" "}
                            {data.penggunaKode.length > 0 &&
                            data.pengguna ===
                              (data.penggunaKode[0] as { id: string }).id
                              ? "Belum mengunggah bukti pembayaran"
                              : "Bukti pembayaran tidak ditemukan"}
                          </p>
                        )}
                        {data.peran === "pengguna" && !data.verifikasi && (
                          <div className="relative flex items-center">
                            <label className="absolute z-10 cursor-pointer rounded-full">
                              <input
                                className="file:w-0 file:m-0 file:px-0 file:py-1 file:border-0 text-sm invisible"
                                name="pembayaran"
                                type="file"
                                accept={config.type.image.join(", ")}
                                onChange={(event) =>
                                  uploadHandler(event, "pembayaran")
                                }
                              />
                            </label>
                            <button className="relative left-0 rounded-full border border-green-default px-3 py-0.5 text-sm text-green-default">
                              Unggah bukti pembayaran
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              <div>
                <p className="font-bold">Status</p>
                <div className="flex gap-4">
                  {data.verifikasi ? (
                    <p className="flex gap-1 text-green-default">
                      <span className="material-icons-outlined">check</span>{" "}
                      Terverifikasi
                    </p>
                  ) : data.pembayaran ? (
                    <p className="flex gap-1">
                      <span className="material-icons-outlined">autorenew</span>
                      {data.peran === "pengguna"
                        ? "Dalam proses"
                        : "Menunggu"}{" "}
                      verifikasi
                    </p>
                  ) : (
                    <p className="flex gap-1 text-red-default">
                      <span className="material-icons-outlined">close</span>{" "}
                      Data pendaftaran belum lengkap
                    </p>
                  )}
                  {data.peran === "admin" && data.pembayaran && (
                    <>
                      <button
                        className={`relative left-0 rounded-full border px-3 py-0.5 text-sm ${
                          data.verifikasi
                            ? "border-red-default text-red-default"
                            : "border-green-default text-green-default"
                        }`}
                        onClick={() => verifyHandler(data.id, data.verifikasi)}
                      >
                        {data.verifikasi ? "Hapus verifikasi" : "Verifikasi"}
                      </button>
                      {data.verifikasi && (
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

          <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
            <p className="mb-3 font-[Gotham] text-lg md:text-xl">
              Daftar Peserta
            </p>
            <div className="flex flex-col gap-3">
              {data.penggunaKode.map((p, index) => (
                <div key={p.id}>
                  {data.peran === "pengguna" && (
                    <p className="font-bold">
                      {p.nama} {data.pengguna === p.id && " (Saya)"}
                    </p>
                  )}
                  {data.peran === "admin" && (
                    <a
                      className="font-bold hover:underline"
                      href={`/pengguna/${p.id}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {p.nama}
                    </a>
                  )}
                  <div className="gap-4">
                    <div className="flex gap-4">
                      {p.verifikasi ? (
                        <p className="flex gap-1 text-green-default">
                          <span className="material-icons-outlined">check</span>{" "}
                          Identitas Terverifikasi
                        </p>
                      ) : (
                        <p className="flex gap-1 text-red-default">
                          <span className="material-icons-outlined">close</span>{" "}
                          Identitas belum terverifikasi
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default WorkshopPage;

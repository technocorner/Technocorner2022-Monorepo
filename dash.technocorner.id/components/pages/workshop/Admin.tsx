import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getData, putData } from "../../../lib/method";
import toast from "react-hot-toast";
import { toastError, toastLoading, toastSuccess } from "../../../lib/toast";
import Loading from "../Loading";

const initData: Array<{
  id: string;
  peserta: Array<{
    id: string;
    nama: string;
    whatsapp: string;
    instansi: string;
  }>;
  pembayaran: string;
  verifikasi: boolean;
}> = [];

export default function Admin() {
  const router = useRouter();
  const [data, setData] = useState(initData);
  const [filteredData, setFilteredData] = useState(initData);
  const [showData, setShowData] = useState(initData);
  const [paginate, setPaginate] = useState(25);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getData(`/dashboard/workshop`);
      if (res.success) {
        setData(res.body);
        setLoading(false);
      } else {
        toastError(res.body.error);
      }
    })();
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter(
        (d) =>
          d.peserta.filter(
            (p) => p.nama.toLowerCase().indexOf(searchQuery) !== -1
          ).length
      )
    );
    setPage(0);
  }, [data, searchQuery]);

  useEffect(() => {
    if (!paginate) {
      setShowData(filteredData);
      return;
    }

    setShowData(filteredData.slice(page * paginate, (page + 1) * paginate));
  }, [page, paginate, filteredData]);

  async function verifyHandler(id: string, verifikasi: boolean) {
    const loadingToast = toastLoading();

    const res = await putData(`/dashboard/workshop/verifikasi`, {
      id,
      verifikasi: !verifikasi,
    });

    toast.dismiss(loadingToast);
    if (res.success) {
      const index = data.findIndex((d: { id: string }) => id === d.id);
      setData((prevData) => {
        const data = [...prevData];
        (data[index] as { verifikasi: boolean }).verifikasi = !verifikasi;
        return data;
      });
      toastSuccess(
        !verifikasi ? "Verifikasi berhasil" : "Pembatalan verifikasi berhasil"
      );
    } else {
      toastError(res.body.error);
    }
  }

  function searchHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      kueri: { value: string };
    };

    setSearchQuery(target.kueri.value.toLowerCase());
  }

  function paginateHandler(event: React.ChangeEvent<HTMLSelectElement>) {
    setPage(0);

    if (event.target.value === "All") {
      setPaginate(0);
      return;
    }

    setPaginate(Number(event.target.value));
  }

  return loading ? (
    <Loading />
  ) : (
    <>
      <div className="flex-grow">
        <h1 className="font-[GothamBold] text-2xl">Workshop</h1>
        <div className="mt-8 p-8 rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
          <h2 className="mb-4 font-[Gotham] text-lg md:text-xl">
            Daftar Peserta
          </h2>
          {!data.length && <p className="text-center">Tidak ada data</p>}
          {data.length > 0 && (
            <>
              <div className="mb-2 flex flex-wrap gap-2 justify-between items-center">
                <form className="space-x-2" onSubmit={searchHandler}>
                  <input
                    className="rounded p-1 leading-6 outline outline-1 focus:outline-blue-light"
                    placeholder="Cari nama peserta"
                    name="kueri"
                    autoComplete="off"
                  />
                  <button
                    className="px-2 py-1 rounded bg-blue-light text-white-light"
                    type="submit"
                  >
                    Cari
                  </button>
                </form>
                <div className="flex items-center gap-3">
                  <span>
                    {page * paginate + 1 < filteredData.length &&
                      (paginate ? page * paginate + 1 : 1) + "-"}
                    {(page + 1) * paginate < filteredData.length
                      ? (page + 1) * paginate
                      : filteredData.length}{" "}
                    dari {filteredData.length}
                  </span>
                  <select className="p-1" onChange={paginateHandler}>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="all">Semua</option>
                  </select>
                  <div className="flex">
                    <button
                      className={`material-icons-outlined ${
                        !(page > 0) && "text-black-lighter"
                      }`}
                      onClick={() =>
                        setPage((prev) => (prev > 0 ? prev - 1 : prev))
                      }
                    >
                      navigate_before
                    </button>
                    <button
                      className={`material-icons-outlined ${
                        !(page * paginate < filteredData.length - paginate) &&
                        "text-black-lighter"
                      }`}
                      onClick={() =>
                        setPage((prev) =>
                          prev * paginate < filteredData.length - paginate
                            ? prev + 1
                            : prev
                        )
                      }
                    >
                      navigate_next
                    </button>
                  </div>
                </div>
              </div>
              {!showData.length && (
                <p className="text-center">Tidak ada data</p>
              )}
              {showData.length > 0 && (
                <table className="w-full table-fixed">
                  <thead>
                    <tr>
                      <th className="w-16 border border-black-lighter truncate">
                        Nomor
                      </th>
                      <th className="border border-black-lighter truncate">
                        Nama Peserta
                      </th>
                      <th className="border border-black-lighter truncate">
                        Nomor WhatsApp
                      </th>
                      <th className="border border-black-lighter truncate">
                        Asal Instansi
                      </th>
                      <th className="border border-black-lighter truncate">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {showData.map((d, index) => (
                      <tr key={d.id}>
                        <td
                          className={`p-1 border-x border-black-lighter text-center truncate ${
                            showData.length === index + 1 && "border-b"
                          }`}
                        >
                          {paginate ? index + 1 + page * paginate : index + 1}
                        </td>
                        <td
                          className={`p-1 border-x border-black-lighter ${
                            showData.length === index + 1 && "border-b"
                          }`}
                        >
                          {d.peserta.map((p) => (
                            <a
                              className="block truncate hover:underline"
                              href={`${router.asPath}/peserta/${d.id}`}
                              target="_blank"
                              rel="noreferrer noopener"
                              key={p.id}
                            >
                              {p.nama}
                            </a>
                          ))}
                        </td>
                        <td
                          className={`p-1 border-x border-black-lighter ${
                            showData.length === index + 1 && "border-b"
                          }`}
                        >
                          {d.peserta.map((p) => (
                            <a
                              className="block truncate hover:underline"
                              href={`https://wa.me/${p.whatsapp}`}
                              target="_blank"
                              rel="noreferrer noopener"
                              key={p.id}
                            >
                              {p.whatsapp}
                            </a>
                          ))}
                        </td>
                        <td
                          className={`p-1 border-x border-black-lighter ${
                            showData.length === index + 1 && "border-b"
                          }`}
                        >
                          {d.peserta.map((p, index) => (
                            <p className="truncate" key={p.instansi + index}>
                              {p.instansi}
                            </p>
                          ))}
                        </td>
                        <td
                          className={`p-1 border-x border-black-lighter ${
                            showData.length === index + 1 && "border-b"
                          }`}
                        >
                          <div className="flex justify-center flex-wrap gap-1">
                            <a
                              className="px-5 py-1 rounded-2xl bg-green-default text-white-light text-sm truncate"
                              href={`${router.asPath}/peserta/${d.id}`}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              Data
                            </a>
                            {d.pembayaran ? (
                              <a
                                className="px-5 py-1 rounded-2xl bg-green-default text-white-light text-sm truncate"
                                href={d.pembayaran}
                                target="_blank"
                                rel="noreferrer noopener"
                              >
                                Bukti pembayaran
                              </a>
                            ) : (
                              <p
                                className="px-5 py-1 rounded-2xl bg-red-default text-white-light text-sm truncate"
                                title="Tidak ada data"
                              >
                                Bukti pembayaran
                              </p>
                            )}
                            <button
                              className={`px-5 py-1 rounded-2xl text-white-light text-sm truncate ${
                                d.verifikasi
                                  ? "bg-red-default"
                                  : "bg-green-default"
                              }`}
                              onClick={() => verifyHandler(d.id, d.verifikasi)}
                            >
                              {d.verifikasi
                                ? "Batalkan verifikasi"
                                : "Verifikasi"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {showData.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  <button
                    className={page > 0 ? "flex" : "hidden"}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    <span className="material-icons-outlined">
                      navigate_before
                    </span>{" "}
                    Sebelumnya
                  </button>
                  <button
                    className={
                      page * paginate < filteredData.length - paginate
                        ? "flex"
                        : "hidden"
                    }
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Selanjutnya{" "}
                    <span className="material-icons-outlined">
                      navigate_next
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

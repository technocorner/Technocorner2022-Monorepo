import React, { useEffect, useState } from "react";
import { getData } from "../../../lib/method";
import { toastError } from "../../../lib/toast";

const initData: {
  page: { pos: number; from: number; until: number; total: number };
  questions: Array<{
    id: string;
    judul: string;
    isi: string;
    label: string;
  }>;
} = { page: { pos: 0, from: 0, until: 0, total: 0 }, questions: [] };

export default function Admin() {
  const [data, setData] = useState(initData);
  const [page, setPage] = useState(0);
  const [label, setLabel] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      const res = await getData(
        `/dashboard/bantuan?p=${page}&label=${label}&q=${query
          .trim()
          .toLowerCase()}`
      );

      if (!res.success) {
        return toastError(res.body.error ? res.body.error : "Terjadi galat");
      }

      setData(res.body);
    })();
  }, [page, label, query]);

  function searchHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(
      (
        event.target as typeof event.target & {
          query: { value: string };
        }
      ).query.value
    );
  }

  return (
    <div className="flex-grow flex flex-col">
      <h1 className="font-[GothamBold] text-2xl">Pusat Bantuan</h1>
      <div className="mt-8 p-8 flex-grow rounded-3xl transform-gpu bg-gradient-to-br from-[#F0F0F0] to-[#F0F0F0]/50 backdrop-blur-[5px] outline outline-2 outline-white-light">
        <h2 className="mb-2 font-[Gotham] text-xl">Daftar Pertanyaan</h2>
        <div className="mb-2 flex flex-wrap gap-2 justify-between items-center">
          <form className="flex-1 flex gap-x-2" onSubmit={searchHandler}>
            <input
              className="flex-1 rounded p-1 leading-6 outline outline-1 focus:outline-blue-light"
              placeholder="Cari pertanyaan"
              name="query"
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
              {`${data.page.from}-${data.page.until} dari ${data.page.total}`}
            </span>
            <div className="flex">
              <button
                className={`material-icons-outlined ${
                  !(page > 0) && "text-black-lighter"
                }`}
                onClick={() => setPage((prev) => (prev > 0 ? prev - 1 : prev))}
              >
                navigate_before
              </button>
              <button
                className={`material-icons-outlined ${
                  data.page.from !== 0 && "text-black-lighter"
                }`}
                onClick={() =>
                  setPage((prev) =>
                    prev < data.page.total / 10 ? prev + 1 : prev
                  )
                }
              >
                navigate_next
              </button>
            </div>
          </div>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            className="rounded-full px-3 py-0.5 border border-green-dark font-sans text-sm text-green-dark"
            onClick={() => setLabel("all")}
          >
            Semua
          </button>
          <button
            className="rounded-full px-3 py-0.5 border border-green-dark font-sans text-sm text-green-dark"
            onClick={() => setLabel("umum")}
          >
            #Umum
          </button>
          <button
            className="rounded-full px-3 py-0.5 border border-green-dark font-sans text-sm text-green-dark"
            onClick={() => setLabel("iot")}
          >
            #IoT
          </button>
          <button
            className="rounded-full px-3 py-0.5 border border-green-dark font-sans text-sm text-green-dark"
            onClick={() => setLabel("eec")}
          >
            #EEC
          </button>
          <button
            className="rounded-full px-3 py-0.5 border border-green-dark font-sans text-sm text-green-dark"
            onClick={() => setLabel("lf")}
          >
            #LF
          </button>
          <button
            className="rounded-full px-3 py-0.5 border border-green-dark font-sans text-sm text-green-dark"
            onClick={() => setLabel("tp")}
          >
            #TP
          </button>
          <button
            className="rounded-full px-3 py-0.5 border border-green-dark font-sans text-sm text-green-dark"
            onClick={() => setLabel("webinar")}
          >
            #Webinar
          </button>
          <button
            className="rounded-full px-3 py-0.5 border border-green-dark font-sans text-sm text-green-dark"
            onClick={() => setLabel("workshop")}
          >
            #Workshop
          </button>
        </div>
        {data.questions.length > 0 && (
          <div className="flex flex-col gap-2">
            {data.questions.map((d) => (
              <a
                className="p-4 bg-white-dark/50 rounded-xl hover:bg-white-dark"
                href={`/bantuan/${d.id}`}
                target="_blank"
                rel="noopener noreferrer"
                key={d.id}
              >
                <h3 className="truncate font-[GothamBold]">{d.judul}</h3>
                <p className="line-clamp-2">{d.isi}</p>
                <p className="text-black-light/80">#{d.label}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

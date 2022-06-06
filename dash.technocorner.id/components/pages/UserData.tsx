import { useEffect, useState } from "react";
import { getData } from "../../lib/method";

export default function UserData() {
  const [data, setData] = useState({
    name: "",
    email: "",
    status: "",
    agency: "",
    identity: "",
    whatsapp: "",
  });

  useEffect(() => {
    (async () => {
      const res = await getData("/dashboard/profil");
      if (res.success) {
        setData(res.body);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="font-bold">Nama Lengkap</p>
        <p>{data.name ? data.name : "Memuat..."}</p>
      </div>
      <div>
        <p className="font-bold">Email</p>
        <p>{data.email ? data.email : "Memuat..."}</p>
      </div>
      <div>
        <p className="font-bold">Status</p>
        {data.status ? (
          <p>{data.status}</p>
        ) : (
          <p className="flex text-red-default">
            <span className="material-icons-outlined">close</span> Pengguna
            belum mengisi status
          </p>
        )}
      </div>
      <div>
        <p className="font-bold">Asal Instansi</p>
        {data.agency ? (
          <p>{data.agency}</p>
        ) : (
          <p className="flex text-red-default">
            <span className="material-icons-outlined">close</span> Pengguna
            belum mengisi asal instansi
          </p>
        )}
      </div>
      <div>
        <p className="font-bold">Kartu Identitas</p>
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
          <p className="flex text-red-default">
            <span className="material-icons-outlined">close</span> Pengguna
            belum mengunggah kartu identitas
          </p>
        )}
      </div>
      <div>
        <p className="font-bold">Nomor WhatsApp</p>
        {data.whatsapp ? (
          <p>{data.whatsapp}</p>
        ) : (
          <p className="flex text-red-default">
            <span className="material-icons-outlined">close</span> Pengguna
            belum mengisi nomor WhatsApp
          </p>
        )}
      </div>
    </div>
  );
}

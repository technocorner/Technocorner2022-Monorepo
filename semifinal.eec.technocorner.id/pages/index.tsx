import HtmlHead from "../components/HtmlHead";
import Labs from "../data/labs";
import { useRouter } from "next/router";
import { getData } from "../libs/fetch";
import statusCode from "../libs/statusCode";
import { toastError, toastLoading } from "../libs/toast";
import toast from "react-hot-toast";

export default function semifinal() {
  const router = useRouter();

  async function openLab(lab: typeof Labs[0]) {
    const loadingToast = toastLoading();

    const res = await getData(`/lab/${lab.id}`);

    toast.dismiss(loadingToast);
    if (res.status === statusCode.OK) {
      if (!res.json) {
        toastError(`Akses ${lab.title} belum diizinkan`);
        return;
      }
      router.push(`/soal/${lab.link}`);
      return;
    } else {
      toastError(res.json && res.json.error ? res.json.error : "Terjadi galat");
    }
  }

  return (
    <>
      <HtmlHead
        title="Beranda"
        description="Beranda semifinal kompetisi EEC yang diselenggarakan oleh Technocorner. Semifinal ini akan diadakan pada tanggal 19-20 April 2022."
      />
      <div className="flex flex-col gap-y-6 px-0 md:px-12 lg:px-24">
        {Labs.map((lab) => (
          <button key={lab.id} onClick={() => openLab(lab)}>
            <div className="duration-300 transform hover:-translate-y-2 hover:drop-shadow-xl text-lg text-center rounded-xl py-3 bg-gradient-to-b to-cstmdarkestgreen from-cstmblue text-white-default">
              <p>
                {lab.id}. {lab.title}
              </p>
              <p>Durasi {lab.duration}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

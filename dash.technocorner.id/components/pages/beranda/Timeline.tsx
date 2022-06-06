export default function Timeline({
  rundown,
}: {
  rundown: { [key: string]: any };
}) {
  const date = new Date();
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][
    date.getDay()
  ];
  const tanggal = `${date.getDate()} ${
    [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ][date.getMonth()]
  } ${date.getFullYear()}`;

  return (
    <div className="h-full p-10 rounded-3xl transform-gpu bg-gradient-to-b from-[#F0F0F0] to-[#F0F0F0]/40 backdrop-blur-[5px]">
      <div>
        <p className="font-bold text-2xl text-red-default">{hari}</p>
        <p>{tanggal}</p>
      </div>
      <p className="my-10 font-[Gotham] text-xl text-center">Lini Masa Acara</p>
      <div className="flex flex-col gap-6">
        {Object.keys(rundown).length === 0 && (
          <p className="text-center">
            Ikuti acara Technocorner untuk melihat lini masa
          </p>
        )}
        {rundown &&
          Object.keys(rundown).map((tanggal, index) => (
            <div className="flex flex-col gap-2" key={index}>
              <p className="text-lg">{tanggal}</p>
              {rundown[tanggal].map(
                (
                  r: { waktu: string; label: string; isi: string },
                  index: number
                ) => (
                  <div className="flex items-center" key={index}>
                    <div className="flex-none w-[5rem] pr-3 flex flex-col items-end">
                      <p className="font-[Gotham] text-lg leading-5">
                        {r.waktu}
                      </p>
                      <p className="text-sm leading-4">WIB</p>
                    </div>
                    <div className="pl-3 border-l border-red-default">
                      <p className="font-[Gotham]">{r.label}</p>
                      <p>{r.isi}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

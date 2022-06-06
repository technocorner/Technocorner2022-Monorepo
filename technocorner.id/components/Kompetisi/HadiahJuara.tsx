import { dataKompetisi } from "../../data/dataKompetisi";

export default function HadiahJuara({ name }: { name: string }) {
  const prize = dataKompetisi.find((k) => k.id === name)!.champ;
  const boxCSS =
    "grid items-center bg-cstmglass shadow-lg rounded-lg py-2 text-center aspect-square";
  const textCSS =
    "mt-3 font-gothambold text-yellow-default text-2xs md:text-sm xl:text-lg 2xl:text-xl";

  return (
    <div
      data-aos="fade-up"
      className=" px-4 sm:px-12 md:px-24 lg:px-36 grid pt-12 md:pt-16 xl:pt-20 bg-cstmwhite mb-2"
    >
      <div className="font-mechano text-sm md:text-lg lg:text-2xl 2xl:text-3xl text-center pb-2 sm:pb-4 md:pb-6">
        Hadiah Juara
      </div>
      <div className="m-auto grid grid-cols-3 w-full md:w-4/5 lg:w-3/5 gap-3 sm:gap-6">
        {prize &&
          prize.map((p) => (
            <div className={boxCSS} key={p.name}>
              <img
                className="m-auto w-1/2"
                loading="lazy"
                src={p.image}
                alt={p.name}
              />
              <p className={textCSS}>{p.reward}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

const boxCSS =
  "grid items-center bg-cstmglass shadow-lg rounded-lg py-2 text-center aspect-square";
const textCSS =
  "font-gothambold text-yellow-default text-2xs md:text-sm xl:text-lg 2xl:text-xl";

function Event({
  benefit,
}: {
  benefit: Array<{ name: string; image: string }>;
}) {
  return (
    <div
      data-aos="fade-up"
      className="px-4 sm:px-12 md:px-24 lg:px-36 grid pt-12 md:pt-16 xl:pt-20 bg-cstmwhite"
    >
      <div className="font-mechano text-sm md:text-lg lg:text-2xl 2xl:text-3xl text-center pb-2 sm:pb-4 md:pb-6">
        Benefit
      </div>
      <div
        className={`m-auto grid ${
          benefit.length === 2 && "grid-cols-2 w-2/3 md:7/12 lg:w-2/5"
        } ${
          benefit.length === 3 && "grid-cols-3 w-full md:w-4/5 lg:w-3/5"
        } gap-3 sm:gap-6`}
      >
        {benefit.map((b) => (
          <div className={boxCSS} key={b.name}>
            <img
              className="mx-auto w-6/12"
              loading="lazy"
              src={b.image}
              alt={b.name}
            />
            <div className={textCSS}>{b.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { Event };

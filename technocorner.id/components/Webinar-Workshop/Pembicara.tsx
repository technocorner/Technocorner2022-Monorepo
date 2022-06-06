function Pembicara({
  pembicara,
}: {
  pembicara: Array<{
    name: string;
    photo: string;
    position: string;
    description: string;
  }>;
}) {
  return (
    <div
      data-aos="fade-up"
      className="bg-cstwhite px-4 md:px-24 lg:px-36 pt-12 md:pt-16 xl:pt-20"
    >
      <div className="flex flex-col w-full items-center justify-center">
        <p className="font-mechano text-sm md:text-lg lg:text-2xl 2xl:text-3xl text-center">
          Pembicara
        </p>
        <div className="w-4/5 flex items-center justify-center flex-col lg:flex-row gap-4 lg:gap-8 mt-10">
          {pembicara.map((p, index) => (
            <div
              className={`w-fit sm:max-w-[66%] md:max-w-[58%] lg:max-w-[40%] flex flex-col items-center p-8 rounded-3xl transform-gpu bg-gradient-to-bl ${
                index === 0 && "from-[#F893AB] to-[#EE225C]"
              } ${index === 1 && "from-[#7ED4F1] to-[#0C86A7]"} ${
                index === 2 && "from-[#7AFFF2] to-[#2E8C83]"
              }`}
              key={index}
            >
              <img
                className="max-h-[30rem] w-fit h-full"
                loading="lazy"
                src={p.photo}
              />
              {p.name.length > 0 && (
                <p className="mt-3 mb-2 font-[Gotham] text-white-light text-lg text-center">
                  {p.name}
                </p>
              )}
              {p.position.length > 0 && (
                <div className="h-16 w-full p-2 flex items-center justify-center bg-cstmwhite rounded-2xl">
                  <p className="line-clamp-2 text-center">{p.position}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export { Pembicara };

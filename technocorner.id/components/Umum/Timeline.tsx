import { dataTimeline } from "../../data/dataTimeline";

export default function Timeline(props: any) {
  const list = dataTimeline.filter((items) => items.category == props.name);

  return (
    <>
      <div
        data-aos="fade-right"
        className="overflow-x-hidden grid content-center gap-4 px-4 md:px-24 lg:px-36 pt-12 md:pt-16 xl:pt-20 bg-cstmwhite"
      >
        <div className="font-mechano text-sm md:text-lg lg:text-2xl 2xl:text-3xl text-center">
          Lini Masa
        </div>
        <div className="mx-auto w-10/12 md:w-full text-center relative flex flex-col after:content-('') after:bg-gradient-to-b after:from-cstmgreen after:to-blue-light after:absolute after:rounded-full md:after:-translate-x-1/2 md:after:inset-x-1/2 after:w-2 after:h-full">
          {list.map(
            (items, index) =>
              items.show && (
                <div
                  className="flex md:even:flex-row-reverse text-left md:px-4 md:justify-start my-1 md:w-1/2 md:self-end md:even:self-start md:even:text-right gap-2 md:gap-4"
                  key={index}
                >
                  <div className="ml-4 md:ml-0 shrink-0 w-3 md:w-5 h-px md:h-0.5 self-center bg-cstmblack"></div>
                  <div className="shrink-0  w-6 h-6 md:w-10 md:h-10 self-center bg-cstmgreen rounded-full"></div>
                  <div className="shrink-0  w-3 md:w-5 h-px md:h-0.5 self-center bg-cstmblack"></div>
                  <div>
                    <div className="font-gothammedium text-xs md:text-sm xl:text-base 2xl:text-lg">
                      {items.content}
                    </div>
                    <div className="font-gothambook text-xs md:text-sm xl:text-base 2xl:text-lg">
                      {items.date}
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
}

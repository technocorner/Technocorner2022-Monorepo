import { Sponsor } from "../../data/dataSponsor";
import { Medpart } from "../../data/dataMedpart";

function Medsponsor() {
  return (
    <div className="content-center grid gap-8 sm:gap-12 xl:gap-16 px-4 md:px-24 lg:px-36 py-10 bg-cstmwhite">
      {Sponsor.length > 0 && (
        <div
          data-aos="fade-up"
          className="text-center border border-cstmblack border-2 rounded-lg grid gap-4 p-4"
        >
          <p className="text-sm md:text-base lg:text-lg xl:text-xl font-mechano text-center">
            Sponsors
          </p>
          <div className="flex items-center justify-center gap-5 flex-wrap">
            {Sponsor.map((item) => (
              <div key={item.name}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <img
                    style={{ height: item.height }}
                    loading="lazy"
                    src={item.logo}
                    alt={item.name}
                    title={item.name}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      {Medpart.length > 0 && (
        <div
          data-aos="fade-up"
          className="text-center border border-cstmblack border-2 rounded-lg grid gap-6 sm:gap-4 p-4"
        >
          <p className="text-sm md:text-base lg:text-lg xl:text-xl font-mechano text-center">
            Media Partners
          </p>
          {/* <div className="grid grid-cols-2 sm:grid-cols-4"> */}
          <div className="flex justify-center gap-5 flex-wrap">
            {Medpart.map((item) => (
              <div key={item.name}>
                <img
                  style={{ height: item.height }}
                  loading="lazy"
                  src={item.logo}
                  alt={item.name}
                  title={item.name}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export { Medsponsor };

import Link from "next/link";
import { dataKompetisi } from "../../data/dataKompetisi";

function Event() {
  return (
    <div className="bg-gradient-to-b from-cstmdarkestgreen to-cstmblue px-4 md:px-24 lg:px-36 py-16 sm:py-24">
      <div className="lg:min-h-screen flex flex-col space-y-16 sm:space-y-32">
        <div className="my-auto h-full space-y-8 pb-5">
          <div
            data-aos="fade-right"
            className="grid row-span-4 content-center sm:gap-3 lg:gap-12 sm:grid-cols-2 text-cstmwhite"
          >
            <div className="m-auto sm:hidden">
              <img
                className="w-28 h-28 mb-4"
                loading="lazy"
                src="/images/Homepage/kompetisi.webp"
                alt="Logo Kompetisi"
              />
            </div>
            <div className="">
              <p className="text-sm md:text-base lg:text-lg font-mechano ">
                KOMPETISI
              </p>
              <div className="text-xl sm:text-2xl lg:text-3xl 2xl:text-5xl leading-snug lg:leading-normal font-gothambold">
                <p>Ikuti dan Dapatkan</p>
                <p>Berbagai Hadiah!</p>
              </div>
              <p className="text-2xs md:text-xs xl:text-base  2xl:text-lg  font-gothambook text-justify my-1 md:my-2 lg:my-3">
                Daftar ke berbagai lomba yang diselenggarakan di Technocorner
                2022. Terdapat lomba Internet of Things, Electrical Engineering,
                Transporter, dan Line Follower. Raih juara dan menang berbagai
                hadiah yang ada!
              </p>
            </div>
            <div className="hidden sm:block mx-auto">
              <img
                className="sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-48 lg:h-48"
                loading="lazy"
                src="/images/Homepage/kompetisi.webp"
                alt="Logo Kompetisi"
              />
            </div>
          </div>
          <div
            data-aos="fade-left"
            className="row-span-4 md:row-span-3 text-center"
          >
            <p className="font-gothambold text-sm md:text-base text-cstmwhite mb-2 lg:mb-4">
              Kompetisi yang diadakan
            </p>
            <div className="px-8 grid gap-2 sm:gap-6 grid-cols-2 sm:grid-cols-4 justify-items-center">
              {dataKompetisi.map((item) => (
                <a
                  className="aspect-square transform transition-transform transition-300 hover:scale-105"
                  key={item.id}
                  href={`/kompetisi/${item.name}`}
                >
                  <div className="rounded-xl grid w-full h-full bg-cstmwhite p-2 sm:p-4">
                    <div className="block m-auto w-6/12 lg:w-8/12">
                      <img
                        loading="lazy"
                        src={item.logo}
                        alt={`Logo ${item.content}`}
                      />
                    </div>
                    <div className="font-mechano text-xs sm:text-sm xl:text-base">
                      {item.title}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div
          data-aos="fade-right"
          className="grid sm:flex sm:flex-row content-center sm:gap-3 lg:gap-12 text-cstmwhite"
        >
          <div className="m-auto grid sm:hidden">
            <img
              className="w-[7rem] h-[7rem] mb-4"
              loading="lazy"
              src="/images/Homepage/workshop.webp"
              alt="Logo Workshop"
            />
          </div>
          <div className="sm:w-8/12">
            <p className="text-sm md:text-base lg:text-lg font-mechano ">
              WORKSHOP
            </p>
            <div className="text-xl sm:text-2xl lg:text-3xl 2xl:text-5xl  font-gothambold">
              <p>Pelajari dan Asah</p>
              <p>Kemampuan Robotika!</p>
            </div>
            <p className="text-2xs md:text-xs xl:text-base 2xl:text-lg text-left font-gothambook text-justify my-1 md:my-2 lg:my-3">
              Technocorner 2022 berupaya memperkenalkan serta meningkatkan
              pemahaman dan kesadaran masyarakat Indonesia mengenai pesatnya
              transformasi teknologi saat masa pemulihan setelah pandemi di
              Indonesia. Kegiatan ini diharapkan dapat memberikan wawasan dan
              menjadi pendorong semangat masyarakat dalam memajukan,
              mengembangkan, dan mengaplikasikan IPTEK sekaligus menyusun
              strategi teknologi untuk memulihkan bangsa Indonesia setelah
              pandemi, serta dapat membangun generasi penerus bangsa yang
              kreatif dan kompetitif.
            </p>
            <Link href="/workshop">
              <a className="text-2xs md:text-xs xl:text-base  2xl:text-lg  text-cstmyellow font-gothambold">
                Informasi Lebih Lanjut {">"}
              </a>
            </Link>
          </div>
          <div className="hidden sm:flex w-4/12">
            <img
              className="m-auto sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-48 lg:h-48"
              loading="lazy"
              src="/images/Homepage/workshop.webp"
              alt="Logo Workshop"
            />
          </div>
        </div>
        <div
          data-aos="fade-left"
          className="grid sm:flex sm:flex-row content-center sm:gap-3 lg:gap-12 text-cstmwhite"
        >
          <div className="m-auto grid sm:hidden">
            <img
              className="w-[7rem] h-[7rem] mb-4"
              loading="lazy"
              src="/images/Homepage/webinar.webp"
              alt="Logo Webinar"
            />
          </div>
          <div className="sm:w-8/12">
            <p className="text-sm md:text-base lg:text-lg font-mechano ">
              WEBINAR
            </p>
            <div className="text-xl sm:text-2xl lg:text-3xl 2xl:text-5xl font-gothambold">
              <p>Dapatkan Ilmu</p>
              <p>Seputar Teknologi!</p>
            </div>
            <p className="text-2xs md:text-xs xl:text-base 2xl:text-lg text-left font-gothambook text-justify my-1 md:my-2 lg:my-3">
              Technocorner mengadakan webinar berskala nasional dengan tema{" "}
              <b>
                <i>
                  &quot;Revive The Nation Through Optimizing Technology and
                  Digitalization&quot;
                </i>
              </b>
              . Tema tersebut diangkat dengan dasar kondisi pandemi Covid-19
              yang mulai mereda dan mulai membawa harapan berkurangnya batasan
              mobilitas masyarakat. Hal tersebut turut mendorong transformasi
              dan inovasi berkelanjutan di bidang teknologi agar proses adaptasi
              kali kedua ini tidak menjadi kendala dalam beraktivitas. Webinar
              Technocorner akan membahas perkembangan dan inovasi teknologi pada
              lima bidang berbeda, yaitu ekonomi, pendidikan, kesehatan,{" "}
              <i>cyber security</i>, dan <i>artificial intelligence</i>.
            </p>
            <Link href="/webinar">
              <a className="text-2xs md:text-xs xl:text-base  2xl:text-lg  text-cstmyellow font-gothambold">
                Informasi Lebih Lanjut {">"}
              </a>
            </Link>
          </div>
          <div className="hidden sm:flex w-4/12">
            <img
              className="m-auto sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-48 lg:h-48"
              loading="lazy"
              src="/images/Homepage/webinar.webp"
              alt="Logo Webinar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export { Event };

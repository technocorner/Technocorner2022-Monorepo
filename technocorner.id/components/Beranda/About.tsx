function About() {
  return (
    <div className="lg:h-screen  bg-cstmwhite">
      <div className="h-full py-24" id="about">
        <div
          data-aos="fade-up"
          className="h-full grid content-center gap-8 sm:gap-12 sm:grid-rows-1 sm:grid-cols-2 px-4 md:px-24 lg:px-36"
        >
          <div className="h-full grid content-center">
            <p className="text-sm md:text-base lg:text-lg font-mechano ">
              Mengenal Technocorner
            </p>
            <div className="text-xl sm:text-2xl lg:text-3xl 2xl:text-5xl leading-snug md:leading-normal font-gothambold">
              <p>Transformation</p>
              <span className="text-cstmgreen">Technology</span>{" "}
              <span>for Nation</span>
              <p>Recovery</p>
            </div>
            <p className="text-2xs md:text-xs xl:text-base 2xl:text-lg text-left font-gothambook my-1 md:my-6 ">
              Technocorner merupakan acara tahunan berbasis teknologi yang
              diselenggarakan oleh KMTETI Universitas Gadjah Mada. Tahun ini,
              Technocorner kembali dengan tema “Transformation Technology for
              Nation Recovery” yang bertujuan memperkenalkan pesatnya
              transformasi teknologi saat masa pemulihan setelah pandemi di
              Indonesia.
            </p>
          </div>
          <div className="xl grid content-center m-auto w-full">
            <iframe
              className="w-full aspect-video"
              src="https://link.technocorner.id/MengenalTC"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
export { About };

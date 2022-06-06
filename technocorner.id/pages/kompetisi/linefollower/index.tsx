import React, { useEffect } from "react";
import { Footer } from "../../../components/Layout";
import Logo from "../../../components/Umum/Title";
import FAQ from "../../../components/Umum/FAQ";
import ContactPerson from "../../../components/Umum/ContactPerson";
import Gallery from "../../../components/Umum/Galeri";
import Timeline from "../../../components/Umum/Timeline";
import HadiahJuara from "../../../components/Kompetisi/HadiahJuara";
import AcaraLainnya from "../../../components/Umum/AcaraLainnya";
import Aos from "aos";
import { dataAcara } from "../../../data/dataAcara";
import HtmlHead from "../../../components/HtmlHead";
import Demo from "../../../components/Kompetisi/Demo";

const Linefollower = () => {
  useEffect(() => {
    Aos.init({
      duration: 2000,
    });
  }, []);
  return (
    <>
      <HtmlHead
        title={dataAcara.find((a) => a.id === "LF")!.shortTitle}
        description={dataAcara.find((a) => a.id === "LF")!.content}
      />
      <Logo name="LF" />
      <HadiahJuara name="LF" />
      <Timeline name="LF" />
      <Demo name="LF" />
      <FAQ name="LF" />
      <Gallery name="LF" />
      <ContactPerson name="LF" />
      <AcaraLainnya name="LF" />
      <Footer />
    </>
  );
};

export default Linefollower;

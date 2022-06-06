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

const IoT = () => {
  useEffect(() => {
    Aos.init({
      duration: 2000,
    });
  }, []);
  return (
    <>
      <HtmlHead
        title={dataAcara.find((a) => a.id === "IoT")!.shortTitle}
        description={dataAcara.find((a) => a.id === "IoT")!.content}
      />
      <Logo name="IoT" />
      <HadiahJuara name="IoT" />
      <Timeline name="IoT" />
      <FAQ name="IoT" />
      <Gallery name="IoT" />
      <ContactPerson name="IoT" />
      <AcaraLainnya name="IoT" />
      <Footer />
    </>
  );
};

export default IoT;

import React, { useEffect } from "react";
import { Footer } from "../../../components/Layout";
import Logo from "../../../components/Umum/Title";
import Timeline from "../../../components/Umum/Timeline";
import TourLab from "../../../components/Umum/TourLab";
import FAQ from "../../../components/Umum/FAQ";
import ContactPerson from "../../../components/Umum/ContactPerson";
import Gallery from "../../../components/Umum/Galeri";
import HadiahJuara from "../../../components/Kompetisi/HadiahJuara";
import AcaraLainnya from "../../../components/Umum/AcaraLainnya";
import Aos from "aos";
import { dataAcara } from "../../../data/dataAcara";
import HtmlHead from "../../../components/HtmlHead";

const EEC = () => {
  useEffect(() => {
    Aos.init({
      duration: 2000,
    });
  }, []);

  return (
    <>
      <HtmlHead
        title={dataAcara.find((a) => a.id === "EEC")!.shortTitle}
        description={dataAcara.find((a) => a.id === "EEC")!.content}
      />
      <Logo name="EEC" />
      <HadiahJuara name="EEC" />
      <Timeline name="EEC" />
      <TourLab/>
      <FAQ name="EEC" />
      <Gallery name="EEC" />
      <ContactPerson name="EEC" />
      <AcaraLainnya name="EEC" />
      <Footer />
    </>
  );
};

export default EEC;

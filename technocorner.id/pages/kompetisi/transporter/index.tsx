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
import HtmlHead from "../../../components/HtmlHead";
import { dataAcara } from "../../../data/dataAcara";
import Demo from "../../../components/Kompetisi/Demo";

const Transporter = () => {
  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <>
      <HtmlHead
        title={dataAcara.find((a) => a.id === "TP")!.shortTitle}
        description={dataAcara.find((a) => a.id === "TP")!.content}
      />
      <Logo name="TP" />
      <HadiahJuara name="TP" />
      <Timeline name="TP" />
      <Demo name="TP" />
      <FAQ name="TP" />
      <Gallery name="TP" />
      <ContactPerson name="TP" />
      <AcaraLainnya name="TP" />
      <Footer />
    </>
  );
};

export default Transporter;

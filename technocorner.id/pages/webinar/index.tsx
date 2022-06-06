import HtmlHead from "../../components/HtmlHead";
import { Footer } from "../../components/Layout";
import Title from "../../components/Umum/Title";
import { Pembicara } from "../../components/Webinar-Workshop/Pembicara";
import { Event } from "../../components/Webinar-Workshop/Benefit";
import Galeri from "../../components/Umum/Galeri";
import ContactPerson from "../../components/Umum/ContactPerson";
import FAQ from "../../components/Umum/FAQ";
import Timeline from "../../components/Umum/Timeline";
import AcaraLainnya from "../../components/Umum/AcaraLainnya";
import { pembicaraWebinar } from "../../data/dataPembicara";
import { dataAcara } from "../../data/dataAcara";
import { benefitWebinar } from "../../data/dataBenefit";

const Webinar = () => {
  return (
    <>
      <HtmlHead
        title={dataAcara.find((a) => a.id === "Webinar")!.shortTitle}
        description={dataAcara.find((a) => a.id === "Webinar")!.content}
      />
      <Title name="Webinar" />
      <Event benefit={benefitWebinar} />
      <Timeline name="Webinar" />
      <Pembicara pembicara={pembicaraWebinar} />
      <FAQ name="Webinar" />
      <Galeri name="Webinar" />
      <ContactPerson name="Webinar" />
      <AcaraLainnya name="Webinar" />
      <Footer />
    </>
  );
};

export default Webinar;

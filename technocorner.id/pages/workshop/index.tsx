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
import { pembicaraWorkshop } from "../../data/dataPembicara";
import { dataAcara } from "../../data/dataAcara";
import { benefitWorkshop } from "../../data/dataBenefit";

const Workshop = () => {
  return (
    <>
      <HtmlHead
        title={dataAcara.find((a) => a.id === "Workshop")!.shortTitle}
        description={dataAcara.find((a) => a.id === "Workshop")!.content}
      />
      <Title name="Workshop" />
      <Event benefit={benefitWorkshop} />
      <Timeline name="Workshop" />
      <Pembicara pembicara={pembicaraWorkshop} />
      <FAQ name="Workshop" />
      <Galeri name="Workshop" />
      <ContactPerson name="Workshop" />
      <AcaraLainnya name="Workshop" />
      <Footer />
    </>
  );
};

export default Workshop;

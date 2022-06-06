import type { NextPage } from "next";
import { useEffect } from "react";
import HtmlHead from "../components/HtmlHead";
import { Footer } from '../components/Layout';
import { Logo } from "../components/Beranda/Logo";
import { About } from "../components/Beranda/About";
import { Event } from "../components/Beranda/Event";
import { Testimonial } from "../components/Beranda/Testimonial";
import { Medsponsor } from "../components/Beranda/Medsponsor";
import Aos from "aos";
import "aos/dist/aos.css";

const Home: NextPage = () => {
  useEffect(()=> {
    Aos.init({
      duration:2000,
    });
  },[])
  return (
    <>
      <HtmlHead
        title="Beranda"
        description="Technocorner merupakan acara tahunan berbasis teknologi yang diselenggarakan oleh KMTETI Universitas Gadjah Mada. Tahun ini, Technocorner kembali dengan tema “Transformation Technology for Nation Recovery” yang bertujuan memperkenalkan pesatnya transformasi teknologi saat masa pemulihan setelah pandemi di Indonesia."
      />
      <Logo/>      
      <About/>
      <Event/>
      <Testimonial/>
      <Medsponsor/>
      <Footer/>
    </>
  );
};

export default Home;

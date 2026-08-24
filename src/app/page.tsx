import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { Servicios, Modalidades, SobreMi, Testimonios } from "@/components/Secciones";
import Programas from "@/components/Programas";
import Preguntas from "@/components/Preguntas";
import BlogHome from "@/components/BlogHome";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import BotonWhatsApp from "@/components/BotonWhatsApp";
import AgendaProvider from "@/components/AgendaProvider";

export default function Inicio() {
  return (
    <AgendaProvider>
      <Header />
      <main id="contenido">
        <Hero />
        <Servicios />
        <Programas />
        <Modalidades />
        <SobreMi />
        <Testimonios />
        <BlogHome />
        <Preguntas />
        <Contacto />
      </main>
      <Footer />
      <BotonWhatsApp />
    </AgendaProvider>
  );
}

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import {
  Servicios, Areas, Modalidades, SobreMi, Testimonios, Cierre,
} from "@/components/Secciones";
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
        <Areas />
        <Servicios />
        <Modalidades />
        <SobreMi />
        <Testimonios />
        <BlogHome />
        <Preguntas />
        <Contacto />
        <Cierre />
      </main>
      <Footer />
      <BotonWhatsApp />
    </AgendaProvider>
  );
}

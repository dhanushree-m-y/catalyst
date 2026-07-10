import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Trusted from "@/components/Trusted";
import About from "@/components/About";
import Why from "@/components/Why";
import Founder from "@/components/Founder";
import Event from "@/components/Event";
import Upcoming from "@/components/Upcoming";
import Community from "@/components/Community";
import Sponsors from "@/components/Sponsors";
import HostEvent from "@/components/HostEvent";
import Volunteer from "@/components/Volunteer";
import Contact from "@/components/Contact";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import CursorGlow from "@/components/CursorGlow";
import ScrollUI from "@/components/ScrollUI";

export default function Home() {
  return (
    <>
      <Nav />
      <span id="top" />
      <Hero />
      <Trusted />
      <About />
      <Why />
      <Founder />
      <Event />
      <Upcoming />
      <Community />
      <Sponsors />
      <HostEvent />
      <Volunteer />
      <Contact />
      <FinalCta />
      <Footer />
      <ScrollReveal />
      <CursorGlow />
      <ScrollUI />
    </>
  );
}

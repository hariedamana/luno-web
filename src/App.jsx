import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BetweenText from "./components/BetweenText";
import Features from "./components/Features";
import LunoModes from "./components/LunoModes";
import LunoOverview from "./components/LunoOverview";
import BlueprintSection from "./components/BlueprintSection";
import Footer from "./components/Footer";

export default function App() {
  useEffect(() => {
    const sections = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -120px 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      {/* HERO — instant confidence */}
      <section data-reveal className="reveal fade-in">
        <Hero />
      </section>

      {/* OVERVIEW — depth appear */}
      <section data-reveal className="reveal depth">
        <LunoOverview />
      </section>

      {/* BETWEEN TEXT — quiet lift */}
      <section data-reveal className="reveal lift">
        <BetweenText />
      </section>

      {/* FEATURES — sectional clarity */}
      <section data-reveal className="reveal settle">
        <Features />
      </section>

      {/* MODES — precision reveal */}
      <section data-reveal className="reveal precision">
        <LunoModes />
      </section>

      {/* BLUEPRINT — engineered assemble */}
      <section data-reveal className="reveal assemble">
        <BlueprintSection />
      </section>

      {/* FOOTER — calm glass settle */}
      <section data-reveal className="reveal fade-in">
        <Footer />
      </section>
    </>
  );
}

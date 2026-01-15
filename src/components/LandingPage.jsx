import { useEffect } from "react";

import Hero from "./Hero";
import LunoOverview from "./LunoOverview";
import BetweenText from "./BetweenText";
import Features from "./Features";
import LunoModes from "./LunoModes";
import BlueprintSection from "./BlueprintSection";
import Footer from "./Footer";

export default function LandingPage() {
  useEffect(() => {
    const sections = document.querySelectorAll("[data-motion]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -15% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* HERO */}
      <section data-motion className="motion motion-soft">
        <Hero />
      </section>

      {/* OVERVIEW */}
      <section data-motion className="motion motion-depth">
        <LunoOverview />
      </section>

      {/* BETWEEN TEXT */}
      <section data-motion className="motion motion-lift">
        <BetweenText />
      </section>

      {/* FEATURES */}
      <section data-motion className="motion motion-precision">
        <Features />
      </section>

      {/* MODES */}
      <section data-motion className="motion motion-precision">
        <LunoModes />
      </section>

      {/* BLUEPRINT */}
      <section data-motion className="motion motion-assemble">
        <BlueprintSection />
      </section>

      {/* FOOTER */}
      <section data-motion className="motion motion-soft">
        <Footer />
      </section>
    </>
  );
}

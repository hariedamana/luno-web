import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import BuyLuno from "./components/BuyLuno";
import SplashScreen from "./components/SplashScreen";
import Footer from "./components/Footer";

export default function App() {
  const [activePage, setActivePage] = useState("landing");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setActivePage("landing"); // ensure landing shows
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  // ⬅️ SPLASH FIRST
  if (showSplash) {
    return <SplashScreen />;
  }

  // ⬅️ MAIN APP AFTER SPLASH
  return (
    <>
      <Navbar setActivePage={setActivePage} />

      <div className={`page-container ${activePage}`}>
        {/* LANDING PAGE */}
        <section className="page landing">
          <LandingPage />
        </section>

        {/* HOME */}
        <section className="page home">
          <h1>Home Dashboard</h1>
        </section>

        {/* MODES */}
        <section className="page modes">
          <h1>Modes</h1>
        </section>

        {/* SESSIONS */}
        <section className="page sessions">
          <h1>Sessions</h1>
        </section>

        {/* DEVICE */}
        <section className="page device">
          <h1>Device</h1>
        </section>

        {/* BUY */}
        <section className="page buy">
          <BuyLuno />
        </section>
      </div>

      <Footer />
    </>
  );
}

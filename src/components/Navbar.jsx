import { useEffect, useState } from "react";
import lunoLogo from "../assets/luno-logo.png";

export default function Navbar({ setActivePage }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar-inner">
        {/* LEFT */}
        <div className="nav-left">
          <div
            className="logo"
            onClick={() => setActivePage("landing")}
            style={{ cursor: "pointer" }}
          >
            <img
              src={lunoLogo}
              alt="Luno"
              className="logo-image"
            />
            <span className="logo-text">Luno</span>
          </div>
        </div>

        {/* CENTER */}
        <ul className="nav-links">
          <li onClick={() => setActivePage("home")}>Home</li>
          <li onClick={() => setActivePage("modes")}>Modes</li>
          <li onClick={() => setActivePage("sessions")}>Sessions</li>
          <li onClick={() => setActivePage("device")}>Device</li>
          <li onClick={() => setActivePage("buy")}>Buy Luno</li>
        </ul>

        {/* RIGHT */}
        <div className="nav-right">
          <span className="login">Log in</span>
          <button className="download">Download</button>
        </div>
      </div>
    </nav>
  );
}

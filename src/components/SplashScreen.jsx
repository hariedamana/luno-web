    import "./SplashScreen.css";
import lunoLogo from "../assets/luno-logo.png";

export default function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <img
          src={lunoLogo}
          alt="Luno"
          className="splash-logo"
        />
        <p className="splash-title">LUNO</p>
      </div>
    </div>
  );
}

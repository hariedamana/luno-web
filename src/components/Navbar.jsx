import lunoLogo from "../assets/luno-logo.png";

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        {/* LEFT */}
        <div className="nav-left">
          <div className="logo">
            <img
              src={lunoLogo}
              alt="LUNO"
              className="logo-img"
            />
          </div>

          <a className="nav-link">Home</a>
          <a className="nav-link">Sessions</a>
          <a className="nav-link">Modes</a>
          <a className="nav-link">Device</a>
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          <button className="btn signin">Sign in</button>
          <button className="btn signup">Sign up for free</button>
        </div>
      </div>
    </nav>
  );
}

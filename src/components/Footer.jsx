export default function Footer() {
  return (
    <footer className="luno-footer">
      <div className="footer-glass">
        <div className="footer-inner">

          <div className="footer-grid">

            {/* BRAND */}
            <div className="footer-col">
              <h4>LUNO</h4>
              <p className="footer-desc">
                Private, on-device intelligence designed to understand
                conversations without compromising trust.
              </p>
            </div>

            {/* PRODUCT */}
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li>Modes</li>
                <li>Sessions</li>
                <li>Device</li>
                <li>Buy Luno</li>
              </ul>
            </div>

            {/* TECHNOLOGY */}
            <div className="footer-col">
              <h4>Technology</h4>
              <ul>
                <li>On-device AI</li>
                <li>Privacy Architecture</li>
                <li>Offline Processing</li>
                <li>Security Model</li>
              </ul>
            </div>

            {/* COMPANY */}
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>

          </div>

          {/* BOTTOM */}
          <div className="footer-bottom">
            <span>© 2026 LUNO</span>
            <span>Built for privacy-first intelligence</span>
          </div>

        </div>
      </div>
    </footer>
  );
}

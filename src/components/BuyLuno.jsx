import "./BuyLuno.css";
import deviceImg from "../assets/device.png";
import lunoLogo from "../assets/luno-logo.png";

import piImg from "../assets/pi.png";
import respeakerImg from "../assets/respeaker.png";
import sdImg from "../assets/sdcard.png";
import powerImg from "../assets/powerbank.png";

import Footer from "./Footer"; // ✅ ADD FOOTER IMPORT

export default function BuyLuno() {
  const hardwareItems = [
    {
      name: "Raspberry Pi Zero 2 W",
      image: piImg,
    },
    {
      name: "ReSpeaker 2-Mic Pi HAT",
      image: respeakerImg,
    },
    {
      name: "microSD Card (32 GB)",
      image: sdImg,
    },
    {
      name: "External Power Bank (5V ≥ 2A)",
      image: powerImg,
    },
  ];

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="buy-luno-hero">
        <div className="hero-inner">
          <div className="luno-text">
            <span>L</span>
            <span className="cut">U</span>
            <span>N</span>
            <span className="cut">O</span>
          </div>

          <img
            src={deviceImg}
            alt="Luno Voice Device"
            className="device-image"
          />

          <div className="subtitle">
            EDGE-AI VOICE CAPTURE DEVICE
          </div>
        </div>
      </section>

      {/* ================= FEATURE BANNER ================= */}
      <section className="feature-banner">
        <div className="feature-banner-inner">
          <div className="feature-left">
            <span className="feature-eyebrow">BUILT FOR</span>
            <h2 className="feature-title">
              INSTANT<br />CAPTURE
            </h2>
          </div>

          <div className="feature-logo">
            <img src={lunoLogo} alt="Luno Logo" />
          </div>

          <div className="feature-right">
            ZERO-LATENCY EDGE PROCESSING
          </div>
        </div>
      </section>

      {/* ================= PRODUCT SECTION ================= */}
      <section className="product-section">
        <div className="product-container">
          <div className="product-side-heading">
            MEET&nbsp;LUNO
          </div>

          <div className="product-card">
            <div className="product-image-wrap">
              <img
                src={deviceImg}
                alt="Luno Device"
                className="product-image"
              />
            </div>

            <div className="product-details">
              <h3 className="product-title">LUNO VOICE DEVICE</h3>

              <p className="product-description">
                Core edition of the Luno Edge-AI voice capture device.
                Designed for meetings, classrooms, and interviews with
                offline processing and privacy-first architecture.
              </p>

              <ul className="product-features">
                <li>Dual microphone array</li>
                <li>Offline speech-to-text</li>
                <li>Zero-latency edge processing</li>
                <li>Local encrypted storage</li>
              </ul>

              <div className="product-meta">
                <span className="product-price">₹2,999</span>
                <span className="product-badge">EDGE AI EDITION</span>
              </div>

              <div className="feature-icons">
                <div className="feature-icon">
                  <div className="icon-circle">🎙️</div>
                  <span>DUAL MIC</span>
                </div>
                <div className="feature-icon">
                  <div className="icon-circle">⚡</div>
                  <span>ZERO LATENCY</span>
                </div>
                <div className="feature-icon">
                  <div className="icon-circle">🧠</div>
                  <span>EDGE AI</span>
                </div>
                <div className="feature-icon">
                  <div className="icon-circle">🔒</div>
                  <span>ENCRYPTED</span>
                </div>
                <div className="feature-icon">
                  <div className="icon-circle">📡</div>
                  <span>OFFLINE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="add-to-cart-wrap">
            <button className="add-to-cart-btn">
              <span className="cart-text">ADD TO CART</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= HARDWARE SECTION ================= */}
      <section className="hardware-section">
        <h2 className="hardware-heading">Hardware</h2>

        <div className="hardware-grid">
          {hardwareItems.map((item, index) => (
            <div className="hw-card" key={index}>
              <div className="hw-card-inner">
                <div className="hw-front">
                  <img src={item.image} alt={item.name} />
                  <div className="hw-label">{item.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= REVIEW SECTION ================= */}
      <section className="review-section">
        <div className="review-header">
          <span className="review-eyebrow">CLIENT TESTIMONIALS</span>
          <h2 className="review-title">
            Testimonials that <span>Speak to Results</span>
          </h2>
        </div>

        <div className="review-grid">
          <div className="review-card">
            <div className="review-top">
              <div className="review-avatar">A</div>
              <div>
                <h4>Anand Krishnan</h4>
                <span>Research Assistant</span>
              </div>
            </div>

            <div className="review-rating">
              ★★★★★ <span>5.0</span>
            </div>

            <p className="review-text">
              Luno’s offline-first capture solved our privacy concerns instantly.
              The zero-latency performance is genuinely impressive.
            </p>
          </div>

          <div className="review-card">
            <div className="review-top">
              <div className="review-avatar">S</div>
              <div>
                <h4>Shreya Menon</h4>
                <span>Assistant Professor</span>
              </div>
            </div>

            <div className="review-rating">
              ★★★★★ <span>5.0</span>
            </div>

            <p className="review-text">
              We use Luno in classrooms for discussions and lectures.
              Offline speech capture with this level of accuracy is rare.
            </p>
          </div>

          <div className="review-card">
            <div className="review-top">
              <div className="review-avatar">R</div>
              <div>
                <h4>Rahul Nair</h4>
                <span>Startup Founder</span>
              </div>
            </div>

            <div className="review-rating">
              ★★★★★ <span>5.0</span>
            </div>

            <p className="review-text">
              Luno feels like a product from a much larger company.
              Clean design, reliable performance, and strong privacy focus.
            </p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER (END OF PAGE) ================= */}
      <Footer />
    </>
  );
}

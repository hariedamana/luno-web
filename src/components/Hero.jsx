export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-badge">
          Looking for an AI voice platform?
        </div>

        <h1 className="hero-title">
          Internal voice capture at the speed of <span>AI</span>
        </h1>

        <p className="hero-subtitle">
          Capture, transcribe, and organize conversations into structured,
          production-ready insights.
        </p>

        {/* CTA + Divider */}
        <div className="hero-cta-wrapper">
          <div className="hero-divider">
            <button className="hero-cta">
              Start for free!
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

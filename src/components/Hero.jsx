import heroVideo from "../assets/hero-bg.mp4";

export default function Hero() {
  return (
    <section className="hero">
      <video
        src={heroVideo}   // ✅ USE THE IMPORT
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="hero-diagonal-loop" />

      <div className="hero-content">
        <h1>
          Internal voice capture<br />
          at the speed of <span className="luno-accent">AI</span>
        </h1>

        <p>
          Capture, transcribe, and organize conversations into structured,
          production-ready insights.
        </p>
      </div>
    </section>
  );
  
}

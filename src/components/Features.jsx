import keyboardImage from "../assets/keyboard-features.png";

export default function Features() {
  return (
    <section className="features">
      <div className="features-inner">
        {/* LEFT TEXT */}
        <div className="features-text">
          <h2>
            It’s not about saving time.<br />
            <span>It’s about feeling like you’re never wasting it.</span>
          </h2>

          <button className="features-download">
             Download
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="features-visual">
          <img
            src={keyboardImage}
            alt="Luno keyboard features"
            draggable="false"
          />
        </div>
      </div>
    </section>
  );
}

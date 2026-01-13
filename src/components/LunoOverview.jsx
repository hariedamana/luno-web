import { useRef, useState } from "react";

export default function LunoOverview() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    videoRef.current.play();
    setPlaying(true);
  };

  return (
    <section className="luno-overview-section">
      {/* HEADER */}
      <div className="video-header centered">
        <h2>See LUNO in Action</h2>
        <p>
          A quick look at how LUNO captures conversations, understands context,
          and turns speech into structured insights.
        </p>
      </div>

      {/* VIDEO */}
      <div className="video-wrapper">
        <video
          ref={videoRef}
          src="src/assets/luno-overview.mp4"
          playsInline
          className="luno-overview-video"
        />

        {!playing && (
          <button className="video-play-btn" onClick={handlePlay}>
            ▶
          </button>
        )}
      </div>
    </section>
  );
}

import { useRef } from "react";

import lunoSyncVisual from "../assets/luno-sync-visual.png";
import lunoScholarVisual from "../assets/luno-scholar-visual.png";
import lunoProbeVisual from "../assets/luno-probe-visual.png";
import lunoReflectVisual from "../assets/luno-reflect-visual.png";
import lunoCareVisual from "../assets/luno-care-visual.png";
import lunoVerdictVisual from "../assets/luno-verdict-visual.png";
import lunoSparkVisual from "../assets/luno-spark-visual.png";

export default function LunoModes() {
  const scrollRef = useRef(null);

  return (
    <section className="raycast-section">
      {/* SECTION HEADER */}
      <div className="modes-header">
        <h2>Modes of LUNO</h2>
        <p>
          Purpose-built modes designed for every context — from meetings and
          learning to ideas, care, and decisions.
        </p>
      </div>

      {/* VIEWPORT */}
      <div className="carousel-viewport">
        {/* CARD RAIL */}
        <div className="raycast-single-wrapper" ref={scrollRef}>
          {/* LUNO Sync */}
          <div className="raycast-card sync">
            <header className="raycast-card-header">
              <div className="raycast-app">
                <div className="raycast-icon">
                  <span className="icon-dot" />
                </div>
                <span className="raycast-title">LUNO Sync</span>
              </div>
            </header>

            <p className="raycast-desc">
              Generate structured minutes, key points, decisions, and action
              items from meetings.
            </p>

            <div className="raycast-visual">
              <img src={lunoSyncVisual} alt="" className="luno-visual-image" />
            </div>
          </div>

          {/* LUNO Scholar */}
          <div className="raycast-card scholar">
            <header className="raycast-card-header">
              <div className="raycast-app">
                <div className="raycast-icon">
                  <span className="icon-dot" />
                </div>
                <span className="raycast-title">LUNO Scholar</span>
              </div>
            </header>

            <p className="raycast-desc">
              Convert lectures into organized study notes and explanations.
            </p>

            <div className="raycast-visual">
              <img src={lunoScholarVisual} alt="" className="luno-visual-image" />
            </div>
          </div>

          {/* LUNO Probe */}
          <div className="raycast-card probe">
            <header className="raycast-card-header">
              <div className="raycast-app">
                <div className="raycast-icon">
                  <span className="icon-dot" />
                </div>
                <span className="raycast-title">LUNO Probe</span>
              </div>
            </header>

            <p className="raycast-desc">
              Separate questions and answers for interviews and research
              sessions.
            </p>

            <div className="raycast-visual">
              <img src={lunoProbeVisual} alt="" className="luno-visual-image" />
            </div>
          </div>

          {/* LUNO Reflect */}
          <div className="raycast-card reflect">
            <header className="raycast-card-header">
              <div className="raycast-app">
                <div className="raycast-icon">
                  <span className="icon-dot" />
                </div>
                <span className="raycast-title">LUNO Reflect</span>
              </div>
            </header>

            <p className="raycast-desc">
              Capture personal thoughts and voice notes, summarized into clear
              reflections.
            </p>

            <div className="raycast-visual">
              <img src={lunoReflectVisual} alt="" className="luno-visual-image" />
            </div>
          </div>

          {/* LUNO Care */}
          <div className="raycast-card care">
            <header className="raycast-card-header">
              <div className="raycast-app">
                <div className="raycast-icon">
                  <span className="icon-dot" />
                </div>
                <span className="raycast-title">LUNO Care</span>
              </div>
            </header>

            <p className="raycast-desc">
              Capture doctor–patient conversations including symptoms, advice,
              and follow-ups.
            </p>

            <div className="raycast-visual">
              <img src={lunoCareVisual} alt="" className="luno-visual-image" />
            </div>
          </div>

          {/* LUNO Verdict */}
          <div className="raycast-card verdict">
            <header className="raycast-card-header">
              <div className="raycast-app">
                <div className="raycast-icon">
                  <span className="icon-dot" />
                </div>
                <span className="raycast-title">LUNO Verdict</span>
              </div>
            </header>

            <p className="raycast-desc">
              Organize legal discussions into arguments, references, and final
              outcomes.
            </p>

            <div className="raycast-visual">
              <img src={lunoVerdictVisual} alt="" className="luno-visual-image" />
            </div>
          </div>

          {/* LUNO Spark */}
          <div className="raycast-card spark">
            <header className="raycast-card-header">
              <div className="raycast-app">
                <div className="raycast-icon">
                  <span className="icon-dot" />
                </div>
                <span className="raycast-title">LUNO Spark</span>
              </div>
            </header>

            <p className="raycast-desc">
              Capture brainstorming sessions and turn ideas into actionable
              insights.
            </p>

            <div className="raycast-visual">
              <img src={lunoSparkVisual} alt="" className="luno-visual-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

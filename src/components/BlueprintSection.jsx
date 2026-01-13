import BlueprintFlow from "./BlueprintFlow";
import SignalIsolation from "./SignalIsolation";
import ContextModelingFlow from "./ContextModelingFlow";
import KnowledgeStructuringFlow from "./KnowledgeStructuringFlow";
import PrivacyBoundaryFlow from "./PrivacyBoundaryFlow";
import ActionableOutputFlow from "./ActionableOutputFlow";

export default function ArchitectureSection() {
  return (
    <section className="architecture-section">
      <div className="architecture-container">

        {/* SECTION HEADING */}
        <div className="architecture-header">
          <h2>Under the Hood</h2>
          <p>The internal systems that enable real-time, private intelligence.</p>
        </div>

        {/* STEP 1 — AUDIO INGESTION */}
        <div className="arch-row">
          <div className="arch-text">
            <h3>Audio Ingestion</h3>
            <p>
              LUNO continuously captures raw audio streams directly on the device.
              No recordings are uploaded, stored externally, or transmitted over
              the network.
            </p>
            <p>
              This ensures privacy-first operation while enabling real-time
              processing of conversations as they happen.
            </p>
          </div>
          <div className="arch-visual">
            <BlueprintFlow />
          </div>
        </div>

        {/* STEP 2 — SIGNAL ISOLATION */}
        <div className="arch-row reverse">
          <div className="arch-text">
            <h3>Signal Isolation</h3>
            <p>
              Speech patterns are separated from background noise and irrelevant
              signals using frequency-aware filtering before analysis.
            </p>
            <p>
              Only clean, human speech signals are allowed to pass through to
              the next processing stage.
            </p>
          </div>
          <div className="arch-visual">
            <SignalIsolation />
          </div>
        </div>

        {/* STEP 3 — CONTEXT MODELING */}
        <div className="arch-row">
          <div className="arch-text">
            <h3>Context Modeling</h3>
            <p>
              LUNO builds a real-time understanding of conversations by identifying
              speakers, intent, relationships, and conversational structure —
              not just individual words.
            </p>
            <p>
              Meaning emerges from how conversational signals connect and evolve
              over time.
            </p>
          </div>
          <div className="arch-visual">
            <ContextModelingFlow />
          </div>
        </div>

        {/* STEP 4 — KNOWLEDGE STRUCTURING */}
        <div className="arch-row reverse">
          <div className="arch-text">
            <h3>Knowledge Structuring</h3>
            <p>
              Interpreted conversations are condensed into structured knowledge
              layers — summaries, action items, references, and decisions —
              forming a stable, reusable understanding.
            </p>
          </div>
          <div className="arch-visual">
            <KnowledgeStructuringFlow />
          </div>
        </div>

        {/* STEP 5 — COORDINATED INTELLIGENCE FABRIC */}
        <div className="arch-row">
          <div className="arch-text">
            <h3>A Coordinated Intelligence Fabric</h3>
            <p>
              LUNO processes information through synchronized internal systems —
              not sequential pipelines.
            </p>
            <p>
              Multiple internal modules activate, idle, and coordinate in parallel,
              allowing meaning to emerge through structure and timing rather than
              fragile step-by-step flows.
            </p>
          </div>
          <div className="arch-visual">
            <PrivacyBoundaryFlow />
          </div>
        </div>

        {/* STEP 6 — ACTIONABLE OUTPUT */}
        <div className="arch-row reverse">
          <div className="arch-text">
            <h3>On-Device Hardware Stack</h3>
            <p>
              A vertically integrated hardware architecture where capture, compute, and intelligence
are physically isolated yet precisely aligned — optimized for private, real-time inference.

            </p>
          </div>
          <div className="arch-visual">
            <ActionableOutputFlow />
          </div>
        </div>

      </div>
    </section>
  );
}

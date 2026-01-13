export default function SignalIsolation() {
  return (
    <svg
      viewBox="0 0 600 360"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className="blueprint-svg"
    >
      {/* INCOMING FREQUENCY BANDS */}
      <path d="M40 110 L240 110" stroke="rgba(150,150,150,0.35)" strokeWidth="1.2" strokeDasharray="5 6" />
      <path d="M40 150 L240 150" stroke="rgba(140,200,255,0.85)" strokeWidth="1.5" />
      <path d="M40 210 L240 210" stroke="rgba(150,150,150,0.35)" strokeWidth="1.2" strokeDasharray="5 6" />

      {/* ISOLATION GATE */}
      <rect x="260" y="120" width="80" height="120" rx="12" stroke="rgba(180,160,255,0.9)" strokeWidth="1.5" />
      <line x1="260" y1="180" x2="340" y2="180" stroke="rgba(180,160,255,0.6)" strokeWidth="1" />

      {/* BLOCKED FREQUENCIES */}
      <path d="M300 120 L300 60" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 6" />
      <path d="M300 240 L300 300" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 6" />

      {/* CLEAN OUTPUT */}
      <path d="M360 180 L560 180" stroke="rgba(120,220,180,0.9)" strokeWidth="1.6" strokeLinecap="round" />

      {/* CORE */}
      <circle cx="300" cy="180" r="5" fill="rgba(180,160,255,0.9)" />
    </svg>
  );
}

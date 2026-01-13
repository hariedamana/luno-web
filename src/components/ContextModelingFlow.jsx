export default function ContextModelingFlow() {
  return (
    <svg
      viewBox="0 0 600 360"
      className="blueprint-svg context-modeling"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* AXIS GUIDES */}
      <line
        x1="300"
        y1="60"
        x2="300"
        y2="300"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
        strokeDasharray="4 6"
      />
      <line
        x1="120"
        y1="180"
        x2="480"
        y2="180"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
        strokeDasharray="4 6"
      />

      {/* CENTRAL HUB */}
      <circle
        cx="300"
        cy="180"
        r="36"
        stroke="rgba(180,160,255,0.9)"
        strokeWidth="1.5"
      >
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        cx="300"
        cy="180"
        r="18"
        stroke="rgba(180,160,255,0.5)"
        strokeWidth="1"
      >
        <animate
          attributeName="opacity"
          values="0.3;0.8;0.3"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        cx="300"
        cy="180"
        r="4"
        fill="rgba(180,160,255,0.9)"
      >
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="2.2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* MODULE FACTORY */}
      {[
        // TOP
        { x: 270, y: 40, c: "rgba(120,200,255,0.9)", d: "3.2s" },
        { x: 200, y: 70, c: "rgba(120,200,255,0.6)", d: "3.8s" },
        { x: 340, y: 70, c: "rgba(120,200,255,0.6)", d: "4.1s" },

        // BOTTOM
        { x: 270, y: 288, c: "rgba(120,220,180,0.9)", d: "3.4s" },
        { x: 200, y: 258, c: "rgba(120,220,180,0.6)", d: "4s" },
        { x: 340, y: 258, c: "rgba(120,220,180,0.6)", d: "4.3s" },

        // LEFT
        { x: 60, y: 164, c: "rgba(160,160,255,0.8)", d: "3.6s" },
        { x: 90, y: 120, c: "rgba(160,160,255,0.6)", d: "4.2s" },
        { x: 90, y: 208, c: "rgba(160,160,255,0.6)", d: "4.6s" },

        // RIGHT
        { x: 480, y: 164, c: "rgba(255,180,120,0.8)", d: "3.7s" },
        { x: 450, y: 120, c: "rgba(255,180,120,0.6)", d: "4.4s" },
        { x: 450, y: 208, c: "rgba(255,180,120,0.6)", d: "4.8s" },
      ].map((m, i) => (
        <rect
          key={i}
          x={m.x}
          y={m.y}
          width="60"
          height="32"
          rx="8"
          stroke={m.c}
          strokeWidth="1.2"
        >
          <animate
            attributeName="opacity"
            values="0.35;1;0.35"
            dur={m.d}
            repeatCount="indefinite"
          />
        </rect>
      ))}
    </svg>
  );
}

export default function KnowledgeStructuringFlow() {
  return (
    <svg
      viewBox="0 0 600 360"
      className="blueprint-svg knowledge-structuring"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* CENTRAL ALIGNMENT SPINE */}
      <line
        x1="300"
        y1="40"
        x2="300"
        y2="320"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1"
        strokeDasharray="4 6"
      />

      {/* STACKED KNOWLEDGE LAYERS */}
      {[
        { y: 80,  w: 260, o: "0.9", d: "4.8s" },
        { y: 120, w: 300, o: "0.75", d: "4.2s" },
        { y: 160, w: 340, o: "0.6", d: "3.8s" },
        { y: 200, w: 300, o: "0.75", d: "4.4s" },
        { y: 240, w: 260, o: "0.9", d: "5s" },
      ].map((layer, i) => (
        <rect
          key={i}
          x={300 - layer.w / 2}
          y={layer.y}
          width={layer.w}
          height="22"
          rx="6"
          stroke={`rgba(180,200,255,${layer.o})`}
          strokeWidth="1.2"
        >
          <animate
            attributeName="opacity"
            values="0.35;1;0.35"
            dur={layer.d}
            repeatCount="indefinite"
          />
        </rect>
      ))}

      {/* CORE KNOWLEDGE LOCK */}
      <rect
        x="250"
        y="150"
        width="100"
        height="60"
        rx="10"
        stroke="rgba(200,180,255,0.9)"
        strokeWidth="1.4"
      >
        <animate
          attributeName="opacity"
          values="0.5;1;0.5"
          dur="3.6s"
          repeatCount="indefinite"
        />
      </rect>

      {/* INNER CORE */}
      <rect
        x="270"
        y="170"
        width="60"
        height="20"
        rx="6"
        stroke="rgba(200,180,255,0.6)"
        strokeWidth="1"
      >
        <animate
          attributeName="opacity"
          values="0.4;0.9;0.4"
          dur="2.6s"
          repeatCount="indefinite"
        />
      </rect>

      {/* SIDE STRUCTURE GUIDES */}
      <line
        x1="170"
        y1="60"
        x2="170"
        y2="300"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      <line
        x1="430"
        y1="60"
        x2="430"
        y2="300"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
    </svg>
  );
}

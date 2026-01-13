export default function BlueprintFlow() {
  return (
    <svg
      viewBox="0 0 600 360"
      className="blueprint-svg"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >

      {/* INPUT SIGNALS */}
      <path className="flow in a"
        d="M40 140 C120 120, 140 180, 240 170" />
      <path className="flow in b"
        d="M40 180 C120 180, 140 180, 240 180" />
      <path className="flow in c"
        d="M40 220 C120 240, 140 180, 240 190" />

      {/* CORE */}
      <circle className="core outer" cx="300" cy="180" r="44" />
      <circle className="core inner" cx="300" cy="180" r="20" />
      <circle className="core center" cx="300" cy="180" r="4" />

      {/* OUTPUT SIGNALS */}
      <path className="flow out a"
        d="M360 170 C420 160, 460 120, 560 120" />
      <path className="flow out b"
        d="M360 180 C420 180, 460 180, 560 180" />
      <path className="flow out c"
        d="M360 190 C420 200, 460 240, 560 240" />

    </svg>
  );
}

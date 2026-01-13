export default function PrivacyBoundaryFlow() {
  return (
    <svg
  viewBox="0 0 600 360"
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
>

  <g stroke="rgba(255,255,255,0.08)" stroke-width="1">
    <line x1="100" y1="60" x2="500" y2="60" />
    <line x1="100" y1="120" x2="500" y2="120" />
    <line x1="100" y1="180" x2="500" y2="180" />
    <line x1="100" y1="240" x2="500" y2="240" />
    <line x1="100" y1="300" x2="500" y2="300" />

    <line x1="140" y1="40" x2="140" y2="320" />
    <line x1="220" y1="40" x2="220" y2="320" />
    <line x1="300" y1="40" x2="300" y2="320" />
    <line x1="380" y1="40" x2="380" y2="320" />
    <line x1="460" y1="40" x2="460" y2="320" />
  </g>

  <rect x="130" y="90" width="20" height="20" rx="4" stroke="rgba(200,200,200,0.45)" stroke-width="1">
    <animate attributeName="opacity" values="0.2;1;0.2" dur="4s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="scale"
      values="1;1.02;1" dur="4s" repeatCount="indefinite"
      additive="sum" />
  </rect>

  <rect x="210" y="90" width="20" height="20" rx="4" stroke="rgba(200,200,200,0.45)" stroke-width="1">
    <animate attributeName="opacity" values="0.2;1;0.2" dur="4s" begin="0.4s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="scale"
      values="1;1.02;1" dur="4s" begin="0.4s" repeatCount="indefinite"
      additive="sum" />
  </rect>

  <rect x="290" y="90" width="20" height="20" rx="4" stroke="rgba(200,200,200,0.45)" stroke-width="1">
    <animate attributeName="opacity" values="0.2;1;0.2" dur="4s" begin="0.8s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="scale"
      values="1;1.02;1" dur="4s" begin="0.8s" repeatCount="indefinite"
      additive="sum" />
  </rect>

  <rect x="370" y="90" width="20" height="20" rx="4" stroke="rgba(200,200,200,0.45)" stroke-width="1">
    <animate attributeName="opacity" values="0.2;1;0.2" dur="4s" begin="1.2s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="scale"
      values="1;1.02;1" dur="4s" begin="1.2s" repeatCount="indefinite"
      additive="sum" />
  </rect>

  <rect x="450" y="90" width="20" height="20" rx="4" stroke="rgba(200,200,200,0.45)" stroke-width="1">
    <animate attributeName="opacity" values="0.2;1;0.2" dur="4s" begin="1.6s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="scale"
      values="1;1.02;1" dur="4s" begin="1.6s" repeatCount="indefinite"
      additive="sum" />
  </rect>

  <rect x="130" y="150" width="20" height="20" rx="4" stroke="rgba(140,200,255,0.9)" stroke-width="1">
    <animate attributeName="opacity" values="1;0.2;1" dur="4s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="scale"
      values="1.02;1;1.02" dur="4s" repeatCount="indefinite"
      additive="sum" />
  </rect>

  <rect x="210" y="150" width="20" height="20" rx="4" stroke="rgba(140,200,255,0.9)" stroke-width="1">
    <animate attributeName="opacity" values="1;0.2;1" dur="4s" begin="0.4s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="scale"
      values="1.02;1;1.02" dur="4s" begin="0.4s" repeatCount="indefinite"
      additive="sum" />
  </rect>

  <rect x="290" y="150" width="20" height="20" rx="4" stroke="rgba(140,200,255,0.9)" stroke-width="1">
    <animate attributeName="opacity" values="1;0.2;1" dur="4s" begin="0.8s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="scale"
      values="1.02;1;1.02" dur="4s" begin="0.8s" repeatCount="indefinite"
      additive="sum" />
  </rect>

  <rect x="370" y="150" width="20" height="20" rx="4" stroke="rgba(140,200,255,0.9)" stroke-width="1">
    <animate attributeName="opacity" values="1;0.2;1" dur="4s" begin="1.2s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="scale"
      values="1.02;1;1.02" dur="4s" begin="1.2s" repeatCount="indefinite"
      additive="sum" />
  </rect>

  <rect x="450" y="150" width="20" height="20" rx="4" stroke="rgba(140,200,255,0.9)" stroke-width="1">
    <animate attributeName="opacity" values="1;0.2;1" dur="4s" begin="1.6s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="scale"
      values="1.02;1;1.02" dur="4s" begin="1.6s" repeatCount="indefinite"
      additive="sum" />
  </rect>


  <rect x="0" y="0" width="600" height="360" fill="rgba(0,0,0,0)">
    <animate attributeName="opacity" values="1;0.6;1" dur="12s" repeatCount="indefinite"/>
  </rect>

</svg>
    );  
}
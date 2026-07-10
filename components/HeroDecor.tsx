/** Decorative hero background — stylised potted plants, a flower pot and soft sunlight. */
export default function HeroDecor() {
  return (
    <div className="hero-decor" aria-hidden="true">
      <span className="hero-beam" />
      <LeafyPlant className="hero-plant hp-left" />
      <BroadPlant className="hero-plant hp-right" />
      <FlowerPot className="hero-plant hp-pot" />
    </div>
  );
}

function LeafyPlant({ className }: { className?: string }) {
  const angles = [-46, -33, -20, -7, 7, 20, 33, 46];
  return (
    <svg className={className} viewBox="0 0 150 220" fill="none" aria-hidden="true">
      {angles.map((a, i) => (
        <ellipse
          key={a}
          cx="75"
          cy="92"
          rx="9"
          ry="66"
          transform={`rotate(${a} 75 168)`}
          fill={i % 2 ? "#a9cf9f" : "#8bbd85"}
        />
      ))}
      <path d="M50,164 H100 L92,216 H58 Z" fill="#f0dac7" />
      <rect x="46" y="158" width="58" height="13" rx="4" fill="#e6cbb5" />
    </svg>
  );
}

function BroadPlant({ className }: { className?: string }) {
  const leaves = [
    { a: -40, rx: 24, ry: 46, c: "#7fb079" },
    { a: -18, rx: 26, ry: 54, c: "#93c489" },
    { a: 0, rx: 22, ry: 60, c: "#7fb079" },
    { a: 20, rx: 26, ry: 52, c: "#9fce95" },
    { a: 42, rx: 23, ry: 44, c: "#7fb079" },
  ];
  return (
    <svg className={className} viewBox="0 0 200 230" fill="none" aria-hidden="true">
      {leaves.map((l) => (
        <ellipse key={l.a} cx="100" cy="100" rx={l.rx} ry={l.ry} transform={`rotate(${l.a} 100 178)`} fill={l.c} />
      ))}
      <path d="M68,172 H132 L122,225 H78 Z" fill="#efd8c4" />
      <rect x="63" y="166" width="74" height="14" rx="4" fill="#e4c9b3" />
    </svg>
  );
}

function FlowerPot({ className }: { className?: string }) {
  const petals = [0, 72, 144, 216, 288];
  const flower = (cx: number, cy: number, s: number, fill: string) => (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      {petals.map((p) => (
        <ellipse key={p} cx="0" cy="-9" rx="5" ry="8" transform={`rotate(${p})`} fill={fill} />
      ))}
      <circle cx="0" cy="0" r="4" fill="#ffd54a" />
    </g>
  );
  return (
    <svg className={className} viewBox="0 0 110 140" fill="none" aria-hidden="true">
      {/* stems */}
      <path d="M55,120 C50,90 40,80 42,58" stroke="#8bbd85" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M55,120 C58,92 70,84 70,64" stroke="#8bbd85" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M55,120 C55,96 55,84 55,52" stroke="#8bbd85" strokeWidth="3" fill="none" strokeLinecap="round" />
      {flower(42, 56, 1.1, "#ffffff")}
      {flower(70, 62, 1.0, "#f6a8c6")}
      {flower(55, 50, 1.25, "#ef7fae")}
      {/* pink pot */}
      <path d="M34,112 H76 L70,138 H40 Z" fill="#f2b0cd" />
      <rect x="31" y="106" width="48" height="11" rx="4" fill="#ec98bd" />
    </svg>
  );
}

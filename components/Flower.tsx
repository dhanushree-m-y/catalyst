/** Decorative pink flower accent. Positioned via the passed className. */
export default function Flower({ className = "" }: { className?: string }) {
  return (
    <svg className={`flower ${className}`.trim()} viewBox="0 0 100 100" aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="50" cy="27" rx="15" ry="22" transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="12" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}

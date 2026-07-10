import Flower from "./Flower";

/** Animated decorative layer behind the auth card — floating flowers + twinkling sparkles. */
export default function AuthDecor() {
  const flowers = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9"];
  const sparks = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13", "s14"];
  return (
    <div className="auth-decor" aria-hidden="true">
      {flowers.map((f) => (
        <Flower key={f} className={`auth-flr ${f}`} />
      ))}
      {sparks.map((s) => (
        <span key={s} className={`auth-spark ${s}`}>
          ✦
        </span>
      ))}
    </div>
  );
}

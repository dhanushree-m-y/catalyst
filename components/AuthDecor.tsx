import Flower from "./Flower";

/** Animated decorative layer behind the auth card — floating flowers + twinkling sparkles. */
export default function AuthDecor() {
  const sparks = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
  return (
    <div className="auth-decor" aria-hidden="true">
      <Flower className="auth-flr f1" />
      <Flower className="auth-flr f2" />
      <Flower className="auth-flr f3" />
      <Flower className="auth-flr f4" />
      <Flower className="auth-flr f5" />
      {sparks.map((s) => (
        <span key={s} className={`auth-spark ${s}`}>
          ✦
        </span>
      ))}
    </div>
  );
}

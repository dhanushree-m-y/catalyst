const groups = [
  "Students & undergraduates",
  "Graduates & postgraduates",
  "Career-switchers & self-taught",
];

export default function HackWho() {
  return (
    <section id="who" className="hack-who">
      <div className="wrap">
        <div className="head-block center reveal">
          <div className="eyebrow center">Eligibility</div>
          <h2 className="h2">Who can participate?</h2>
        </div>
        <div className="who-grid reveal d1">
          {groups.map((g) => (
            <div key={g} className="who-card">
              {g}
            </div>
          ))}
        </div>
        <p className="who-note">
          Open to women across every field — beginners are especially welcome.
          No prior experience required.
        </p>
      </div>
    </section>
  );
}

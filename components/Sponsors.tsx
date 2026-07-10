const TIERS = [
  {
    key: "title",
    name: "Title",
    tag: "Headline partner",
    feat: true,
    perks: [
      "Naming rights — “powered by you”",
      "Largest logo everywhere",
      "Keynote slot + exhibition booth",
      "First access to participant resumes",
    ],
  },
  {
    key: "gold",
    name: "Gold",
    tag: "Major partner",
    perks: [
      "Prominent logo on tees & website",
      "Booth + workshop / mentor slot",
      "Access to participant resumes",
    ],
  },
  {
    key: "silver",
    name: "Silver",
    tag: "Supporting partner",
    perks: [
      "Logo on event materials & site",
      "Social media shoutout",
      "Swag in participant kits",
    ],
  },
  {
    key: "inkind",
    name: "In-kind",
    tag: "Food · venue · swag",
    perks: [
      "Provide prizes, food, venue or swag",
      "Recognition matched to your support",
    ],
  },
];

export default function Sponsors() {
  return (
    <section className="sponsors" id="sponsors">
      <div className="wrap">
        <div className="head-block center reveal">
          <div className="eyebrow center">Sponsor us</div>
          <h2 className="h2">Partners who believe in her.</h2>
          <p className="lead" style={{ margin: "16px auto 0", maxWidth: "52ch" }}>
            Back Git With Her — from prize pools and meals to venue and swag — and put your
            brand in front of the next generation of women who build. Pick a level below.
          </p>
        </div>

        <div className="sp-tiers reveal d1">
          {TIERS.map((t) => (
            <div key={t.key} className={`sp-tier${t.feat ? " feat" : ""}`}>
              {t.feat && <span className="sp-badge">Most visible</span>}
              <div className="sp-name">{t.name}</div>
              <div className="sp-price">{t.tag}</div>
              <ul className="sp-perks">
                {t.perks.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <a
                href={`/sponsor?tier=${t.key}`}
                className={`btn ${t.feat ? "btn-primary" : "btn-dark"}`}
              >
                {t.key === "inkind" ? "Support in-kind" : `Sponsor as ${t.name}`}{" "}
                <span className="arw">→</span>
              </a>
            </div>
          ))}
        </div>

        <p className="note">
          Not sure which fits? <a href="/sponsor">Talk to us →</a>
        </p>
      </div>
    </section>
  );
}

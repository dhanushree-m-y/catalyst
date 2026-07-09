const events = [
  {
    date: "23 Aug 2026",
    tag: "Flagship",
    title: "Git With Her — Hackathon",
    type: "Hackathon · 8 hours",
    desc: "Our flagship all-women build day. Beginners and builders across every field welcome.",
    cta: "View hackathon →",
    href: "/git-with-her",
  },
  {
    date: "Monthly",
    tag: "Workshop",
    title: "Build Nights",
    type: "Hands-on · 2 hours",
    desc: "Short, practical sessions — from your first line of code to your first PCB or CAD model.",
    cta: "Get notified →",
    href: "#contact",
  },
  {
    date: "Season 1",
    tag: "Talks",
    title: "Speaker Sessions",
    type: "Panel · Evening",
    desc: "Honest talks from women who've built careers and companies across engineering and beyond.",
    cta: "See lineup →",
    href: "#speakers",
  },
];

export default function Upcoming() {
  return (
    <section id="upcoming">
      <div className="wrap">
        <div className="head-block reveal">
          <div className="eyebrow">What&apos;s next</div>
          <h2 className="h2">Upcoming events &amp; meetups.</h2>
        </div>
        <div className="upcoming-list">
          {events.map((e, i) => (
            <a
              key={e.title}
              href={e.href}
              className={`up-card reveal${i === 1 ? " d1" : i === 2 ? " d2" : ""}`}
            >
              <span className="up-tag">{e.tag}</span>
              <span className="up-date">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="17" rx="3" />
                  <path d="M3 9h18M8 2v4M16 2v4" />
                </svg>
                {e.date}
              </span>
              <h3>{e.title}</h3>
              <div className="up-type">{e.type}</div>
              <p>{e.desc}</p>
              <span className="up-cta">{e.cta}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

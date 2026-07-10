const roles = [
  {
    title: "Host / emcee",
    desc: "Keep the energy up and the day flowing on stage.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a5 5 0 00-3 9v3h6v-3a5 5 0 00-3-9zM9 18h6M10 21h4" />
      </svg>
    ),
  },
  {
    title: "Photography & video",
    desc: "Capture the moments — reels, recap and highlights.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="7" width="14" height="12" rx="2" />
        <path d="M17 11l4-2v6l-4-2z" />
        <circle cx="10" cy="13" r="2.4" />
      </svg>
    ),
  },
  {
    title: "Event management",
    desc: "Logistics, schedule and making the day run smoothly.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 9h16M9 4v16M13 13l2 2 3-3" />
      </svg>
    ),
  },
  {
    title: "Mentors & judges",
    desc: "Guide teams through the build and judge the demos.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l2.4 6.5L21 11l-6.6 2.5L12 20l-2.4-6.5L3 11l6.6-2.5z" />
      </svg>
    ),
  },
  {
    title: "Social & design",
    desc: "Posters, posts and coverage before and during.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="2.6" />
        <circle cx="6" cy="12" r="2.6" />
        <circle cx="18" cy="19" r="2.6" />
        <path d="M8.3 10.7l7.4-4.2M8.3 13.3l7.4 4.2" />
      </svg>
    ),
  },
  {
    title: "Registration & hospitality",
    desc: "Welcome desk, badges and looking after everyone.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 3v4h8V3M9 12h6M9 16h4" />
      </svg>
    ),
  },
];

export default function Volunteer() {
  return (
    <section className="volunteer" id="volunteer">
      <div className="wrap">
        <div className="head-block center reveal">
          <div className="eyebrow center">Join the crew</div>
          <h2 className="h2">Volunteer with us.</h2>
        </div>
        <p className="volunteer-lead reveal d1">
          Git With Her runs on people who care. Lend a few hours and help make the
          day happen — pick the role that fits you.
        </p>
        <div className="cards reveal d1">
          {roles.map((r, i) => (
            <div key={r.title} className={`hcard reveal${i % 3 === 1 ? " d1" : i % 3 === 2 ? " d2" : ""}`}>
              <div className="ico">{r.icon}</div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
        <div className="volunteer-cta reveal">
          <a href="/volunteer" className="btn btn-primary">
            Become a volunteer <span className="arw">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

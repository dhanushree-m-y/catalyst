const channels = [
  {
    title: "Join the community",
    desc: "Become a member and get first access to every event.",
    cta: "Join us →",
    href: "#register",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M3 20a6 6 0 0112 0M15 20a5 5 0 016-4.6" />
      </svg>
    ),
  },
  {
    title: "Become a sponsor",
    desc: "Back the next generation of women who build.",
    cta: "Partner with us →",
    href: "#sponsors",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z" />
      </svg>
    ),
  },
  {
    title: "Host an event",
    desc: "Run a workshop, panel or meetup with our support.",
    cta: "Propose it →",
    href: "#host",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 21h8M12 17v4M5 4h14v7a7 7 0 01-14 0zM5 7H3v2a3 3 0 003 3M19 7h2v2a3 3 0 01-3 3" />
      </svg>
    ),
  },
  {
    title: "General enquiries",
    desc: "Questions, press, or just want to say hello?",
    cta: "Email us →",
    href: "mailto:hello@catalyst.community",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M4 7l8 6 8-6" />
      </svg>
    ),
  },
];

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="head-block center reveal">
          <div className="eyebrow center">Say hello</div>
          <h2 className="h2">Get in touch.</h2>
        </div>
        <div className="contact-grid">
          {channels.map((c, i) => (
            <a
              key={c.title}
              href={c.href}
              className={`contact-card reveal${i % 2 ? " d1" : ""}`}
            >
              <div className="ico">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <span className="clink">{c.cta}</span>
            </a>
          ))}
        </div>
        <p className="contact-note">
          Prefer email? <a href="mailto:hello@catalyst.community">hello@catalyst.community</a>
        </p>
      </div>
    </section>
  );
}

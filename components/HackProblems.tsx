import ImageSlot from "./ImageSlot";

const problems = [
  {
    n: "01",
    title:
      "AI for social impact — a model or tool that tackles a real community challenge.",
    img: "https://images.unsplash.com/photo-1633114072836-15d933c6d3a7?q=80&w=600&auto=format&fit=crop",
  },
  {
    n: "02",
    title:
      "Women's safety & wellbeing — tech that protects, supports or empowers women.",
    img: "https://images.unsplash.com/photo-1758691736580-a41e0cfe9e9f?q=80&w=600&auto=format&fit=crop",
  },
  {
    n: "03",
    title:
      "Access for all — make healthcare, education or opportunity reachable for everyone.",
    img: "https://images.unsplash.com/photo-1681949222860-9cb3b0329878?q=80&w=600&auto=format&fit=crop",
  },
];

export default function HackProblems() {
  return (
    <section id="problems" className="problems">
      <div className="wrap">
        <div className="head-block center">
          <div className="eyebrow center">What you&apos;ll build</div>
          <h2 className="h2">Problem statements.</h2>
        </div>
        <div className="problem-list">
          {problems.map((p) => (
            <a key={p.n} href="/register" className="problem-row">
              <div className="problem-num">{p.n}</div>
              <div className="problem-thumb">
                <ImageSlot src={p.img} shape="rect" placeholder={p.title} />
              </div>
              <div className="problem-title">{p.title}</div>
              <span className="problem-arrow" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

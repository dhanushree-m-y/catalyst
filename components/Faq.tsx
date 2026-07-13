const items = [
  {
    q: "Do I need to know how to code?",
    a: "Not at all. Git With Her is beginner-friendly by design, and Catalyst welcomes women from every field — not just software. Mentors and workshops meet you exactly where you are, whatever you're building.",
    open: true,
  },
  {
    q: "Who can join Catalyst?",
    a: "Any woman curious about technology — students, recent graduates, and career-switchers alike. Come solo or with friends; we'll help you find a team of 2–4.",
  },
  {
    q: "What should I bring?",
    a: "A laptop, your charger, and an open mind. We'll take care of the food, the space, the mentors, and the good energy.",
  },
  {
    q: "Will I actually build something?",
    a: "Yes. The day is structured so every team leaves with a working first version to demo — and the confidence that you can build the next one too.",
  },
];

export default function Faq() {
  return (
    <section className="faq band-rose" id="faq">
      <div className="wrap">
        <div className="head-block center reveal">
          <div className="eyebrow center">Questions</div>
          <h2 className="h2">Good to know.</h2>
        </div>
        <div className="faq-wrap">
          {items.map((item, i) => (
            <details key={i} className="acc reveal" open={item.open}>
              <summary>
                {item.q}
                <span className="plus">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <div className="ans">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

import ImageSlot from "./ImageSlot";

const problems = [
  {
    n: "01",
    title:
      "Carbon Footprint & Climate Tech — build solutions that help people and organisations measure, reduce and manage their environmental impact through technology.",
    img: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=600&auto=format&fit=crop",
  },
  {
    n: "02",
    title:
      "Rural Empowerment — digital solutions that improve access to education, healthcare, finance, employment, agriculture or public services in rural communities.",
    img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
  },
  {
    n: "03",
    title:
      "Open Innovation — solve any real-world problem with technology; build a scalable, impactful and user-centric software solution to a meaningful challenge.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
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

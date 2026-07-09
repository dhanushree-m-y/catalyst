const steps = [
  { n: "01", time: "Hour 0", title: "Check-in & kickoff", desc: "Arrive, settle in, and get a warm welcome plus a quick tour of the day.", x: 60, y: 8, side: "right" },
  { n: "02", time: "Hour 1", title: "Team up & ideate", desc: "Find your team of 2–4, or get matched, and pick a problem worth solving.", x: 40, y: 29, side: "left" },
  { n: "03", time: "Hours 2–6", title: "Build with mentors", desc: "The core sprint — workshops run alongside and mentors circulate to help.", x: 60, y: 50, side: "right" },
  { n: "04", time: "Hour 7", title: "Demos & feedback", desc: "Show what you made; friendly judges give real, kind, useful feedback.", x: 40, y: 71, side: "left" },
  { n: "05", time: "Hour 8", title: "Awards & celebration", desc: "Prizes, certificates and a group photo. You leave a builder.", x: 60, y: 92, side: "right" },
];

const PATH =
  "M60,8 C60,19 40,18 40,29 C40,40 60,39 60,50 C60,61 40,60 40,71 C40,82 60,81 60,92";

export default function Roadmap() {
  return (
    <section id="timeline" className="roadmap">
      <div className="wrap">
        <div className="head-block center">
          <div className="eyebrow center">How the day flows</div>
          <h2 className="h2">The build-day roadmap.</h2>
        </div>
        <div className="rm-wrap">
          <svg className="rm-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d={PATH} fill="none" strokeWidth="1.8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {steps.map((s) => (
            <div
              key={s.n}
              className={`rm-point rm-${s.side}`}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              <span className="rm-dot" />
              <div className="rm-label">
                <div className="rm-num">{s.n}</div>
                <div className="rm-time">{s.time}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

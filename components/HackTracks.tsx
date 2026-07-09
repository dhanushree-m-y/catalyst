const tracks = [
  { name: "AI & Data", desc: "Models, agents and data for good." },
  { name: "Web & Mobile", desc: "Apps, tools and platforms people love." },
  { name: "Hardware & IoT", desc: "Electronics, robotics and connected devices." },
  { name: "HealthTech", desc: "Care, wellness and access for everyone." },
  { name: "Women Safety", desc: "Tech that protects and empowers women." },
  { name: "Social Impact", desc: "Climate, education, inclusion and beyond." },
];

export default function HackTracks() {
  return (
    <section id="tracks" className="tracks band-rose">
      <div className="wrap">
        <div className="head-block center reveal">
          <div className="eyebrow center">Build on any theme</div>
          <h2 className="h2">Tracks &amp; problem areas.</h2>
        </div>
        <div className="track-grid reveal d1">
          {tracks.map((t, i) => (
            <div key={t.name} className="track-card">
              <div className="track-num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{t.name}</h3>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
        <p className="tracks-note">
          Not sure which to pick? Bring any idea — mentors will help you shape it on the day.
        </p>
      </div>
    </section>
  );
}

import ImageSlot from "./ImageSlot";

const speakers = [
  { title: "Software Engineer", org: "Tech Company", d: "" },
  { title: "Founder & CEO", org: "Startup", d: "d1" },
  { title: "Product Designer", org: "Studio", d: "d2" },
  { title: "Data Scientist", org: "Tech Company", d: "d3" },
];

export default function Speakers() {
  return (
    <section className="speakers" id="speakers">
      <div className="wrap">
        <div className="head-block reveal">
          <div className="eyebrow">Speakers &amp; mentors</div>
          <h2 className="h2">Learn from women who&apos;ve done it.</h2>
        </div>
        <div className="spk-grid">
          {speakers.map((s, i) => (
            <div key={i} className={`spk reveal ${s.d}`.trim()}>
              <div className="avatar">
                <ImageSlot src={`/assets/art-spk${i + 1}.png`} shape="circle" placeholder="Portrait" />
              </div>
              <h3>Speaker Name</h3>
              <div className="title">{s.title}</div>
              <div className="org">{s.org}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

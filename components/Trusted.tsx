import Counter from "./Counter";

export default function Trusted() {
  return (
    <section className="trusted tight">
      <div className="wrap">
        <div className="trusted-inner reveal">
          <p>Building a generation of women who build</p>
          <div className="nums">
            <div className="tnum">
              <b><Counter to={500} suffix="+" /></b>
              <span>Women in the community</span>
            </div>
            <div className="tnum">
              <b><Counter to={40} suffix="+" /></b>
              <span>Mentors &amp; speakers</span>
            </div>
            <div className="tnum">
              <b><Counter to={1} /></b>
              <span>Place you belong</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

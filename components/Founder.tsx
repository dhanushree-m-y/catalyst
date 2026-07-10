import ImageSlot from "./ImageSlot";
import Flower from "./Flower";

export default function Founder() {
  return (
    <section className="founder">
      <div className="wrap">
        <div className="head-block reveal">
          <div className="eyebrow">Meet the founder</div>
        </div>
        <div className="founder-card reveal d1" style={{ marginTop: 26 }}>
          <Flower className="founder-flower" />
          <div className="founder-portrait">
            <ImageSlot
              src="/founder.jpg"
              shape="rect"
              alt="Dhanushree M Y, Founder of Catalyst"
              placeholder="Drop founder portrait"
            />
          </div>
          <div className="founder-copy">
            <div className="eyebrow">Founder</div>
            <div className="name">Dhanushree M Y</div>
            <div className="role">Founder, Catalyst</div>
            <p className="bio">
              &quot;I built Catalyst because I know how much one opportunity can
              change someone&apos;s journey. My goal is to help more women
              discover theirs.&quot;
            </p>
            <a
              href="https://www.linkedin.com/in/dhanushree-m-y-77940b24a"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-dark"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5A2.5 2.5 0 100 3.51a2.5 2.5 0 004.98-.01zM.24 8.02h4.48V24H.24V8.02zM8.34 8.02h4.29v2.18h.06c.6-1.13 2.06-2.32 4.24-2.32 4.53 0 5.37 2.98 5.37 6.86V24h-4.48v-6.36c0-1.52-.03-3.47-2.12-3.47-2.12 0-2.45 1.66-2.45 3.36V24H8.34V8.02z" />
              </svg>
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Hero() {
  return (
    <header className="hero band-rose">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="hero-head reveal">
            <div className="eyebrow">A community for women who build</div>
            <h1 className="display">
              Where women in every field <span className="accent">belong,</span>{" "}
              learn &amp; grow.
            </h1>
          </div>
          <div className="hero-sub reveal d1">
            <p className="lead">
              Catalyst is a community for women across every field — software,
              electronics, civil, mechanical, design and beyond. Find your
              people, sharpen your craft, and build what you&apos;ve been
              dreaming about.
            </p>
            <div className="hero-actions">
              <a href="#register" className="btn btn-primary">
                Join Catalyst <span className="arw">→</span>
              </a>
              <a href="#why" className="btn btn-ghost">
                See what we&apos;re about
              </a>
            </div>
          </div>
        </div>
        <div className="hero-photo reveal d2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Women-cutout.png" alt="The women of Catalyst" />
        </div>
      </div>
    </header>
  );
}

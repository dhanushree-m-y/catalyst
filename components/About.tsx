import ImageSlot from "./ImageSlot";
import Flower from "./Flower";

export default function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="about-grid">
          <div className="about-copy reveal">
            <div className="eyebrow">What is Catalyst</div>
            <h2 className="h2">More than a network — a launchpad for women who build.</h2>
            <p className="lead">
              Catalyst is a community for women across every field — software,
              electronics, civil, mechanical, data and design. Wherever you
              build, you belong here.
            </p>
            <p className="lead">
              We turn curiosity into confidence through hands-on events,
              mentorship, and a community that lasts long after the day is done.
            </p>
            <a href="/git-with-her" className="btn btn-primary">
              Explore Git With Her <span className="arw">→</span>
            </a>
          </div>

          <div className="about-media reveal d1">
            <Flower className="about-flower" />
            <div className="arch arch-1">
              <ImageSlot
                src="https://images.unsplash.com/photo-1633114072836-15d933c6d3a7?q=80&w=800&auto=format&fit=crop"
                shape="rect"
                placeholder="Women building together"
              />
            </div>
            <div className="arch arch-2">
              <ImageSlot
                src="https://images.unsplash.com/photo-1758691736580-a41e0cfe9e9f?q=80&w=800&auto=format&fit=crop"
                shape="rect"
                placeholder="Women collaborating"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
                src="/networking.jpg"
                shape="rect"
                placeholder="Women networking at a Catalyst event"
              />
            </div>
            <div className="arch arch-2">
              <ImageSlot
                src="/men.jpg"
                shape="rect"
                placeholder="Building together, empowering women"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

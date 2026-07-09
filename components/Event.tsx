import ImageSlot from "./ImageSlot";
import Flower from "./Flower";

export default function Event() {
  return (
    <section className="event band-rose" id="event">
      <div className="wrap">
        <div className="head-block reveal">
          <div className="eyebrow">Our flagship event</div>
        </div>
        <div className="event-grid">
          <div className="event-copy reveal">
            <h2 className="h2">Git With Her</h2>
            <p className="lead">
              Our flagship eight-hour build day, made for beginners and builders
              across every field — software, hardware, design and beyond. Come
              with an idea or just curiosity; leave with something you made, and
              people who have your back.
            </p>
            <ul className="event-facts">
              <li>Women Only</li>
              <li>8 Hours</li>
              <li>Team of 2–4</li>
              <li>Beginner Friendly</li>
              <li>Prize Pool</li>
              <li>Mentors</li>
              <li>Networking</li>
            </ul>
            <div className="btn-row">
              <a href="/git-with-her" className="btn btn-primary">
                See the hackathon <span className="arw">→</span>
              </a>
              <a href="/git-with-her#faq" className="btn btn-ghost">
                Read the FAQ
              </a>
            </div>
          </div>
          <div className="event-media reveal d1">
            <Flower className="event-flower" />
            <ImageSlot
              src="/CS.jpg"
              shape="rect"
              placeholder="Women presenting their hackathon project"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

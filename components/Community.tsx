import Carousel from "./Carousel";
import Flower from "./Flower";

const images = [
  "/YoubelongHere1.jpg",
  "/YoubelongHere2.jpg",
  "/YoubelongHere3.jpg",
  "/YoubelongHere4.jpg",
];

export default function Community() {
  return (
    <section className="community" id="community">
      <div className="wrap">
        <div className="community-grid">
          <div className="community-media reveal">
            <Flower className="community-flower" />
            <Carousel images={images} />
          </div>
          <div className="community-copy reveal d1">
            <div className="eyebrow">The community</div>
            <h2 className="h2">You belong here.</h2>
            <p className="lead">
              Whatever you build and whoever you are, Catalyst is a place to find
              your people, share the wins, and grow together — long after the
              event ends.
            </p>
            <a href="#register" className="btn btn-primary">
              Join Catalyst <span className="arw">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

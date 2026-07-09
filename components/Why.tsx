import ImageSlot from "./ImageSlot";

export default function Why() {
  return (
    <section id="why" className="band-rose">
      <div className="wrap">
        <div className="split">
          <div className="split-media reveal">
            <ImageSlot
              src="/badge.jpg"
              shape="rect"
              placeholder="A Catalyst crew member welcoming a participant"
            />
          </div>
          <div className="split-copy reveal d1">
            <div className="eyebrow">Why Catalyst</div>
            <h2 className="h2">One opportunity can change everything.</h2>
            <p className="lead">
              Catalyst was built by someone who once found her own opportunity
              through a hackathon — and saw how a single open door can redirect a
              whole career.
            </p>
            <p className="lead">
              Today, Catalyst exists to create more of those doors, for every
              woman ready to begin.
            </p>
            <p className="quote">
              A room where you don&apos;t have to prove you belong — because
              everyone already knows you do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

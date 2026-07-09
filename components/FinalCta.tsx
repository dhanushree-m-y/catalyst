import ImageSlot from "./ImageSlot";
import Flower from "./Flower";

export default function FinalCta() {
  return (
    <section className="final" id="register">
      <div className="final-inner reveal">
        <Flower className="final-flower" />
        <div className="final-media">
          <ImageSlot
            src="https://images.unsplash.com/photo-1681949222860-9cb3b0329878?q=80&w=1600&auto=format&fit=crop"
            shape="rect"
            placeholder="Drop full-width photo — women celebrating / building"
          />
        </div>
        <div className="final-scrim" />
        <div className="final-content">
          <div className="eyebrow">Your seat is waiting</div>
          <h2 className="h2">Ready to build your next idea?</h2>
          <a href="#register" className="btn btn-primary">
            Register Now <span className="arw">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

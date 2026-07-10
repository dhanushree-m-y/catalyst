import AccountChip from "./AccountChip";

/** Consistent top nav for sub-pages: logo + navigation + account chip. */
export default function SubNav() {
  return (
    <nav className="hack-nav">
      <div className="hack-inner">
        <a href="/" className="logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/catalyst-mark.svg" alt="" />
          Catalyst
        </a>
        <div className="subnav-links">
          <a href="/git-with-her">Git With Her</a>
          <a href="/#community">Community</a>
          <a href="/#sponsors">Sponsors</a>
          <a href="/#contact">Contact</a>
          <AccountChip />
        </div>
      </div>
    </nav>
  );
}

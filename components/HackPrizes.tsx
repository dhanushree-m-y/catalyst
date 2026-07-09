const Trophy = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M8 21h8M12 17v4M6 4h12v6a6 6 0 01-12 0zM6 7H3.5v1.5A2.5 2.5 0 006 11M18 7h2.5v1.5A2.5 2.5 0 0118 11" />
  </svg>
);
const Medal = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="14" r="6" />
    <path d="M9.5 8.6L7 2.5h4M14.5 8.6L17 2.5h-4" />
  </svg>
);
const Gift = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M3 13h18M12 8v13M12 8S10.5 3 8 4.5 9 8 12 8zm0 0s1.5-5 4-3.5S15 8 12 8z" />
  </svg>
);
const Cert = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="4" y="4" width="16" height="12" rx="2" />
    <path d="M9 20l3-2 3 2v-4H9zM8 8h8M8 11h5" />
  </svg>
);
const Briefcase = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 12h18" />
  </svg>
);

const places = [
  { place: "2nd", amount: "₹15,000", extra: "+ certificates & goodies", Icon: Medal },
  { place: "1st", amount: "₹25,000", extra: "+ trophy & recruiter intros", Icon: Trophy, top: true },
  { place: "3rd", amount: "₹10,000", extra: "+ certificates & goodies", Icon: Medal },
];

const perks = [
  { label: "Trophies", Icon: Trophy },
  { label: "Certificates", Icon: Cert },
  { label: "Goodies & swag", Icon: Gift },
  { label: "Recruiter intros", Icon: Briefcase },
];

export default function HackPrizes() {
  return (
    <section id="prizes" className="prizes">
      <div className="wrap">
        <div className="head-block center reveal">
          <div className="eyebrow center">Worth building for</div>
          <h2 className="h2">A ₹50,000 prize pool.</h2>
        </div>
        <div className="prize-grid reveal d1">
          {places.map(({ place, amount, extra, Icon, top }) => (
            <div key={place} className={`prize-card${top ? " prize-top" : ""}`}>
              <div className="prize-icon">
                <Icon />
              </div>
              <div className="prize-place">{place} place</div>
              <div className="prize-amount">{amount}</div>
              <div className="prize-extra">{extra}</div>
            </div>
          ))}
        </div>
        <div className="perks reveal">
          {perks.map(({ label, Icon }) => (
            <span key={label} className="perk">
              <Icon />
              {label}
            </span>
          ))}
        </div>
        <p className="prize-note">
          Plus mentorship and recruiter visibility for every finalist.
        </p>
      </div>
    </section>
  );
}

export default function Timeline() {
  return (
    <section className="tight" id="timeline" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="head-block center reveal">
          <div className="eyebrow center">How the day flows</div>
          <h2 className="h2">Eight hours, start to celebration.</h2>
        </div>
        <div className="timeline">
          <div className="tstep reveal">
            <div className="tdot">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="tbody">
              <div className="time">Hour 0</div>
              <h3>Check-in &amp; kickoff</h3>
              <p>Arrive, grab coffee, and settle in. A warm welcome and a quick tour of the day.</p>
            </div>
          </div>
          <div className="tstep reveal">
            <div className="tdot">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="7" cy="8" r="3" />
                <circle cx="17" cy="8" r="3" />
                <path d="M2 20a5 5 0 0110 0M12 20a5 5 0 0110 0" />
              </svg>
            </div>
            <div className="tbody">
              <div className="time">Hour 1</div>
              <h3>Team up &amp; ideate</h3>
              <p>Find your team of 2–4, or get matched on the spot. Pick a problem worth solving.</p>
            </div>
          </div>
          <div className="tstep reveal">
            <div className="tdot">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19V5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
                <path d="M14 3v6h6" />
              </svg>
            </div>
            <div className="tbody">
              <div className="time">Hours 2–6</div>
              <h3>Build with mentors</h3>
              <p>The core sprint. Workshops run alongside, and mentors circulate to help you ship.</p>
            </div>
          </div>
          <div className="tstep reveal">
            <div className="tdot">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 11l18-5v12M3 11v5a4 4 0 004 4h1M9 9v6" />
              </svg>
            </div>
            <div className="tbody">
              <div className="time">Hour 7</div>
              <h3>Demos &amp; feedback</h3>
              <p>Show what you made. Friendly judges give real, kind, useful feedback.</p>
            </div>
          </div>
          <div className="tstep reveal">
            <div className="tdot">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 21h8M12 17v4M5 4h14v7a7 7 0 01-14 0zM5 7H3v2a3 3 0 003 3M19 7h2v2a3 3 0 01-3 3" />
              </svg>
            </div>
            <div className="tbody">
              <div className="time">Hour 8</div>
              <h3>Awards &amp; celebration</h3>
              <p>Prizes, certificates, and a group photo. You leave a builder — and part of Catalyst.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

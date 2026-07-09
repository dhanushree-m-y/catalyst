export default function Highlights() {
  return (
    <section id="highlights">
      <div className="wrap">
        <div className="head-block reveal">
          <div className="eyebrow">Event highlights</div>
          <h2 className="h2">Everything you need to start.</h2>
        </div>
        <div className="cards">
          <div className="hcard reveal">
            <div className="ico">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a5 5 0 00-3 9v3h6v-3a5 5 0 00-3-9zM9 18h6M10 21h4" />
              </svg>
            </div>
            <h3>Mentors beside you</h3>
            <p>Working engineers and designers who sit with you, unblock you, and cheer you on.</p>
          </div>
          <div className="hcard reveal d1">
            <div className="ico">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19V5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
                <path d="M14 3v6h6M8 13h8M8 17h5" />
              </svg>
            </div>
            <h3>Hands-on workshops</h3>
            <p>Short, practical sessions that take you from idea to a working first version.</p>
          </div>
          <div className="hcard reveal d2">
            <div className="ico">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 21h8M12 17v4M5 4h14v7a7 7 0 01-14 0zM5 7H3v2a3 3 0 003 3M19 7h2v2a3 3 0 01-3 3" />
              </svg>
            </div>
            <h3>Real prizes</h3>
            <p>A prize pool, certificates, and recruiter visibility for the teams who go the distance.</p>
          </div>
          <div className="hcard reveal">
            <div className="ico">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="7" cy="8" r="3" />
                <circle cx="17" cy="8" r="3" />
                <path d="M2 20a5 5 0 0110 0M12 20a5 5 0 0110 0" />
              </svg>
            </div>
            <h3>Your people</h3>
            <p>Leave with a group chat that outlasts the day — collaborators, friends, and a network.</p>
          </div>
          <div className="hcard reveal d1">
            <div className="ico">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 11l18-5v12M3 11v5a4 4 0 004 4h1M9 9v6" />
              </svg>
            </div>
            <h3>Speaker sessions</h3>
            <p>Honest talks from women who&apos;ve built careers, companies, and everything in between.</p>
          </div>
          <div className="hcard reveal d2">
            <div className="ico">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z" />
              </svg>
            </div>
            <h3>A safe, warm space</h3>
            <p>Beginner-friendly by design, with a code of conduct that protects the room.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

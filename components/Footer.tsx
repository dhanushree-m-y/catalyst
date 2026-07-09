export default function Footer() {
  return (
    <footer>
      <div className="foot">
        <div className="foot-top">
          <div className="foot-brand">
            <a href="#top" className="logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/catalyst-mark.svg" alt="" />
              Catalyst
            </a>
            <p>
              A community where women across every field belong, learn, and grow
              — one opportunity at a time.
            </p>
          </div>
          <div className="foot-col">
            <h4>Explore</h4>
            <a href="#why">Why Catalyst</a>
            <a href="/git-with-her">Git With Her</a>
            <a href="/git-with-her#speakers">Speakers</a>
            <a href="#community">Community</a>
            <a href="/git-with-her#faq">FAQ</a>
          </div>
          <div className="foot-col">
            <h4>Get involved</h4>
            <a href="#register">Register</a>
            <a href="#partner">Become a partner</a>
            <a href="#">Mentor with us</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="foot-bottom">
          <div className="socials">
            <a href="#" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5A2.5 2.5 0 100 3.51a2.5 2.5 0 004.98-.01zM.24 8.02h4.48V24H.24V8.02zM8.34 8.02h4.29v2.18h.06c.6-1.13 2.06-2.32 4.24-2.32 4.53 0 5.37 2.98 5.37 6.86V24h-4.48v-6.36c0-1.52-.03-3.47-2.12-3.47-2.12 0-2.45 1.66-2.45 3.36V24H8.34V8.02z" />
              </svg>
            </a>
            <a href="#" aria-label="X">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.6l8-9.2L1 2h7l4.8 6.3L18.9 2zm-2.4 18h1.9L7.6 3.9H5.6L16.5 20z" />
              </svg>
            </a>
          </div>
          <div className="power">
            © 2026 Catalyst. Powered by <b>Webstor Labs</b>.
          </div>
        </div>
      </div>
    </footer>
  );
}

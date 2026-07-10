# Catalyst — backend / form storage

All site forms (Join, Volunteer, Sponsor, Propose-an-event, and Team registration
when it's turned on) POST to **`/api/register`**, which saves each submission.

- **Locally** (dev): saved to `data/*.json` files (gitignored). No setup needed.
- **In production** (Vercel): saved to a **Postgres database** (Neon). You connect it once
  in the Vercel dashboard and it just works — see below.

If no database is connected in production, the forms return an error ("couldn't save,
please try again") instead of silently losing data. So set the database up before launch.

---

## One-time setup on Vercel

### 1. Deploy the site
- Vercel → **Add New → Project** → import the GitHub repo (`dhanushree-m-y/catalyst`).
- Framework is auto-detected (Next.js). Click **Deploy**.

### 2. Add the database
- In the project → **Storage** tab → **Create Database** → **Postgres** (Neon) → **Create**.
- When asked, **Connect** it to this project.
- That automatically adds the `DATABASE_URL` environment variable — nothing to copy by hand.

### 3. Add your admin password
- Project → **Settings → Environment Variables** → add:
  - **Key:** `ADMIN_KEY`   **Value:** *(any long secret you choose, e.g. `gwh-2026-9f3k...`)*
- (Optional) To turn the live **team registration form** back on later, also add:
  - **Key:** `NEXT_PUBLIC_REGISTRATION_OPEN`   **Value:** `true`

### 4. Redeploy
- Project → **Deployments** → **⋯ → Redeploy** (so the new env vars take effect).

Done. Every Join / Volunteer / Sponsor / Event-proposal submission is now saved to the database.

---

## Viewing & downloading the signups

Open these in your browser (replace `YOUR_KEY` with your `ADMIN_KEY`, and the domain with
your live site):

- **All signups (JSON):**
  `https://your-site.vercel.app/api/admin?key=YOUR_KEY`
- **One type only:** add `&kind=member` (or `sponsor`, `volunteer`, `host`, `participant`)
  `https://your-site.vercel.app/api/admin?key=YOUR_KEY&kind=sponsor`
- **Download as CSV (opens in Excel / Google Sheets):** add `&format=csv`
  `https://your-site.vercel.app/api/admin?key=YOUR_KEY&format=csv`

Keep the `ADMIN_KEY` private — anyone with it can view the signups. Without the correct
key, `/api/admin` returns "Not found".

---

## The record types (`kind`)

| kind          | form                | prefix |
|---------------|---------------------|--------|
| `member`      | Join the community  | MEM    |
| `volunteer`   | Volunteer           | VOL    |
| `sponsor`     | Sponsor             | SPN    |
| `host`        | Propose an event    | HST    |
| `participant` | Team registration   | GWH    |

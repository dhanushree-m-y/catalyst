# Catalyst — accounts & admin dashboard

## What this adds
- **Sign up / Log in** for students & sponsors — email + password, and **"Continue with Google"**.
- **Log out** and an **`/account`** profile page.
- An **`/admin`** dashboard (admins only) showing counts + tables of everyone who
  registered / joined / volunteered / sponsored / proposed an event, with **CSV export**.

Accounts are stored in the same Neon database (a `users` table, auto-created on first signup).
The existing forms still work without an account — the dashboard shows all of it.

---

## Environment variables to add in Vercel
Project → **Settings → Environment Variables** (all: Production, Preview, Development). Then **Redeploy**.

| Key | Value | Needed for |
|-----|-------|-----------|
| `AUTH_SECRET` | `d+fNcDhYkAed6UVkVNwTth2VCIU1Z/6lMNt/CwOLOZ1h` | Required — signs login sessions |
| `ADMIN_EMAILS` | your admin email(s), comma-separated, e.g. `buildwithcatalyst@gmail.com` | Who can open `/admin` |
| `AUTH_GOOGLE_ID` | *(from Google, step below)* | "Continue with Google" |
| `AUTH_GOOGLE_SECRET` | *(from Google, step below)* | "Continue with Google" |

`DATABASE_URL` and `ADMIN_KEY` are already set from before.

**Who becomes admin:** whoever signs up / logs in with an email listed in `ADMIN_EMAILS`.
So sign up with that exact email, then open `/admin`.

> Without `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`, the Google button simply doesn't show —
> email/password still works. Add them whenever you're ready for Gmail login.

---

## Enable "Continue with Google" (Google Cloud Console — free, ~10 min)
1. Go to **console.cloud.google.com** → create a project (e.g. "Catalyst").
2. **APIs & Services → OAuth consent screen** → choose **External** → fill App name
   (`Catalyst`), your support email, developer email → Save. (You can leave it in "Testing"
   and add your own Gmail as a test user, or click **Publish** to open it to everyone.)
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID** → type **Web application**.
4. **Authorized JavaScript origins:**
   - `https://catalyst-self-eight.vercel.app`
   - `http://localhost:3000`
5. **Authorized redirect URIs:**
   - `https://catalyst-self-eight.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`
6. **Create** → copy **Client ID** → `AUTH_GOOGLE_ID`, **Client secret** → `AUTH_GOOGLE_SECRET`
   (add both in Vercel, then Redeploy).

> If you add a custom domain later, add that domain's origin + `/api/auth/callback/google`
> redirect URI here too.

---

## Pages
| Path | What |
|------|------|
| `/signup` | Create an account (name, email, phone, password, or Google) |
| `/login` | Log in (email/password, or Google) |
| `/account` | Profile + log out (+ link to `/admin` for admins) |
| `/admin` | Admin dashboard — counts, tables, CSV (admins only) |

Nav shows **Log in** when signed out, **Account** when signed in.

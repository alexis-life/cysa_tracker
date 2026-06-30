# Deploying your CySA+ Tracker to cysa.alexischao.com

This walks through all four pieces: database (Supabase), code hosting
(GitHub), the live site (Vercel), and pointing your domain at it.
Do these in order — each step needs the one before it.

---

## 1. Supabase — your database

1. Go to https://supabase.com and sign in (GitHub login is easiest).
2. Click **New Project**. Pick any name (e.g. `cysa-tracker`), set a
   database password (save it somewhere — you won't need it again for
   this setup, but Supabase requires one), and pick the region closest
   to you. Free tier is fine.
3. Once the project finishes spinning up (~2 min), go to the **SQL
   Editor** in the left sidebar → **New query**.
4. Open `supabase-schema.sql` from this project, copy its entire
   contents, paste into the SQL editor, and click **Run**. This
   creates the `tracker_data` table that holds your history.
5. Go to **Project Settings** (gear icon) → **API**. You'll need two
   values from this page in step 3 below:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (a long string under "Project API keys")

Keep this tab open — you'll copy these into Vercel shortly.

---

## 2. GitHub — push the code

1. Create a new repository at https://github.com/new (e.g.
   `cysa-tracker`). Keep it private if you'd rather your question bank
   not be public — doesn't affect anything functionally.
2. From this project folder on your machine, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cysa-tracker.git
   git push -u origin main
   ```
   (If you downloaded this as a zip rather than having it locally
   already, unzip it first, `cd` into the folder, then run the above.)

---

## 3. Vercel — hosting

Since you signed up for Vercel with your GitHub account, it's already
linked — no extra connection step needed.

1. Go to https://vercel.com/new — you should see your repos listed.
2. Find `cysa-tracker` and click **Import**.
3. Vercel will auto-detect it as a Vite project — leave the build
   settings as default.
4. Before clicking Deploy, expand **Environment Variables** and add
   three:
   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | the Project URL from Supabase step 1.5 |
   | `VITE_SUPABASE_ANON_KEY` | the anon public key from Supabase step 1.5 |
   | `ANTHROPIC_API_KEY` | your Anthropic API key (starts with `sk-ant-`) |

   Get an Anthropic API key at https://console.anthropic.com/settings/keys
   if you don't have one — click **Create Key**. This key is only
   ever used server-side (inside `/api/generate-question.js` and
   `/api/classify-question.js`), never sent to the browser.
5. Click **Deploy**. After a minute or two you'll get a live URL like
   `cysa-tracker-xyz.vercel.app` — open it and confirm the tracker
   loads and the Dashboard renders.

---

## 4. Point your domain at it

1. In Vercel, go to your project → **Settings** → **Domains**.
2. Type `cysa.alexischao.com` and click **Add**.
3. Vercel will show you a DNS record to add — typically a **CNAME**
   record:
   | Type | Name | Value |
   |---|---|---|
   | CNAME | `cysa` | `cname.vercel-dns.com` |
4. Go to wherever you manage `alexischao.com`'s DNS (your registrar —
   Namecheap, GoDaddy, Cloudflare, etc.), find the DNS settings, and
   add that exact CNAME record.
5. DNS changes can take anywhere from a few minutes to a few hours to
   propagate. Vercel's domain page will show a green checkmark once
   it detects the record correctly.

Once that checkmark appears, `cysa.alexischao.com` will serve your
tracker directly.

---

## Bringing your data over

Your existing history lives in the Claude artifact's storage, not
here — this is a fresh database. Use the **Export Data** button on
the old artifact's Dashboard tab to download your JSON backup, then
once this new site is live, use its **Import Data** button to merge
it in.

---

## Updating the site later

Any time you want to change something (add questions, tweak styling,
etc.), edit the files and run:
```bash
git add .
git commit -m "describe your change"
git push
```
Vercel automatically redeploys on every push to `main` — no extra
steps needed.

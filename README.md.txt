# Cloudinary Signed Audio Starter (Vercel + Thunkable)

Stream protected audio in Thunkable by generating **short-lived signed URLs** from Cloudinary.

## What you get
- `/api/signed-url` endpoint (Vercel serverless) that returns a signed delivery URL
- `.env.example` for required Cloudinary credentials
- Minimal dependencies

---

## 1) Cloudinary setup
1. Create a folder (e.g., `premium/`) and upload your MP3s in the **Cloudinary Media Library**.
2. Set each asset's **delivery type** to **authenticated** (not public).
   - You can do this at upload time or by editing the asset's settings.
3. Copy your **Cloud Name**, **API Key**, and **API Secret** from Cloudinary console.

> Use the **video** resource type for audio assets to take advantage of Cloudinary's pipeline.

---

## 2) Deploy to Vercel
- Create a new Vercel project and import this folder.
- Set environment variables in Vercel → Project → Settings → **Environment Variables**:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - (Optional) `APP_SHARED_KEY` to require a shared header (`X-App-Key`).
  - (Optional advanced) `CLD_AUTH_TOKEN_KEY` if you enable token-based auth.

Deploy—Vercel will expose an endpoint like:
```
https://your-project.vercel.app/api/signed-url
```

---

## 3) Test locally (optional)
Install deps and run the Vercel dev server:
```bash
npm install
npx vercel dev
```
Then POST:
```bash
curl -X POST http://localhost:3000/api/signed-url   -H "Content-Type: application/json"   -H "X-App-Key: $APP_SHARED_KEY"   -d '{"public_id":"premium/morning-calm-15min","format":"mp3"}'
```

---

## 4) Thunkable wiring
**Components:**
- Web API (name: `GetURL`)
- Sound (name: `Player`)

**Blocks (concept):**
1. Set `GetURL.Url` to your deployed endpoint:
   ```
   https://your-project.vercel.app/api/signed-url
   ```
2. Headers:
   ```
   Content-Type: application/json
   X-App-Key: <APP_SHARED_KEY>   // only if you set this on the server
   ```
3. Body (JSON):
   ```json
   { "public_id": "premium/morning-calm-15min", "format": "mp3" }
   ```
4. Call Web API. On response:
   - Parse JSON → `set Player.Source = response.url`
   - `call Player.Play`

**Tip:** If swapping tracks rapidly, set `Player.Source = ""` before setting the new URL, then `Play`.

---

## 5) Security notes
- **Do not** expose your Cloudinary API secret in Thunkable. Keep signing in this endpoint.
- Set a shared `X-App-Key` in production (or add JWT checks if you have a user system).
- For even tighter control, enable **token-based authentication** in Cloudinary and uncomment the `auth_token` block.
- Consider using short filenames (e.g., `premium/id123.mp3`) so public_id doesn't leak details.

---

## 6) Usage quick reference
- Upload asset (authenticated) → `public_id` like `premium/morning-calm-15min`
- POST to `/api/signed-url` → receive `{"url":"...signed...mp3"}`
- Set `Sound.Source = url` → `Sound.Play`

---

## 7) Migrating later to Firebase (if desired)
- Replace this endpoint with a Firebase Cloud Function that:
  1) verifies an **ID token** from Firebase Auth
  2) returns a **5-minute signed URL** from Firebase Storage
- Your Thunkable flow remains the same: **call endpoint → get URL → set Sound.Source → Play**.


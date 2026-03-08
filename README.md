# Knowledge Capsule

A private, single-user knowledge vault. Record yourself explaining topics via YouTube links or direct video upload, get automatic transcripts and AI-generated summaries, and edit everything inline.

---

## What it does

- Sign in with your Google account
- Create topics (e.g. "Data Structures", "System Design")
- Add recordings under each topic — paste a YouTube link or upload a video directly
- The app auto-fetches the YouTube transcript and generates a summary using AI
- Edit the title, description, notes, and summary inline
- Archive recordings you no longer need

---

## Prerequisites

Before you start, you need accounts/credentials for four services. All of them have free tiers.

| Service | What it's used for | Free? |
|---|---|---|
| MongoDB Atlas | Stores all your data | Yes |
| Google Cloud | Sign-in + YouTube upload | Yes |
| Groq | AI summary generation | Yes |

---

## Step 1 — Clone and install

```bash
git clone <your-repo-url>
cd knowledge-capsule-next
npm install
```

---

## Step 2 — MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new **free cluster** (M0 tier)
3. Under **Database Access**, create a user with read/write permissions — note the username and password
4. Under **Network Access**, click **Add IP Address** → **Allow Access from Anywhere** (for local dev)
5. Click **Connect** on your cluster → **Drivers** → copy the connection string

It looks like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
```

Replace `<username>` and `<password>` with the credentials you just created.

---

## Step 3 — Google Cloud (OAuth + YouTube API)

This gives you Google sign-in AND the ability to upload videos to YouTube.

### 3a — Create a project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click the project dropdown at the top → **New Project** → give it a name → **Create**

### 3b — Enable APIs

1. Go to **APIs & Services** → **Library**
2. Search for **YouTube Data API v3** → click it → **Enable**

### 3c — Configure OAuth consent screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** → **Create**
3. Fill in the required fields (App name, support email)
4. On the **Scopes** step, click **Add or remove scopes** and add:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `https://www.googleapis.com/auth/youtube.upload`
5. On the **Test users** step, click **Add users** and add your own Google email address
6. Save and continue through the rest of the steps

### 3d — Create OAuth credentials

1. Go to **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
2. Application type: **Web application**
3. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. Click **Create**
5. Copy the **Client ID** and **Client Secret**

---

## Step 4 — Groq API key

1. Go to [console.groq.com](https://console.groq.com) and create a free account
2. Go to **API Keys** → **Create API Key**
3. Copy the key (starts with `gsk_...`)

---

## Step 5 — Create `.env.local`

Create a file called `.env.local` in the project root with the following:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/knowledge-capsule

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id-from-step-3
GOOGLE_CLIENT_SECRET=your-client-secret-from-step-3

# NextAuth — generate a random secret with: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000

# Groq (AI summaries)
GROQ_API_KEY=gsk_your-groq-api-key
```

To generate `NEXTAUTH_SECRET`, run this in your terminal:
```bash
openssl rand -base64 32
```

---

## Step 6 — Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Sign in with the Google account you added as a test user in Step 3c.

---

## How to use it

1. **Create a topic** — click the `+` button in the left sidebar
2. **Add a recording** — select the topic, click **Add recording**
   - Paste a YouTube URL, or switch to **Upload video** to upload a file directly (it will be saved to your YouTube channel as unlisted)
3. **Fetch transcript** — open the recording, find the Transcript section, click **Fetch transcript**
4. **Generate summary** — click **Generate summary** (requires a transcript)
5. **Edit anything** — click on the title, description, notes, or summary to edit inline

---

## Deploying to Vercel

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. In the project settings, go to **Environment Variables** and add all the variables from your `.env.local`
4. For `NEXTAUTH_URL`, set it to your Vercel deployment URL (e.g. `https://your-app.vercel.app`)
5. In Google Cloud Console, add your Vercel URL to **Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
6. Deploy

---

## Common issues

**"No refresh token found" when uploading a video**
You signed in before the YouTube scope was added. Sign out and sign back in to grant the new permission.

**"MONGODB_URI is not configured"**
Your `.env.local` file is missing or the `MONGODB_URI` value is wrong. Double-check the connection string and make sure your MongoDB Atlas IP allowlist includes your current IP.

**Google sign-in fails**
Make sure your Google account is added as a test user in the OAuth consent screen (Step 3c), and that `NEXTAUTH_URL` matches the URL you're accessing the app from.

**YouTube transcript not available**
Some videos have captions disabled. Use the **Paste transcript manually** option instead.

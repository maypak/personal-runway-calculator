# Supabase OAuth Setup Guide

## 🎯 Goal
Enable Google and GitHub social login for Personal Runway Calculator.

---

## 📋 Setup Steps

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project: `personal-runway-calculator`

---

### 2. Enable Google OAuth

#### A. Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add authorized redirect URI:
   ```
   https://[YOUR-SUPABASE-PROJECT].supabase.co/auth/v1/callback
   ```
   Example: `https://abcdefghijk.supabase.co/auth/v1/callback`
7. Copy **Client ID** and **Client Secret**

#### B. Configure in Supabase
1. Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** and click **Enable**
3. Paste:
   - **Client ID**: (from Google Console)
   - **Client Secret**: (from Google Console)
4. Click **Save**

---

### 3. Enable GitHub OAuth

#### A. Create GitHub OAuth App
1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:
   - **Application name**: Personal Runway Calculator
   - **Homepage URL**: `https://personal-runway-calculator.vercel.app`
   - **Authorization callback URL**:
     ```
     https://[YOUR-SUPABASE-PROJECT].supabase.co/auth/v1/callback
     ```
4. Click **Register application**
5. Copy **Client ID**
6. Click **Generate a new client secret**
7. Copy **Client Secret**

#### B. Configure in Supabase
1. Supabase Dashboard → **Authentication** → **Providers**
2. Find **GitHub** and click **Enable**
3. Paste:
   - **Client ID**: (from GitHub)
   - **Client Secret**: (from GitHub)
4. Click **Save**

---

## ✅ Test the Integration

1. Deploy the latest code to Vercel
2. Visit: https://personal-runway-calculator.vercel.app
3. Click **Continue with Google** or **Continue with GitHub**
4. Verify redirect and authentication works
5. Check Supabase Dashboard → **Authentication** → **Users** to see new social logins

---

## 🔒 Security Notes

- Never commit OAuth secrets to Git
- Supabase stores them securely
- Rotate secrets if compromised
- Add multiple redirect URIs if you have staging/dev environments

---

## 📝 Redirect URIs to Whitelist

For production:
```
https://personal-runway-calculator.vercel.app
```

For local development (optional):
```
http://localhost:3000
```

---

## 🚨 Troubleshooting

### "Invalid redirect URI"
- Check that Supabase callback URL is added to Google/GitHub
- Format: `https://[project-ref].supabase.co/auth/v1/callback`

### "OAuth not configured"
- Verify Client ID/Secret are correctly pasted in Supabase
- Check that the provider is **Enabled** (toggle is ON)

### "User not created"
- Check Supabase → **Authentication** → **Settings**
- Ensure **Enable email confirmations** is OFF (for easier testing)
- Or check user's email for confirmation link

---

## 📊 Expected Conversion Impact

Based on research (freemium-monetization-2026-02-14.md):
- **+20-30% signup conversion** (easier signup)
- **-15% email confirmation friction** (no password to remember)
- **Better user experience** (one-click auth)

---

**Status:** ⏳ Awaiting Supabase OAuth configuration  
**ETA:** 10-15 minutes once you start  
**Blocker:** None (code is ready, just needs dashboard setup)

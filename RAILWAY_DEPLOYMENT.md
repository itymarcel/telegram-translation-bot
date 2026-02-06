# Deploy to Railway 🚂

Deploy your Telegram Translation Bot to Railway in minutes!

## What is Railway?

Railway is a deployment platform that makes it easy to deploy apps. It will:
- Auto-detect your Node.js app
- Install dependencies
- Build TypeScript to JavaScript
- Run your bot 24/7
- Provide free $5/month credit (enough for this bot!)

## Prerequisites

1. ✅ Telegram bot created (@BotFather)
2. ✅ OpenAI API key
3. ✅ GitHub account (to push your code)
4. ✅ Railway account (free at [railway.app](https://railway.app))

## Deployment Steps

### 1. Prepare Your Code

Your code is already configured for Railway! ✅

The important files:
- `railway.json` - Railway configuration
- `package.json` - Build and start scripts
- `.gitignore` - Excludes .env files (important!)

### 2. Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Ready for Railway deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/telegram-translator.git
git branch -M main
git push -u origin main
```

### 3. Deploy on Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign in** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**
6. **Railway will auto-detect and start deploying!**

### 4. Set Environment Variables

In Railway dashboard:

1. **Click on your project**
2. **Go to "Variables" tab**
3. **Add these variables:**

```env
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=production
PORT=3000
```

**Important:** Don't include quotes around the values!

### 5. Deploy!

Railway will automatically:
1. ✅ Install dependencies
2. ✅ Build TypeScript
3. ✅ Start your bot
4. ✅ Keep it running 24/7

**Your bot is now live!** 🎉

### 6. Test It

1. Open Telegram
2. Search for your bot
3. Send a message
4. Get a translation!

## Railway Dashboard

After deployment, you'll see:
- **Logs** - Real-time logs of your bot
- **Metrics** - CPU, memory usage
- **Deployments** - History of all deployments
- **Settings** - Configure everything

## Important Notes

### SQLite Database

⚠️ **Railway uses ephemeral storage** - your SQLite database will reset on each deployment.

**Solutions:**

**Option 1: Railway Volumes (Recommended)**
1. In Railway dashboard, go to "Settings"
2. Click "Add Volume"
3. Mount path: `/app/backend/data`
4. This persists your database across deployments

**Option 2: External Database**
- Use Railway's PostgreSQL addon
- Requires code changes to use PostgreSQL instead of SQLite

**For learning/personal use:** Option 1 (volumes) is perfect!

### Costs

Railway free tier includes:
- $5 credit per month
- ~500 hours of execution
- **More than enough for a personal bot!**

Typical usage:
- Bot running 24/7: ~$3-4/month
- OpenAI API: ~$0.10-0.50/month
- **Total: ~$3.50-4.50/month (fits in free tier!)**

### Auto-Deployments

Railway will automatically redeploy when you push to GitHub:

```bash
git add .
git commit -m "Update bot features"
git push
# Railway automatically deploys!
```

## Troubleshooting

### "Application failed to respond"

Check Railway logs:
1. Click on your deployment
2. View logs
3. Look for errors

Common issues:
- Missing environment variables
- Wrong `TELEGRAM_BOT_TOKEN`
- Invalid `OPENAI_API_KEY`

### Bot not responding

1. **Check Railway logs** - Look for connection errors
2. **Verify environment variables** - All set correctly?
3. **Test bot token** - Try in local development first
4. **Check Railway status** - Is the service running?

### Database keeps resetting

**Solution:** Add a Railway volume (see SQLite section above)

### Out of credits

Railway free tier gives $5/month. If you run out:
- Check usage in dashboard
- Add payment method for overage
- Or optimize (unlikely needed for personal use)

## Monitoring Your Bot

### View Logs
```bash
# In Railway dashboard: Deployments > View Logs
```

### Check Status
```bash
# Your bot will log:
# "Telegram bot ready: @your_bot_username"
# "✅ Telegram Translation Bot is ready!"
```

### Metrics
Railway shows:
- CPU usage
- Memory usage
- Request counts
- Error rates

## Updating Your Bot

```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push

# Railway auto-deploys!
# Wait ~2 minutes
# Bot restarts with new code
```

## Environment Variables Reference

Required:
```env
TELEGRAM_BOT_TOKEN=your-token
OPENAI_API_KEY=your-key
```

Optional (with defaults):
```env
NODE_ENV=production
PORT=3000
OPENAI_MODEL=gpt-4-turbo-preview
DATABASE_PATH=./data/database.sqlite
```

## Advanced: Custom Domain (Optional)

1. In Railway: Settings > Networking
2. Add your domain
3. Update DNS records
4. Your bot API will be at: `your-domain.com`

**(Not needed for Telegram bot - bot works regardless!)**

## Rollback

If something breaks:

1. Go to Railway dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "Redeploy"

## Local Development vs Production

| Feature | Local | Railway |
|---------|-------|---------|
| **Command** | `npm run dev` | Auto-deployed |
| **Logs** | Terminal | Railway dashboard |
| **Database** | Persisted | Needs volume |
| **Environment** | `.env` file | Railway variables |
| **Updates** | Save & reload | Git push |

## Security

✅ **Your secrets are safe:**
- `.env` files are gitignored
- Environment variables stored securely in Railway
- Database is private to your service
- HTTPS enabled by default

## Need Help?

1. Check Railway logs first
2. Verify environment variables
3. Test locally with `npm run dev`
4. Check Railway status page
5. Railway has great Discord support!

## Success Checklist

After deployment, verify:
- [ ] Railway shows "Success" status
- [ ] Logs show "Telegram bot ready"
- [ ] Can message bot on Telegram
- [ ] Bot responds with translations
- [ ] Translations include educational context
- [ ] Dashboard accessible (if you deployed frontend too)

## Alternative: Deploy Frontend Too

Want the web dashboard on Railway too?

1. **Option A: Same Service**
   - Build frontend and serve static files from backend
   - Requires code changes

2. **Option B: Separate Service (Recommended)**
   - Deploy frontend to Vercel/Netlify (free)
   - Keep backend on Railway
   - Update frontend env vars to point to Railway URL

For a Telegram bot, **you don't need the frontend in production** - it's mainly useful for local development!

---

## Quick Deploy Checklist

```bash
# 1. Push to GitHub
git push

# 2. Connect to Railway
# (Do in Railway dashboard)

# 3. Set env vars in Railway:
TELEGRAM_BOT_TOKEN=...
OPENAI_API_KEY=...

# 4. Add volume for database persistence
# (In Railway settings)

# 5. Deploy! ✅
```

**Your bot will be live in ~5 minutes!** 🚀

---

**Questions?** Check the logs first - they tell you everything!

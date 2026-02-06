# Railway Deployment Setup

## Environment Variables

Add these environment variables to your Railway backend service:

### Required Variables

1. **`OPENAI_API_KEY`**
   - Your OpenAI API key
   - Get from: https://platform.openai.com/api-keys

2. **`TELEGRAM_BOT_TOKEN`**
   - Your Telegram bot token
   - Get from: @BotFather on Telegram

### Webhook Configuration (Recommended for Production)

3. **`TELEGRAM_USE_WEBHOOK`**
   - Value: `true`
   - Enables webhook mode (eliminates polling conflicts)

4. **`WEBHOOK_URL`**
   - Value: Your Railway backend URL
   - Example: `https://backend-production-xxxx.up.railway.app`
   - **Important:** No trailing slash!
   - Find this in Railway → Backend service → Settings → Domains

### Optional Variables

5. **`OPENAI_MODEL`** (optional)
   - Default: `gpt-4-turbo-preview`
   - Options: `gpt-4o`, `gpt-4o-mini`, etc.

6. **`FRONTEND_URL`** (optional)
   - Default: `http://localhost:5173`
   - Set to your Railway frontend URL if deploying frontend

## How to Add Environment Variables

1. Go to your Railway project
2. Click on the **backend** service
3. Go to **Variables** tab
4. Click **+ New Variable**
5. Add each variable with its value
6. Railway will automatically redeploy

## Webhook vs Polling

| Mode | Use Case | Pros | Cons |
|------|----------|------|------|
| **Webhook** | Production (Railway) | ✅ No conflicts<br>✅ Lower latency<br>✅ More efficient | Requires public URL |
| **Polling** | Local development | ✅ Easy setup<br>✅ No URL needed | ⚠️ 409 conflicts<br>⚠️ Higher latency |

## Local Development

For local development, simply **don't set** `TELEGRAM_USE_WEBHOOK` (or set it to `false`).
The bot will automatically use polling mode.

## Troubleshooting

### Bot not receiving messages on Railway

1. Check that `TELEGRAM_USE_WEBHOOK=true` is set
2. Verify `WEBHOOK_URL` matches your Railway backend URL exactly
3. Check Railway logs for "Webhook set successfully" message
4. Test webhook: `curl -X POST https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo`

### 409 Conflict errors

- If using webhooks, these should not appear
- If they do, ensure `TELEGRAM_USE_WEBHOOK=true` is set correctly
- Verify only one instance is running (check Railway deployments)

### Webhook not receiving updates

1. Railway backend must be publicly accessible
2. Check firewall/security settings
3. Verify webhook endpoint is accessible: `curl -X POST https://your-app.up.railway.app/api/telegram/webhook`

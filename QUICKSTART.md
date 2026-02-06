# Quick Start Guide

## Prerequisites

Before starting, make sure you have:
- Node.js 18+ installed
- An OpenAI API key (from https://platform.openai.com/api-keys)
- A WhatsApp account

## Step-by-Step Setup

### 1. Install Dependencies

The dependencies are currently being installed. Wait for `npm install` to complete (this may take a few minutes).

You can check the status by running:
```bash
ps aux | grep "npm install"
```

### 2. Configure Your API Key

Edit `backend/.env` and replace `your-api-key-here` with your actual OpenAI API key:

```bash
# Open the file in your editor
nano backend/.env

# Or use sed to replace directly:
sed -i '' 's/your-api-key-here/sk-YOUR-ACTUAL-API-KEY/' backend/.env
```

### 3. Start the Application

Once npm install completes, start both the backend and frontend:

```bash
npm run dev
```

This will:
- Start the backend server on http://localhost:3000
- Start the frontend on http://localhost:5173
- Both will auto-reload on code changes

### 4. Connect WhatsApp

1. Open your browser to http://localhost:5173
2. You'll see a QR code on the dashboard
3. Open WhatsApp on your phone
4. Go to: **Settings → Linked Devices → Link a Device**
5. Scan the QR code with your phone
6. Wait for the status to change to "Connected"

### 5. Test Translation

Once connected, send yourself a message on WhatsApp:

**Test in Italian:**
```
Ciao, come stai?
```

**Expected Response:**
```
Hello, how are you?
```

**Test in English:**
```
Good morning, how is the weather?
```

**Expected Response:**
```
Buongiorno, com'è il tempo?
```

## Troubleshooting

### npm install is taking too long
- This is normal for the first install (5-10 minutes)
- whatsapp-web.js downloads Chromium, which is large
- Don't interrupt the process

### QR code not showing
- Make sure the backend started without errors
- Check backend logs for any error messages
- Ensure port 3000 is not already in use

### Authentication failed
- Delete `backend/data/.wwebjs_auth` folder
- Restart the backend server
- Try scanning the QR code again

### Translation not working
- Check that your OpenAI API key is correct
- Verify you have credits in your OpenAI account
- Look at the backend console for error messages

## What's Next?

Once everything is working:

1. **View Chats**: Navigate to the Chats page to see all conversations
2. **Check History**: View the Translations page for complete history
3. **Monitor Stats**: Dashboard shows real-time statistics
4. **Configure**: Settings page lets you update your API key

## Need Help?

Check the main README.md for:
- Full API documentation
- Project structure details
- Development guidelines
- Future enhancement plans

Happy translating! 🎉

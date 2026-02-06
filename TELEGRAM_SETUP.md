# How to Create Your Telegram Translation Bot

Follow these simple steps to set up your personal translation bot on Telegram.

## Step 1: Create the Bot on Telegram

1. **Open Telegram** on your phone or computer

2. **Search for @BotFather** in Telegram
   - This is Telegram's official bot creation tool
   - It has a blue verified checkmark

3. **Start a chat** with @BotFather
   - Send the command: `/start`

4. **Create your bot**
   - Send: `/newbot`
   - BotFather will ask for a name and username

5. **Choose a name** for your bot
   - Example: "My Translation Bot"
   - This is the display name users see

6. **Choose a username** for your bot
   - Must end in "bot"
   - Example: "mytranslation_bot"
   - Must be unique

7. **Get your token**
   - BotFather will send you a message with your bot token
   - It looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
   - **Keep this token secret!**

## Step 2: Configure the Server

1. **Open backend/.env** in a text editor

2. **Add your bot token:**
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
   (Replace with your actual token from BotFather)

3. **Make sure your OpenAI API key is set:**
   ```env
   OPENAI_API_KEY=sk-proj-your-key-here
   ```

4. **Save the file**

## Step 3: Start the Server

```bash
npm run dev
```

You should see:
```
Telegram bot ready: @your_bot_username
✅ Telegram Translation Bot is ready!
📱 Start chatting with your bot on Telegram
```

## Step 4: Chat with Your Bot

1. **Open Telegram**

2. **Search for your bot**
   - Use the username you created (e.g., @mytranslation_bot)

3. **Start the bot**
   - Click "START" or send `/start`
   - The bot will send you a welcome message

4. **Send a message to translate**
   - Italian: "Ciao! Come stai?"
   - English: "Hello! How are you?"

5. **Get instant translation!**
   - The bot will detect the language and translate it

## Bot Commands

Your bot supports these commands:

- `/start` - Start the bot and see welcome message
- `/help` - Show help information
- `/stats` - Show your translation statistics (future feature)

## Example Conversation

```
You: Ciao! Come stai oggi?
Bot: Hello! How are you today?

You: What's the weather like?
Bot: Com'è il tempo?

You: Vorrei un caffè per favore
Bot: I would like a coffee please
```

## Troubleshooting

### "ERROR: TELEGRAM_BOT_TOKEN is not set"
- Make sure you added the token to backend/.env
- Check there are no spaces or quotes around the token
- Restart the server after adding the token

### Bot doesn't respond
- Make sure the server is running
- Check the backend logs for errors
- Verify the bot token is correct
- Try sending `/start` first

### Translation not working
- Check your OpenAI API key is correct
- Verify you have credits in your OpenAI account
- Look at backend logs for error messages

### Can't find the bot
- Wait a few minutes after creating it
- Make sure the username ends in "bot"
- Check for typos in the username

## Privacy & Security

- Your bot is **private** - only you can use it (unless you share the username)
- Messages are processed through OpenAI for translation
- Translation history is stored in your local database
- Your bot token is secret - don't share it

## Next Steps

Once your bot is working:

1. **View the dashboard** at http://localhost:5173
   - See all your translations
   - Check statistics
   - Manage settings

2. **Test different phrases**
   - Common greetings
   - Food and dining terms
   - Travel phrases

3. **Explore Phase 2 features** (future)
   - Word-of-hour vocabulary delivery
   - Custom word lists
   - Multiple languages

## Need Help?

Check these files:
- `README.md` - Complete documentation
- `QUICKSTART.md` - Quick setup guide
- `STATUS.md` - Current project status

## Bot Customization (Optional)

You can customize your bot via @BotFather:

1. `/setdescription` - Set bot description
2. `/setabouttext` - Set about text
3. `/setuserpic` - Set profile picture
4. `/setcommands` - Set command list

Example commands to set:
```
start - Start the translation bot
help - Show help information
```

Enjoy your personal translation bot! 🤖🌍

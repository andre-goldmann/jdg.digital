# 🎮 TFT Daily Scraper - Quick Start Guide

Get your daily Team Fight Tactics team composition in seconds!

## 🚀 Quick Start (3 steps)

### 1. Install Playwright browsers (one-time setup)

```bash
npx playwright install chromium
```

### 2. Run the scraper

```bash
cd apps/opencrawl-manager-e2e
node run-daily-tft.js --headed
```

### 3. Check the results

The scraper will:

- ✅ Open TFT Tactics website
- ✅ Select Set 4.5
- ✅ Pick a random team comp
- ✅ Extract champions
- ✅ Format and display the daily post
- ✅ Save results to `test-results/daily-posts/`

## 📋 Example Output

```
📅 Daily TFT Team Comp - Thursday, February 13, 2026
──────────────────────────────────────────────────

🏆 Chosen Brawlers (Set 4.5)

👥 Champions:
   • Maokai
   • Tahm Kench
   • Vi
   • Nunu
   • Shyvana
   • Cho'Gath
   • Xayah
   • Sett

💡 Practice this comp to improve your TFT skills!
🎮 Good luck on the Convergence!
```

## 🔧 Advanced Usage

### Run headless (no browser window)

```bash
node run-daily-tft.js
```

### Target a different Set

```bash
node run-daily-tft.js --set=7
```

### Post to your channel (requires setup)

```bash
node run-daily-tft.js --post
```

## 📤 Setup Channel Posting

### Discord

1. In your Discord server, go to Server Settings → Integrations → Webhooks
2. Click "New Webhook"
3. Name it "TFT Daily Bot"
4. Select the #daily_tft channel
5. Copy the webhook URL
6. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
7. Edit `.env` and add:
   ```
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_URL
   ```
8. Run with posting enabled:
   ```bash
   node run-daily-tft.js --post
   ```

### Slack

1. Go to https://api.slack.com/messaging/webhooks
2. Create an incoming webhook for your workspace
3. Select the #daily_tft channel
4. Copy the webhook URL
5. Add to your `.env` file:
   ```
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

## ⏰ Schedule Daily Runs

### Windows (Task Scheduler)

```powershell
$action = New-ScheduledTaskAction -Execute "node" -Argument "run-daily-tft.js --post" -WorkingDirectory "C:\path\to\opencrawl-manager-e2e"
$trigger = New-ScheduledTaskTrigger -Daily -At 9AM
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "TFT Daily Scraper"
```

### Linux/Mac (cron)

```bash
# Edit crontab
crontab -e

# Add this line (runs at 9 AM daily)
0 9 * * * cd /path/to/opencrawl-manager-e2e && node run-daily-tft.js --post
```

## 🐛 Troubleshooting

### Browser doesn't open

Make sure Playwright browsers are installed:

```bash
npx playwright install
```

### Can't find Set 4.5

The website structure may have changed. Check screenshots in `test-results/`:

- `tft-before-filter.png`
- `tft-after-filter.png`
- `tft-selected-comp.png`

### No champions found

Run in headed mode to see what's happening:

```bash
node run-daily-tft.js --headed
```

## 📚 More Options

See the full [README.md](./README.md) for detailed documentation.

## 🤝 Need Help?

- Check the [Playwright documentation](https://playwright.dev/)
- View the test files for customization
- Open an issue if something doesn't work

Happy TFT learning! 🎉

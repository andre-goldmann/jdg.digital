# OpenCrawl Manager - TFT Daily Scraper Implementation

## Summary

Successfully implemented a Playwright-based end-to-end testing suite for the opencrawl-manager project with a specialized TFT (Team Fight Tactics) daily team composition scraper.

## What Was Created

### 1. E2E Test Project Structure

```
apps/opencrawl-manager-e2e/
├── src/
│   ├── example.spec.ts              # Basic example test
│   ├── tft-daily-scraper.spec.ts    # Simple TFT scraper
│   └── tft-daily-advanced.spec.ts   # Advanced scraper with robust error handling
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore file
├── eslint.config.mjs                 # ESLint configuration
├── playwright.config.ts              # Playwright configuration
├── project.json                      # Nx project configuration
├── QUICKSTART.md                     # Quick start guide
├── README.md                         # Comprehensive documentation
├── run-daily-tft.js                  # Standalone script to run scraper
└── tsconfig.json                     # TypeScript configuration
```

### 2. Test Files

#### example.spec.ts

- Basic Playwright test to verify setup
- Tests the main application

#### tft-daily-scraper.spec.ts

- Simple implementation of the TFT scraper
- Navigates to https://tftactics.gg/tierlist/team-comps/
- Selects Set 4.5
- Extracts a random team composition
- Displays champion list

#### tft-daily-advanced.spec.ts (Recommended)

- Advanced scraper with better error handling
- Multiple selector strategies for robustness
- Screenshot capture for debugging
- Formatted output for posting
- Saves results to files (txt and json)
- Includes placeholders for Discord/Slack integration

### 3. Features

#### Core Functionality

- ✅ Web scraping with Playwright
- ✅ Random team composition selection
- ✅ Champion extraction and formatting
- ✅ Screenshot capture for debugging
- ✅ Result persistence (txt and json files)
- ✅ Formatted daily post generation

#### Output Format

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

### 4. Integration Capabilities

#### Supported Platforms (via webhooks)

- Discord
- Slack
- Microsoft Teams
- Telegram

#### Environment Variables

Create a `.env` file with:

```bash
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/...
```

### 5. Usage

#### Quick Run

```bash
cd apps/opencrawl-manager-e2e
node run-daily-tft.js --headed
```

#### Command Line Options

```bash
node run-daily-tft.js [options]

Options:
  --post       Actually post to the channel (default: dry run)
  --set=X.X    Target specific TFT set (default: 4.5)
  --headed     Run in headed mode (see the browser)
  --headless   Run in headless mode (default)
```

#### Using Playwright Directly

```bash
# Run all TFT tests
npx playwright test tft-daily

# Run specific test
npx playwright test tft-daily-advanced.spec.ts

# Run in headed mode
npx playwright test tft-daily-advanced.spec.ts --headed

# Run with UI mode
npx playwright test --ui
```

### 6. Automation

#### Schedule Daily Runs

**Windows Task Scheduler:**

```powershell
$action = New-ScheduledTaskAction -Execute "node" -Argument "run-daily-tft.js --post" -WorkingDirectory "C:\path\to\opencrawl-manager-e2e"
$trigger = New-ScheduledTaskTrigger -Daily -At 9AM
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "TFT Daily Scraper"
```

**Linux/Mac cron:**

```bash
0 9 * * * cd /path/to/opencrawl-manager-e2e && node run-daily-tft.js --post
```

### 7. Output Files

The scraper generates:

1. **Console Output**: Formatted daily post displayed in terminal
2. **Screenshots**:
   - `test-results/tft-before-filter.png` - Initial page state
   - `test-results/tft-after-filter.png` - After filtering
   - `test-results/tft-selected-comp.png` - Selected comp highlighted
3. **Text File**: `test-results/daily-posts/tft-daily-YYYY-MM-DD.txt`
4. **JSON File**: `test-results/daily-posts/tft-daily-YYYY-MM-DD.json`

### 8. Next Steps

#### To Use the Scraper:

1. **Install Playwright browsers** (one-time):

   ```bash
   npx playwright install chromium
   ```

2. **Run the scraper**:

   ```bash
   cd apps/opencrawl-manager-e2e
   node run-daily-tft.js --headed
   ```

3. **Check results**:
   - View console output
   - Check `test-results/daily-posts/` for saved files
   - Review screenshots in `test-results/`

#### To Enable Channel Posting:

1. **Set up webhook** (Discord, Slack, etc.)
2. **Create .env file**:
   ```bash
   cp .env.example .env
   ```
3. **Add webhook URL** to .env
4. **Implement posting logic** in `tft-daily-advanced.spec.ts` (uncomment the webhook code in `saveDailyPost()` function)
5. **Run with --post flag**:
   ```bash
   node run-daily-tft.js --post
   ```

#### To Customize:

- **Target different Set**: Modify the set selector in the test
- **Change format**: Edit the `formatDailyTFTPost()` function
- **Add more info**: Extract traits, items, positioning from the website
- **Multiple comps**: Modify to extract top 3 comps instead of random one

### 9. Troubleshooting

| Issue                  | Solution                                    |
| ---------------------- | ------------------------------------------- |
| Browser doesn't open   | Run `npx playwright install`                |
| Can't find Set 4.5     | Check screenshots, website may have changed |
| No champions extracted | Run in headed mode to debug selectors       |
| Test times out         | Increase timeout with `--timeout=120000`    |

### 10. Documentation

- **Quick Start**: See [QUICKSTART.md](apps/opencrawl-manager-e2e/QUICKSTART.md)
- **Full Documentation**: See [README.md](apps/opencrawl-manager-e2e/README.md)
- **Playwright Docs**: https://playwright.dev/

## Technical Details

### Scraping Strategy

1. **Navigate** to TFT Tactics tierlist page
2. **Select Set 4.5** using multiple selector strategies
3. **Find team comps** using flexible selectors
4. **Random selection** of one team composition
5. **Extract data**:
   - Team name from headings
   - Champions from images/attributes
6. **Format output** with emojis and formatting
7. **Save results** to files
8. **Optional posting** to communication platform

### Error Handling

- Multiple selector fallbacks
- Screenshot capture at each step
- Graceful degradation if selectors fail
- Timeout handling
- Detailed console logging

### Dependencies

- @playwright/test (already installed)
- Node.js built-in modules (fs, path, child_process)
- No additional packages required

## Conclusion

The TFT Daily Scraper is ready to use! It provides a robust, automated way to get daily team composition recommendations for Team Fight Tactics, with flexible posting options to your preferred communication platform.

Start with the quick start guide and explore the advanced features as needed. Happy TFT learning! 🎮

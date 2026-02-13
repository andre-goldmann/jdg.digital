# OpenCrawl Manager E2E Tests

Playwright end-to-end tests for the OpenCrawl Manager application, including a daily TFT team composition scraper.

## Setup

1. Install dependencies (if not already installed):

   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### Run all tests

```bash
npx nx e2e opencrawl-manager-e2e
```

### Run specific test

```bash
npx nx e2e opencrawl-manager-e2e --grep "TFT"
```

### Run with UI mode

```bash
npx playwright test --ui
```

### Run in headed mode (see the browser)

```bash
npx playwright test --headed
```

## TFT Daily Scraper

### Overview

The TFT Daily Scraper automatically fetches a random Team Fortress Tactics team composition from Set 4.5 and formats it for posting to your daily_tft channel.

### Features

- ✅ Navigates to https://tftactics.gg/tierlist/team-comps/
- ✅ Filters for Set 4.5 team compositions
- ✅ Randomly selects a team comp
- ✅ Extracts team name and champion list
- ✅ Formats a beautiful daily post
- ✅ Saves results to files (txt and json)
- ✅ Takes screenshots for debugging
- ⏳ Posts to your daily_tft channel (requires configuration)

### Running the Daily Scraper

```bash
# Run the basic scraper
npx playwright test tft-daily-scraper.spec.ts

# Run the advanced scraper with better DOM navigation
npx playwright test tft-daily-advanced.spec.ts

# Run in headed mode to see it in action
npx playwright test tft-daily-advanced.spec.ts --headed
```

### Output

The scraper generates:

1. **Console output**: Formatted daily post
2. **Screenshots**: `test-results/tft-*.png` for debugging
3. **Text file**: `test-results/daily-posts/tft-daily-YYYY-MM-DD.txt`
4. **JSON file**: `test-results/daily-posts/tft-daily-YYYY-MM-DD.json`

Example output:

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

### Posting to Channels

To enable automatic posting to your communication platform, set up environment variables:

#### Discord

1. Create a webhook in your Discord channel
2. Set the environment variable:
   ```bash
   export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
   ```

#### Slack

1. Create an incoming webhook in your Slack workspace
2. Set the environment variable:
   ```bash
   export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
   ```

Then uncomment and customize the posting logic in the test files.

### Scheduling Daily Runs

You can schedule the scraper to run daily using:

#### Windows Task Scheduler

```powershell
# Create a scheduled task
schtasks /create /tn "TFT Daily Scraper" /tr "npx playwright test tft-daily-advanced.spec.ts" /sc daily /st 09:00
```

#### Cron (Linux/Mac)

```bash
# Add to crontab
0 9 * * * cd /path/to/project && npx playwright test tft-daily-advanced.spec.ts
```

#### GitHub Actions

See `.github/workflows/tft-daily.yml` (if created) for CI/CD integration.

## Test Structure

- `example.spec.ts` - Basic example test
- `tft-daily-scraper.spec.ts` - Simple TFT scraper
- `tft-daily-advanced.spec.ts` - Advanced scraper with better error handling and debugging

## Troubleshooting

### Test fails to find Set 4.5

The website structure may have changed. Check the screenshots in `test-results/` to debug:

- `tft-before-filter.png` - Initial page state
- `tft-after-filter.png` - After attempting to filter
- `tft-selected-comp.png` - Selected team composition (highlighted in red)

### No champions extracted

The scraper tries multiple strategies to find champions. If it fails:

1. Check the screenshots
2. Inspect the website manually
3. Update the selectors in the test file

### Want to target a different Set?

Modify the Set selector in the test file, for example change `"Set 4.5"` to `"Set 7"`.

## Documentation

- [Playwright Documentation](https://playwright.dev/)
- [Nx Playwright Plugin](https://nx.dev/nx-api/playwright)
- [TFT Tactics Website](https://tftactics.gg/)

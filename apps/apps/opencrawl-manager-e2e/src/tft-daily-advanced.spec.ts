import { test, expect } from '@playwright/test';

/**
 * Advanced TFT Team Composition Scraper with better DOM navigation
 * This version uses more robust selectors and navigation patterns
 */
test.describe('TFT Daily Team Comp - Advanced Scraper', () => {
  test('scrape and post daily TFT team comp from Set 4.5', async ({ page }) => {
    // Enable console logging
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

    await test.step('Navigate to TFT Tactics and wait for content', async () => {
      await page.goto('https://tftactics.gg/tierlist/team-comps/', {
        waitUntil: 'domcontentloaded',
      });

      // Wait for the main content to be visible
      await page.waitForSelector('body', { state: 'visible' });
      await page.waitForTimeout(2000); // Give time for dynamic content
    });

    await test.step('Select Set 4.5 filter', async () => {
      // Take a screenshot for debugging
      await page.screenshot({
        path: 'test-results/tft-before-filter.png',
        fullPage: true,
      });

      // Try to find and click Set 4.5 filter
      // This might be a button, link, or dropdown option
      const set45Selectors = [
        'button:has-text("Set 4.5")',
        'a:has-text("Set 4.5")',
        '[data-set="4.5"]',
        'select option:has-text("Set 4.5")',
        'text=Set 4.5',
        '.set-selector:has-text("4.5")',
      ];

      let clicked = false;
      for (const selector of set45Selectors) {
        try {
          const element = page.locator(selector).first();
          if (await element.isVisible({ timeout: 2000 })) {
            await element.click();
            clicked = true;
            console.log(`✓ Clicked Set 4.5 using selector: ${selector}`);
            break;
          }
        } catch (e) {
          // Try next selector
          continue;
        }
      }

      if (!clicked) {
        console.log(
          '⚠ Could not find Set 4.5 selector, proceeding with current page state'
        );
      }

      await page.waitForTimeout(1500);
      await page.screenshot({
        path: 'test-results/tft-after-filter.png',
        fullPage: true,
      });
    });

    await test.step('Extract team compositions and select random one', async () => {
      // Get the page content for analysis
      const pageContent = await page.content();

      // Look for team composition containers with various possible selectors
      const teamCompSelectors = [
        '.team-comp',
        '.composition',
        '[class*="comp-"]',
        '[class*="tier"]',
        '.build',
        '[data-testid*="comp"]',
      ];

      let teamComps = null;
      let usedSelector = '';

      for (const selector of teamCompSelectors) {
        const elements = page.locator(selector);
        const count = await elements.count();
        if (count > 0) {
          teamComps = elements;
          usedSelector = selector;
          console.log(
            `✓ Found ${count} team comps using selector: ${selector}`
          );
          break;
        }
      }

      // If we still can't find specific team comp containers,
      // try to find all sections or articles on the page
      if (!teamComps || (await teamComps.count()) === 0) {
        teamComps = page.locator('article, section, [class*="card"]');
        usedSelector = 'article, section, [class*="card"]';
        console.log(`⚠ Using fallback selector: ${usedSelector}`);
      }

      const compCount = await teamComps.count();
      expect(compCount).toBeGreaterThan(0);

      // Select a random team comp
      const randomIndex = Math.floor(Math.random() * compCount);
      const selectedComp = teamComps.nth(randomIndex);

      console.log(
        `\n📊 Selected composition ${randomIndex + 1} of ${compCount}`
      );

      // Highlight the selected comp (for debugging)
      await selectedComp.evaluate((el) => {
        el.style.border = '3px solid red';
      });

      await page.screenshot({
        path: 'test-results/tft-selected-comp.png',
        fullPage: true,
      });
    });

    await test.step('Extract team name and champion list', async () => {
      // Re-select the comp after screenshot
      const teamComps = page.locator(
        '.team-comp, .composition, [class*="comp-"], [class*="tier"], .build, article, section'
      );
      const compCount = await teamComps.count();
      const randomIndex = Math.floor(Math.random() * compCount);
      const selectedComp = teamComps.nth(randomIndex);

      // Extract team name
      const teamName = await extractTeamName(selectedComp);
      console.log(`\n🎮 Team: ${teamName}`);

      // Extract champions
      const champions = await extractChampions(selectedComp, page);

      console.log('\n👥 Champions:');
      champions.forEach((champ) => console.log(`   - ${champ}`));

      expect(champions.length).toBeGreaterThan(0);

      // Format and display the daily message
      const message = formatDailyTFTPost(teamName, champions);
      console.log('\n' + '='.repeat(60));
      console.log(message);
      console.log('='.repeat(60) + '\n');

      // Save to file for posting
      await saveDailyPost(message);
    });
  });
});

/**
 * Extract team name from composition element
 */
async function extractTeamName(compElement: any): Promise<string> {
  const nameSelectors = [
    'h1',
    'h2',
    'h3',
    'h4',
    '[class*="title"]',
    '[class*="name"]',
    '[class*="comp-name"]',
    '.header',
  ];

  for (const selector of nameSelectors) {
    try {
      const nameEl = compElement.locator(selector).first();
      const name = await nameEl.textContent({ timeout: 1000 });
      if (name && name.trim().length > 0) {
        return name.trim();
      }
    } catch (e) {
      continue;
    }
  }

  return 'Mystery Team Comp';
}

/**
 * Extract champion names from composition element
 */
async function extractChampions(
  compElement: any,
  page: any
): Promise<string[]> {
  const champions: string[] = [];

  // Try to find champion images or elements
  const championSelectors = [
    'img[alt*="TFT"]',
    'img[title]',
    '[class*="champion"] img',
    '[class*="unit"] img',
    '[data-champion]',
    '.champion',
    '.unit',
  ];

  for (const selector of championSelectors) {
    const champElements = compElement.locator(selector);
    const count = await champElements.count();

    if (count > 0) {
      console.log(`   Found ${count} champions using: ${selector}`);

      for (let i = 0; i < count; i++) {
        const champ = champElements.nth(i);

        // Try multiple attributes and methods to get champion name
        const name = await extractChampionName(champ);

        if (name && !champions.includes(name)) {
          champions.push(name);
        }
      }

      if (champions.length > 0) {
        break; // Found champions, stop trying other selectors
      }
    }
  }

  // If no champions found, try to extract from text content
  if (champions.length === 0) {
    const text = await compElement.textContent();
    const possibleChamps = text.match(/[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/g);
    if (possibleChamps) {
      champions.push(...possibleChamps.slice(0, 8)); // Take first 8
    }
  }

  return champions;
}

/**
 * Extract champion name from element
 */
async function extractChampionName(element: any): Promise<string | null> {
  const attributes = ['alt', 'title', 'data-champion', 'aria-label'];

  for (const attr of attributes) {
    try {
      const value = await element.getAttribute(attr);
      if (value) {
        // Clean up the name
        let name = value
          .replace(/^TFT\s*/i, '')
          .replace(/\s*-\s*TFT.*$/i, '')
          .replace(/Set\s*\d+(\.\d+)?/gi, '')
          .trim();

        if (name.length > 0 && name.length < 20) {
          return name;
        }
      }
    } catch (e) {
      continue;
    }
  }

  return null;
}

/**
 * Format the daily post message
 */
function formatDailyTFTPost(teamName: string, champions: string[]): string {
  const date = new Date();
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const header = `📅 Daily TFT Team Comp - ${dateStr}`;
  const separator = '─'.repeat(50);
  const teamSection = `\n🏆 ${teamName} (Set 4.5)\n`;
  const champSection = `\n👥 Champions:\n${champions
    .map((c) => `   • ${c}`)
    .join('\n')}`;
  const footer = `\n\n💡 Practice this comp to improve your TFT skills!\n🎮 Good luck on the Convergence!`;

  return `${header}\n${separator}${teamSection}${champSection}${footer}`;
}

/**
 * Save the daily post to a file and prepare for posting
 */
async function saveDailyPost(message: string): Promise<void> {
  const fs = require('fs');
  const path = require('path');

  const outputDir = 'test-results/daily-posts';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const date = new Date().toISOString().split('T')[0];
  const filename = path.join(outputDir, `tft-daily-${date}.txt`);

  fs.writeFileSync(filename, message, 'utf8');
  console.log(`\n💾 Daily post saved to: ${filename}`);

  // Also save as JSON for easy integration
  const jsonData = {
    date: new Date().toISOString(),
    message: message,
    platform: 'daily_tft_channel',
    posted: false,
  };

  const jsonFilename = path.join(outputDir, `tft-daily-${date}.json`);
  fs.writeFileSync(jsonFilename, JSON.stringify(jsonData, null, 2), 'utf8');
  console.log(`📋 JSON data saved to: ${jsonFilename}`);

  // TODO: Implement actual posting to daily_tft channel
  // Example integrations:

  // Discord:
  // const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  // if (webhookUrl) {
  //   await fetch(webhookUrl, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       content: message,
  //       username: 'TFT Daily Bot'
  //     })
  //   });
  // }

  // Slack:
  // const slackWebhook = process.env.SLACK_WEBHOOK_URL;
  // if (slackWebhook) {
  //   await fetch(slackWebhook, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       text: message,
  //       channel: '#daily_tft'
  //     })
  //   });
  // }
}

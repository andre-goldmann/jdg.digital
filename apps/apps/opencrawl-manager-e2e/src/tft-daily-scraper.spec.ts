import { test, expect } from '@playwright/test';

test.describe('TFT Team Composition Scraper', () => {
  test('scrape random TFT team comp from Set 4.5', async ({ page }) => {
    await test.step('Navigate to TFT Tactics tierlist', async () => {
      await page.goto('https://tftactics.gg/tierlist/team-comps/');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Select Set 4.5', async () => {
      // Look for the Set selector dropdown or button
      const setSelector = page.locator('text=/Set.*4\\.5/i').first();

      // Click if it's a button/link, otherwise look for a dropdown
      const isVisible = await setSelector
        .isVisible({ timeout: 5000 })
        .catch(() => false);

      if (isVisible) {
        await setSelector.click();
      } else {
        // Try to find a dropdown or filter that contains Set 4.5
        const dropdown = page.locator('select, [role="combobox"]').first();
        if (await dropdown.isVisible({ timeout: 5000 }).catch(() => false)) {
          await dropdown.click();
          await page.locator('text=/Set.*4\\.5/i').click();
        }
      }

      // Wait for content to load
      await page.waitForTimeout(2000);
    });

    await test.step('Find and extract random team composition', async () => {
      // Look for team comp containers
      const teamComps = page.locator(
        '[class*="team"], [class*="comp"], .composition, [data-comp]'
      );
      const count = await teamComps.count();

      expect(count).toBeGreaterThan(0);

      // Select a random team comp
      const randomIndex = Math.floor(Math.random() * count);
      const selectedComp = teamComps.nth(randomIndex);

      // Try to get the team name
      const teamNameLocator = selectedComp
        .locator('h1, h2, h3, h4, [class*="title"], [class*="name"]')
        .first();
      const teamName = await teamNameLocator
        .textContent()
        .catch(() => 'Unknown Team');

      console.log(`\n=== Selected Team: ${teamName?.trim()} ===\n`);

      // Extract champions from the selected comp
      const championLocators = selectedComp.locator(
        '[class*="champion"], [class*="unit"], img[alt*="TFT"], img[title]'
      );
      const champCount = await championLocators.count();

      const champions: string[] = [];

      for (let i = 0; i < champCount; i++) {
        const champ = championLocators.nth(i);

        // Try multiple ways to get champion name
        let champName = await champ.getAttribute('alt').catch(() => null);
        if (!champName) {
          champName = await champ.getAttribute('title').catch(() => null);
        }
        if (!champName) {
          champName = await champ
            .getAttribute('data-champion')
            .catch(() => null);
        }
        if (!champName) {
          // Try to find text near the image
          const parent = champ.locator('..');
          champName = await parent.textContent().catch(() => null);
        }

        if (champName && champName.trim()) {
          // Clean up the name (remove "TFT" prefix if exists)
          const cleanName = champName.replace(/^TFT\s*/i, '').trim();
          if (cleanName && !champions.includes(cleanName)) {
            champions.push(cleanName);
          }
        }
      }

      // Log the champion list
      console.log('Champions:');
      champions.forEach((champ) => console.log(`- ${champ}`));

      // Create formatted message for daily_tft channel
      const dailyMessage = formatDailyTFTMessage(
        teamName?.trim() || 'Unknown Team',
        champions
      );
      console.log('\n=== Daily TFT Post ===');
      console.log(dailyMessage);

      // TODO: Post to daily_tft channel (Discord/Slack/etc)
      // await postToDailyTFTChannel(dailyMessage);

      expect(champions.length).toBeGreaterThan(0);
    });
  });
});

/**
 * Format the TFT team composition as a message for the daily_tft channel
 */
function formatDailyTFTMessage(teamName: string, champions: string[]): string {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    `**Daily TFT Team Comp - ${date}**\n\n` +
    `🎮 **${teamName}** (Set 4.5)\n\n` +
    `Champions:\n${champions.map((c) => `- ${c}`).join('\n')}\n\n` +
    `Good luck on the Rift! 🏆`
  );
}

/**
 * Post the message to the daily_tft channel
 * This is a placeholder - implement based on your platform (Discord, Slack, etc.)
 */
async function postToDailyTFTChannel(message: string): Promise<void> {
  // Example for Discord webhook:
  // const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  // if (webhookUrl) {
  //   await fetch(webhookUrl, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ content: message })
  //   });
  // }

  // Example for Slack webhook:
  // const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  // if (webhookUrl) {
  //   await fetch(webhookUrl, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ text: message })
  //   });
  // }

  console.log(
    'Message ready to post (implement your channel posting logic here)'
  );
}

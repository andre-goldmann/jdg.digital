#!/usr/bin/env node

/**
 * WhaleWisdom Scraper - Node.js Version
 * Extracts top buys and top sells data from WhaleWisdom filer pages and returns results as JSON.
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';

class WhaleWisdomScraper {
    constructor(baseUrl = 'https://whalewisdom.com') {
        this.baseUrl = baseUrl;
        this.axiosInstance = axios.create({
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
    }

    async getFilerData(filerName) {
        const url = `${this.baseUrl}/filer/${filerName}`;
        
        try {
            const response = await this.axiosInstance.get(url);
            const $ = cheerio.load(response.data);
            
            // Extract basic fund information
            const fundInfo = this._extractFundInfo($);
            
            // Extract top buys
            const topBuys = this._extractTopBuys($);
            
            // Extract top sells
            const topSells = this._extractTopSells($);
            
            // Extract 13F activity data
            const activityData = this._extract13FActivity($);
            
            return {
                filer_name: filerName,
                url: url,
                fund_info: fundInfo,
                top_buys: topBuys,
                top_sells: topSells,
                activity_data: activityData,
                scraped_at: new Date().toISOString()
            };
            
        } catch (error) {
            return {
                error: `Failed to fetch/parse data: ${error.message}`,
                filer_name: filerName,
                url: url
            };
        }
    }

    _extractFundInfo($) {
        const info = {};
        
        // Fund name
        const fundNameElem = $('h1').first();
        if (fundNameElem.length) {
            info.name = fundNameElem.text().trim();
        }
        
        // Look for clean descriptive text rather than parsing messy location data
        const description = $('div').filter((i, el) => {
            const text = $(el).text();
            return text.includes('based out of') && text.includes('13F filing') && text.length < 1000;
        }).first().text().trim();
        
        if (description) {
            info.description = description;
            
            // Extract location from description
            const locationMatch = description.match(/based out of ([^.]+)\./);
            if (locationMatch) {
                info.location = locationMatch[1].trim();
            }
            
            // Extract market value
            const marketValueMatch = description.match(/\$([0-9,]+)/);
            if (marketValueMatch) {
                info.market_value = marketValueMatch[0];
            }
            
            // Extract concentration
            const concentrationMatch = description.match(/concentration of ([0-9.]+%)/);
            if (concentrationMatch) {
                info.top_10_concentration = concentrationMatch[1];
            }
            
            // Extract largest holding
            const holdingMatch = description.match(/largest holding is ([^with]+)/);
            if (holdingMatch) {
                info.largest_holding = holdingMatch[1].trim();
            }
        }
        
        return info;
    }

    _extractTopBuys($) {
        const buys = [];
        
        // Find tables with stock symbols and look for the one with "% Change" header
        $('table').each((i, table) => {
            const $table = $(table);
            const hasStockData = $table.find('strong').length > 0;
            const hasPercentChange = $table.text().includes('% Change');
            
            if (hasStockData && hasPercentChange) {
                $table.find('tr').each((j, row) => {
                    const $row = $(row);
                    const cells = $row.find('td');
                    
                    if (cells.length >= 2) {
                        const nameCell = $(cells[0]);
                        const symbol = nameCell.find('strong').text().trim();
                        const name = nameCell.find('a').text().trim();
                        const percentage = $(cells[1]).text().trim();
                        
                        // Only add if we have meaningful data and it's not a header
                        if (symbol && name && percentage && 
                            percentage !== 'Name' && percentage !== '% Change' &&
                            percentage.includes('%')) {
                            buys.push({
                                symbol: symbol,
                                name: name,
                                percentage_change: percentage
                            });
                        }
                    }
                });
                return false; // Found the table, no need to continue
            }
        });
        
        return buys;
    }

    _extractTopSells($) {
        const sells = [];
        
        // For Amanah Holdings Trust, there are no sells, but let's implement the logic anyway
        // Find tables with stock symbols but look for sell-specific patterns
        $('table').each((i, table) => {
            const $table = $(table);
            const hasStockData = $table.find('strong').length > 0;
            const hasPercentChange = $table.text().includes('% Change');
            
            // This would be a different table than the buys table
            // For now, return empty since we know this fund has no sells
            if (hasStockData && hasPercentChange && i > 0) { // Skip first table (buys)
                $table.find('tr').each((j, row) => {
                    const $row = $(row);
                    const cells = $row.find('td');
                    
                    if (cells.length >= 2) {
                        const nameCell = $(cells[0]);
                        const symbol = nameCell.find('strong').text().trim();
                        const name = nameCell.find('a').text().trim();
                        const percentage = $(cells[1]).text().trim();
                        
                        // Only add if we have meaningful data and it's not a header
                        if (symbol && name && percentage && 
                            percentage !== 'Name' && percentage !== '% Change' &&
                            percentage.includes('%')) {
                            sells.push({
                                symbol: symbol,
                                name: name,
                                percentage_change: percentage
                            });
                        }
                    }
                });
            }
        });
        
        return sells;
    }

    _extract13FActivity($) {
        const activity = {};
        
        // Find the activity table (table 3 based on debug output)
        $('table').each((i, table) => {
            const $table = $(table);
            const tableText = $table.text();
            
            // Look for the table containing activity data
            if (tableText.includes('Market Value') && tableText.includes('New Purchases')) {
                $table.find('tr').each((j, row) => {
                    const $row = $(row);
                    const cells = $row.find('td');
                    
                    if (cells.length >= 2) {
                        const key = $(cells[0]).text().trim();
                        const value = $(cells[1]).text().trim();
                        
                        if (key && value) {
                            // Clean up the key for JSON
                            let keyClean = key.toLowerCase()
                                .replace(/\s+/g, '_')
                                .replace(/%/g, 'percent')
                                .replace(/\[1\]/g, '')
                                .replace(/\[2\]/g, '_alt')
                                .replace(/\(/g, '')
                                .replace(/\)/g, '');
                            
                            activity[keyClean] = value;
                        }
                    }
                });
                return false; // Found the table, stop looking
            }
        });
        
        return activity;
    }
}

// CLI interface
async function main() {
    const argv = yargs(hideBin(process.argv))
        .usage('Usage: $0 <filer> [options]')
        .command('$0 <filer>', 'Scrape WhaleWisdom filer data', (yargs) => {
            yargs.positional('filer', {
                describe: 'Filer name/slug (e.g., amanah-holdings-trust)',
                type: 'string'
            });
        })
        .option('output', {
            alias: 'o',
            describe: 'Output JSON file path',
            type: 'string'
        })
        .option('pretty', {
            describe: 'Pretty print JSON output',
            type: 'boolean',
            default: false
        })
        .help()
        .argv;

    const scraper = new WhaleWisdomScraper();
    const data = await scraper.getFilerData(argv.filer);
    
    // Format JSON output
    const jsonOutput = argv.pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    
    if (argv.output) {
        fs.writeFileSync(argv.output, jsonOutput);
        console.log(`Data saved to ${argv.output}`);
    } else {
        console.log(jsonOutput);
    }
}

// Run if called directly
main().catch(console.error);

export default WhaleWisdomScraper;

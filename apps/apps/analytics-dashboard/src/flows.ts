import { Chat, genkit, Session } from 'genkit/beta';
import { googleAI, gemini20Flash } from '@genkit-ai/googleai';
import { parse } from 'partial-json';
import { z } from 'zod';
import { analysisPrompt } from './prompts';
import { writeFileSync } from 'fs';
const model = gemini20Flash;

const ai = genkit({
  plugins: [googleAI()],
  model
});

let session: Session;

const getDateTime = ai.defineTool(
  {
    name: 'getDateTime',
    description: 'Gets the current date and time',
    outputSchema: z.string(),
  },
  async (input) => {
    // Here, we would typically make an API call or database query. For this
    // example, we just return the date and time.
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return `The current date and time is ${formattedDate} ${formattedTime}`;
  }
);
// TODO: use the prompt from here:
//  https://medium.datadriveninvestor.com/i-used-ai-to-analyze-every-single-us-stock-heres-what-to-look-out-for-in-2025-6223f21cb302
// show the results within the app
// TODO: check all examples here: https://firebase.google.com/docs/genkit?hl=de
// watch again: https://www.youtube.com/watch?v=mx7yZoIa2n4
/**
 * Define a flow to execute. You can call any flow using this pattern,
 * such as those that use `generate()` to generate text or images
 * outside the context of a chat session.
 */
export const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: z.object({
      userInput: z.string(),
      sessionId: z.string(),
      clearSession: z.boolean()
    }),
    outputSchema: z.object({
      agentResponse: z.string(),
      options: z.optional(z.array(z.string()))
    })
  },
  async ({ userInput, sessionId, clearSession }) => {
    if (userInput.length === 0) {
      userInput = 'Hi';
    }
    console.info("Users input: ", userInput);
    let chat: Chat;
    if (clearSession) {
      session = ai.createSession({ sessionId });
      await session.updateMessages(sessionId, []);
    }
    chat = session.chat({ sessionId, model, tools: [getDateTime] });
    const prompt = `
    You're a general purpose assistant that can respond to a variety of user queries.

    If the user asks for the date and time, call a tool to get the date and time.

    User input: ${userInput}

    Respond to the user and, if you ask the user a question, provide some options
    for the user to answer your question. You can ask the user clarifying questions
    to get more information.

    Final responses should be structured as follows:

    {
      agentResponse: "INSERT YOUR RESPONSE",
      options: [ // options to answer agentResponse if it is a question
        "option_1",
        "option_2",
        "option_3",
        ...
      ]
    }

    Respond as JSON only. Wrap all field values in double quotes. Do not use single quotes.`

    const { text } = await chat.send({ prompt });
    return parse(maybeStripMarkdown(text));
  }
);

const AnalysisOutput = z.object({
  agentResponse: z.string(),
});

export const analysisFlow = ai.defineFlow(
  {
    name: 'analysisFlow',
    inputSchema: z.object({
      userInput: z.string(),
      sessionId: z.string(),
      clearSession: z.boolean()
    }),
    outputSchema: AnalysisOutput
  },
  async ({ userInput, sessionId, clearSession }) => {
    if (userInput.length === 0) {
      userInput = 'Hi';
    }
    console.info("Users input: ", userInput);
    let chat: Chat;
    if (clearSession) {
      session = ai.createSession({ sessionId });
      await session.updateMessages(sessionId, []);
    }
    chat = session.chat({ sessionId, model, tools: [getDateTime] });

    if('Hi' === userInput) {
      const tex = {
        "agentResponse": "Type or select the company you wanne get the analysis for!",
        "options": [
          "Aal",
          "Google",
          "SHELL"
        ]
      };

      return tex;
    }
    // TODO: get the data from https://app.simfin.com/
    const data = {
      "quarterly": [
        {
          "ticker": "AAL",
          "endDate": "2024-12-31T21:00:00.000Z",
          "totalRevenue": 8000000000,
          "grossProfit": 1200000000,
          "operatingIncome": 500000000,
          "netIncome": 300000000,
          "netIncomeFromContinuingOperations": 300000000,
          "netIncomeAttributableToParent": 300000000,
          "totalCashFromOperatingActivities": 350000000,
          "capitalExpenditure": -15000000,
          "cashFlowFromInvestingActivities": -1205000000,
          "freeCashFlow": 335000000,
          "endPeriodCashFlow": 900000000
        }
      ],
      "earnings": [
        {
          "endDate": "2024-10-24T17:00:00.000Z",
          "ticker": "AAL",
          "estimatedEps": 0.15,
          "actualEps": 0.26,
          "surprisePercent": 87.5
        }
      ],
      "keyMetrics": {
        "aggregateGrowth": {
          "aggregateRevenueGrowth": 495.97315436241615,
          "aggregateGrossProfitGrowth": 276.9230769230769,
          "aggregateNetIncomeGrowth": 163.63636363636363,
          "aggregateOperatingIncomeGrowth": 2147.483647
        }
      },
      "annualRevenueDataQuarterly": [
        {
          "totalRevenue": 67273000000
        }
      ],
      "annualRevenueData": [
        {
          "totalRevenue": 67273000000,
          "operatingIncome": 5344000000,
          "netIncome": 4015000000,
          "totalCashFromOperatingActivities": 20815000000,
          "capitalExpenditure": -453300000,
          "endDate": "2023-10-19"
        }
      ],
      "annual": [
        {
          "totalRevenue": 8.995256928218927e+13,
          "operatingIncome": 1197.3853707063168
        }
      ],
      "yoyGrowth": {
        "2023-10-18-19 to 2024-12-31": {
          "totalRevenue": 0.1858381294448002,
          "grossProfit": 0.16856302319714081,
          "netIncome": 0.11768306377353086,
          "operatingIncome": 0.13367008568537657
        }
      },
      "valuationRatios": {
        "priceToEarningsTtm": 25.323577874377745,
        "priceToSalesTtm": 3.5245638903314156,
        "priceDate": "2024-12-31",
        "highestPrice": 117.49,
        "lowestPrice": 67.49,
        "commonSharesOutstanding": 657138996,
        "marketCap": 77192475576,
        "priceToEarningsTrailing12Months": 25.3235768978768537,
        "priceToSales": 3.5245638903314156,
        "priceToBookValue": 1.44148749245927141,
        "enterpriseValue": 9.9778+10,
        "evToRevenue": 1.1127359019676899,
        "evToEbitda": 4.8004213010
      },
      "bookToMarketValue": -0.42457,
      "sharesOutstanding": 657138996,
      "adjustedClosingPrice": 17.43
    };

    const { text } = await chat.send(analysisPrompt(userInput, data));

    //return parse(maybeStripMarkdown(text));
    return {agentResponse: text};

  }
);

const markdownRegex = /^\s*(```json)?((.|\n)*?)(```)?\s*$/i;
function maybeStripMarkdown(withMarkdown: string) {
  const mdMatch = markdownRegex.exec(withMarkdown);
  if (!mdMatch) {
    return withMarkdown;
  }
  return mdMatch[2];
}

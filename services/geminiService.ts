import { GoogleGenAI, Chat, GenerativeModel } from "@google/genai";
import { MOCK_PORTFOLIO } from '../constants';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are FinChart, an intelligent financial portfolio assistant.
Your goal is to help the user understand their portfolio performance, allocation, and market trends.

Here is the user's CURRENT PORTFOLIO DATA:
${JSON.stringify(MOCK_PORTFOLIO)}

*** CRITICAL RULES FOR RESPONSE ***
1.  **Be Concise:** Answer questions clearly and briefly.
2.  **Data-Driven:** Use the provided portfolio data to answer questions about net worth, specific holdings, or allocation.
3.  **Visualizations:** If the user asks to "visualize", "show a chart", "plot", "graph", or if the question is best answered with a visual breakdown (e.g., "What is my asset allocation?", "Compare my tech stocks"):
    *   You MUST generate a JSON block representing the chart configuration.
    *   The JSON block MUST be wrapped in triple backticks with 'json' language specifier.
    *   The JSON structure MUST strictly follow this interface:
        \`\`\`json
        {
          "type": "chart",
          "chartType": "pie" | "bar" | "line" | "area",
          "title": "String title for the chart",
          "data": [ { "name": "Label", "value": 123, ... } ], 
          "xAxisKey": "name", // The key in data objects to use for X axis labels
          "dataKey": "value", // The key in data objects to use for values
          "yAxisLabel": "Optional Label"
        }
        \`\`\`
    *   For "line" or "area" charts involving time (e.g., "History of AAPL"), since you only have current price, you must SIMULATE realistic historical data points (e.g., last 6 months) for the chart data to make it look real.
4.  **Formatting:** Use standard Markdown for the text part of your response.

Example of a response with a chart:
"Here is the breakdown of your portfolio by Asset Class. You are heavily invested in Stocks."
\`\`\`json
{
  "type": "chart",
  "chartType": "pie",
  "title": "Portfolio Allocation by Asset Class",
  "data": [
    { "name": "Stock", "value": 150000 },
    { "name": "Crypto", "value": 45000 },
    { "name": "Cash", "value": 15000 }
  ],
  "xAxisKey": "name",
  "dataKey": "value"
}
\`\`\`
`;

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // slightly creative for generating mock historical data if needed
      },
    });
  }
  return chatSession;
};

export const parseResponse = (text: string): { text: string; chart: any | null } => {
  const codeBlockRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = text.match(codeBlockRegex);

  if (match && match[1]) {
    try {
      const jsonContent = JSON.parse(match[1]);
      if (jsonContent.type === 'chart') {
        return {
          text: text.replace(match[0], '').trim(),
          chart: jsonContent,
        };
      }
    } catch (e) {
      console.error("Failed to parse chart JSON", e);
    }
  }

  return { text: text, chart: null };
};

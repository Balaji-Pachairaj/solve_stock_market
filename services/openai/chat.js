const OpenAI = require("openai");

class OPEN_AI_CHAT {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getSummaryTopGainerTopLoser(gainer, loser) {
    try {
      const systemPrompt = `
You are a stock market analyst.

Your job:
- Analyze given top gainers and losers
- Provide short, clear summaries
- Mention stock name and explain the movement with percentage and price. 
- Keep it simple and factual.

Return ONLY valid JSON in this format:
{
  "gainers": [
    { "symbol": "", "summary": "" }
  ],
  "losers": [
    { "symbol": "", "summary": "" }
  ]
}
`;

      const userPrompt = `
Top Gainers:
${JSON.stringify(gainer, null, 2)}

Top Losers:
${JSON.stringify(loser, null, 2)}
`;

      const response = await this.client.chat.completions.create({
        model: "gpt-5-nano",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });

      let content = response.choices[0].message.content;

      // Optional: clean JSON if wrapped in ```json
      if (content.includes("```")) {
        content = content.replace(/```json|```/g, "").trim();
      }

      return JSON.parse(content);
    } catch (error) {
      console.error("OpenAI Error:", error.message);
      return {
        gainers: [],
        losers: [],
        error: "Failed to generate summary",
      };
    }
  }
}

module.exports = {
  OPEN_AI_CHAT,
};

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

  async generateEmailforStockSummary(date, data) {
    const prompt = `
You are generating an email report.

Create a clean, professional HTML email for stock gain/loss summary.

Provided data is stock market data of biggest gainer and biggest loser in the top 500 companies in india. data is from ${date} of stock market. mention data in email

Order ascending if lose and descending if gain

Data:
${JSON.stringify(data, null, 2)}


Important : Mention the time of from and to in email content, from and to are UST and add +5:30 into it and display it as just indian date format for laymen to understand. mention all the gain and loss stock. Add all stock into the result of the html. if there are n gainer, should mention n gainer and same for loss
Return ONLY HTML.
`;

    const res = await this.client.chat.completions.create({
      model: "gpt-4o-mini", // cheap + good
      messages: [
        {
          role: "system",
          content: `You generate email HTML.
          
Rules:
- Use simple inline CSS (email safe)
- No external CSS or JS
- Green for gain, red for loss
- Keep it clean and readable
- make it interesting to read

          `,
        },
        { role: "user", content: prompt },
      ],
    });

    return res.choices[0].message.content;
  }
}

module.exports = {
  OPEN_AI_CHAT,
};

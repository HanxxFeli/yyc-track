const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

const client = new TextAnalyticsClient(
  process.env.AZURE_SENTIMENT_ANALYSIS_ENDPOINT,
  new AzureKeyCredential(process.env.AZURE_SENTIMENT_ANALYSIS_KEY)
);

/**
 * Analyzes sentiment of a comment using Azure Text Analytics.
 *
 * Returns one of: "positive" | "negative" | "neutral" | "mixed"
 * Returns null if no text provided or if Azure fails (fail open).
 *
 * We only store the top-level sentiment label — not per-sentence scores.
 */
const analyzeSentiment = async (text) => {
  if (!text || text.trim() === "") return null;

  const results = await client.analyzeSentiment([text]);
  const result = results[0];

  if (result.error) {
    console.error("Azure Sentiment error:", result.error);
    return null; // fail open — don't block submission
  }

  return result.sentiment; // "positive" | "negative" | "neutral" | "mixed"
};

module.exports = { analyzeSentiment };
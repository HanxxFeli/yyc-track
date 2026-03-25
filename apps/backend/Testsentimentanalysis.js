const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
require("dotenv").config();

// 🔑 Replace with your values from Azure Portal
const endpoint = process.env.AZURE_SENTIMENT_ANALYSIS_ENDPOINT;
const apiKey = process.env.AZURE_SENTIMENT_ANALYSIS_KEY;
console.log(endpoint)
console.log(apiKey)

// Create client
const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(apiKey));

async function runSentimentAnalysis() {
  const documents = [
    "I love this product, it's amazing!",
    "The service was terrible and slow.",
    "It was okay, nothing special."
  ];

  try {
    const results = await client.analyzeSentiment(documents);

    results.forEach((doc, index) => {
      if (doc.error) {
        console.error(`Error in document ${index}:`, doc.error);
        return;
      }

      console.log(`\nDocument ${index + 1}:`);
      console.log(`Text: ${documents[index]}`);
      console.log(`Sentiment: ${doc.sentiment}`);
      console.log("Confidence Scores:", doc.confidenceScores);

      // Sentence-level breakdown
      doc.sentences.forEach((sentence, i) => {
        console.log(`  Sentence ${i + 1}: ${sentence.text}`);
        console.log(`  Sentiment: ${sentence.sentiment}`);
        console.log(`  Scores:`, sentence.confidenceScores);
      });
    });

  } catch (err) {
    console.error("Error running sentiment analysis:", err);
  }
}

runSentimentAnalysis();
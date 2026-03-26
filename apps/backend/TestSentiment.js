/**
 * Quick test script for Azure Sentiment Analysis
 * Run with: node testSentiment.js
 *
 * Make sure your .env is set up with:
 *   AZURE_LANGUAGE_ENDPOINT
 *   AZURE_LANGUAGE_KEY
 */

require("dotenv").config();
const { analyzeSentiment } = require("./utils/sentimentAnalysis");

const testCases = [
  {
    label: "Clearly positive",
    text: "This station is amazing, always clean and staff are super helpful!",
  },
  {
    label: "Clearly negative",
    text: "This station is disgusting and I never feel safe here at night.",
  },
  {
    label: "Neutral",
    text: "The train arrived at 8am and departed at 8:05am.",
  },
  {
    label: "Negative",
    text: "The station is clean but the crowding during rush hour is unbearable.",
  },
  {
    label: "Empty comment (should return null)",
    text: "",
  },
];

const runTests = async () => {
  console.log("🧪 Testing Azure Sentiment Analysis...\n");
  console.log("─".repeat(60));

  for (const test of testCases) {
    try {
      console.log(`\n📝 Test: ${test.label}`);
      console.log(`   Text: "${test.text}"`);

      const result = await analyzeSentiment(test.text);

      console.log(`   Sentiment: ${result ?? "null (no comment)"}`);
    } catch (err) {
      console.log(`   Result: ❌ ERROR — ${err.message}`);
    }
  }

  console.log("\n" + "─".repeat(60));
  console.log("✅ Tests complete.\n");
};

runTests();
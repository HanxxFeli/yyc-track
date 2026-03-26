const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/auth");
const {
  getCEITrend,
  getCategoryAverages,
  getSentimentDistribution,
  getStationRankings,
  getStationCEITrend,
  getStationCategoryAverages,
  getStationSentiment,
  getStationFeedbackVolume,
} = require("../controllers/analyticsController");

// ─────────────────────────────────────────────
// ALL STATIONS
// All accept ?period=7d|30d  (default: 7d)
// ─────────────────────────────────────────────
router.get("/cei-trend",          protectAdmin, getCEITrend);
router.get("/category-averages",  protectAdmin, getCategoryAverages);
router.get("/sentiment",          protectAdmin, getSentimentDistribution);
router.get("/station-rankings",   protectAdmin, getStationRankings);

// ─────────────────────────────────────────────
// INDIVIDUAL STATION
// All accept ?period=7d|30d  (default: 7d)
// ─────────────────────────────────────────────
router.get("/station/:stationId/cei-trend",         protectAdmin, getStationCEITrend);
router.get("/station/:stationId/category-averages", protectAdmin, getStationCategoryAverages);
router.get("/station/:stationId/sentiment",         protectAdmin, getStationSentiment);
router.get("/station/:stationId/volume",            protectAdmin, getStationFeedbackVolume);

module.exports = router;
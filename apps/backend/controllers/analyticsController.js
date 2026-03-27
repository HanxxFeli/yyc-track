const Feedback = require("../models/Feedback");
const Station = require("../models/Station");
const mongoose = require("mongoose");

/**
 * Helper: builds a $match date filter based on period query param.
 *
 * How it handles less than 7 or 30 days of data:
 * - We never throw an error or return empty — the aggregation simply
 *   returns whatever data exists within the window.
 * - If only 3 days of data exist in a 7-day window, the graph shows
 *   3 data points. The frontend should handle sparse data gracefully.
 * - The response always includes `periodDays` and `actualDataDays` so
 *   the frontend knows how much real data backs the result.
 */
const getDateFilter = (period) => {
  const days = period === "30d" ? 30 : 7;
  const since = new Date();
  since.setDate(since.getDate() - days);
  return { $gte: since };
};

// ─────────────────────────────────────────────────────────────────
// ALL STATIONS ANALYTICS
// ─────────────────────────────────────────────────────────────────

/**
 * @desc    Average CEI across all stations over time (for line/bar graph)
 * @route   GET /api/admin/analytics/cei-trend
 * @access  Admin
 *
 * How it works:
 * - Groups all feedback by day within the period
 * - For each day, computes the weighted average CEI across all stations
 *   using the same formula as utils/cei.js
 * - Returns one data point per day that had feedback
 * - If fewer than 7/30 days have data, only those days are returned
 */
const getCEITrend = async (req, res) => {
  try {
    const { period = "7d" } = req.query;
    const dateFilter = getDateFilter(period);

    const trend = await Feedback.aggregate([
      {
        $match: {
          isDeleted: false,
          flagStatus: { $ne: "pending" },
          createdAt: dateFilter,
        },
      },
      {
        // Group by day — compute weighted CEI per day across all stations
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          avgSafety: { $avg: "$ratings.safety" },
          avgCleanliness: { $avg: "$ratings.cleanliness" },
          avgAccessibility: { $avg: "$ratings.accessibility" },
          avgCrowding: { $avg: "$ratings.crowding" },
          avgOverall: { $avg: "$ratings.overall" },
          feedbackCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          feedbackCount: 1,
          // Apply same CEI weights as utils/cei.js
          cei: {
            $round: [
              {
                $multiply: [
                  {
                    $add: [
                      { $multiply: ["$avgSafety", 0.25] },
                      { $multiply: ["$avgCleanliness", 0.25] },
                      { $multiply: ["$avgAccessibility", 0.25] },
                      { $multiply: ["$avgCrowding", 0.25] },
                    ],
                  },
                  20,
                ],
              },
              1,
            ],
          },
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json({
      period,
      periodDays: period === "30d" ? 30 : 7,
      actualDataDays: trend.length, // may be less than periodDays if data is sparse
      trend,
    });
  } catch (err) {
    console.error("getCEITrend error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

/**
 * @desc    Average category scores across all stations for a period
 * @route   GET /api/admin/analytics/category-averages
 * @access  Admin
 *
 * How it works:
 * - Averages all 5 rating categories across every feedback submission
 *   in the period, system-wide
 * - Single result object (not a time series)
 * - totalFeedback tells the frontend how many submissions back the averages
 */
const getCategoryAverages = async (req, res) => {
  try {
    const { period = "7d" } = req.query;
    const dateFilter = getDateFilter(period);

    const result = await Feedback.aggregate([
      {
        $match: {
          isDeleted: false,
          flagStatus: { $ne: "pending" },
          createdAt: dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          avgSafety: { $avg: "$ratings.safety" },
          avgCleanliness: { $avg: "$ratings.cleanliness" },
          avgAccessibility: { $avg: "$ratings.accessibility" },
          avgCrowding: { $avg: "$ratings.crowding" },
          avgOverall: { $avg: "$ratings.overall" },
        },
      },
      {
        $project: {
          _id: 0,
          totalFeedback: 1,
          averages: {
            safety: { $round: ["$avgSafety", 2] },
            cleanliness: { $round: ["$avgCleanliness", 2] },
            accessibility: { $round: ["$avgAccessibility", 2] },
            crowding: { $round: ["$avgCrowding", 2] },
            overall: { $round: ["$avgOverall", 2] },
          },
        },
      },
    ]);

    res.json({
      period,
      data: result[0] ?? {
        totalFeedback: 0,
        averages: {
          safety: null,
          cleanliness: null,
          accessibility: null,
          crowding: null,
          overall: null,
        },
      },
    });
  } catch (err) {
    console.error("getCategoryAverages error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

/**
 * @desc    Sentiment distribution across all stations for a period
 * @route   GET /api/admin/analytics/sentiment
 * @access  Admin
 *
 * How it works:
 * - Counts how many feedback submissions have each sentiment label
 * - Returns both raw counts and percentages
 * - Only counts feedback that has a sentiment label (comment was provided)
 * - Feedback with no comment has sentiment: null and is excluded
 */
const getSentimentDistribution = async (req, res) => {
  try {
    const { period = "7d" } = req.query;
    const dateFilter = getDateFilter(period);

    const result = await Feedback.aggregate([
      {
        $match: {
          isDeleted: false,
          flagStatus: { $ne: "pending" },
          sentiment: { $ne: null }, // only include feedback with a sentiment label
          createdAt: dateFilter,
        },
      },
      {
        $group: {
          _id: "$sentiment",
          count: { $sum: 1 },
        },
      },
    ]);

    // Build a complete object with all 4 labels, defaulting missing ones to 0
    const labels = ["positive", "negative", "neutral", "mixed"];
    const counts = {};
    labels.forEach((l) => (counts[l] = 0));
    result.forEach((r) => (counts[r._id] = r.count));

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    // Calculate percentages — return 0 if no sentiment data yet
    const percentages = {};
    labels.forEach((l) => {
      percentages[l] =
        total > 0 ? parseFloat(((counts[l] / total) * 100).toFixed(1)) : 0;
    });

    res.json({
      period,
      total,
      counts,
      percentages,
    });
  } catch (err) {
    console.error("getSentimentDistribution error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

/**
 * @desc    Top 5 and Bottom 5 stations by CEI score
 * @route   GET /api/admin/analytics/station-rankings
 * @access  Admin
 *
 * How it works:
 * - Reads the pre-computed CEI directly from the Station document
 *   (no aggregation needed — already maintained by utils/cei.js)
 * - Stations with no feedback (cei: null) are excluded from both lists
 * - If fewer than 5 stations have feedback, returns however many exist
 */
const getStationRankings = async (req, res) => {
  try {
    const stations = await Station.find({ cei: { $ne: null } })
      .select("name line cei averageRatings totalFeedback")
      .sort({ cei: -1 }); // highest CEI first

    const top5 = stations.slice(0, 5);
    const bottom5 = stations.slice(-5).reverse(); // lowest CEI first

    res.json({
      top5,
      bottom5,
      totalRankedStations: stations.length, // lets frontend know if < 5
    });
  } catch (err) {
    console.error("getStationRankings error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// ─────────────────────────────────────────────────────────────────
// INDIVIDUAL STATION ANALYTICS
// ─────────────────────────────────────────────────────────────────

/**
 * @desc    CEI trend for a single station over 7 or 30 days
 * @route   GET /api/admin/analytics/station/:stationId/cei-trend
 * @access  Admin
 *
 * How it works:
 * - Same as system-wide CEI trend but filtered to one station
 * - Returns one data point per day that had at least one feedback submission
 * - actualDataDays tells the frontend how many days actually have data
 *   so it can show "Based on X days of data" if sparse
 */
const getStationCEITrend = async (req, res) => {
  try {
    const { stationId } = req.params;
    const { period = "7d" } = req.query;
    const dateFilter = getDateFilter(period);

    const station = await Station.findById(stationId).select("name");
    if (!station) {
      return res.status(404).json({ error: "Station not found." });
    }

    const trend = await Feedback.aggregate([
      {
        $match: {
          stationId: new mongoose.Types.ObjectId(stationId),
          isDeleted: false,
          flagStatus: { $ne: "pending" },
          createdAt: dateFilter,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          avgSafety: { $avg: "$ratings.safety" },
          avgCleanliness: { $avg: "$ratings.cleanliness" },
          avgAccessibility: { $avg: "$ratings.accessibility" },
          avgCrowding: { $avg: "$ratings.crowding" },
          avgOverall: { $avg: "$ratings.overall" },
          feedbackCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          feedbackCount: 1,
          cei: {
            $round: [
              {
                $multiply: [
                  {
                    $add: [
                      { $multiply: ["$avgSafety", 0.25] },
                      { $multiply: ["$avgCleanliness", 0.25] },
                      { $multiply: ["$avgAccessibility", 0.25] },
                      { $multiply: ["$avgCrowding", 0.25] },
                    ],
                  },
                  20,
                ],
              },
              1,
            ],
          },
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json({
      stationId,
      stationName: station.name,
      period,
      periodDays: period === "30d" ? 30 : 7,
      actualDataDays: trend.length,
      trend,
    });
  } catch (err) {
    console.error("getStationCEITrend error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

/**
 * @desc    Average category scores for a single station over 7 or 30 days
 * @route   GET /api/admin/analytics/station/:stationId/category-averages
 * @access  Admin
 *
 * How it works:
 * - Same as system-wide category averages but scoped to one station
 * - Returns a single averaged result for the period, not a time series
 */
const getStationCategoryAverages = async (req, res) => {
  try {
    const { stationId } = req.params;
    const { period = "7d" } = req.query;
    const dateFilter = getDateFilter(period);

    const station = await Station.findById(stationId).select("name");
    if (!station) {
      return res.status(404).json({ error: "Station not found." });
    }

    const result = await Feedback.aggregate([
      {
        $match: {
          stationId: new mongoose.Types.ObjectId(stationId),
          isDeleted: false,
          flagStatus: { $ne: "pending" },
          createdAt: dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          avgSafety: { $avg: "$ratings.safety" },
          avgCleanliness: { $avg: "$ratings.cleanliness" },
          avgAccessibility: { $avg: "$ratings.accessibility" },
          avgCrowding: { $avg: "$ratings.crowding" },
          avgOverall: { $avg: "$ratings.overall" },
        },
      },
      {
        $project: {
          _id: 0,
          totalFeedback: 1,
          averages: {
            safety: { $round: ["$avgSafety", 2] },
            cleanliness: { $round: ["$avgCleanliness", 2] },
            accessibility: { $round: ["$avgAccessibility", 2] },
            crowding: { $round: ["$avgCrowding", 2] },
            overall: { $round: ["$avgOverall", 2] },
          },
        },
      },
    ]);

    res.json({
      stationId,
      stationName: station.name,
      period,
      data: result[0] ?? {
        totalFeedback: 0,
        averages: {
          safety: null,
          cleanliness: null,
          accessibility: null,
          crowding: null,
          overall: null,
        },
      },
    });
  } catch (err) {
    console.error("getStationCategoryAverages error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

/**
 * @desc    Sentiment count for a single station over 7 or 30 days
 * @route   GET /api/admin/analytics/station/:stationId/sentiment
 * @access  Admin
 *
 * How it works:
 * - Same as system-wide sentiment but scoped to one station
 * - Returns counts + percentages for all 4 labels
 * - Useful for showing "this station gets mostly negative feedback"
 */
const getStationSentiment = async (req, res) => {
  try {
    const { stationId } = req.params;
    const { period = "7d" } = req.query;
    const dateFilter = getDateFilter(period);

    const station = await Station.findById(stationId).select("name");
    if (!station) {
      return res.status(404).json({ error: "Station not found." });
    }

    const result = await Feedback.aggregate([
      {
        $match: {
          stationId: new mongoose.Types.ObjectId(stationId),
          isDeleted: false,
          flagStatus: { $ne: "pending" },
          sentiment: { $ne: null },
          createdAt: dateFilter,
        },
      },
      {
        $group: {
          _id: "$sentiment",
          count: { $sum: 1 },
        },
      },
    ]);

    const labels = ["positive", "negative", "neutral", "mixed"];
    const counts = {};
    labels.forEach((l) => (counts[l] = 0));
    result.forEach((r) => (counts[r._id] = r.count));

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const percentages = {};
    labels.forEach((l) => {
      percentages[l] =
        total > 0 ? parseFloat(((counts[l] / total) * 100).toFixed(1)) : 0;
    });

    res.json({
      stationId,
      stationName: station.name,
      period,
      total,
      counts,
      percentages,
    });
  } catch (err) {
    console.error("getStationSentiment error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

/**
 * @desc    Feedback volume per day for a single station
 * @route   GET /api/admin/analytics/station/:stationId/volume
 * @access  Admin
 *
 * How it works:
 * - Counts submissions per day for the station within the period
 * - Good for a bar chart showing engagement over time
 * - Shows if feedback spikes on certain days (e.g. after an incident)
 */
const getStationFeedbackVolume = async (req, res) => {
  try {
    const { stationId } = req.params;
    const { period = "7d" } = req.query;
    const dateFilter = getDateFilter(period);

    const station = await Station.findById(stationId).select("name");
    if (!station) {
      return res.status(404).json({ error: "Station not found." });
    }

    const volume = await Feedback.aggregate([
      {
        $match: {
          stationId: new mongoose.Types.ObjectId(stationId),
          isDeleted: false,
          createdAt: dateFilter,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.json({
      stationId,
      stationName: station.name,
      period,
      totalFeedback: volume.reduce((sum, d) => sum + d.count, 0),
      volume,
    });
  } catch (err) {
    console.error("getStationFeedbackVolume error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

module.exports = {
  // All stations
  getCEITrend,
  getCategoryAverages,
  getSentimentDistribution,
  getStationRankings,
  // Individual station
  getStationCEITrend,
  getStationCategoryAverages,
  getStationSentiment,
  getStationFeedbackVolume,
};

/**
 * seed.js
 *
 * Seeds all test data required for YYC Track test execution.
 * Run with: node seed.js
 *
 * Requires MONGODB_URI in your .env file (or environment).
 * Stations are assumed to already be loaded by the existing station seed script.
 * This script seeds: Users, Admin, and Feedback records only.
 *
 * After inserting feedback it calls recalculateStationCEI() for every station
 * that received feedback so the Station documents have accurate cei,
 * averageRatings, and totalFeedback values — exactly as they would after a
 * real user submission.
 *
 * Safe to re-run — drops and recreates all seeded collections each time.
 */

"use strict";

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ── Inline model definitions ──────────────────────────────────────────────
// Schemas are defined inline so this script has no dependency on your
// project's model files. The password regex/minlength constraints are
// omitted here because we insert pre-hashed values directly.

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    googleId: { type: String, sparse: true, unique: true },
    authMethod: { type: String, enum: ["local", "google"], default: "local" },
    profilePicture: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    postalCode: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const AdminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    profilePicture: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: true },
    emailVerificationCode: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const FeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    ratings: {
      safety: { type: Number, min: 1, max: 5, required: true },
      cleanliness: { type: Number, min: 1, max: 5, required: true },
      accessibility: { type: Number, min: 1, max: 5, required: true },
      crowding: { type: Number, min: 1, max: 5, required: true },
      overall: { type: Number, min: 1, max: 5, required: true },
    },
    comment: { type: String, trim: true, maxlength: 1000 },
    flagCount: { type: Number, default: 0 },
    flagStatus: {
      type: String,
      enum: ["none", "pending", "archived"],
      default: "none",
    },
    sentiment: {
      type: String,
      enum: ["positive", "negative", "neutral", "mixed"],
      default: null,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// strict: false so we don't need to replicate the full Station schema.
// We only need _id/name for lookups and findByIdAndUpdate for CEI writes.
const StationSchema = new mongoose.Schema({ name: String }, { strict: false });

// Guard against double-registration when the script is re-required
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
const Station =
  mongoose.models.Station || mongoose.model("Station", StationSchema);

// ── CEI recalculation ─────────────────────────────────────────────────────
// Inlined from utils/cei.js so the seed produces accurate Station.cei,
// averageRatings, and totalFeedback without importing from your src tree.
// This is the exact same aggregation pipeline your app uses in production.

const WEIGHTS = {
  safety: 0.25,
  cleanliness: 0.25,
  accessibility: 0.25,
  crowding: 0.25,
};

async function recalculateStationCEI(stationId) {
  const result = await Feedback.aggregate([
    {
      // Only count active, non-pending feedback for this station
      $match: {
        stationId: new mongoose.Types.ObjectId(stationId),
        isDeleted: false,
        flagStatus: { $ne: "pending" },
      },
    },
    {
      // Compute per-category averages across all matching feedback
      $group: {
        _id: "$stationId",
        totalFeedback: { $sum: 1 },
        avgSafety: { $avg: "$ratings.safety" },
        avgCleanliness: { $avg: "$ratings.cleanliness" },
        avgAccessibility: { $avg: "$ratings.accessibility" },
        avgCrowding: { $avg: "$ratings.crowding" },
        avgOverall: { $avg: "$ratings.overall" },
      },
    },
    {
      // Apply weights, scale to 0-100, round category averages to 2dp
      $project: {
        _id: 0,
        totalFeedback: 1,
        averageRatings: {
          safety: { $round: ["$avgSafety", 2] },
          cleanliness: { $round: ["$avgCleanliness", 2] },
          accessibility: { $round: ["$avgAccessibility", 2] },
          crowding: { $round: ["$avgCrowding", 2] },
          overall: { $round: ["$avgOverall", 2] },
        },
        cei: {
          $round: [
            {
              $multiply: [
                {
                  $add: [
                    { $multiply: ["$avgSafety", WEIGHTS.safety] },
                    { $multiply: ["$avgCleanliness", WEIGHTS.cleanliness] },
                    { $multiply: ["$avgAccessibility", WEIGHTS.accessibility] },
                    { $multiply: ["$avgCrowding", WEIGHTS.crowding] },
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
  ]);

  if (result.length === 0) {
    // No active feedback remains — reset station scores to null
    await Station.findByIdAndUpdate(stationId, {
      cei: null,
      totalFeedback: 0,
      averageRatings: {
        safety: null,
        cleanliness: null,
        accessibility: null,
        crowding: null,
        overall: null,
      },
    });
    return;
  }

  const { totalFeedback, averageRatings, cei } = result[0];
  await Station.findByIdAndUpdate(stationId, {
    cei,
    totalFeedback,
    averageRatings,
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────

async function hash(plainText) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

function log(msg) {
  console.log(`  ${msg}`);
}

// ── Main ──────────────────────────────────────────────────────────────────

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("ERROR: MONGODB_URI is not set. Add it to your .env file.");
    process.exit(1);
  }

  console.log("\n=== YYC Track Test Data Seed ===\n");
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected.\n");

  // ── 1. Verify stations exist ────────────────────────────────────────────
  const allStations = await Station.find({}).select("_id name").lean();
  if (allStations.length === 0) {
    console.error(
      "ERROR: No stations found. Run your station seed script first.",
    );
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log(`Found ${allStations.length} stations in the database.\n`);

  // Look up a station by name; fall back to array index if name not found.
  function getStation(name, fallbackIndex) {
    return (
      allStations.find((s) => s.name === name) || allStations[fallbackIndex]
    );
  }

  // ── 2. Drop existing seeded collections ────────────────────────────────
  console.log("Dropping existing test data...");
  await User.deleteMany({});
  await Admin.deleteMany({});
  await Feedback.deleteMany({});
  log("Users, Admins, and Feedback cleared.");
  console.log();

  // ── 3. Seed standard user accounts ────────────────────────────────────
  // Password for all standard users: Test@1234
  console.log("Seeding standard user accounts...");
  const userPassword = await hash("Test@1234");

  const users = await User.insertMany(
    [
      {
        firstName: "Test",
        lastName: "User1",
        email: "testuser1@yyctrack.ca",
        password: userPassword,
        authMethod: "local",
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: "Test",
        lastName: "User2",
        email: "testuser2@yyctrack.ca",
        password: userPassword,
        authMethod: "local",
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: "Test",
        lastName: "User3",
        email: "testuser3@yyctrack.ca",
        password: userPassword,
        authMethod: "local",
        isEmailVerified: true,
        isActive: true,
      },
      {
        firstName: "Test",
        lastName: "User4",
        email: "testuser4@yyctrack.ca",
        password: userPassword,
        authMethod: "local",
        isEmailVerified: true,
        isActive: true,
      },
    ],
    { lean: true },
  );

  users.forEach((u) => log(`Created user: ${u.email}`));
  console.log();

  // ── 4. Seed unverified user account ───────────────────────────────────
  // isEmailVerified: false — used for REQ-REG-03 and negative login tests.
  console.log("Seeding unverified user account...");
  const [unverifiedUser] = await User.insertMany(
    [
      {
        firstName: "Unverified",
        lastName: "User",
        email: "unverified@yyctrack.ca",
        password: userPassword,
        authMethod: "local",
        isEmailVerified: false,
        emailVerificationCode: "TEST-VERIFY-CODE-001",
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h from now
        isActive: true,
      },
    ],
    { lean: true },
  );
  log(
    `Created unverified user: ${unverifiedUser.email} (isEmailVerified: false)`,
  );
  console.log();

  // ── 5. Seed admin account ──────────────────────────────────────────────
  // Password: Admin@1234
  console.log("Seeding admin account...");
  const adminPassword = await hash("Admin@1234");
  const [admin] = await Admin.insertMany(
    [
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@yyctrack.ca",
        password: adminPassword,
        isEmailVerified: true,
        isActive: true,
      },
    ],
    { lean: true },
  );
  log(`Created admin: ${admin.email}`);
  console.log();

  // ── 6. Seed existing feedback records ─────────────────────────────────
  // 10 records across 10 stations, all submitted by testuser1.
  // flagStatus: 'none' on all of these so they are counted in the CEI.
  // Used for REQ-FBK-04 (CEI aggregation) and REQ-DSH-01 (dashboard display).
  console.log(
    "Seeding existing feedback records (10 stations, submitted by testuser1)...",
  );
  const testuser1 = users[0];

  const feedbackDocs = await Feedback.insertMany(
    [
      {
        userId: testuser1._id,
        stationId: getStation("City Hall", 0)._id,
        ratings: {
          safety: 4,
          cleanliness: 3,
          accessibility: 5,
          crowding: 2,
          overall: 4,
        },
        comment:
          "Generally good station but can get crowded during peak hours.",
        flagCount: 0,
        flagStatus: "none",
        sentiment: "positive",
        isDeleted: false,
      },
      {
        userId: testuser1._id,
        stationId: getStation("Anderson", 1)._id,
        ratings: {
          safety: 3,
          cleanliness: 4,
          accessibility: 3,
          crowding: 3,
          overall: 3,
        },
        comment: "Average experience. Cleanliness is well maintained.",
        flagCount: 0,
        flagStatus: "none",
        sentiment: "neutral",
        isDeleted: false,
      },
      {
        userId: testuser1._id,
        stationId: getStation("Chinook", 2)._id,
        ratings: {
          safety: 2,
          cleanliness: 2,
          accessibility: 3,
          crowding: 5,
          overall: 2,
        },
        comment: "Very crowded and could use more cleaning.",
        flagCount: 0,
        flagStatus: "none",
        sentiment: "negative",
        isDeleted: false,
      },
      {
        userId: testuser1._id,
        stationId: getStation("Brentwood", 3)._id,
        ratings: {
          safety: 5,
          cleanliness: 5,
          accessibility: 5,
          crowding: 2,
          overall: 5,
        },
        comment: "Excellent station — clean, safe, and easy to navigate.",
        flagCount: 0,
        flagStatus: "none",
        sentiment: "positive",
        isDeleted: false,
      },
      {
        userId: testuser1._id,
        stationId: getStation("Lions Park", 4)._id,
        ratings: {
          safety: 3,
          cleanliness: 3,
          accessibility: 4,
          crowding: 3,
          overall: 3,
        },
        comment: "Decent station. Accessibility ramps are good.",
        flagCount: 0,
        flagStatus: "none",
        sentiment: "neutral",
        isDeleted: false,
      },
      {
        userId: testuser1._id,
        stationId: getStation("Tuscany", 5)._id,
        ratings: {
          safety: 4,
          cleanliness: 3,
          accessibility: 4,
          crowding: 2,
          overall: 4,
        },
        comment: "Quiet station, rarely crowded.",
        flagCount: 0,
        flagStatus: "none",
        sentiment: "positive",
        isDeleted: false,
      },
      {
        userId: testuser1._id,
        stationId: getStation("Saddletowne", 6)._id,
        ratings: {
          safety: 2,
          cleanliness: 2,
          accessibility: 2,
          crowding: 4,
          overall: 2,
        },
        comment: "Needs significant improvement in all areas.",
        flagCount: 0,
        flagStatus: "none",
        sentiment: "negative",
        isDeleted: false,
      },
      {
        userId: testuser1._id,
        stationId: getStation("Southland", 7)._id,
        ratings: {
          safety: 4,
          cleanliness: 4,
          accessibility: 4,
          crowding: 3,
          overall: 4,
        },
        comment: "Well-maintained station overall.",
        flagCount: 0,
        flagStatus: "none",
        sentiment: "positive",
        isDeleted: false,
      },
      {
        userId: testuser1._id,
        stationId: getStation("Crowchild", 8)._id,
        ratings: {
          safety: 3,
          cleanliness: 3,
          accessibility: 3,
          crowding: 3,
          overall: 3,
        },
        comment: "Nothing stands out, just an average station.",
        flagCount: 0,
        flagStatus: "none",
        sentiment: "neutral",
        isDeleted: false,
      },
      {
        userId: testuser1._id,
        stationId: getStation("Sunalta", 9)._id,
        ratings: {
          safety: 4,
          cleanliness: 4,
          accessibility: 3,
          crowding: 2,
          overall: 4,
        },
        comment: "Small but clean and safe.",
        flagCount: 0,
        flagStatus: "none",
        sentiment: "positive",
        isDeleted: false,
      },
    ],
    { lean: true },
  );

  feedbackDocs.forEach((f) => {
    const station = allStations.find(
      (s) => s._id.toString() === f.stationId.toString(),
    );
    log(
      `Created feedback for: ${station ? station.name : f.stationId} (overall: ${f.ratings.overall})`,
    );
  });
  console.log();

  // ── 7. Seed flagged comment records ───────────────────────────────────
  // flagStatus: 'pending' — the CEI aggregation $match excludes these,
  // so they will NOT affect station scores. Submitted by testuser2.
  // Used for REQ-ADM-01 and REQ-ADM-02.
  console.log(
    "Seeding flagged comment records (3 records, submitted by testuser2)...",
  );
  const testuser2 = users[1];

  const flaggedDocs = await Feedback.insertMany(
    [
      {
        userId: testuser2._id,
        stationId: getStation("City Hall", 0)._id,
        ratings: {
          safety: 1,
          cleanliness: 1,
          accessibility: 1,
          crowding: 5,
          overall: 1,
        },
        comment:
          "This is a flagged comment containing inappropriate content — example A.",
        flagCount: 1,
        flagStatus: "pending",
        sentiment: "negative",
        isDeleted: false,
      },
      {
        userId: testuser2._id,
        stationId: getStation("Anderson", 1)._id,
        ratings: {
          safety: 1,
          cleanliness: 2,
          accessibility: 1,
          crowding: 4,
          overall: 1,
        },
        comment:
          "This is a flagged comment containing inappropriate content — example B.",
        flagCount: 2,
        flagStatus: "pending",
        sentiment: "negative",
        isDeleted: false,
      },
      {
        userId: testuser2._id,
        stationId: getStation("Chinook", 2)._id,
        ratings: {
          safety: 1,
          cleanliness: 1,
          accessibility: 2,
          crowding: 5,
          overall: 1,
        },
        comment:
          "This is a flagged comment containing inappropriate content — example C.",
        flagCount: 1,
        flagStatus: "pending",
        sentiment: "negative",
        isDeleted: false,
      },
    ],
    { lean: true },
  );

  flaggedDocs.forEach((f) => {
    const station = allStations.find(
      (s) => s._id.toString() === f.stationId.toString(),
    );
    log(
      `Created flagged feedback for: ${station ? station.name : f.stationId} (flagStatus: ${f.flagStatus})`,
    );
  });
  console.log();

  // ── 8. Seed corrupted / invalid records ───────────────────────────────
  // These reference a non-existent stationId so the dashboard API fails
  // gracefully when trying to join — used for REQ-DSH-03 error handling tests.
  console.log(
    "Seeding corrupted/invalid feedback records (2 records for error handling tests)...",
  );
  const fakeStationId = new mongoose.Types.ObjectId(); // intentionally does not exist in Station collection

  const corruptedDocs = await Feedback.insertMany(
    [
      {
        userId: testuser1._id,
        stationId: fakeStationId,
        ratings: {
          safety: 3,
          cleanliness: 3,
          accessibility: 3,
          crowding: 3,
          overall: 3,
        },
        comment: "Corrupted record A — references a non-existent station.",
        flagCount: 0,
        flagStatus: "none",
        sentiment: null,
        isDeleted: false,
      },
      {
        userId: testuser1._id,
        stationId: fakeStationId,
        ratings: {
          safety: 2,
          cleanliness: 2,
          accessibility: 2,
          crowding: 2,
          overall: 2,
        },
        comment: "Corrupted record B — references a non-existent station.",
        flagCount: 0,
        flagStatus: "none",
        sentiment: null,
        isDeleted: false,
      },
    ],
    { lean: true },
  );

  corruptedDocs.forEach((f, i) =>
    log(
      `Created corrupted record ${i + 1} (stationId: ${f.stationId} — does not exist in Station collection)`,
    ),
  );
  console.log();

  // ── 9. Recalculate CEI for every station that received feedback ────────
  // Without this step Station.cei / averageRatings / totalFeedback stay
  // null/0 and the dashboard shows no data even though feedback exists.
  //
  // We only recalculate for stations that received flagStatus:'none' feedback
  // (i.e. the 10 regular records). The 3 flagged records target the same
  // stations but are excluded from CEI by the aggregation $match anyway,
  // so running recalculate on those stationIds is still safe and correct.
  console.log(
    "Recalculating CEI scores for stations that received feedback...",
  );

  const stationIdsToRecalc = [
    ...new Set(feedbackDocs.map((f) => f.stationId.toString())),
  ];

  for (const stationId of stationIdsToRecalc) {
    await recalculateStationCEI(stationId);
    const station = allStations.find((s) => s._id.toString() === stationId);
    log(`Recalculated CEI for: ${station ? station.name : stationId}`);
  }
  console.log();

  // ── 10. Summary ───────────────────────────────────────────────────────
  console.log("=== Seed Complete — 7 datasets loaded ===\n");
  console.log(
    "  Standard users     : 4  (testuser1-4@yyctrack.ca  / Test@1234)",
  );
  console.log(
    "  Unverified user    : 1  (unverified@yyctrack.ca   / Test@1234, isEmailVerified: false)",
  );
  console.log(
    "  Admin account      : 1  (admin@yyctrack.ca        / Admin@1234)",
  );
  console.log(
    `  Feedback records   : ${feedbackDocs.length}  (10 stations, by testuser1, CEI recalculated)`,
  );
  console.log(
    `  Flagged records    : ${flaggedDocs.length}  (flagStatus: pending, by testuser2, excluded from CEI)`,
  );
  console.log(
    `  Corrupted records  : ${corruptedDocs.length}  (non-existent stationId, for error handling tests)`,
  );
  console.log(
    `  Stations in DB     : ${allStations.length}  (untouched — loaded by your existing station seed)`,
  );
  console.log(
    "\nRe-run this script at the start of every test session to restore a clean state.\n",
  );

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("\nSeed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});

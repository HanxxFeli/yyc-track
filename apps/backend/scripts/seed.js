/**
 * YYCTrack MongoDB Seed Script
 * Matches actual models: User.js, Admin.js, Feedback.js, Station.js
 *
 * Place at: apps/backend/scripts/seed.js
 *
 * Add to package.json scripts:
 *   "seed": "node scripts/seed.js"
 *
 * Run locally:
 *   npm run seed
 *
 * Run inside Docker:
 *   docker compose exec backend npm run seed
 *
 * FIXES FROM ORIGINAL:
 *  - Added 2 more flagged feedback records (TC-ADM-01/02 need 3 total in queue)
 *  - Replaced eeeeeeeeeeeeeeeeeeeeeeee userId in feedback (that _id belongs to Admin, not User)
 *  - Corrected station line assignments: Lions Park, Crowchild, Tuscany → Red Line
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
require('dotenv').config();

const User     = require('../models/User');
const Admin    = require('../models/Admin');
const Station  = require('../models/Station');
const Feedback = require('../models/Feedback');

const SALT_ROUNDS = 10;
const hash = (pw) => bcrypt.hashSync(pw, SALT_ROUNDS);

// ─── Users ────────────────────────────────────────────────────────────────────
const userData = [
  {
    _id: new mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
    firstName: 'Test', lastName: 'User1',
    email: 'testuser1@yyctrack.ca',
    password: hash('Test@1234'),
    authMethod: 'local', isEmailVerified: true, isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('bbbbbbbbbbbbbbbbbbbbbbbb'),
    firstName: 'Test', lastName: 'User2',
    email: 'testuser2@yyctrack.ca',
    password: hash('Test@1234'),
    authMethod: 'local', isEmailVerified: true, isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('cccccccccccccccccccccccc'),
    firstName: 'Test', lastName: 'User3',
    email: 'testuser3@yyctrack.ca',
    password: hash('Test@1234'),
    authMethod: 'local', isEmailVerified: true, isActive: true,
  },
  {
    _id: new mongoose.Types.ObjectId('dddddddddddddddddddddddd'),
    firstName: 'Test', lastName: 'User4',
    email: 'testuser4@yyctrack.ca',
    password: hash('Test@1234'),
    authMethod: 'local', isEmailVerified: true, isActive: true,
  },
  {
    // Unverified — used in TC-REG-03 (resend verification)
    _id: new mongoose.Types.ObjectId('ffffffffffffffffffffffff'),
    firstName: 'Unverified', lastName: 'User',
    email: 'unverified@yyctrack.ca',
    password: hash('Test@1234'),
    authMethod: 'local',
    isEmailVerified: false,
    emailVerificationCode: '123456',
    emailVerificationExpires: new Date(Date.now() + 10 * 60 * 1000),
    isActive: true,
  },
];

// ─── Admin (separate collection) ─────────────────────────────────────────────
const adminData = [
  {
    _id: new mongoose.Types.ObjectId('eeeeeeeeeeeeeeeeeeeeeeee'),
    firstName: 'Admin', lastName: 'User',
    email: 'admin@yyctrack.ca',
    password: hash('Admin@1234'),
    isEmailVerified: true, isActive: true,
  },
];

// ─── Stations ─────────────────────────────────────────────────────────────────
const stationData = [
  { _id: new mongoose.Types.ObjectId('111111111111111111111111'), name: 'Anderson',               line: 'Red',  coordinates: { lat: 50.9372, lng: -114.0719 }, gtfsStopId: '8001' },
  { _id: new mongoose.Types.ObjectId('222222222222222222222222'), name: 'Chinook',                line: 'Red',  coordinates: { lat: 50.9549, lng: -114.0703 }, gtfsStopId: '8002' },
  { _id: new mongoose.Types.ObjectId('333333333333333333333333'), name: 'City Hall',              line: 'Both', coordinates: { lat: 51.0456, lng: -114.0584 }, gtfsStopId: '8003' },
  { _id: new mongoose.Types.ObjectId('444444444444444444444444'), name: 'Lions Park',             line: 'Red',  coordinates: { lat: 51.0726, lng: -114.1099 }, gtfsStopId: '8004' },
  { _id: new mongoose.Types.ObjectId('555555555555555555555555'), name: 'Saddletowne',            line: 'Blue', coordinates: { lat: 51.0905, lng: -113.9474 }, gtfsStopId: '8005' },
  { _id: new mongoose.Types.ObjectId('666666666666666666666666'), name: 'Southland',              line: 'Red',  coordinates: { lat: 50.9744, lng: -114.0674 }, gtfsStopId: '8006' },
  { _id: new mongoose.Types.ObjectId('777777777777777777777777'), name: 'Crowchild',              line: 'Red',  coordinates: { lat: 51.0633, lng: -114.1283 }, gtfsStopId: '8007' },
  { _id: new mongoose.Types.ObjectId('888888888888888888888888'), name: 'Tuscany',                line: 'Red',  coordinates: { lat: 51.1248, lng: -114.2157 }, gtfsStopId: '8008' },
  { _id: new mongoose.Types.ObjectId('999999999999999999999999'), name: 'Brentwood',              line: 'Red',  coordinates: { lat: 51.0832, lng: -114.1283 }, gtfsStopId: '8009' },
  { _id: new mongoose.Types.ObjectId('aaa111111111111111111111'), name: 'Dalhousie',              line: 'Red',  coordinates: { lat: 51.1003, lng: -114.1503 }, gtfsStopId: '8010' },
  { _id: new mongoose.Types.ObjectId('aaa222222222222222222222'), name: 'Sirocco',                line: 'Red',  coordinates: { lat: 51.0063, lng: -114.1716 }, gtfsStopId: '8011' },
  { _id: new mongoose.Types.ObjectId('aaa333333333333333333333'), name: '69 Street',              line: 'Red',  coordinates: { lat: 51.0045, lng: -114.2003 }, gtfsStopId: '8012' },
  { _id: new mongoose.Types.ObjectId('aaa444444444444444444444'), name: 'Somerset-Bridlewood',    line: 'Red',  coordinates: { lat: 50.8993, lng: -114.0734 }, gtfsStopId: '8013' },
  { _id: new mongoose.Types.ObjectId('aaa555555555555555555555'), name: 'Shawnessy',              line: 'Red',  coordinates: { lat: 50.9141, lng: -114.0722 }, gtfsStopId: '8014' },
  { _id: new mongoose.Types.ObjectId('aaa666666666666666666666'), name: 'Fish Creek-Lacombe',     line: 'Red',  coordinates: { lat: 50.9285, lng: -114.0723 }, gtfsStopId: '8015' },
  { _id: new mongoose.Types.ObjectId('aaa777777777777777777777'), name: 'Midnapore',              line: 'Red',  coordinates: { lat: 50.9421, lng: -114.0712 }, gtfsStopId: '8016' },
  { _id: new mongoose.Types.ObjectId('aaa888888888888888888888'), name: 'Fairview',               line: 'Red',  coordinates: { lat: 50.9626, lng: -114.0700 }, gtfsStopId: '8017' },
  { _id: new mongoose.Types.ObjectId('aaa999999999999999999999'), name: 'Heritage',               line: 'Red',  coordinates: { lat: 50.9690, lng: -114.0700 }, gtfsStopId: '8018' },
  { _id: new mongoose.Types.ObjectId('bbb111111111111111111111'), name: 'Elbow Drive',            line: 'Red',  coordinates: { lat: 50.9847, lng: -114.0789 }, gtfsStopId: '8019' },
  { _id: new mongoose.Types.ObjectId('bbb222222222222222222222'), name: 'Erlton/Stampede',        line: 'Red',  coordinates: { lat: 51.0269, lng: -114.0618 }, gtfsStopId: '8020' },
  { _id: new mongoose.Types.ObjectId('bbb333333333333333333333'), name: 'Victoria Park/Stampede', line: 'Red',  coordinates: { lat: 51.0356, lng: -114.0578 }, gtfsStopId: '8021' },
  { _id: new mongoose.Types.ObjectId('bbb444444444444444444444'), name: '1 Street SW',            line: 'Both', coordinates: { lat: 51.0440, lng: -114.0637 }, gtfsStopId: '8022' },
  { _id: new mongoose.Types.ObjectId('bbb555555555555555555555'), name: 'Centre Street',          line: 'Both', coordinates: { lat: 51.0456, lng: -114.0659 }, gtfsStopId: '8023' },
  { _id: new mongoose.Types.ObjectId('bbb666666666666666666666'), name: 'Bridgeland/Memorial',    line: 'Both', coordinates: { lat: 51.0517, lng: -114.0490 }, gtfsStopId: '8024' },
  { _id: new mongoose.Types.ObjectId('bbb777777777777777777777'), name: 'Whitehorn',              line: 'Blue', coordinates: { lat: 51.0864, lng: -113.9536 }, gtfsStopId: '8025' },
  { _id: new mongoose.Types.ObjectId('bbb888888888888888888888'), name: 'McKnight-Westwinds',     line: 'Blue', coordinates: { lat: 51.0968, lng: -113.9593 }, gtfsStopId: '8026' },
  { _id: new mongoose.Types.ObjectId('bbb999999999999999999999'), name: 'Airport Trail',          line: 'Blue', coordinates: { lat: 51.1033, lng: -113.9722 }, gtfsStopId: '8027' },
  { _id: new mongoose.Types.ObjectId('ccc111111111111111111111'), name: 'Rundle',                 line: 'Blue', coordinates: { lat: 51.0667, lng: -113.9782 }, gtfsStopId: '8028' },
  { _id: new mongoose.Types.ObjectId('ccc222222222222222222222'), name: 'Marlborough',            line: 'Blue', coordinates: { lat: 51.0637, lng: -113.9990 }, gtfsStopId: '8029' },
  { _id: new mongoose.Types.ObjectId('ccc333333333333333333333'), name: 'Franklin',               line: 'Blue', coordinates: { lat: 51.0619, lng: -114.0175 }, gtfsStopId: '8030' },
  { _id: new mongoose.Types.ObjectId('ccc444444444444444444444'), name: 'Barlow/Max Bell',        line: 'Blue', coordinates: { lat: 51.0568, lng: -114.0300 }, gtfsStopId: '8031' },
  { _id: new mongoose.Types.ObjectId('ccc555555555555555555555'), name: 'Zoo',                    line: 'Blue', coordinates: { lat: 51.0531, lng: -114.0423 }, gtfsStopId: '8032' },
  { _id: new mongoose.Types.ObjectId('ccc666666666666666666666'), name: 'Sunalta',                line: 'Red',  coordinates: { lat: 51.0444, lng: -114.0879 }, gtfsStopId: '8033' },
  { _id: new mongoose.Types.ObjectId('ccc777777777777777777777'), name: 'Westbrook',              line: 'Red',  coordinates: { lat: 51.0444, lng: -114.1068 }, gtfsStopId: '8034' },
  { _id: new mongoose.Types.ObjectId('ccc888888888888888888888'), name: '45 Street',              line: 'Red',  coordinates: { lat: 51.0444, lng: -114.1248 }, gtfsStopId: '8035' },
  { _id: new mongoose.Types.ObjectId('ccc999999999999999999999'), name: 'Glenbow',                line: 'Red',  coordinates: { lat: 51.0166, lng: -114.1547 }, gtfsStopId: '8036' },
  { _id: new mongoose.Types.ObjectId('ddd111111111111111111111'), name: 'Signal Hill',            line: 'Red',  coordinates: { lat: 51.0045, lng: -114.1716 }, gtfsStopId: '8037' },
  { _id: new mongoose.Types.ObjectId('ddd222222222222222222222'), name: 'Stampede',               line: 'Both', coordinates: { lat: 51.0330, lng: -114.0580 }, gtfsStopId: '8038' },
  { _id: new mongoose.Types.ObjectId('ddd333333333333333333333'), name: 'Downtown West/Kerby',    line: 'Both', coordinates: { lat: 51.0472, lng: -114.0807 }, gtfsStopId: '8039' },
  { _id: new mongoose.Types.ObjectId('ddd444444444444444444444'), name: 'SAIT/AUArts/Jubilee',    line: 'Red',  coordinates: { lat: 51.0635, lng: -114.0927 }, gtfsStopId: '8040' },
  { _id: new mongoose.Types.ObjectId('ddd555555555555555555555'), name: 'Banff Trail',            line: 'Red',  coordinates: { lat: 51.0735, lng: -114.1002 }, gtfsStopId: '8041' },
  { _id: new mongoose.Types.ObjectId('ddd666666666666666666666'), name: 'University of Calgary',  line: 'Red',  coordinates: { lat: 51.0807, lng: -114.1280 }, gtfsStopId: '8042' },
  { _id: new mongoose.Types.ObjectId('ddd777777777777777777777'), name: '69 Street West',         line: 'Red',  coordinates: { lat: 51.0220, lng: -114.1920 }, gtfsStopId: '8043' },
  { _id: new mongoose.Types.ObjectId('ddd888888888888888888888'), name: 'Stoney',                 line: 'Blue', coordinates: { lat: 51.1120, lng: -114.1780 }, gtfsStopId: '8044' },
  { _id: new mongoose.Types.ObjectId('ddd999999999999999999999'), name: 'Tuscany Station',        line: 'Blue', coordinates: { lat: 51.1248, lng: -114.2100 }, gtfsStopId: '8045' },
];

// ─── Feedback ─────────────────────────────────────────────────────────────────
const andersonId = new mongoose.Types.ObjectId('111111111111111111111111');
const tuscanyId  = new mongoose.Types.ObjectId('888888888888888888888888');
const cityHallId = new mongoose.Types.ObjectId('333333333333333333333333');

const user1 = new mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa');
const user2 = new mongoose.Types.ObjectId('bbbbbbbbbbbbbbbbbbbbbbbb');
const user3 = new mongoose.Types.ObjectId('cccccccccccccccccccccccc');
const user4 = new mongoose.Types.ObjectId('dddddddddddddddddddddddd');

const feedbackData = [
  // ── Anderson — 5 records for TC-DSH-01, TC-NFR-01 ───────────────────────────
  { stationId: andersonId, userId: user1, ratings: { safety: 4, cleanliness: 3, accessibility: 5, crowding: 2, overall: 4 }, comment: 'Generally good.', flagStatus: 'none', isDeleted: false },
  { stationId: andersonId, userId: user2, ratings: { safety: 2, cleanliness: 4, accessibility: 3, crowding: 5, overall: 3 }, comment: 'Crowded evenings.', flagStatus: 'none', isDeleted: false },
  { stationId: andersonId, userId: user3, ratings: { safety: 3, cleanliness: 3, accessibility: 4, crowding: 3, overall: 3 }, comment: 'Average.', flagStatus: 'none', isDeleted: false },
  { stationId: andersonId, userId: user4, ratings: { safety: 5, cleanliness: 5, accessibility: 5, crowding: 4, overall: 5 }, comment: 'Excellent!', flagStatus: 'none', isDeleted: false },
  { stationId: andersonId, userId: user1, ratings: { safety: 1, cleanliness: 2, accessibility: 2, crowding: 1, overall: 1 }, comment: 'Needs improvement.', flagStatus: 'none', isDeleted: false },

  // ── Tuscany — EXACTLY 2 records for TC-DSH-06 math verification ─────────────
  // Expected averages → Safety: 3.0 | Cleanliness: 3.0 | Accessibility: 4.0 | Crowding: 4.0 | Overall: 3.5
  { stationId: tuscanyId, userId: user1, ratings: { safety: 4, cleanliness: 2, accessibility: 5, crowding: 3, overall: 4 }, comment: '', flagStatus: 'none', isDeleted: false },
  { stationId: tuscanyId, userId: user2, ratings: { safety: 2, cleanliness: 4, accessibility: 3, crowding: 5, overall: 3 }, comment: '', flagStatus: 'none', isDeleted: false },

  // ── City Hall — testuser4 feedback for TC-ACC-04 (account deletion test) ─────
  { stationId: cityHallId, userId: user4, ratings: { safety: 3, cleanliness: 3, accessibility: 3, crowding: 3, overall: 3 }, comment: 'testuser4 entry — used for deletion test.', flagStatus: 'none', isDeleted: false },

  // ── Flagged comments — 3 total for TC-ADM-01, TC-ADM-02, TC-ADM-05 ──────────
  { stationId: andersonId, userId: user2, ratings: { safety: 1, cleanliness: 1, accessibility: 1, crowding: 1, overall: 1 }, comment: 'Flagged comment #1.', flagStatus: 'pending', isDeleted: false },
  { stationId: tuscanyId,  userId: user3, ratings: { safety: 1, cleanliness: 1, accessibility: 1, crowding: 1, overall: 1 }, comment: 'Flagged comment #2.', flagStatus: 'pending', isDeleted: false },
  { stationId: cityHallId, userId: user1, ratings: { safety: 2, cleanliness: 1, accessibility: 1, crowding: 1, overall: 1 }, comment: 'Flagged comment #3.', flagStatus: 'pending', isDeleted: false },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  await mongoose.connection.db.collection('users').deleteMany({});
  await mongoose.connection.db.collection('admins').deleteMany({});
  await mongoose.connection.db.collection('stations').deleteMany({});
  await mongoose.connection.db.collection('feedbacks').deleteMany({});
  await mongoose.connection.db.collection('adminlogs').deleteMany({});
  console.log('🗑️  Cleared existing collections');

  // Insert directly to bypass pre-save middleware (passwords already hashed)
  await mongoose.connection.db.collection('users').insertMany(userData);
  console.log(`👤 Inserted ${userData.length} users`);

  await mongoose.connection.db.collection('admins').insertMany(adminData);
  console.log(`🔐 Inserted ${adminData.length} admins`);

  await Station.insertMany(stationData);
  console.log(`🚉 Inserted ${stationData.length} stations`);

  await Feedback.insertMany(feedbackData);
  console.log(`💬 Inserted ${feedbackData.length} feedback records (3 flagged)`);

  await mongoose.disconnect();
  console.log('');
  console.log('✅ Seed complete!');
  console.log('');
  console.log('Test accounts:');
  console.log('  testuser1@yyctrack.ca  / Test@1234');
  console.log('  testuser2@yyctrack.ca  / Test@1234');
  console.log('  testuser3@yyctrack.ca  / Test@1234');
  console.log('  testuser4@yyctrack.ca  / Test@1234  ← has City Hall feedback, used in TC-ACC-04');
  console.log('  unverified@yyctrack.ca / Test@1234  ← not email verified, used in TC-REG-03');
  console.log('  admin@yyctrack.ca      / Admin@1234 ← Admin collection');
  console.log('');
  console.log('TC-DSH-06 expected Tuscany averages:');
  console.log('  Safety: 3.0  |  Cleanliness: 3.0  |  Accessibility: 4.0  |  Crowding: 4.0  |  Overall: 3.5');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
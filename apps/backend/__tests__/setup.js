
// Runs automatically before every test file

const mongoose = require("mongoose");

// Use a separate test database so seed data is never touched during testing
const TEST_DB_URI =
    process.env.MONGODB_URI_TEST || // create new mongoDB Database
    process.env.MONGODB_URI || // create a new mongoDb Database 
    "mongodb://localhost:27017/yyc-track-test";

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(TEST_DB_URI);
    }
});

afterAll(async () => {
    await mongoose.disconnect();
});
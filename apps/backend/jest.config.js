module.exports = {
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.test.js"],
    testTimeout: 15000,
    forceExit: true,
    runInBand: true,   // run tests serially to avoid DB conflicts
    collectCoverageFrom: [
        "controllers/**/*.js",
        "middleware/**/*.js",
        "utils/**/*.js",
        "!**/node_modules/**",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov"],
    verbose: true,
};
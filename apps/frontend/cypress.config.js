// cypress.config.js
// Place this in apps/frontend/

const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: "http://localhost:3000",
        viewportWidth:  1280,
        viewportHeight: 720,
        defaultCommandTimeout: 8000,
        requestTimeout:        10000,
        video: false,
        screenshotOnRunFailure: true,
        screenshotsFolder: "cypress/screenshots",
        specPattern: "cypress/e2e/**/*.cy.js",
        supportFile: "cypress/support/e2e.js",
        env: {
            TEST_USER_EMAIL:    "testuser1@yyctrack.ca",
            TEST_USER_PASSWORD: "Test@1234",
            ADMIN_EMAIL:        "admin@yyctrack.ca",
            ADMIN_PASSWORD:     "Admin@1234",
            API_URL:            "http://localhost:5000",
        },
    },
});
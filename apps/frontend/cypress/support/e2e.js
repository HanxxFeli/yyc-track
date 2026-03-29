// cypress/support/e2e.js
// Custom Cypress commands available in all test files

// ── Login as a regular user ───────────────────────────────────────────────────
Cypress.Commands.add("loginAsUser", () => {
    cy.visit("/login");
    cy.get('[data-testid="email-input"]').clear().type(Cypress.env("TEST_USER_EMAIL"));
    cy.get('[data-testid="password-input"]').clear().type(Cypress.env("TEST_USER_PASSWORD"));
    cy.get('[data-testid="login-submit"]').click();
    cy.url().should("not.include", "/login");
});

// ── Login as admin ────────────────────────────────────────────────────────────
Cypress.Commands.add("loginAsAdmin", () => {
    cy.visit("/login");
    cy.get('[data-testid="email-input"]').clear().type(Cypress.env("ADMIN_EMAIL"));
    cy.get('[data-testid="password-input"]').clear().type(Cypress.env("ADMIN_PASSWORD"));
    cy.get('[data-testid="login-submit"]').click();
    cy.url().should("not.include", "/login");
});

// ── Log out ───────────────────────────────────────────────────────────────────
Cypress.Commands.add("logout", () => {
    cy.get('[data-testid="logout-button"]').click();
    cy.url().should("include", "/login");
});

// ── Login via API (faster — bypasses UI, sets token in localStorage) ─────────
Cypress.Commands.add("loginViaApi", (email, password) => {
    cy.request({
        method: "POST",
        url: `${Cypress.env("API_URL")}/api/auth/login`,
        body: { email, password },
    }).then((res) => {
        window.localStorage.setItem("token", res.body.token);
    });
});
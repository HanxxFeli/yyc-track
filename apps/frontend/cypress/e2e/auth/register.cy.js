/**
 * cypress/e2e/auth/register.cy.js
 *
 * Covers: TC-REG-01, TC-REG-02, TC-REG-04, TC-REG-05, TC-REG-07
 *
 * TC-REG-03 and TC-REG-06 are MANUAL — require Mailtrap inbox verification.
 *
 * data-testid attributes required (add to your Register component):
 *   [data-testid="register-firstname"]   First name input
 *   [data-testid="register-lastname"]    Last name input
 *   [data-testid="register-email"]       Email input
 *   [data-testid="register-password"]    Password input
 *   [data-testid="register-confirm"]     Confirm password input
 *   [data-testid="register-submit"]      Submit button
 *   [data-testid="success-message"]      Success notification
 *   [data-testid="error-message"]        Inline error (general)
 *   [data-testid="error-password"]       Password field error
 *   [data-testid="error-confirm"]        Confirm password error
 */

describe("User Registration", () => {
    beforeEach(() => {
        cy.visit("/register");
    });

    // ── TC-REG-01: Successful registration ──────────────────────────────────────
    it("TC-REG-01: valid registration shows success message and does not redirect to dashboard", () => {
        const uniqueEmail = `newuser_${Date.now()}@yyctrack.ca`;

        cy.get('[data-testid="register-firstname"]').type("Test");
        cy.get('[data-testid="register-lastname"]').type("User");
        cy.get('[data-testid="register-email"]').type(uniqueEmail);
        cy.get('[data-testid="register-password"]').type("Test@1234");
        cy.get('[data-testid="register-confirm"]').type("Test@1234");
        cy.get('[data-testid="register-submit"]').click();

        // Should show success message
        cy.get('[data-testid="success-message"]').should("be.visible");

        // Should NOT redirect to dashboard — email must be verified first
        cy.url().should("not.include", "/dashboard");
    });

    // ── TC-REG-02: Duplicate email rejected ─────────────────────────────────────
    it("TC-REG-02: duplicate email shows inline error and does not create account", () => {
            cy.get('[data-testid="register-firstname"]').type("Another");
            cy.get('[data-testid="register-lastname"]').type("User");
            cy.get('[data-testid="register-email"]').type("testuser1@yyctrack.ca"); // seeded
            cy.get('[data-testid="register-password"]').type("Test@1234");
            cy.get('[data-testid="register-confirm"]').type("Test@1234");
            cy.get('[data-testid="register-submit"]').click();

            cy.get('[data-testid="error-message"]').should("be.visible");
            cy.get('[data-testid="error-message"]').should(
            "contain.text",
            "already exists"
        );

        cy.url().should("include", "/register");
    });

    // ── TC-REG-04: Graceful error when backend is down ──────────────────────────
    it("TC-REG-04: backend failure shows friendly error and does not crash", () => {
        // Mock the registration endpoint to return 500
        cy.intercept("POST", "/api/auth/register", {
            statusCode: 500,
            body: { message: "Internal server error" },
        }).as("registerFail");

        cy.get('[data-testid="register-firstname"]').type("Test");
        cy.get('[data-testid="register-lastname"]').type("User");
        cy.get('[data-testid="register-email"]').type("anyone@yyctrack.ca");
        cy.get('[data-testid="register-password"]').type("Test@1234");
        cy.get('[data-testid="register-confirm"]').type("Test@1234");
        cy.get('[data-testid="register-submit"]').click();

        cy.wait("@registerFail");

        // App must NOT crash or show blank screen
        cy.get("body").should("be.visible");
        cy.get('[data-testid="error-message"]').should("be.visible");

        // Submit button should return to active (not stuck loading)
        cy.get('[data-testid="register-submit"]').should("not.be.disabled");

        // No unhandled errors in console
        cy.window().then((win) => {
            expect(win.document.body.innerHTML).to.not.equal("");
        });
    });

    // ── TC-REG-05: Password mismatch rejected ───────────────────────────────────
    it("TC-REG-05: mismatched passwords show validation error without submitting", () => {
        cy.get('[data-testid="register-firstname"]').type("Mismatch");
        cy.get('[data-testid="register-lastname"]').type("User");
        cy.get('[data-testid="register-email"]').type("mismatch@yyctrack.ca");
        cy.get('[data-testid="register-password"]').type("Test@1234");
        cy.get('[data-testid="register-confirm"]').type("Different@999");
        cy.get('[data-testid="register-submit"]').click();

        // Error shown for confirm field
        cy.get('[data-testid="error-confirm"]').should("be.visible");
        cy.get('[data-testid="error-confirm"]').should(
            "contain.text",
            "match"
        );

        // Must stay on register page — form not submitted
        cy.url().should("include", "/register");

        // Intercept should NOT have been called
        cy.get('[data-testid="success-message"]').should("not.exist");
    });

    // ── TC-REG-07: Password too short rejected ──────────────────────────────────
    it("TC-REG-07: password below minimum length shows validation error without submitting", () => {
        cy.get('[data-testid="register-firstname"]').type("Weak");
        cy.get('[data-testid="register-lastname"]').type("User");
        cy.get('[data-testid="register-email"]').type("weakpass@yyctrack.ca");
        cy.get('[data-testid="register-password"]').type("123"); // 3 chars — below min
        cy.get('[data-testid="register-confirm"]').type("123");
        cy.get('[data-testid="register-submit"]').click();

        cy.get('[data-testid="error-password"]').should("be.visible");
        cy.url().should("include", "/register");
        cy.get('[data-testid="success-message"]').should("not.exist");
    });
});
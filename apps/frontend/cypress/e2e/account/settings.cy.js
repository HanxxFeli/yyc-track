/**
 * cypress/e2e/account/settings.cy.js
 *
 * Covers: TC-ACC-01, TC-ACC-02, TC-ACC-03, TC-ACC-04, TC-ACC-05,
 *         TC-ACC-06, TC-ACC-07, TC-ACC-08, TC-ACC-09, TC-ACC-10,
 *         TC-ACC-11, TC-ACC-12
 *
 * data-testid attributes required (add to your Account Settings component):
 *   [data-testid="account-firstname"]       First name input
 *   [data-testid="account-lastname"]        Last name input
 *   [data-testid="account-email"]           Email input
 *   [data-testid="account-save"]            Save Changes button
 *   [data-testid="account-cancel"]          Cancel button
 *   [data-testid="current-password"]        Current password input
 *   [data-testid="new-password"]            New password input
 *   [data-testid="confirm-new-password"]    Confirm new password input
 *   [data-testid="delete-account-btn"]      Delete My Account button
 *   [data-testid="delete-confirm-password"] Password confirmation in delete dialog
 *   [data-testid="delete-confirm-btn"]      Confirm Delete button
 *   [data-testid="delete-cancel-btn"]       Cancel in delete dialog
 *   [data-testid="success-message"]         Success notification
 *   [data-testid="error-message"]           General error
 *   [data-testid="error-email"]             Email field validation error
 *   [data-testid="error-confirm-password"]  Confirm password error
 */

describe("Account Management", () => {
    beforeEach(() => {
        // testuser1 is the primary account for most tests
        cy.loginAsUser();
        cy.visit("/account");
    });

    // ── TC-ACC-01: Update display name ──────────────────────────────────────────
    it("TC-ACC-01: valid name update shows success and persists", () => {
        cy.get('[data-testid="account-firstname"]').clear().type("Updated");
        cy.get('[data-testid="account-save"]').click();

        cy.get('[data-testid="success-message"]').should("be.visible");

        // Reload and confirm the value persisted
        cy.reload();
        cy.get('[data-testid="account-firstname"]').should("have.value", "Updated");
    });

    // ── TC-ACC-02: Invalid email format rejected ─────────────────────────────────
    it("TC-ACC-02: invalid email format shows validation error before submitting", () => {
        cy.get('[data-testid="account-email"]').clear().type("not-an-email");
        cy.get('[data-testid="account-save"]').click();

        cy.get('[data-testid="error-email"]').should("be.visible");
        cy.get('[data-testid="error-email"]').should("contain.text", "valid email");

        // Should NOT submit
        cy.get('[data-testid="success-message"]').should("not.exist");
    });

    // ── TC-ACC-03: Cancel preserves original data ────────────────────────────────
    it("TC-ACC-03: cancelling account update reverts form to original values", () => {
        // Read current name before editing
        cy.get('[data-testid="account-firstname"]')
        .invoke("val")
        .then((originalName) => {
            // Edit the name
            cy.get('[data-testid="account-firstname"]').clear().type("Should Not Save");

            // Cancel
            cy.get('[data-testid="account-cancel"]').click();

            // Field should revert to original
            cy.get('[data-testid="account-firstname"]').should(
            "have.value",
            originalName
            );
        });

        cy.get('[data-testid="success-message"]').should("not.exist");
    });

    // ── TC-ACC-04: Account deletion ──────────────────────────────────────────────
    it("TC-ACC-04: confirming account deletion logs user out and redirects", () => {
        // Use testuser3 to avoid breaking other tests — login as testuser3
        cy.visit("/login");
        cy.get('[data-testid="email-input"]').type("testuser3@yyctrack.ca");
        cy.get('[data-testid="password-input"]').type("Test@1234");
        cy.get('[data-testid="login-submit"]').click();
        cy.url().should("include", "/dashboard");
        cy.visit("/account");

        cy.get('[data-testid="delete-account-btn"]').click();
        cy.get('[data-testid="delete-confirm-password"]').type("Test@1234");
        cy.get('[data-testid="delete-confirm-btn"]').click();

        // Redirected to login or home after deletion
        cy.url().should("satisfy", (url) => {
            return url.includes("/login") || url === Cypress.config("baseUrl") + "/";
        });

        // JWT cleared
        cy.window().then((win) => {
            expect(win.localStorage.getItem("token")).to.be.null;
        });
    });

    // ── TC-ACC-05: DB failure during update ──────────────────────────────────────
    it("TC-ACC-05: DB failure during update shows friendly error without crashing", () => {
        cy.intercept("PUT", "/api/users/*", {
            statusCode: 500,
            body: { message: "Database error" },
        }).as("updateFail");

        cy.get('[data-testid="account-firstname"]').clear().type("New Display Name");
        cy.get('[data-testid="account-save"]').click();

        cy.wait("@updateFail");

        cy.get("body").should("be.visible");
        cy.get('[data-testid="error-message"]').should("be.visible");
        cy.get('[data-testid="success-message"]').should("not.exist");
    });

    // ── TC-ACC-06: Password update ───────────────────────────────────────────────
    it("TC-ACC-06: valid password change allows login with new password", () => {
        // Use testuser2 for this test so other tests aren't affected
        cy.visit("/login");
        cy.get('[data-testid="email-input"]').type("testuser2@yyctrack.ca");
        cy.get('[data-testid="password-input"]').type("Test@1234");
        cy.get('[data-testid="login-submit"]').click();
        cy.visit("/account");

        cy.get('[data-testid="current-password"]').type("Test@1234");
        cy.get('[data-testid="new-password"]').type("NewSecure@999");
        cy.get('[data-testid="confirm-new-password"]').type("NewSecure@999");
        cy.get('[data-testid="account-save"]').click();

        cy.get('[data-testid="success-message"]').should("be.visible");

        // Logout and login with new password
        cy.get('[data-testid="logout-button"]').click();
        cy.get('[data-testid="email-input"]').type("testuser2@yyctrack.ca");
        cy.get('[data-testid="password-input"]').type("NewSecure@999");
        cy.get('[data-testid="login-submit"]').click();

        cy.url().should("include", "/dashboard");
    });

    // ── TC-ACC-07: New password mismatch rejected ────────────────────────────────
    it("TC-ACC-07: new password mismatch shows validation error", () => {
        cy.get('[data-testid="current-password"]').type("Test@1234");
        cy.get('[data-testid="new-password"]').type("NewPass@111");
        cy.get('[data-testid="confirm-new-password"]').type("NewPass@999"); // mismatch
        cy.get('[data-testid="account-save"]').click();

        cy.get('[data-testid="error-confirm-password"]').should("be.visible");
        cy.get('[data-testid="error-confirm-password"]').should(
        "contain.text",
        "match"
        );
        cy.get('[data-testid="success-message"]').should("not.exist");
    });

    // ── TC-ACC-08: Cancel deletion preserves account ─────────────────────────────
    it("TC-ACC-08: cancelling account deletion keeps account intact", () => {
        cy.get('[data-testid="delete-account-btn"]').click();

        // Click cancel in the confirmation dialog
        cy.get('[data-testid="delete-cancel-btn"]').click();

        // User still on account page and still logged in
        cy.url().should("include", "/account");
        cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.be.a("string");
        });
    });

    // ── TC-ACC-09: Navigate away without saving — data not persisted ─────────────
    it("TC-ACC-09: navigating away without saving does not persist changes", () => {
        cy.get('[data-testid="account-firstname"]')
        .invoke("val")
        .then((originalName) => {
            cy.get('[data-testid="account-firstname"]').clear().type("Should Not Save");

            // Navigate away without clicking save
            cy.visit("/dashboard");

            // Come back to account settings
            cy.visit("/account");

            // Value should be original, not the edited value
            cy.get('[data-testid="account-firstname"]').should(
            "have.value",
            originalName
            );
        });
    });

    // ── TC-ACC-10: DB failure — no partial save ──────────────────────────────────
    it("TC-ACC-10: DB failure during update shows error and data unchanged on reload", () => {
        cy.intercept("PUT", "/api/users/*", {
            statusCode: 500,
            body: { message: "Database error" },
        }).as("saveFail");

        cy.get('[data-testid="account-firstname"]')
        .invoke("val")
        .then((originalName) => {
            cy.get('[data-testid="account-firstname"]').clear().type("Partial Save");
            cy.get('[data-testid="account-save"]').click();
            cy.wait("@saveFail");

            cy.get('[data-testid="error-message"]').should("be.visible");

            // Reload — original data should still be there (no partial save)
            cy.reload();
            cy.get('[data-testid="account-firstname"]').should(
            "have.value",
            originalName
            );
        });
    });

    // ── TC-ACC-11: Valid update persists after refresh ───────────────────────────
    it("TC-ACC-11: valid update shows success and persists after re-login", () => {
        const newName = `Updated_${Date.now()}`;

        cy.get('[data-testid="account-firstname"]').clear().type(newName);
        cy.get('[data-testid="account-save"]').click();

        cy.get('[data-testid="success-message"]').should("be.visible");

        // Reload and confirm
        cy.reload();
        cy.get('[data-testid="account-firstname"]').should("have.value", newName);
    });

    // ── TC-ACC-12: Invalid email format — save blocked ───────────────────────────
    it("TC-ACC-12: invalid email format blocks save and shows validation error", () => {
        cy.get('[data-testid="account-email"]').clear().type("user@"); // invalid

        cy.get('[data-testid="account-save"]').click();

        cy.get('[data-testid="error-email"]').should("be.visible");
        cy.get('[data-testid="success-message"]').should("not.exist");

        // Reload — data unchanged
        cy.reload();
        cy.get('[data-testid="account-email"]').should("not.have.value", "user@");
    });
});
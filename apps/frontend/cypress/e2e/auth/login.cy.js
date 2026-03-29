/**
 * cypress/e2e/auth/login.cy.js
 *
 * Covers: TC-LOG-01, TC-LOG-02, TC-LOG-04, TC-LOG-05, TC-LOG-06, TC-LOG-07
 *
 * TC-LOG-03 is MANUAL — requires Mailtrap inbox verification for the reset link.
 *
 * data-testid attributes required (add to your Login component):
 *   [data-testid="email-input"]        Email field
 *   [data-testid="password-input"]     Password field
 *   [data-testid="login-submit"]       Login button
 *   [data-testid="error-message"]      Inline error
 *   [data-testid="logout-button"]      Logout button (in nav/header)
 *   [data-testid="user-greeting"]      User name/greeting shown after login
 *   [data-testid="forgot-password"]    Forgot password link
 */

describe("User Login", () => {
    beforeEach(() => {
        cy.visit("/login");
    });

    // ── TC-LOG-01: Valid login ───────────────────────────────────────────────────
    it("TC-LOG-01: valid credentials redirect to dashboard and store JWT in localStorage", () => {
        cy.get('[data-testid="email-input"]').type("testuser1@yyctrack.ca");
        cy.get('[data-testid="password-input"]').type("Test@1234");
        cy.get('[data-testid="login-submit"]').click();

        // Redirected to dashboard
        cy.url().should("include", "/dashboard");

        // JWT stored in localStorage
        cy.window().then((win) => {
            const token = win.localStorage.getItem("token");
            expect(token).to.be.a("string");
            expect(token.split(".")).to.have.lengthOf(3); // valid JWT has 3 parts
        });

        // User greeting visible
        cy.get('[data-testid="user-greeting"]').should("be.visible");
    });

    // ── TC-LOG-02: Wrong password rejected ──────────────────────────────────────
    it("TC-LOG-02: wrong password shows generic error and stores no JWT", () => {
        cy.get('[data-testid="email-input"]').type("testuser1@yyctrack.ca");
        cy.get('[data-testid="password-input"]').type("WrongPass99!");
        cy.get('[data-testid="login-submit"]').click();

        // Stays on login page
        cy.url().should("include", "/login");

        // Generic error — must not reveal which field is wrong
        cy.get('[data-testid="error-message"]').should("be.visible");
        cy.get('[data-testid="error-message"]')
        .invoke("text")
        .then((text) => {
            expect(text.toLowerCase()).to.not.include("password is incorrect");
            expect(text.toLowerCase()).to.not.include("email not found");
            expect(text.toLowerCase()).to.include("invalid"); // generic message
        });

        // No token stored
        cy.window().then((win) => {
            expect(win.localStorage.getItem("token")).to.be.null;
        });
    });

    // ── TC-LOG-04: Backend unavailable ──────────────────────────────────────────
    it("TC-LOG-04: backend failure shows friendly error and does not crash", () => {
        cy.intercept("POST", "/api/auth/login", {
            statusCode: 500,
            body: { message: "Internal server error" },
        }).as("loginFail");

        cy.get('[data-testid="email-input"]').type("testuser1@yyctrack.ca");
        cy.get('[data-testid="password-input"]').type("Test@1234");
        cy.get('[data-testid="login-submit"]').click();

        cy.wait("@loginFail");

        // No blank screen
        cy.get("body").should("be.visible");

        // Friendly error shown
        cy.get('[data-testid="error-message"]').should("be.visible");

        // Login button returns to active state
        cy.get('[data-testid="login-submit"]').should("not.be.disabled");
    });

    // ── TC-LOG-05: Non-existent email ───────────────────────────────────────────
    it("TC-LOG-05: non-existent email shows same generic error as wrong password", () => {
        cy.get('[data-testid="email-input"]').type("ghost@yyctrack.ca");
        cy.get('[data-testid="password-input"]').type("Test@1234");
        cy.get('[data-testid="login-submit"]').click();

        cy.url().should("include", "/login");
        cy.get('[data-testid="error-message"]').should("be.visible");

        // Same message as TC-LOG-02 — no account enumeration
        cy.get('[data-testid="error-message"]')
        .invoke("text")
        .then((text) => {
            expect(text.toLowerCase()).to.not.include("email not found");
            expect(text.toLowerCase()).to.not.include("no account");
        });

        cy.window().then((win) => {
            expect(win.localStorage.getItem("token")).to.be.null;
        });
    });
});

// ── TC-LOG-06: Session persists after refresh ──────────────────────────────────
describe("Session Persistence", () => {
    beforeEach(() => {
        cy.loginAsUser();
    });

    it("TC-LOG-06: user remains authenticated after full page refresh", () => {
        cy.url().should("include", "/dashboard");

        // Full page refresh
        cy.reload();

        // Still on dashboard — not redirected to login
        cy.url().should("not.include", "/login");
        cy.get('[data-testid="user-greeting"]').should("be.visible");

        // Token still in localStorage
        cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.be.a("string");
        });
    });
});

// ── TC-LOG-07: Logout clears JWT and blocks protected routes ──────────────────
describe("Logout", () => {
    beforeEach(() => {
        cy.loginAsUser();
    });

    it("TC-LOG-07: logout removes JWT and redirects to login; protected route inaccessible", () => {
        cy.get('[data-testid="logout-button"]').click();

        // Redirected to login after logout
        cy.url().should("include", "/login");

        // JWT removed from localStorage
        cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.be.null;
        });

        // Attempting to navigate to protected route redirects back to login
        cy.visit("/dashboard");
        cy.url().should("include", "/login");
    });
});
/**
 * cypress/e2e/responsive/viewports.cy.js
 *
 * Covers: TC-NFR-08 (390x844 — iPhone 14), TC-NFR-09 (360x800 — Android)
 *
 * No additional data-testid attributes needed beyond what other tests use.
 * These tests reuse existing testids and check layout/visibility at small viewports.
 */

const viewports = [
  { name: "iPhone 14", width: 390, height: 844, tc: "TC-NFR-08" },
  { name: "Android",   width: 360, height: 800, tc: "TC-NFR-09" },
];

viewports.forEach(({ name, width, height, tc }) => {
    describe(`Mobile Responsiveness — ${name} ${width}x${height} (${tc})`, () => {
            beforeEach(() => {
            cy.viewport(width, height);
        });

        // ── Login page ──────────────────────────────────────────────────────────────
        it(`${tc}: /login renders correctly — all fields visible, no horizontal scroll`, () => {
            cy.visit("/login");

            cy.get('[data-testid="email-input"]').should("be.visible");
            cy.get('[data-testid="password-input"]').should("be.visible");
            cy.get('[data-testid="login-submit"]').should("be.visible");

            // No horizontal overflow
            cy.window().then((win) => {
                expect(win.document.documentElement.scrollWidth).to.be.lte(width);
            });
        });

        // ── Register page ───────────────────────────────────────────────────────────
        it(`${tc}: /register renders correctly — all form fields visible`, () => {
            cy.visit("/register");

            cy.get('[data-testid="register-firstname"]').should("be.visible");
            cy.get('[data-testid="register-lastname"]').should("be.visible");
            cy.get('[data-testid="register-email"]').should("be.visible");
            cy.get('[data-testid="register-password"]').should("be.visible");
            cy.get('[data-testid="register-confirm"]').should("be.visible");
            cy.get('[data-testid="register-submit"]').should("be.visible");

            cy.window().then((win) => {
                expect(win.document.documentElement.scrollWidth).to.be.lte(width);
            });
        });

        // ── Map page ────────────────────────────────────────────────────────────────
        it(`${tc}: /map renders correctly — map fills viewport`, () => {
            cy.loginAsUser();
            cy.visit("/map");

            cy.get('[data-testid="map-container"]').should("be.visible");

            // Map should not have horizontal overflow
            cy.window().then((win) => {
                expect(win.document.documentElement.scrollWidth).to.be.lte(width);
            });
        });

        // ── Station dashboard page ──────────────────────────────────────────────────
        it(`${tc}: station dashboard renders correctly at mobile viewport`, () => {
            cy.loginAsUser();
            cy.visit("/stations/anderson/dashboard");

            cy.get('[data-testid="dashboard-container"]').should("be.visible");
            cy.get('[data-testid="cei-score"]').should("be.visible");

            cy.window().then((win) => {
                expect(win.document.documentElement.scrollWidth).to.be.lte(width);
            });
        });

        // ── Feedback form page ──────────────────────────────────────────────────────
        it(`${tc}: feedback form renders correctly — all rating inputs accessible`, () => {
            cy.loginAsUser();
            cy.visit("/stations/city-hall/feedback");

            cy.get('[data-testid="rating-safety"]').should("be.visible");
            cy.get('[data-testid="feedback-submit"]').should("be.visible");

            cy.window().then((win) => {
                expect(win.document.documentElement.scrollWidth).to.be.lte(width);
            });
        });

        // ── Account settings page (TC-NFR-09 only) ──────────────────────────────────
        if (width === 360) {
            it(`${tc}: /account renders correctly at 360px`, () => {
                cy.loginAsUser();
                cy.visit("/account");

                cy.get('[data-testid="account-firstname"]').should("be.visible");
                cy.get('[data-testid="account-save"]').should("be.visible");

                cy.window().then((win) => {
                expect(win.document.documentElement.scrollWidth).to.be.lte(width);
                });
            });

            it(`${tc}: /admin renders correctly at 360px for admin user`, () => {
                cy.loginAsAdmin();
                cy.visit("/admin");

                cy.get('[data-testid="admin-panel"]').should("be.visible");

                cy.window().then((win) => {
                expect(win.document.documentElement.scrollWidth).to.be.lte(width);
                });
            });
        }
    });
});
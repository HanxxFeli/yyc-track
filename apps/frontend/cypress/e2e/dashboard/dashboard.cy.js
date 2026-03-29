/**
 * cypress/e2e/dashboard/dashboard.cy.js
 *
 * Covers: TC-DSH-01, TC-DSH-02, TC-DSH-03, TC-DSH-05, TC-DSH-07
 *
 * TC-DSH-04 is MANUAL — requires deliberately breaking the chart component.
 * TC-DSH-06 is covered in Jest — requires exact numeric DB comparison.
 *
 * data-testid attributes required (add to your StationDashboard component):
 *   [data-testid="dashboard-container"]     Main dashboard wrapper
 *   [data-testid="cei-score"]               CEI score value display
 *   [data-testid="rating-safety-avg"]       Safety average display
 *   [data-testid="rating-cleanliness-avg"]  Cleanliness average display
 *   [data-testid="rating-accessibility-avg"] Accessibility average display
 *   [data-testid="rating-crowding-avg"]     Crowding average display
 *   [data-testid="trend-chart"]             Trend chart container
 *   [data-testid="sentiment-section"]       Sentiment analysis section
 *   [data-testid="empty-feedback-message"]  Shown when no feedback exists
 *   [data-testid="submit-feedback-cta"]     Submit Feedback button/link
 *   [data-testid="dashboard-error"]         Error state message
 *   [data-testid="admin-analytics-panel"]   Extra admin analytics (admin only)
 *   [data-testid="station-name"]            Station name heading
 */

describe("Station Dashboard", () => {
    beforeEach(() => {
        cy.loginAsUser();
    });

    // ── TC-DSH-01: Dashboard displays all required data sections ─────────────────
    it("TC-DSH-01: dashboard loads within 3s and shows CEI, ratings, trends, sentiment", () => {
        // Anderson has seeded feedback so it should have a CEI score
        cy.visit("/stations/anderson/dashboard", { timeout: 3000 });

        // All main sections visible
        cy.get('[data-testid="dashboard-container"]').should("be.visible");
        cy.get('[data-testid="cei-score"]').should("be.visible");
        cy.get('[data-testid="rating-safety-avg"]').should("be.visible");
        cy.get('[data-testid="rating-cleanliness-avg"]').should("be.visible");
        cy.get('[data-testid="rating-accessibility-avg"]').should("be.visible");
        cy.get('[data-testid="rating-crowding-avg"]').should("be.visible");
        cy.get('[data-testid="trend-chart"]').should("be.visible");
        cy.get('[data-testid="sentiment-section"]').should("be.visible");

        // CEI should be a number between 0 and 100
        cy.get('[data-testid="cei-score"]')
        .invoke("text")
        .then((text) => {
            const score = parseFloat(text);
            expect(score).to.be.gte(0);
            expect(score).to.be.lte(100);
        });
    });

    // ── TC-DSH-02: Empty state when no feedback ──────────────────────────────────
    it("TC-DSH-02: dashboard for station with no feedback shows empty state message", () => {
        // Tuscany has no seeded feedback — adjust to a station with no feedback in your seed
        cy.visit("/stations/tuscany/dashboard");

        cy.get('[data-testid="empty-feedback-message"]').should("be.visible");

        // Dashboard should still load (no crash)
        cy.get('[data-testid="dashboard-container"]').should("be.visible");
    });

    // ── TC-DSH-03: Graceful error on invalid station ID ──────────────────────────
    it("TC-DSH-03: invalid station ID in URL shows friendly error without crashing", () => {
        cy.visit("/stations/test-corrupted-id/dashboard");

        // No blank screen
        cy.get("body").should("be.visible");

        // Friendly error shown
        cy.get('[data-testid="dashboard-error"]').should("be.visible");

        // No unhandled JS errors
        cy.window().then((win) => {
            expect(win.document.body.innerHTML).to.not.equal("");
        });
    });

    // ── TC-DSH-05: Admin sees extra analytics panels ─────────────────────────────
    it("TC-DSH-05: admin user sees additional analytics panels not visible to regular user", () => {
        // First check as regular user
        cy.visit("/stations/anderson/dashboard");
        cy.get('[data-testid="admin-analytics-panel"]').should("not.exist");

        // Now check as admin
        cy.get('[data-testid="logout-button"]').click();
        cy.loginAsAdmin();
        cy.visit("/stations/anderson/dashboard");

        cy.get('[data-testid="admin-analytics-panel"]').should("be.visible");
    });

    // ── TC-DSH-07: No-feedback station shows metadata and submit CTA ─────────────
    it("TC-DSH-07: station with no feedback shows station name and submit feedback CTA", () => {
        cy.visit("/stations/tuscany/dashboard");

        // Station name still displayed
        cy.get('[data-testid="station-name"]').should("be.visible");
        cy.get('[data-testid="station-name"]').should("contain.text", "Tuscany");

        // Submit feedback CTA visible and navigates correctly
        cy.get('[data-testid="submit-feedback-cta"]').should("be.visible");
        cy.get('[data-testid="submit-feedback-cta"]').click();

        // Should navigate to feedback form
        cy.url().should("include", "feedback");
    });
});
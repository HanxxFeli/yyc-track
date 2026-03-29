/**
 * cypress/e2e/feedback/submit.cy.js
 *
 * Covers: TC-FBK-01, TC-FBK-02, TC-FBK-03, TC-FBK-04, TC-FBK-06, TC-FBK-07
 *
 * TC-FBK-05 (CEI update) is handled in Jest — requires direct DB query.
 *
 * data-testid attributes required (add to your FeedbackForm component):
 *   [data-testid="rating-safety"]          Safety rating input/group
 *   [data-testid="rating-cleanliness"]     Cleanliness rating input/group
 *   [data-testid="rating-accessibility"]   Accessibility rating input/group
 *   [data-testid="rating-crowding"]        Crowding rating input/group
 *   [data-testid="rating-overall"]         Overall rating input/group
 *   [data-testid="feedback-comment"]       Comment textarea
 *   [data-testid="feedback-submit"]        Submit button
 *   [data-testid="success-message"]        Success toast/notification
 *   [data-testid="error-message"]          General error
 *   [data-testid="error-safety"]           Safety field error
 *   [data-testid="error-cleanliness"]      Cleanliness field error
 *   [data-testid="error-accessibility"]    Accessibility field error
 *   [data-testid="error-crowding"]         Crowding field error
 *
 * NOTE on rating inputs:
 *   If ratings are star buttons or radio buttons, use:
 *     cy.get('[data-testid="rating-safety"]').find('[value="4"]').click()
 *   If ratings are <select> dropdowns, use:
 *     cy.get('[data-testid="rating-safety"]').select('4')
 *   Adjust the helper below to match your actual component.
 */

// Helper: select a rating value within a rating group
function selectRating(category, value) {
    // Try radio/button first, fall back to select
    cy.get(`[data-testid="rating-${category}"]`).within(() => {
        cy.get(`[value="${value}"]`).first().click({ force: true });
    });
}

describe("Feedback Submission", () => {
    beforeEach(() => {
        cy.loginAsUser();

        // Navigate to a feedback form for City Hall (adjust URL to your routing)
        cy.visit("/stations/city-hall/feedback");
    });

    // ── TC-FBK-01: Valid feedback with comment ───────────────────────────────────
    it("TC-FBK-01: valid feedback with all ratings and comment shows success toast", () => {
        selectRating("safety", 4);
        selectRating("cleanliness", 3);
        selectRating("accessibility", 5);
        selectRating("crowding", 2);
        selectRating("overall", 3);

        cy.get('[data-testid="feedback-comment"]').type(
        "Station was clean but felt a bit crowded."
        );
        cy.get('[data-testid="feedback-submit"]').click();

        cy.get('[data-testid="success-message"]').should("be.visible");

        // Form should reset or navigate away after success
        cy.get('[data-testid="feedback-comment"]').should(($el) => {
            expect($el.val()).to.equal("");
        });
    });

    // ── TC-FBK-02: All ratings empty ────────────────────────────────────────────
    it("TC-FBK-02: submitting with all ratings empty shows per-field validation errors", () => {
        // Leave all rating fields empty — click submit immediately
        cy.get('[data-testid="feedback-submit"]').click();

        // Each required field should show an error
        cy.get('[data-testid="error-safety"]').should("be.visible");
        cy.get('[data-testid="error-cleanliness"]').should("be.visible");
        cy.get('[data-testid="error-accessibility"]').should("be.visible");
        cy.get('[data-testid="error-crowding"]').should("be.visible");

        // Success message must NOT appear
        cy.get('[data-testid="success-message"]').should("not.exist");
    });

    // ── TC-FBK-03: Partial ratings (2 missing) ──────────────────────────────────
    it("TC-FBK-03: submitting with only 2 of 4 ratings shows errors only on missing fields", () => {
        selectRating("safety", 4);
        selectRating("cleanliness", 3);
        // Leave accessibility and crowding empty

        cy.get('[data-testid="feedback-submit"]').click();

        // Only missing fields show errors
        cy.get('[data-testid="error-accessibility"]').should("be.visible");
        cy.get('[data-testid="error-crowding"]').should("be.visible");

        // Filled fields should NOT show errors
        cy.get('[data-testid="error-safety"]').should("not.exist");
        cy.get('[data-testid="error-cleanliness"]').should("not.exist");

        cy.get('[data-testid="success-message"]').should("not.exist");
    });

    // ── TC-FBK-04: Server unavailable during submission ─────────────────────────
    it("TC-FBK-04: server failure shows friendly error and does not crash", () => {
        cy.intercept("POST", "/api/feedback", {
            statusCode: 500,
            body: { message: "Internal server error" },
        }).as("feedbackFail");

        selectRating("safety", 3);
        selectRating("cleanliness", 3);
        selectRating("accessibility", 3);
        selectRating("crowding", 3);
        selectRating("overall", 3);

        cy.get('[data-testid="feedback-submit"]').click();
        cy.wait("@feedbackFail");

        // No blank screen
        cy.get("body").should("be.visible");

        // Friendly error shown
        cy.get('[data-testid="error-message"]').should("be.visible");

        // Submit button returns to active state
        cy.get('[data-testid="feedback-submit"]').should("not.be.disabled");
    });

    // ── TC-FBK-06: Valid feedback without comment ────────────────────────────────
    it("TC-FBK-06: valid feedback with empty comment field is accepted", () => {
        selectRating("safety", 3);
        selectRating("cleanliness", 3);
        selectRating("accessibility", 3);
        selectRating("crowding", 3);
        selectRating("overall", 3);

        // Leave comment field empty
        cy.get('[data-testid="feedback-submit"]').click();

        cy.get('[data-testid="success-message"]').should("be.visible");
        cy.get('[data-testid="error-message"]').should("not.exist");
    });
});

// ── TC-FBK-07: Guest redirected to login ──────────────────────────────────────
describe("Feedback Auth Guard", () => {
    it("TC-FBK-07: guest user visiting feedback page is redirected to login", () => {
        // Do NOT log in
        cy.visit("/stations/city-hall/feedback");

        // Should be redirected to login
        cy.url().should("include", "/login");

        // Feedback form must NOT be visible
        cy.get('[data-testid="feedback-submit"]').should("not.exist");
    });
});
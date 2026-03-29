/**
 * cypress/e2e/admin/moderation.cy.js
 *
 * Covers: TC-ADM-05, TC-ADM-06
 * Access control (TC-ADM-03) is covered in auth.test.js via Jest/Supertest.
 * Audit log (TC-ADM-04) is covered in Jest — requires direct DB query.
 *
 * data-testid attributes required (add to your Admin component):
 *   [data-testid="flagged-list"]              Container for flagged comments list
 *   [data-testid="flagged-item"]              Each flagged comment row (use on each item)
 *   [data-testid="approve-btn"]               Approve / Keep button on each item
 *   [data-testid="remove-btn"]                Remove button on each item
 *   [data-testid="empty-flagged-message"]     Message shown when no flagged comments exist
 *   [data-testid="admin-panel"]               Main admin portal container
 */

describe("Admin Moderation", () => {
    beforeEach(() => {
        cy.loginAsAdmin();
        cy.visit("/admin");
    });

    // ── TC-ADM-05: Admin approves a flagged comment ──────────────────────────────
    it("TC-ADM-05: admin approving a flagged comment removes it from the queue", () => {
        // Confirm there are flagged items in the list (seeded: 3 flagged items)
        cy.get('[data-testid="flagged-list"]').should("be.visible");
        cy.get('[data-testid="flagged-item"]').should("have.length.greaterThan", 0);

        // Get count before approving
        cy.get('[data-testid="flagged-item"]').then(($items) => {
            const countBefore = $items.length;

            // Click approve on the first item
            cy.get('[data-testid="flagged-item"]')
                .first()
                .find('[data-testid="approve-btn"]')
                .click();

            // List should now have one fewer item
            cy.get('[data-testid="flagged-item"]').should(
                "have.length",
                countBefore - 1
            );
        });
    });

    // ── TC-ADM-06: Empty state when no flagged comments ─────────────────────────
    it("TC-ADM-06: empty flagged list shows no-comments message without UI errors", () => {
        // Mock the API to return empty flagged list
        cy.intercept("GET", "/api/admin/feedback*", {
            statusCode: 200,
            body: { feedback: [], total: 0 },
        }).as("emptyFlagged");

        cy.reload();
        cy.wait("@emptyFlagged");

        // Empty state message should be visible
        cy.get('[data-testid="empty-flagged-message"]').should("be.visible");

        // No broken table or UI errors
        cy.get('[data-testid="flagged-list"]').should("exist");
        cy.get('[data-testid="flagged-item"]').should("not.exist");

        // Reload should not change state
        cy.reload();
        cy.wait("@emptyFlagged");
        cy.get('[data-testid="empty-flagged-message"]').should("be.visible");
    });
    });

    // ── TC-ADM-03 (UI side): Regular user redirected from admin portal ─────────────
    describe("Admin Access Control (UI)", () => {
    it("TC-ADM-03a: regular user visiting /admin is redirected away", () => {
        cy.loginAsUser();
        cy.visit("/admin");

        // Should not be on /admin
        cy.url().should("not.include", "/admin");
    });

    it("TC-ADM-03b: unauthenticated user visiting /admin is redirected to login", () => {
        // Do NOT log in
        cy.visit("/admin");
        cy.url().should("include", "/login");
    });
});
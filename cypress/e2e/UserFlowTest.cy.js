describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:5173/");
  });

  it("User Flow test", () => {
    cy.visit("http://localhost:5173/");
    cy.get("#login-button").click();
    cy.url().should("include", "/login");

    // login
    cy.get("#basic_username").type("user@example.com");
    cy.get(".ant-input-affix-wrapper").type("user");
    cy.get('[type="submit"]').click();

    Cypress.Commands.add("login", () => {
      cy.request({
        method: "POST",
        url: "http://localhost:5173/auth",
        body: {
          email: "user@example.com",
          password: "user",
        },
      }).then((response) => {
        window.localStorage.setItem("token", response.body.token);
      });
    });

    // déposer une annonce
    cy.get(".text-gray-900").click();
    cy.get(".ant-card-head-title").should("have.text", "Déposer une annonce");
    cy.url().should("include", "real_estate_ads/create");

    // check first select
    cy.get(
      "#basic_type > :nth-child(2) > .ant-radio > .ant-radio-input"
    ).click();
    // verifier que le select est bien coché
    cy.get(
      "#basic_type > :nth-child(2) > .ant-radio > .ant-radio-input"
    ).should("be.checked");

    cy.get("#basic_price").type("100000");
    cy.get("#basic_title").type("test");
    cy.get("#basic_description").type("test");
    cy.get("#basic_address").type("allée des lilas");
    cy.get("#basic_city").type("Paris");
    cy.get("#basic_zipcode").type("75000");
    cy.get("#basic_floor").type("2");
    cy.get("#basic_surface").type("100");
    cy.get("#basic_rooms").type("3");
    cy.get("#basic_has_garden > .ant-switch-handle").click();
    cy.get(
      "#basic_classification > :nth-child(2) > .ant-radio > .ant-radio-input"
    ).click();
    // probleme avec le JWT token

    cy.get(".block").click();
    cy.get(
      ":nth-child(1) > .ant-card > .ant-card-actions > :nth-child(1) > :nth-child(1) > .ant-btn"
    ).click();

    // probleme avec le JWT token

    cy.visit("http://localhost:5173/");
    cy.get("#user-picture").click();
    cy.get(
      '[data-menu-id="3"] > .ant-dropdown-menu-title-content > .block'
    ).click();
    cy.url().should("include", "/login");
  });
});

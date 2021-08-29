it('Basic CURD test', () => {
    cy.visit('http://localhost:6660/');
    cy.get('#init-btn').click();
						    
    cy.get('#editing').type('CREATE TABLE `test` (id INT, name TEXT);');
    cy.get('#exec-btn').click();
    cy.get('#result-table').contains('td', '0 row(s) affected').should('be.visible');

    cy.get('#editing').clear();

    cy.get('#editing').type('INSERT INTO `test` VALUES (1, \'test\');');
    cy.get('#exec-btn').click();
    cy.get('#result-table').contains('td', '1 row(s) affected').should('be.visible');
    
    cy.get('#editing').clear();

    cy.get('#editing').type('SELECT * FROM `test`;');
    cy.get('#exec-btn').click();
    cy.get('#result-table').contains('td', 'test').should('be.visible');
});

it('Checking history table', () => {
    cy.get('[data-target=history-modal]').click()
    cy.get('#history-modal').should('be.visible');
    cy.get('#history-table').contains('td', 'CREATE TABLE `test` (id INT, name TEXT);').should('be.visible');
    cy.get('#history-table').contains('td', 'INSERT INTO `test` VALUES (1, \'test\');').should('be.visible');
    cy.get('#history-table').contains('td', 'SELECT * FROM `test`;').should('be.visible');
    cy.get('.modal-overlay').click()
    cy.get('#history-modal').should('not.be.visible');
});

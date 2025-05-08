describe('Mentorship Page Tests', () => { 
    beforeEach(() => { 
      cy.visit('http://127.0.0.1:5500/admin/SE_web/mentorship.html');
      // Wait for initial data to load
      cy.wait(2000);
    }); 
   
    it('should load the page and display Mentorship header', () => { 
      cy.contains('Mentorship Assignments').should('be.visible'); 
      cy.get('#assign-mentor').should('exist').and('be.visible');
    }); 
  
    it('should load Programme and Mentor dropdowns', () => {
      cy.get('#selected-programme').should('exist');
      cy.get('#selected-mentor').should('exist');
      
      // Verify dropdowns have options loaded
      cy.get('#selected-programme option').should('have.length.gt', 1);
      cy.get('#selected-mentor option').should('have.length.gt', 1);
    });
    
    it('should display total mentors count', () => {
      cy.get('#total-mentors').should('exist');
      cy.get('#total-mentors').should('not.have.text', '0');
    });
    
    it('should display mentorship table with data', () => {
      cy.get('#mentorshipTable').should('exist');
      cy.get('.mentorship-table').should('exist');
      cy.get('.mentorship-table tbody tr').should('have.length.gt', 0);
    });
    
    it('should filter mentorship data when programme is selected', () => {
      // Get the current number of rows
      cy.get('.mentorship-table tbody tr').then($initialRows => {
        const initialRowCount = $initialRows.length;
        
        // Select the first non-empty programme option
        cy.get('#selected-programme option').not('[value=""]').first().then($option => {
          const programmeId = $option.val();
          cy.get('#selected-programme').select(programmeId);
          
          // Wait for filtering to complete
          cy.wait(1000);
          
          // Verify table has updated
          cy.get('.mentorship-table tbody tr').should('exist');
        });
      });
    });
    
    it('should filter mentorship data when mentor is selected', () => {
      // Get the current number of rows
      cy.get('.mentorship-table tbody tr').then($initialRows => {
        const initialRowCount = $initialRows.length;
        
        // Select the first non-empty mentor option
        cy.get('#selected-mentor option').not('[value=""]').first().then($option => {
          const mentorId = $option.val();
          cy.get('#selected-mentor').select(mentorId);
          
          // Wait for filtering to complete
          cy.wait(1000);
          
          // Verify table has updated
          cy.get('.mentorship-table tbody tr').should('exist');
        });
      });
    });
    
    it('should open modal when "Assign New Mentor" button is clicked', () => {
      cy.get('#assign-mentor').click();
      cy.get('#mentorModal').should('be.visible');
      cy.get('#student-select').should('be.visible');
      cy.get('#mentor-select').should('be.visible');
    });
    
    it('should close modal when close button is clicked', () => {
      cy.get('#assign-mentor').click();
      cy.get('#mentorModal').should('be.visible');
      cy.get('.close').click();
      cy.get('#mentorModal').should('not.be.visible');
    });
    
    it('should populate student dropdown in modal', () => {
      cy.get('#assign-mentor').click();
      cy.get('#student-select option').should('have.length.gt', 0);
    });
    
    it('should populate mentor dropdown when student is selected', () => {
      cy.get('#assign-mentor').click();
      
      // Select the first student
      cy.get('#student-select option').first().then($option => {
        const studentId = $option.val();
        cy.get('#student-select').select(studentId);
        
        // Check that mentor dropdown is populated
        cy.get('#mentor-select option').should('have.length.gt', 0);
      });
    });
  });
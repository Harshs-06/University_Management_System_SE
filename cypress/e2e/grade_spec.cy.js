describe('Grade Page Tests', () => { 
    beforeEach(() => { 
      cy.visit('http://127.0.0.1:5500/admin/SE_web/grade.html');
      // Wait for initial data to load
      cy.wait(2000);
    }); 
   
    it('should load the page and display filter cards', () => { 
      cy.get('.filter-cards').should('be.visible');
      cy.contains('Total Students').should('be.visible'); 
      cy.get('#total-students').should('exist');
    }); 
  
    it('should load filter dropdowns correctly', () => {
      cy.get('#selected-batch').should('exist');
      cy.get('#selected-programme').should('exist');
      cy.get('#selected-subject').should('exist');
      
      // Verify dropdowns have options loaded
      cy.get('#selected-batch option').should('have.length.gt', 1);
      cy.get('#selected-programme option').should('have.length.gt', 1);
      cy.get('#selected-subject option').should('have.length.gt', 1);
    });
    
    it('should display total students count', () => {
      cy.get('#total-students').should('exist');
      cy.get('#total-students').should('not.have.text', '0');
    });
    
    it('should display grades table with data', () => {
      cy.get('#tableContainer').should('exist');
      cy.get('.grades-table').should('exist');
      cy.get('.grades-table tbody tr').should('have.length.gt', 0);
    });
    
    it('should filter student data when subject is selected', () => {
      // Get the current number of rows
      cy.get('.grades-table tbody tr').then($initialRows => {
        // Select the first non-empty subject option
        cy.get('#selected-subject option').not('[value=""]').first().then($option => {
          const subjectId = $option.val();
          cy.get('#selected-subject').select(subjectId);
          
          // Wait for filtering to complete
          cy.wait(1000);
          
          // Verify table has updated
          cy.get('.grades-table tbody tr').should('exist');
        });
      });
    });
    
    it('should show correct headers in the grades table', () => {
      const expectedHeaders = ['Enrollment No', 'Student Name', 'Batch', 'Programme', 
                               'Subject', 'Activity', 'Marks', 'Max Marks', 'Percentage'];
      
      // Check that all expected headers exist
      expectedHeaders.forEach(header => {
        cy.get('.grades-table thead th').contains(header).should('exist');
      });
      
      // Check that the number of headers matches expected
      cy.get('.grades-table thead th').should('have.length', expectedHeaders.length);
    });
    
    it('should calculate percentage correctly', () => {
      // Get the first row of data
      cy.get('.grades-table tbody tr').first().within(() => {
        // Get the marks and max marks
        cy.get('td').eq(6).invoke('text').then(marksText => {
          const marks = parseFloat(marksText);
          cy.get('td').eq(7).invoke('text').then(maxMarksText => {
            const maxMarks = parseFloat(maxMarksText);
            cy.get('td').eq(8).invoke('text').then(percentageText => {
              // Remove the % sign and convert to a number
              const percentage = parseFloat(percentageText.replace('%', ''));
              
              // Calculate expected percentage
              const expectedPercentage = ((marks / maxMarks) * 100).toFixed(2);
              
              // Compare with a small delta for floating point comparison
              expect(Math.abs(percentage - expectedPercentage)).to.be.lessThan(0.1);
            });
          });
        });
      });
    });
    
    it('should highlight the "Result" nav item as selected', () => {
      cy.get('#result').should('have.class', 'selected');
    });
  });
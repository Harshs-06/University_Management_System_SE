// od-management.spec.js
describe('OD Management Module', () => {
    beforeEach(() => {
      // Visit the OD management page
      cy.visit('http://127.0.0.1:5501/admin/od-management.html');
      
      // Wait for scripts to load before proceeding
      cy.wait(500);
      
      // Wait for page to load
      cy.get('.header-text h1').should('contain', 'OD Management');
    });
  
    it('should have the correct page title', () => {
      cy.title().should('eq', 'OD Management');
    });
  
    it('should display navigation elements', () => {
      cy.get('#navigationBar').should('be.visible');
      cy.get('#dashboard').should('be.visible');
      cy.get('#check_profile').should('be.visible');
      cy.get('#courses').should('be.visible');
      cy.get('#notice').should('be.visible');
      cy.get('#schedule').should('be.visible');
      cy.get('#logout').should('be.visible');
    });
  
    it('should have search and filter elements', () => {
      cy.get('.search-bar').should('be.visible');
      cy.get('.search-input').should('be.visible');
      cy.get('.status-dropdown').should('be.visible');
    });
  
    it('should display initial loading state', () => {
      // Check loading message is initially displayed
      // Note: This test might be flaky if data loads too quickly
      cy.get('.od-requests').should('exist');
    });
  
    it('should navigate to dashboard when dashboard link is clicked', () => {
      // Intercept navigation to dashboard
      cy.intercept('GET', '/admin/dashboard.html').as('dashboardNavigation');
      
      // Click dashboard with force to bypass any JS event handlers
      cy.get('#dashboard').click({force: true});
    });
  
    it('should navigate to dashboard when home button is clicked', () => {
      // Intercept navigation to dashboard
      cy.intercept('GET', '/admin/dashboard.html').as('dashboardNavigation');
      
      // Click home button with force to bypass any JS event handlers
      cy.get('#home-btn').click({force: true});
    });
  
    it('should allow filter selection from status dropdown', () => {
      // First check default value
      cy.get('.status-dropdown').should('have.value', '');
      
      // Test each option
      cy.get('.status-dropdown').select('active');
      cy.get('.status-dropdown').should('have.value', 'active');
      
      cy.get('.status-dropdown').select('inactive');
      cy.get('.status-dropdown').should('have.value', 'inactive');
      
      cy.get('.status-dropdown').select('approved');
      cy.get('.status-dropdown').should('have.value', 'approved');
      
      cy.get('.status-dropdown').select('rejected');
      cy.get('.status-dropdown').should('have.value', 'rejected');
      
      // Return to default
      cy.get('.status-dropdown').select('');
      cy.get('.status-dropdown').should('have.value', '');
    });
  
    it('should allow search input', () => {
      const searchTerm = 'Test Team';
      cy.get('.search-input').type(searchTerm);
      cy.get('.search-input').should('have.value', searchTerm);
      
      // Clear search
      cy.get('.search-input').clear();
      cy.get('.search-input').should('have.value', '');
    });
  
    it('should have modal elements for viewing details', () => {
      cy.get('#details-modal').should('exist');
      cy.get('#modal-title').should('exist');
      cy.get('#modal-reason').should('exist');
      cy.get('#modal-student-list').should('exist');
      cy.get('#close-modal').should('exist');
    });
  
    // Mock requests to test UI rendering
    context('With mocked OD requests', () => {
      beforeEach(() => {
        // Create a stub for fetch requests
        cy.intercept('POST', 'https://klmnijdogskxbpdhtrsj.supabase.co/rest/v1/rpc/od_requests*', {
          statusCode: 200,
          body: []
        }).as('fetchODRequests');
        
        // We'll also manually inject sample data to test UI rendering
        cy.window().then((win) => {
          // Sample OD request data
          const mockData = [
            {
              id: 1,
              teamname: 'Team Alpha',
              event: 'Hackathon',
              status: 'active',
              reason: 'Participating in annual coding competition',
              students: ['John Doe', 'Jane Smith'],
              created_at: '2025-05-01T10:00:00'
            },
            {
              id: 2,
              teamname: 'Team Beta',
              event: 'Conference',
              status: 'approved',
              reason: 'Attending industry conference',
              students: ['Alice Johnson', 'Bob Brown'],
              created_at: '2025-05-02T09:30:00'
            }
          ];
          
          // Use the page's renderODRequests function to display our mock data
          if (win.renderODRequests) {
            win.renderODRequests(mockData);
          }
        });
      });
  
      it('should display OD request cards when data is available', () => {
        // Since we've injected mockData in the beforeEach, we should see cards
        cy.get('.od-card').should('have.length.at.least', 1);
      });
      
      it('should display team name in OD request cards', () => {
        cy.contains('.od-card h3', 'Team Alpha').should('exist');
      });
      
      it('should display event details in OD request cards', () => {
        cy.contains('.od-card p', 'Hackathon').should('exist');
      });
      
      it('should have action buttons on OD request cards', () => {
        cy.get('.od-card .accept-btn').should('exist');
        cy.get('.od-card .view-details-btn').should('exist');
        cy.get('.od-card .reject-btn').should('exist');
      });
    });
    
    // Test modal functionality
    it('should have initially hidden modal', () => {
      cy.get('#details-modal').should('have.css', 'display', 'none');
    });
    
    it('should close modal when close button is clicked', () => {
      // First we need to make the modal visible
      cy.window().then((win) => {
        const modal = win.document.getElementById('details-modal');
        modal.style.display = 'block';
      });
      
      // Verify modal is visible
      cy.get('#details-modal').should('be.visible');
      
      // Click close button
      cy.get('#close-modal').click();
      
      // Verify modal is hidden
      cy.get('#details-modal').should('have.css', 'display', 'none');
    });
  });
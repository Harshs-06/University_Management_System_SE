document.addEventListener("DOMContentLoaded", async function () {
    const scheduleButton = document.getElementById("scheduleButton");
    const courseNameInput = document.getElementById("courseName");
    const assessmentDateInput = document.getElementById("assessmentDate");
    const assessmentTypeInput = document.getElementById("assessmentType");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const errorMessage = document.getElementById("errorMessage");
    
    // Store all the assessment dates that are already scheduled
    let occupiedDates = [];

    // Check connection and table existence
    const isConnected = await checkConnection();
    if (!isConnected) {
        showError("Database connection issue. The assessments table might not exist in your Supabase project.");
    }

    // Function to fetch all assessment dates
    async function fetchExistingAssessmentDates() {
        try {
            const { data, error } = await supabaseClient
                .from('assessments')
                .select('date, course, type');

            if (error) throw error;

            // Extract dates and store them in the occupiedDates array
            if (data && data.length > 0) {
                occupiedDates = data.map(item => ({
                    date: item.date,
                    course: item.course,
                    type: item.type
                }));
            }
            
            // Apply the date restrictions to the date picker
            setupDatePicker();
            
        } catch (error) {
            console.error('Error fetching assessment dates:', error);
            showError("Failed to fetch assessment dates. " + (error.message || "Please try again."));
        }
    }
    
    // Function to set up the date picker with enhanced functionality
    function setupDatePicker() {
        // Add min attribute to only allow future dates (today and onwards)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to beginning of day
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedToday = `${yyyy}-${mm}-${dd}`;
        
        assessmentDateInput.setAttribute('min', formattedToday);
        
        // Create a list of occupied dates for reference
        const occupiedDateStrings = occupiedDates.map(item => item.date);
        
        // Add change and input event listeners
        assessmentDateInput.addEventListener('input', function() {
            const selectedDate = this.value;
            validateSelectedDate(selectedDate);
        });
        
        assessmentDateInput.addEventListener('change', function() {
            const selectedDate = this.value;
            validateSelectedDate(selectedDate);
        });
        
        // Add click event to show custom warning when focusing on the input
        assessmentDateInput.addEventListener('focus', function() {
            // Create or update a small tooltip/hint to show before selection
            let dateHint = document.getElementById('dateSelectionHint');
            if (!dateHint && occupiedDateStrings.length > 0) {
                dateHint = document.createElement('div');
                dateHint.id = 'dateSelectionHint';
                dateHint.className = 'date-selection-hint';
                dateHint.textContent = `${occupiedDateStrings.length} date(s) already occupied`;
                
                // Insert after the date input
                assessmentDateInput.parentNode.insertBefore(dateHint, assessmentDateInput.nextSibling);
                
                // Auto-hide after 3 seconds
                setTimeout(() => {
                    if (dateHint && dateHint.parentNode) {
                        dateHint.parentNode.removeChild(dateHint);
                    }
                }, 3000);
            }
        });
        
        // Create or update visual indication of occupied dates
        updateOccupiedDatesContainer();
    }
    
    // Function to update the occupied dates container
    function updateOccupiedDatesContainer() {
        // Check if the container already exists
        let dateListContainer = document.querySelector('.occupied-dates-list');
        
        // If occupiedDates is empty, remove the container if it exists
        if (occupiedDates.length === 0) {
            if (dateListContainer) {
                dateListContainer.remove();
            }
            return;
        }
        
        // Create the container if it doesn't exist
        if (!dateListContainer) {
            dateListContainer = document.createElement('div');
            dateListContainer.className = 'occupied-dates-list';
            // Insert after the assessment-form
            const assessmentForm = document.querySelector('.assessment-form');
            if (assessmentForm) {
                assessmentForm.parentNode.insertBefore(dateListContainer, assessmentForm.nextSibling);
            }
        }
        
        // Update the content
        dateListContainer.innerHTML = '<h4>Dates with Existing Assessments:</h4>';
        
        const datesList = document.createElement('ul');
        datesList.className = 'occupied-dates';
        
        occupiedDates.forEach(item => {
            const dateItem = document.createElement('li');
            
            // Format the date for better readability
            const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short', 
                day: 'numeric'
            });
            
            dateItem.innerHTML = `
                <span class="occupied-date">${formattedDate}</span>
                <span class="occupied-course">${item.course}</span>
                <span class="occupied-type ${item.type}">${item.type}</span>
            `;
            
            datesList.appendChild(dateItem);
        });
        
        dateListContainer.appendChild(datesList);
    }
    
    // Function to validate the selected date
    function validateSelectedDate(selectedDate) {
        const occupiedDateStrings = occupiedDates.map(item => item.date);
        
        if (occupiedDateStrings.includes(selectedDate)) {
            // Find details for this date
            const occupiedAssessment = occupiedDates.find(item => item.date === selectedDate);
            
            // Show error message with detailed information
            showDateClashError(occupiedAssessment);
            
            // Clear the invalid date
            assessmentDateInput.value = '';
            return false;
        }
        
        return true;
    }
    
    // Function to show date clash error in a popup with assessment details
    function showDateClashError(occupiedAssessment = null) {
        // Create modal popup for date clash
        const modal = document.createElement('div');
        modal.className = 'date-clash-modal';
        
        let detailsHTML = '';
        if (occupiedAssessment) {
            const formattedDate = new Date(occupiedAssessment.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            detailsHTML = `
                <div class="clash-details">
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Course:</strong> ${occupiedAssessment.course}</p>
                    <p><strong>Type:</strong> <span class="assessment-type ${occupiedAssessment.type}">${occupiedAssessment.type}</span></p>
                </div>
            `;
        }
        
        modal.innerHTML = `
            <div class="date-clash-content">
                <h3>Date Clash Detected</h3>
                <p>This date is already occupied with another assessment.</p>
                ${detailsHTML}
                <button id="closeModal">OK</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listener to close button
        document.getElementById('closeModal').addEventListener('click', function() {
            modal.remove();
        });
        
        // Auto close after 4 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
            }
        }, 4000);
    }

    // Load existing assessments when page loads
    async function loadAssessments() {
        try {
            loadingSpinner.style.display = "block";
            
            const { data, error } = await supabaseClient
                .from('assessments')
                .select('*')
                .order('date', { ascending: true });

            if (error) {
                throw error;
            }

            // After loading assessments, fetch their dates to apply restrictions
            await fetchExistingAssessmentDates();
            
        } catch (error) {
            console.error('Error loading assessments:', error);
            if (error.code === '42P01') {
                showError("The assessments table doesn't exist. Please set up your database first.");
            } else {
                showError("Failed to load assessments. " + (error.message || "Please try again."));
            }
        } finally {
            loadingSpinner.style.display = "none";
        }
    }

    // Initial load
    loadAssessments();

    scheduleButton.addEventListener("click", async function () {
        const courseName = courseNameInput.value.trim();
        const assessmentDate = assessmentDateInput.value.trim();
        const assessmentType = assessmentTypeInput.value;

        if (courseName === "" || assessmentDate === "") {
            showError("Please fill in all the fields.");
            return;
        }
        
        // Check if date is in the occupied list
        if (!validateSelectedDate(assessmentDate)) {
            return;
        }

        try {
            loadingSpinner.style.display = "block";
            errorMessage.style.display = "none";

            // Add new assessment
            const { data, error: insertError } = await supabaseClient
                .from('assessments')
                .insert([
                    {
                        course: courseName,
                        date: assessmentDate,
                        type: assessmentType
                    }
                ])
                .select();

            if (insertError) throw insertError;

            // Clear form
            courseNameInput.value = "";
            assessmentDateInput.value = "";
            assessmentTypeInput.value = "quiz";

            // Show success message
            showSuccess("Assessment scheduled successfully!");
            
            // Reload assessments to update the occupied dates
            await loadAssessments();

        } catch (error) {
            console.error('Error scheduling assessment:', error);
            if (error.code === '42P01') {
                showError("The assessments table doesn't exist. Please set up your database first.");
            } else {
                showError("Failed to schedule assessment. " + (error.message || "Please try again."));
            }
        } finally {
            loadingSpinner.style.display = "none";
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
        errorMessage.className = "error-message";
    }
    
    function showSuccess(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
        errorMessage.className = "success-message";
        
        // Hide the message after 3 seconds
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
    }
});
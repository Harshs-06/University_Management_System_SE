document.addEventListener("DOMContentLoaded", async function () {
    const scheduleButton = document.getElementById("scheduleButton");
    const courseNameInput = document.getElementById("courseName");
    const assessmentDateInput = document.getElementById("assessmentDate");
    const assessmentTypeInput = document.getElementById("assessmentType");
    const assessmentList = document.getElementById("assessmentList");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const errorMessage = document.getElementById("errorMessage");

    // Check connection and table existence
    const isConnected = await checkConnection();
    if (!isConnected) {
        showError("Database connection issue. The assessments table might not exist in your Supabase project.");
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

            // If we got data, update the list
            if (data) {
                updateAssessmentList(data);
            } else {
                // Empty array is fine - just means no assessments yet
                updateAssessmentList([]);
            }
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

        try {
            loadingSpinner.style.display = "block";
            errorMessage.style.display = "none";

            // Check if date is already scheduled
            const { data: existingAssessments, error: checkError } = await supabaseClient
                .from('assessments')
                .select('id')
                .eq('date', assessmentDate);

            if (checkError) throw checkError;

            if (existingAssessments && existingAssessments.length > 0) {
                showError("An assessment is already scheduled on this date. Please choose another date.");
                return;
            }

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

            // Reload assessments
            await loadAssessments();

            // Clear form
            courseNameInput.value = "";
            assessmentDateInput.value = "";
            assessmentTypeInput.value = "quiz";

            // Show success message
            showSuccess("Assessment scheduled successfully!");

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

    async function removeAssessment(id) {
        try {
            loadingSpinner.style.display = "block";
            errorMessage.style.display = "none";

            const { error } = await supabaseClient
                .from('assessments')
                .delete()
                .eq('id', id);

            if (error) throw error;

            await loadAssessments();
            showSuccess("Assessment removed successfully!");
        } catch (error) {
            console.error('Error removing assessment:', error);
            showError("Failed to remove assessment. " + (error.message || "Please try again."));
        } finally {
            loadingSpinner.style.display = "none";
        }
    }

    function updateAssessmentList(assessments) {
        assessmentList.innerHTML = "";
        
        if (!assessments || assessments.length === 0) {
            const noAssessments = document.createElement("p");
            noAssessments.textContent = "No assessments scheduled yet.";
            noAssessments.className = "no-assessments";
            assessmentList.appendChild(noAssessments);
            return;
        }
        
        assessments.forEach((assessment) => {
            const listItem = document.createElement("li");
            
            // Format the date for better readability
            const formattedDate = new Date(assessment.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            listItem.innerHTML = `
                <div class="assessment-info">
                    <span class="course-name">${assessment.course}</span>
                    <span class="assessment-type ${assessment.type}">${assessment.type}</span>
                    <span class="assessment-date">${formattedDate}</span>
                </div>
                <button class="remove-btn" data-id="${assessment.id}">Remove</button>
            `;
            
            // Add event listener to the remove button
            const removeBtn = listItem.querySelector('.remove-btn');
            removeBtn.addEventListener('click', () => removeAssessment(assessment.id));
            
            assessmentList.appendChild(listItem);
        });
    }

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
document.addEventListener("DOMContentLoaded", function () {
    const scheduleButton = document.getElementById("scheduleButton");
    const courseNameInput = document.getElementById("courseName");
    const assessmentDateInput = document.getElementById("assessmentDate");
    const assessmentTypeInput = document.getElementById("assessmentType");
    const assessmentList = document.getElementById("assessmentList");

    let assessments = [];

    scheduleButton.addEventListener("click", function () {
        const courseName = courseNameInput.value.trim();
        const assessmentDate = assessmentDateInput.value.trim();
        const assessmentType = assessmentTypeInput.value;

        // Check if the same date is already scheduled
        const isDateOccupied = assessments.some(
            (assessment) => assessment.date === assessmentDate
        );

        if (isDateOccupied) {
            alert("An assessment is already scheduled on this date. Please choose another date.");
        } else if (courseName !== "" && assessmentDate !== "") {
            // Add the new assessment
            const newAssessment = {
                course: courseName,
                date: assessmentDate,
                type: assessmentType,
            };

            assessments.push(newAssessment);
            updateAssessmentList();
            courseNameInput.value = "";
            assessmentDateInput.value = "";
        } else {
            alert("Please fill in all the fields.");
        }
    });

    function updateAssessmentList() {
        assessmentList.innerHTML = "";
        assessments.forEach((assessment, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span>${assessment.course} - ${assessment.type} on ${assessment.date}</span>
                <button class="remove-btn" onclick="removeAssessment(${index})">Remove</button>
            `;
            assessmentList.appendChild(listItem);
        });
    }

    window.removeAssessment = function (index) {
        assessments.splice(index, 1);
        updateAssessmentList();
    };
});

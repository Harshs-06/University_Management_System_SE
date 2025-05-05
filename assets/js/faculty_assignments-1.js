// Faculty Assignments JavaScript

// Populate the faculty table
function populateFacultyTable() {
    const facultyTableBody = document.getElementById('facultyTableBody');
    if (!facultyTableBody) return;
    
    // Clear the table
    facultyTableBody.innerHTML = '';
    
    // Get faculty from local storage
    const faculty = getFaculty();
    const courses = getCourses();
    
    // Filter faculty if department is selected
    const departmentFilter = document.getElementById('departmentDropdown').value;
    let filteredFaculty = faculty;
    
    if (departmentFilter) {
        filteredFaculty = faculty.filter(f => {
            const deptCode = f.department.includes('CSE') ? 'CSE' : 
                            f.department.includes('ME') ? 'ME' : 
                            f.department.includes('Ecom') ? 'Ecom' : '';
            return deptCode === departmentFilter;
        });
    }
    
    // Add each faculty to the table
    filteredFaculty.forEach(f => {
        // Count courses assigned to this faculty
        const assignedCourses = courses.filter(c => c.facultyId === f.id);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${f.id}</td>
            <td>${f.name}</td>
            <td>${f.department}</td>
            <td>${f.designation}</td>
            <td>${assignedCourses.length}</td>
            <td>
                <button class="action-btn view-btn" data-faculty-id="${f.id}">View Details</button>
                <button class="action-btn edit-btn" data-faculty-id="${f.id}">Edit</button>
            </td>
        `;
        
        facultyTableBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const facultyId = parseInt(this.getAttribute('data-faculty-id'));
            viewFacultyDetails(facultyId);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const facultyId = parseInt(this.getAttribute('data-faculty-id'));
            // Not implemented in this version
            alert('Edit faculty functionality would be implemented here');
        });
    });
}

// Filter faculty by department
function filterFaculty() {
    populateFacultyTable();
}

// View faculty details
function viewFacultyDetails(facultyId) {
    // Get faculty data
    const faculty = getFaculty().find(f => f.id === facultyId);
    if (!faculty) {
        alert('Faculty not found!');
        return;
    }
    
    // Get courses assigned to this faculty
    const courses = getCourses().filter(c => c.facultyId === facultyId);
    
    // Update modal content
    document.getElementById('modalFacultyName').textContent = faculty.name;
    document.getElementById('modalFacultyDesignation').textContent = faculty.designation;
    document.getElementById('modalFacultyDepartment').textContent = faculty.department;
    document.getElementById('modalFacultyEmail').textContent = faculty.email;
    
    // Update courses list
    const coursesList = document.getElementById('facultyCourseslist');
    coursesList.innerHTML = '';
    
    if (courses.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No courses assigned yet.';
        li.className = 'no-courses';
        coursesList.appendChild(li);
    } else {
        courses.forEach(course => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${course.id}:</strong> ${course.name} 
                <span class="course-info">(${course.department}, ${course.batch})</span>
            `;
            coursesList.appendChild(li);
        });
    }
    
    // Show the modal
    document.getElementById('facultyDetailsModal').style.display = 'block';
}

// Populate course dropdown
function populateCourseDropdown() {
    const courseDropdown = document.getElementById('selectCourse');
    if (!courseDropdown) return;
    
    // Clear existing options except the first one
    while (courseDropdown.options.length > 1) {
        courseDropdown.remove(1);
    }
    
    // Get courses from local storage
    const courses = getCourses();
    
    // Add each course to the dropdown
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = `${course.id}: ${course.name} (${course.department})`;
        courseDropdown.appendChild(option);
    });
}

// Populate faculty dropdown for assignment
function populateFacultyDropdownForAssignment() {
    const facultyDropdown = document.getElementById('selectFaculty');
    if (!facultyDropdown) return;
    
    // Clear existing options except the first one
    while (facultyDropdown.options.length > 1) {
        facultyDropdown.remove(1);
    }
    
    // Get faculty from local storage
    const faculty = getFaculty();
    
    // Add each faculty to the dropdown
    faculty.forEach(f => {
        const option = document.createElement('option');
        option.value = f.id;
        option.textContent = `${f.name} (${f.designation})`;
        facultyDropdown.appendChild(option);
    });
}

// Update department statistics
function updateDepartmentStats() {
    const courses = getCourses();
    const faculty = getFaculty();
    
    // Count courses by department
    const cseCourses = courses.filter(c => c.department === 'CSE').length;
    const meCourses = courses.filter(c => c.department === 'ME').length;
    const ecomCourses = courses.filter(c => c.department === 'Ecom').length;
    
    // Count faculty by department
    const cseFaculty = faculty.filter(f => f.department.includes('CSE')).length;
    const meFaculty = faculty.filter(f => f.department.includes('ME')).length;
    const ecomFaculty = faculty.filter(f => f.department.includes('Ecom')).length;
    
    // Update the UI
    document.getElementById('cseCoursesCount').textContent = cseCourses;
    document.getElementById('meCoursesCount').textContent = meCourses;
    document.getElementById('ecomCoursesCount').textContent = ecomCourses;
    
    document.getElementById('cseFacultyCount').textContent = cseFaculty;
    document.getElementById('meFacultyCount').textContent = meFaculty;
    document.getElementById('ecomFacultyCount').textContent = ecomFaculty;
}

// Add new faculty
function addNewFaculty() {
    // Get form values
    const name = document.getElementById('facultyName').value;
    const designation = document.getElementById('facultyDesignation').value;
    const department = document.getElementById('facultyDepartment').value;
    const email = document.getElementById('facultyEmail').value;
    
    // Get faculty from local storage
    const faculty = getFaculty();
    
    // Generate a new ID (simple increment)
    const newId = faculty.length > 0 ? Math.max(...faculty.map(f => f.id)) + 1 : 1;
    
    // Create new faculty object
    const newFaculty = {
        id: newId,
        name: name,
        designation: designation,
        department: department,
        email: email,
        image: '/assets/images/faculty_placeholder.png'
    };
    
    // Add to faculty array
    faculty.push(newFaculty);
    
    // Save to local storage
    saveFaculty(faculty);
    
    // Update the UI
    populateFacultyTable();
    populateFacultyDropdownForAssignment();
    updateDepartmentStats();
    
    // Show success message
    alert('New faculty member added successfully!');
    
    // Close the modal and reset form
    document.getElementById('addFacultyModal').style.display = 'none';
    document.getElementById('newFacultyForm').reset();
}

// Assign faculty to course
function assignFacultyToCourse() {
    // Get selected values
    const courseId = document.getElementById('selectCourse').value;
    const facultyId = parseInt(document.getElementById('selectFaculty').value);
    
    if (!courseId || !facultyId) {
        alert('Please select both a course and a faculty member.');
        return;
    }
    
    // Get courses and faculty from local storage
    const courses = getCourses();
    const faculty = getFaculty();
    
    // Find the course and faculty
    const course = courses.find(c => c.id === courseId);
    const facultyMember = faculty.find(f => f.id === facultyId);
    
    if (!course) {
        alert('Selected course not found!');
        return;
    }
    
    if (!facultyMember) {
        alert('Selected faculty member not found!');
        return;
    }
    
    // Check if the faculty department matches the course department
    const facultyDept = facultyMember.department.includes('CSE') ? 'CSE' : 
                    facultyMember.department.includes('ME') ? 'ME' : 
                    facultyMember.department.includes('Ecom') ? 'Ecom' : '';
    
    if (facultyDept !== course.department) {
        const confirmAssign = confirm('The faculty member is not from the same department as the course. Do you want to continue?');
        if (!confirmAssign) {
            return;
        }
    }
    
    // Update the course with the new faculty
    course.facultyId = facultyId;
    course.faculty = facultyMember.name;
    
    // Save to local storage
    saveCourses(courses);
    
    // Update the UI
    populateFacultyTable();
    
    // Show success message
    alert(`Successfully assigned ${facultyMember.name} to course ${course.id}: ${course.name}`);
    
    // Reset form
    document.getElementById('assignFacultyForm').reset();
} 
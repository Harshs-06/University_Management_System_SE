/**
 * Manage Faculty JavaScript
 * This file handles faculty management functionality using local storage
 */

document.addEventListener("DOMContentLoaded", function() {
    // Load faculty data
    loadFaculty();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Add new faculty button
    const newFacultyBtn = document.getElementById('newFacultyBtn');
    if (newFacultyBtn) {
        newFacultyBtn.addEventListener('click', showNewFacultyForm);
    }
    
    // Department filter
    const deptFilter = document.getElementById('departmentFilter');
    if (deptFilter) {
        deptFilter.addEventListener('change', function() {
            loadFaculty();
        });
    }
    
    // Search faculty
    const searchInput = document.getElementById('searchFaculty');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            loadFaculty();
        });
    }
}

/**
 * Load faculty data from local storage and display it
 */
function loadFaculty() {
    try {
        // Get faculty list container
        const facultyList = document.getElementById('facultyList');
        if (!facultyList) return;
        
        // Clear existing content
        facultyList.innerHTML = '';
        
        // Get filters
        const departmentFilter = document.getElementById('departmentFilter')?.value || '';
        const searchText = document.getElementById('searchFaculty')?.value || '';
        
        // Get faculty data
        let faculty = LocalDB.getAll('faculty');
        
        // Apply filters
        if (departmentFilter) {
            faculty = faculty.filter(member => member.department_id === parseInt(departmentFilter));
        }
        
        if (searchText) {
            const search = searchText.toLowerCase();
            faculty = faculty.filter(member => 
                member.name.toLowerCase().includes(search) || 
                (member.email && member.email.toLowerCase().includes(search)) || 
                (member.specialization && member.specialization.toLowerCase().includes(search))
            );
        }
        
        // Get departments for reference
        const departments = LocalDB.getAll('departments');
        
        // Display faculty
        if (faculty.length === 0) {
            facultyList.innerHTML = '<div class="empty-message">No faculty members found</div>';
            return;
        }
        
        faculty.forEach(member => {
            const department = departments.find(d => d.id === member.department_id);
            
            const facultyItem = document.createElement('div');
            facultyItem.className = 'faculty-item';
            
            facultyItem.innerHTML = `
                <div class="faculty-info">
                    <h3>${member.name}</h3>
                    <p><strong>Department:</strong> ${department ? department.name : 'Not Assigned'}</p>
                    <p><strong>Email:</strong> ${member.email || 'Not Provided'}</p>
                    <p><strong>Specialization:</strong> ${member.specialization || 'Not Specified'}</p>
                </div>
                <div class="faculty-actions">
                    <button class="btn btn-sm btn-primary edit-faculty-btn" data-id="${member.id}">Edit</button>
                    <button class="btn btn-sm btn-success assign-courses-btn" data-id="${member.id}">Assign Courses</button>
                    <button class="btn btn-sm btn-danger delete-faculty-btn" data-id="${member.id}">Delete</button>
                </div>
            `;
            
            // Add event listeners
            facultyItem.querySelector('.edit-faculty-btn').addEventListener('click', function() {
                editFaculty(member.id);
            });
            
            facultyItem.querySelector('.assign-courses-btn').addEventListener('click', function() {
                window.location.href = `faculty-assign-courses.html?id=${member.id}`;
            });
            
            facultyItem.querySelector('.delete-faculty-btn').addEventListener('click', function() {
                deleteFaculty(member.id);
            });
            
            facultyList.appendChild(facultyItem);
        });
    } catch (error) {
        console.error('Error loading faculty:', error);
        document.getElementById('facultyList').innerHTML = 
            '<div class="empty-message">Error loading faculty data</div>';
    }
}

/**
 * Show form to add a new faculty member
 */
function showNewFacultyForm() {
    // Create or get modal
    let modal = document.getElementById('facultyFormModal');
    
    if (!modal) {
        // Create modal if it doesn't exist
        modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'facultyFormModal';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', 'facultyFormModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="facultyFormModalLabel">Add New Faculty</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="facultyForm">
                            <input type="hidden" id="facultyId" value="">
                            
                            <div class="mb-3">
                                <label for="facultyName" class="form-label">Name</label>
                                <input type="text" class="form-control" id="facultyName" required>
                            </div>
                            
                            <div class="mb-3">
                                <label for="facultyFullName" class="form-label">Full Name (with titles)</label>
                                <input type="text" class="form-control" id="facultyFullName">
                            </div>
                            
                            <div class="mb-3">
                                <label for="facultyEmail" class="form-label">Email</label>
                                <input type="email" class="form-control" id="facultyEmail">
                            </div>
                            
                            <div class="mb-3">
                                <label for="facultyDepartment" class="form-label">Department</label>
                                <select class="form-select" id="facultyDepartment" required>
                                    <option value="">Select Department</option>
                                    <option value="1">CSE</option>
                                    <option value="2">ME</option>
                                    <option value="3">ECE</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="facultySpecialization" class="form-label">Specialization</label>
                                <input type="text" class="form-control" id="facultySpecialization">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveFacultyBtn">Save</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listener to save button
        document.getElementById('saveFacultyBtn').addEventListener('click', saveFaculty);
    }
    
    // Reset form
    document.getElementById('facultyId').value = '';
    document.getElementById('facultyName').value = '';
    document.getElementById('facultyFullName').value = '';
    document.getElementById('facultyEmail').value = '';
    document.getElementById('facultyDepartment').value = '';
    document.getElementById('facultySpecialization').value = '';
    
    // Update modal title
    document.getElementById('facultyFormModalLabel').textContent = 'Add New Faculty';
    
    // Show modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

/**
 * Save faculty member data
 */
function saveFaculty() {
    try {
        // Get form values
        const id = document.getElementById('facultyId').value;
        const name = document.getElementById('facultyName').value.trim();
        const fullName = document.getElementById('facultyFullName').value.trim();
        const email = document.getElementById('facultyEmail').value.trim();
        const departmentId = parseInt(document.getElementById('facultyDepartment').value);
        const specialization = document.getElementById('facultySpecialization').value.trim();
        
        // Validate
        if (!name) {
            alert('Please enter faculty name');
            return;
        }
        
        if (isNaN(departmentId) || departmentId <= 0) {
            alert('Please select a department');
            return;
        }
        
        // Create faculty object
        const faculty = {
            name: name,
            department_id: departmentId
        };
        
        // Add optional fields if provided
        if (fullName) faculty.full_name = fullName;
        if (email) faculty.email = email;
        if (specialization) faculty.specialization = specialization;
        
        // Save faculty
        if (id) {
            // Update existing faculty
            LocalDB.update('faculty', id, faculty);
            alert('Faculty updated successfully');
        } else {
            // Create new faculty
            LocalDB.insert('faculty', faculty);
            alert('Faculty added successfully');
        }
        
        // Hide modal
        bootstrap.Modal.getInstance(document.getElementById('facultyFormModal')).hide();
        
        // Reload faculty list
        loadFaculty();
    } catch (error) {
        console.error('Error saving faculty:', error);
        alert('Error saving faculty');
    }
}

/**
 * Edit an existing faculty member
 * @param {number} id - The faculty ID
 */
function editFaculty(id) {
    try {
        // Get faculty
        const faculty = LocalDB.getById('faculty', id);
        
        if (!faculty) {
            alert('Faculty not found');
            return;
        }
        
        // Show form
        showNewFacultyForm();
        
        // Update form values
        document.getElementById('facultyId').value = faculty.id;
        document.getElementById('facultyName').value = faculty.name;
        document.getElementById('facultyFullName').value = faculty.full_name || '';
        document.getElementById('facultyEmail').value = faculty.email || '';
        document.getElementById('facultyDepartment').value = faculty.department_id;
        document.getElementById('facultySpecialization').value = faculty.specialization || '';
        
        // Update modal title
        document.getElementById('facultyFormModalLabel').textContent = 'Edit Faculty';
    } catch (error) {
        console.error('Error editing faculty:', error);
        alert('Error editing faculty');
    }
}

/**
 * Delete a faculty member
 * @param {number} id - The faculty ID
 */
function deleteFaculty(id) {
    try {
        // Confirm deletion
        if (!confirm('Are you sure you want to delete this faculty member?')) {
            return;
        }
        
        // Check if faculty has assigned courses
        const courses = LocalDB.getAll('courses');
        const assignedCourses = courses.filter(course => course.faculty_id === parseInt(id));
        
        if (assignedCourses.length > 0) {
            if (!confirm(`This faculty is assigned to ${assignedCourses.length} course(s). If you delete this faculty, those courses will no longer have an assigned instructor. Continue?`)) {
                return;
            }
            
            // Remove faculty from courses
            assignedCourses.forEach(course => {
                delete course.faculty_id;
                LocalDB.update('courses', course.id, course);
            });
        }
        
        // Delete faculty
        LocalDB.delete('faculty', id);
        alert('Faculty deleted successfully');
        
        // Reload faculty list
        loadFaculty();
    } catch (error) {
        console.error('Error deleting faculty:', error);
        alert('Error deleting faculty');
    }
} 
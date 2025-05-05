/**
 * Manage Courses JavaScript - LocalStorage Version
 * This file handles course, department, and section management functionality
 */

document.addEventListener("DOMContentLoaded", function() {
    // Load data
    loadDepartments();
    loadSections();
    loadCourses();
    loadFaculty();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // New Department
    const newDeptBtn = document.getElementById('newDepartmentBtn');
    if (newDeptBtn) {
        newDeptBtn.addEventListener('click', showNewDepartmentForm);
    }
    
    // New Section
    const newSectionBtn = document.getElementById('newSectionBtn');
    if (newSectionBtn) {
        newSectionBtn.addEventListener('click', showNewSectionForm);
    }
    
    // New Course
    const newCourseBtn = document.getElementById('newCourseBtn');
    if (newCourseBtn) {
        newCourseBtn.addEventListener('click', showNewCourseForm);
    }
    
    // Department Filter
    const deptFilter = document.getElementById('departmentFilter');
    if (deptFilter) {
        deptFilter.addEventListener('change', function() {
            loadCourses();
        });
    }
    
    // Section Filter
    const sectionFilter = document.getElementById('sectionFilter');
    if (sectionFilter) {
        sectionFilter.addEventListener('change', function() {
            loadCourses();
        });
    }
    
    // Search Input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            loadCourses();
        });
    }
}

/**
 * Load departments from local storage and populate the UI
 */
function loadDepartments() {
    try {
        const departments = LocalDB.getAll('departments');
        
        // Populate department filter dropdown
        const deptFilter = document.getElementById('departmentFilter');
        if (deptFilter) {
            // Clear existing options except the first one
            while (deptFilter.options.length > 1) {
                deptFilter.options.remove(1);
            }
            
            // Add department options
            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.id;
                option.textContent = dept.name;
                deptFilter.appendChild(option);
            });
        }
        
        // Update departments list if available
        const deptList = document.getElementById('departmentsList');
        if (deptList) {
            deptList.innerHTML = '';
            
            if (departments.length === 0) {
                deptList.innerHTML = '<p class="empty-message">No departments found</p>';
                return;
            }
            
            departments.forEach(dept => {
                const deptRow = document.createElement('div');
                deptRow.className = 'department-item';
                
                deptRow.innerHTML = `
                    <div class="department-info">
                        <h3>${dept.name}</h3>
                        <p>Code: ${dept.code}</p>
                    </div>
                    <div class="department-actions">
                        <button class="btn btn-sm btn-primary edit-dept-btn" data-id="${dept.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-dept-btn" data-id="${dept.id}">Delete</button>
                    </div>
                `;
                
                // Add event listeners for edit and delete buttons
                deptRow.querySelector('.edit-dept-btn').addEventListener('click', function() {
                    editDepartment(dept.id);
                });
                
                deptRow.querySelector('.delete-dept-btn').addEventListener('click', function() {
                    deleteDepartment(dept.id);
                });
                
                deptList.appendChild(deptRow);
            });
        }
    } catch (error) {
        console.error('Error loading departments:', error);
        alert('Error loading departments');
    }
}

/**
 * Load sections from local storage and populate the UI
 */
function loadSections() {
    try {
        const sections = LocalDB.getAll('sections');
        
        // Populate section filter dropdown
        const sectionFilter = document.getElementById('sectionFilter');
        if (sectionFilter) {
            // Clear existing options except the first one
            while (sectionFilter.options.length > 1) {
                sectionFilter.options.remove(1);
            }
            
            // Add section options
            sections.forEach(section => {
                const option = document.createElement('option');
                option.value = section.id;
                option.textContent = section.name;
                sectionFilter.appendChild(option);
            });
        }
        
        // Update sections list if available
        const sectionsList = document.getElementById('sectionsList');
        if (sectionsList) {
            sectionsList.innerHTML = '';
            
            if (sections.length === 0) {
                sectionsList.innerHTML = '<p class="empty-message">No sections found</p>';
                return;
            }
            
            sections.forEach(section => {
                const sectionRow = document.createElement('div');
                sectionRow.className = 'section-item';
                
                sectionRow.innerHTML = `
                    <div class="section-info">
                        <h3>${section.name}</h3>
                        <p>Capacity: ${section.capacity || 'Not specified'}</p>
                    </div>
                    <div class="section-actions">
                        <button class="btn btn-sm btn-primary edit-section-btn" data-id="${section.id}">Edit</button>
                        <button class="btn btn-sm btn-danger delete-section-btn" data-id="${section.id}">Delete</button>
                    </div>
                `;
                
                // Add event listeners for edit and delete buttons
                sectionRow.querySelector('.edit-section-btn').addEventListener('click', function() {
                    editSection(section.id);
                });
                
                sectionRow.querySelector('.delete-section-btn').addEventListener('click', function() {
                    deleteSection(section.id);
                });
                
                sectionsList.appendChild(sectionRow);
            });
        }
    } catch (error) {
        console.error('Error loading sections:', error);
        alert('Error loading sections');
    }
}

/**
 * Load faculty members from local storage
 */
function loadFaculty() {
    try {
        const faculty = LocalDB.getAll('faculty');
        
        // Populate faculty dropdown in course form
        const facultyDropdown = document.getElementById('courseFormFaculty');
        if (facultyDropdown) {
            // Clear existing options except the first one
            while (facultyDropdown.options.length > 1) {
                facultyDropdown.options.remove(1);
            }
            
            // Add faculty options
            faculty.forEach(fac => {
                const option = document.createElement('option');
                option.value = fac.id;
                option.textContent = fac.name;
                facultyDropdown.appendChild(option);
            });
        }
        
        // Update faculty list if available
        const facultyList = document.getElementById('facultyList');
        if (facultyList) {
            facultyList.innerHTML = '';
            
            if (faculty.length === 0) {
                facultyList.innerHTML = '<p class="empty-message">No faculty found</p>';
                return;
            }
            
            // Get departments for reference
            const departments = LocalDB.getAll('departments');
            
            faculty.forEach(fac => {
                const dept = departments.find(d => d.id === fac.department_id);
                
                const facRow = document.createElement('div');
                facRow.className = 'faculty-item';
                
                facRow.innerHTML = `
                    <div class="faculty-info">
                        <h3>${fac.name}</h3>
                        <p>Department: ${dept ? dept.name : 'Not assigned'}</p>
                        <p>Email: ${fac.email || 'Not provided'}</p>
                    </div>
                    <div class="faculty-actions">
                        <button class="btn btn-sm btn-primary assign-courses-btn" data-id="${fac.id}">Assign Courses</button>
                    </div>
                `;
                
                // Add event listener for assign courses button
                facRow.querySelector('.assign-courses-btn').addEventListener('click', function() {
                    window.location.href = `faculty-assign-courses.html?id=${fac.id}`;
                });
                
                facultyList.appendChild(facRow);
            });
        }
    } catch (error) {
        console.error('Error loading faculty:', error);
        alert('Error loading faculty');
    }
}

/**
 * Load courses from local storage and populate the courses table
 */
function loadCourses() {
    try {
        // Get courses container
        const coursesContainer = document.getElementById('coursesTable');
        if (!coursesContainer) return;
        
        // Clear existing content
        const tableBody = coursesContainer.querySelector('tbody');
        tableBody.innerHTML = '';
        
        // Get filters
        const departmentFilter = document.getElementById('departmentFilter')?.value || '';
        const sectionFilter = document.getElementById('sectionFilter')?.value || '';
        const searchText = document.getElementById('searchInput')?.value || '';
        
        // Get courses
        let courses = LocalDB.getAll('courses');
        
        // Apply filters
        if (departmentFilter) {
            courses = courses.filter(course => course.department_id === parseInt(departmentFilter));
        }
        
        if (sectionFilter) {
            courses = courses.filter(course => course.section_id === parseInt(sectionFilter));
        }
        
        if (searchText) {
            const search = searchText.toLowerCase();
            courses = courses.filter(course => 
                course.name.toLowerCase().includes(search) || 
                course.code.toLowerCase().includes(search)
            );
        }
        
        // Get reference data
        const departments = LocalDB.getAll('departments');
        const sections = LocalDB.getAll('sections');
        const faculty = LocalDB.getAll('faculty');
        
        // Display courses
        if (courses.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">No courses found</td>
                </tr>
            `;
            return;
        }
        
        courses.forEach(course => {
            const dept = departments.find(d => d.id === course.department_id);
            const section = sections.find(s => s.id === course.section_id);
            const courseProf = faculty.find(f => f.id === course.faculty_id);
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${dept ? dept.name : 'Not assigned'}</td>
                <td>${section ? section.name : 'Not assigned'}</td>
                <td>${courseProf ? courseProf.name : 'Not assigned'}</td>
                <td>${course.capacity || 'Not specified'}</td>
                <td>
                    <button class="btn btn-sm btn-info view-students-btn mb-1" data-id="${course.id}">Students</button>
                    <button class="btn btn-sm btn-primary edit-course-btn mb-1" data-id="${course.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-course-btn mb-1" data-id="${course.id}">Delete</button>
                </td>
            `;
            
            // Add event listeners
            row.querySelector('.view-students-btn').addEventListener('click', function() {
                viewCourseEnrollments(course.id);
            });
            
            row.querySelector('.edit-course-btn').addEventListener('click', function() {
                editCourse(course.id);
            });
            
            row.querySelector('.delete-course-btn').addEventListener('click', function() {
                deleteCourse(course.id);
            });
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading courses:', error);
        alert('Error loading courses');
    }
}

/**
 * Show the form to create a new department
 */
function showNewDepartmentForm() {
    // Get or create modal
    let modal = document.getElementById('departmentFormModal');
    
    if (!modal) {
        // Create modal if it doesn't exist
        modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'departmentFormModal';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', 'departmentFormModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="departmentFormModalLabel">Add New Department</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="departmentForm">
                            <input type="hidden" id="departmentId" value="">
                            <div class="mb-3">
                                <label for="departmentName" class="form-label">Department Name</label>
                                <input type="text" class="form-control" id="departmentName" required>
                            </div>
                            <div class="mb-3">
                                <label for="departmentCode" class="form-label">Department Code</label>
                                <input type="text" class="form-control" id="departmentCode" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveDepartmentBtn">Save</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listener to save button
        document.getElementById('saveDepartmentBtn').addEventListener('click', saveDepartment);
    }
    
    // Reset form
    document.getElementById('departmentId').value = '';
    document.getElementById('departmentName').value = '';
    document.getElementById('departmentCode').value = '';
    
    // Update modal title
    document.getElementById('departmentFormModalLabel').textContent = 'Add New Department';
    
    // Show modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

/**
 * Save a department (create or update)
 */
function saveDepartment() {
    try {
        // Get form values
        const id = document.getElementById('departmentId').value;
        const name = document.getElementById('departmentName').value.trim();
        const code = document.getElementById('departmentCode').value.trim().toUpperCase();
        
        // Validate
        if (!name || !code) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Create department object
        const department = {
            name: name,
            code: code
        };
        
        // Save department
        if (id) {
            // Update existing department
            LocalDB.update('departments', id, department);
            alert('Department updated successfully');
        } else {
            // Create new department
            LocalDB.insert('departments', department);
            alert('Department created successfully');
        }
        
        // Hide modal
        bootstrap.Modal.getInstance(document.getElementById('departmentFormModal')).hide();
        
        // Reload departments
        loadDepartments();
    } catch (error) {
        console.error('Error saving department:', error);
        alert('Error saving department');
    }
}

/**
 * Edit an existing department
 * @param {number} id - The department ID
 */
function editDepartment(id) {
    try {
        // Get department
        const department = LocalDB.getById('departments', id);
        
        if (!department) {
            alert('Department not found');
            return;
        }
        
        // Show form
        showNewDepartmentForm();
        
        // Update form values
        document.getElementById('departmentId').value = department.id;
        document.getElementById('departmentName').value = department.name;
        document.getElementById('departmentCode').value = department.code;
        
        // Update modal title
        document.getElementById('departmentFormModalLabel').textContent = 'Edit Department';
    } catch (error) {
        console.error('Error editing department:', error);
        alert('Error editing department');
    }
}

/**
 * Delete a department
 * @param {number} id - The department ID
 */
function deleteDepartment(id) {
    if (!confirm('Are you sure you want to delete this department?')) {
        return;
    }
    
    try {
        // Delete department
        LocalDB.delete('departments', id);
        
        // Reload departments
        loadDepartments();
    } catch (error) {
        console.error('Error deleting department:', error);
        alert('Error deleting department');
    }
}

/**
 * Show the form to create a new section
 */
function showNewSectionForm() {
    // Get or create modal
    let modal = document.getElementById('sectionFormModal');
    
    if (!modal) {
        // Create modal if it doesn't exist
        modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'sectionFormModal';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', 'sectionFormModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="sectionFormModalLabel">Add New Section</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="sectionForm">
                            <input type="hidden" id="sectionId" value="">
                            <div class="mb-3">
                                <label for="sectionName" class="form-label">Section Name</label>
                                <input type="text" class="form-control" id="sectionName" required>
                            </div>
                            <div class="mb-3">
                                <label for="sectionCapacity" class="form-label">Capacity</label>
                                <input type="number" class="form-control" id="sectionCapacity" min="1" max="100" value="30">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveSectionBtn">Save</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listener to save button
        document.getElementById('saveSectionBtn').addEventListener('click', saveSection);
    }
    
    // Reset form
    document.getElementById('sectionId').value = '';
    document.getElementById('sectionName').value = '';
    document.getElementById('sectionCapacity').value = '30';
    
    // Update modal title
    document.getElementById('sectionFormModalLabel').textContent = 'Add New Section';
    
    // Show modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

/**
 * Save a section (create or update)
 */
function saveSection() {
    try {
        // Get form values
        const id = document.getElementById('sectionId').value;
        const name = document.getElementById('sectionName').value.trim();
        const capacity = parseInt(document.getElementById('sectionCapacity').value);
        
        // Validate
        if (!name) {
            alert('Please fill in the section name');
            return;
        }
        
        if (isNaN(capacity) || capacity < 1) {
            alert('Please enter a valid capacity');
            return;
        }
        
        // Create section object
        const section = {
            name: name,
            capacity: capacity
        };
        
        // Save section
        if (id) {
            // Update existing section
            LocalDB.update('sections', id, section);
            alert('Section updated successfully');
        } else {
            // Create new section
            LocalDB.insert('sections', section);
            alert('Section created successfully');
        }
        
        // Hide modal
        bootstrap.Modal.getInstance(document.getElementById('sectionFormModal')).hide();
        
        // Reload sections
        loadSections();
    } catch (error) {
        console.error('Error saving section:', error);
        alert('Error saving section');
    }
}

/**
 * Edit an existing section
 * @param {number} id - The section ID
 */
function editSection(id) {
    try {
        // Get section
        const section = LocalDB.getById('sections', id);
        
        if (!section) {
            alert('Section not found');
            return;
        }
        
        // Show form
        showNewSectionForm();
        
        // Update form values
        document.getElementById('sectionId').value = section.id;
        document.getElementById('sectionName').value = section.name;
        document.getElementById('sectionCapacity').value = section.capacity || 30;
        
        // Update modal title
        document.getElementById('sectionFormModalLabel').textContent = 'Edit Section';
    } catch (error) {
        console.error('Error editing section:', error);
        alert('Error editing section');
    }
}

/**
 * Delete a section
 * @param {number} id - The section ID
 */
function deleteSection(id) {
    if (!confirm('Are you sure you want to delete this section?')) {
        return;
    }
    
    try {
        // Check if the section is used in any courses
        const courses = LocalDB.getAll('courses');
        const usedSection = courses.find(course => course.section_id === parseInt(id));
        
        if (usedSection) {
            alert('Cannot delete this section because it is used in one or more courses');
            return;
        }
        
        // Delete section
        LocalDB.delete('sections', id);
        
        // Reload sections
        loadSections();
        
        alert('Section deleted successfully');
    } catch (error) {
        console.error('Error deleting section:', error);
        alert('Error deleting section');
    }
}

/**
 * Show the form to create a new course
 */
function showNewCourseForm() {
    // Get or create modal
    let modal = document.getElementById('courseFormModal');
    
    if (!modal) {
        // Create modal if it doesn't exist
        modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'courseFormModal';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', 'courseFormModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="courseFormModalLabel">Add New Course</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="courseForm">
                            <input type="hidden" id="courseId" value="">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="courseName" class="form-label">Course Name</label>
                                    <input type="text" class="form-control" id="courseName" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="courseCode" class="form-label">Course Code</label>
                                    <input type="text" class="form-control" id="courseCode" required>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="courseDepartment" class="form-label">Department</label>
                                    <select class="form-select" id="courseDepartment" required>
                                        <option value="">Select Department</option>
                                        <option value="1">CSE</option>
                                        <option value="2">ME</option>
                                        <option value="3">ECE</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label for="courseSection" class="form-label">Section</label>
                                    <select class="form-select" id="courseSection" required>
                                        <option value="">Select Section</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="courseCapacity" class="form-label">Capacity</label>
                                    <input type="number" class="form-control" id="courseCapacity" min="1" value="30">
                                </div>
                                <div class="col-md-6">
                                    <label for="courseCredits" class="form-label">Credits</label>
                                    <input type="number" class="form-control" id="courseCredits" min="1" max="6" value="3">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="courseFaculty" class="form-label">Faculty (Optional)</label>
                                <select class="form-select" id="courseFaculty">
                                    <option value="">Select Faculty</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveCourseBtn">Save Course</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listener to save button
        document.getElementById('saveCourseBtn').addEventListener('click', saveCourse);
        
        // Add event listener to department dropdown to load sections
        document.getElementById('courseDepartment').addEventListener('change', function() {
            const departmentId = this.value;
            if (!departmentId) return;
            
            // Get sections for this department
            const sections = LocalDB.getAll('sections');
            
            // Populate section dropdown
            const sectionDropdown = document.getElementById('courseSection');
            sectionDropdown.innerHTML = '<option value="">Select Section</option>';
            
            sections.forEach(section => {
                const option = document.createElement('option');
                option.value = section.id;
                option.textContent = section.name;
                sectionDropdown.appendChild(option);
            });
        });
    }
    
    // Reset form
    document.getElementById('courseId').value = '';
    document.getElementById('courseName').value = '';
    document.getElementById('courseCode').value = '';
    document.getElementById('courseDepartment').value = '';
    document.getElementById('courseSection').value = '';
    document.getElementById('courseCapacity').value = '30';
    document.getElementById('courseCredits').value = '3';
    document.getElementById('courseFaculty').value = '';
    
    // Load available faculty for dropdown
    const facultyDropdown = document.getElementById('courseFaculty');
    facultyDropdown.innerHTML = '<option value="">Select Faculty</option>';
    
    const faculty = LocalDB.getAll('faculty');
    faculty.forEach(fac => {
        const option = document.createElement('option');
        option.value = fac.id;
        option.textContent = fac.name;
        facultyDropdown.appendChild(option);
    });
    
    // Update modal title
    document.getElementById('courseFormModalLabel').textContent = 'Add New Course';
    
    // Show modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

/**
 * Save a course (create or update)
 */
function saveCourse() {
    try {
        // Get form values
        const id = document.getElementById('courseId').value;
        const name = document.getElementById('courseName').value.trim();
        const code = document.getElementById('courseCode').value.trim().toUpperCase();
        const departmentId = parseInt(document.getElementById('courseDepartment').value);
        const sectionId = parseInt(document.getElementById('courseSection').value);
        const capacity = parseInt(document.getElementById('courseCapacity').value);
        const credits = parseInt(document.getElementById('courseCredits').value);
        const facultyId = document.getElementById('courseFaculty').value ? 
            parseInt(document.getElementById('courseFaculty').value) : null;
        
        // Validate required fields
        if (!name || !code) {
            alert('Please fill in course name and code');
            return;
        }
        
        if (isNaN(departmentId) || departmentId <= 0) {
            alert('Please select a department');
            return;
        }
        
        if (isNaN(sectionId) || sectionId <= 0) {
            alert('Please select a section');
            return;
        }
        
        if (isNaN(capacity) || capacity < 1) {
            alert('Please enter a valid capacity');
            return;
        }
        
        if (isNaN(credits) || credits < 1 || credits > 6) {
            alert('Please enter valid credits (1-6)');
            return;
        }
        
        // Create course object
        const course = {
            name: name,
            code: code,
            department_id: departmentId,
            section_id: sectionId,
            capacity: capacity,
            credits: credits
        };
        
        // Add faculty if selected
        if (facultyId) {
            course.faculty_id = facultyId;
        }
        
        // Save course
        if (id) {
            // Update existing course
            LocalDB.update('courses', id, course);
            alert('Course updated successfully');
        } else {
            // Create new course
            LocalDB.insert('courses', course);
            alert('Course created successfully');
        }
        
        // Hide modal
        bootstrap.Modal.getInstance(document.getElementById('courseFormModal')).hide();
        
        // Reload courses
        loadCourses();
    } catch (error) {
        console.error('Error saving course:', error);
        alert('Error saving course');
    }
}

/**
 * Edit an existing course
 * @param {number} id - The course ID
 */
function editCourse(id) {
    try {
        // Get course
        const course = LocalDB.getById('courses', id);
        
        if (!course) {
            alert('Course not found');
            return;
        }
        
        // Show course form
        showNewCourseForm();
        
        // Update form values
        document.getElementById('courseId').value = course.id;
        document.getElementById('courseName').value = course.name;
        document.getElementById('courseCode').value = course.code;
        document.getElementById('courseDepartment').value = course.department_id;
        
        // Trigger department change to load sections
        const deptDropdown = document.getElementById('courseDepartment');
        const event = new Event('change');
        deptDropdown.dispatchEvent(event);
        
        // Set the section value after sections are loaded (using setTimeout)
        setTimeout(() => {
            document.getElementById('courseSection').value = course.section_id;
        }, 100);
        
        document.getElementById('courseCapacity').value = course.capacity || 30;
        document.getElementById('courseCredits').value = course.credits || 3;
        
        // Set faculty if assigned
        if (course.faculty_id) {
            document.getElementById('courseFaculty').value = course.faculty_id;
        }
        
        // Update modal title
        document.getElementById('courseFormModalLabel').textContent = 'Edit Course';
    } catch (error) {
        console.error('Error editing course:', error);
        alert('Error editing course');
    }
}

/**
 * Delete a course
 * @param {number} id - The course ID
 */
function deleteCourse(id) {
    if (!confirm('Are you sure you want to delete this course?')) {
        return;
    }
    
    try {
        // Delete course
        LocalDB.delete('courses', id);
        
        // Reload courses
        loadCourses();
    } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course');
    }
}

/**
 * View students enrolled in a course
 * @param {number} courseId - The course ID
 */
function viewCourseEnrollments(courseId) {
    try {
        // Get course
        const course = LocalDB.getById('courses', courseId);
        
        if (!course) {
            alert('Course not found');
            return;
        }
        
        // Get department and section
        const department = LocalDB.getById('departments', course.department_id);
        const section = LocalDB.getById('sections', course.section_id);
        
        // Create or get modal
        let modal = document.getElementById('enrollmentsModal');
        
        if (!modal) {
            // Create modal if it doesn't exist
            modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = 'enrollmentsModal';
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('aria-labelledby', 'enrollmentsModalLabel');
            modal.setAttribute('aria-hidden', 'true');
            
            modal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="enrollmentsModalLabel">Students Enrolled</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="course-info mb-4">
                                <h4 id="enrollmentsCourseTitle"></h4>
                                <p id="enrollmentsCourseDetails"></p>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <h5>Enrolled Students</h5>
                                <button class="btn btn-sm btn-primary" id="addStudentBtn">Add Student</button>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Year</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="enrollmentsTableBody">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listener to add student button
            document.getElementById('addStudentBtn').addEventListener('click', function() {
                showAddStudentToCourseForm(courseId);
            });
        }
        
        // Update course info
        document.getElementById('enrollmentsCourseTitle').textContent = `${course.name} (${course.code})`;
        document.getElementById('enrollmentsCourseDetails').textContent = 
            `Department: ${department ? department.name : 'Unknown'} | Section: ${section ? section.name : 'Unknown'} | Capacity: ${course.capacity || 'Not specified'}`;
        
        // Get enrollments for this course
        const enrollments = getEnrollmentsForCourse(courseId);
        
        // Update table
        const tableBody = document.getElementById('enrollmentsTableBody');
        tableBody.innerHTML = '';
        
        if (enrollments.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" class="text-center">No students enrolled in this course</td>';
            tableBody.appendChild(row);
        } else {
            enrollments.forEach(student => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${student.student_id}</td>
                    <td>${student.name}</td>
                    <td>${student.email || 'Not provided'}</td>
                    <td>${student.year || 'Not specified'}</td>
                    <td>
                        <button class="btn btn-sm btn-danger remove-student-btn" data-student-id="${student.id}">Remove</button>
                    </td>
                `;
                
                // Add event listener to remove button
                row.querySelector('.remove-student-btn').addEventListener('click', function() {
                    removeStudentFromCourse(student.id, courseId);
                });
                
                tableBody.appendChild(row);
            });
        }
        
        // Show modal
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    } catch (error) {
        console.error('Error viewing enrollments:', error);
        alert('Error viewing enrollments');
    }
}

/**
 * Get students enrolled in a specific course
 * @param {number} courseId - The course ID
 * @returns {Array} - The enrolled students
 */
function getEnrollmentsForCourse(courseId) {
    try {
        // In a real app, we would have an enrollments table 
        // Here, we'll simulate by using a special property on students
        const students = LocalDB.getAll('students');
        
        // Filter students by the courses they're enrolled in
        return students.filter(student => {
            // Check if student has enrollments and is enrolled in this course
            return student.enrolled_courses && 
                   student.enrolled_courses.includes(parseInt(courseId));
        });
    } catch (error) {
        console.error('Error getting enrollments:', error);
        return [];
    }
}

/**
 * Show form to add a student to a course
 * @param {number} courseId - The course ID
 */
function showAddStudentToCourseForm(courseId) {
    try {
        // Get course
        const course = LocalDB.getById('courses', courseId);
        
        if (!course) {
            alert('Course not found');
            return;
        }
        
        // Create or get modal
        let modal = document.getElementById('addStudentModal');
        
        if (!modal) {
            // Create modal if it doesn't exist
            modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = 'addStudentModal';
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('aria-labelledby', 'addStudentModalLabel');
            modal.setAttribute('aria-hidden', 'true');
            
            modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addStudentModalLabel">Add Student to Course</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="addStudentForm">
                                <div class="mb-3">
                                    <label for="studentSelect" class="form-label">Select Student</label>
                                    <select class="form-select" id="studentSelect" required>
                                        <option value="">Select Student</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="confirmAddStudentBtn">Add Student</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listener to add student button
            document.getElementById('confirmAddStudentBtn').addEventListener('click', function() {
                const studentId = document.getElementById('studentSelect').value;
                if (!studentId) {
                    alert('Please select a student');
                    return;
                }
                
                addStudentToCourse(studentId, courseId);
                
                // Hide this modal
                bootstrap.Modal.getInstance(modal).hide();
            });
        }
        
        // Get all students not enrolled in this course
        const allStudents = LocalDB.getAll('students');
        const enrolledStudents = getEnrollmentsForCourse(courseId);
        const enrolledStudentIds = enrolledStudents.map(student => student.id);
        
        const availableStudents = allStudents.filter(student => 
            !enrolledStudentIds.includes(student.id)
        );
        
        // Populate student dropdown
        const studentSelect = document.getElementById('studentSelect');
        studentSelect.innerHTML = '<option value="">Select Student</option>';
        
        if (availableStudents.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No available students';
            option.disabled = true;
            studentSelect.appendChild(option);
            
            // Disable the add button
            document.getElementById('confirmAddStudentBtn').disabled = true;
        } else {
            availableStudents.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = `${student.name} (${student.student_id})`;
                studentSelect.appendChild(option);
            });
            
            // Enable the add button
            document.getElementById('confirmAddStudentBtn').disabled = false;
        }
        
        // Update course name in modal title
        document.getElementById('addStudentModalLabel').textContent = `Add Student to ${course.name}`;
        
        // Show modal
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    } catch (error) {
        console.error('Error showing add student form:', error);
        alert('Error showing add student form');
    }
}

/**
 * Add a student to a course
 * @param {number} studentId - The student ID
 * @param {number} courseId - The course ID
 */
function addStudentToCourse(studentId, courseId) {
    try {
        // Get student
        const student = LocalDB.getById('students', studentId);
        
        if (!student) {
            alert('Student not found');
            return;
        }
        
        // Get course
        const course = LocalDB.getById('courses', courseId);
        
        if (!course) {
            alert('Course not found');
            return;
        }
        
        // Check if course is at capacity
        const currentEnrollments = getEnrollmentsForCourse(courseId).length;
        if (course.capacity && currentEnrollments >= course.capacity) {
            alert('Course is at capacity. Cannot enroll more students.');
            return;
        }
        
        // Add course to student's enrolled courses
        if (!student.enrolled_courses) {
            student.enrolled_courses = [];
        }
        
        if (!student.enrolled_courses.includes(parseInt(courseId))) {
            student.enrolled_courses.push(parseInt(courseId));
            LocalDB.update('students', studentId, student);
        }
        
        // Refresh enrollments view
        viewCourseEnrollments(courseId);
        
        alert(`${student.name} has been enrolled in ${course.name}`);
    } catch (error) {
        console.error('Error adding student to course:', error);
        alert('Error adding student to course');
    }
}

/**
 * Remove a student from a course
 * @param {number} studentId - The student ID
 * @param {number} courseId - The course ID
 */
function removeStudentFromCourse(studentId, courseId) {
    try {
        // Confirm removal
        if (!confirm('Are you sure you want to remove this student from the course?')) {
            return;
        }
        
        // Get student
        const student = LocalDB.getById('students', studentId);
        
        if (!student) {
            alert('Student not found');
            return;
        }
        
        // Get course
        const course = LocalDB.getById('courses', courseId);
        
        if (!course) {
            alert('Course not found');
            return;
        }
        
        // Remove course from student's enrolled courses
        if (student.enrolled_courses) {
            const index = student.enrolled_courses.indexOf(parseInt(courseId));
            if (index !== -1) {
                student.enrolled_courses.splice(index, 1);
                LocalDB.update('students', studentId, student);
            }
        }
        
        // Refresh enrollments view
        viewCourseEnrollments(courseId);
        
        alert(`${student.name} has been removed from ${course.name}`);
    } catch (error) {
        console.error('Error removing student from course:', error);
        alert('Error removing student from course');
    }
} 
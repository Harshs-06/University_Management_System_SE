// Manage Courses JavaScript File

// Default sample data for demonstration purposes 
const defaultCourses = [
    {
        id: 'CSE101',
        name: 'Introduction to Programming',
        department: 'CSE',
        faculty: 'Dr. John Smith',
        facultyId: 1,
        studentsCount: 45,
        description: 'An introductory course to programming concepts using Python.',
        credits: 4,
        batch: '2023',
        students: [
            { id: 'CSE2301', name: 'Alice Johnson', section: 'A', attendance: '92%', assignmentsCompleted: '8/10', midTerm: 85, final: 78 },
            { id: 'CSE2302', name: 'Bob Williams', section: 'A', attendance: '88%', assignmentsCompleted: '9/10', midTerm: 72, final: 80 },
            { id: 'CSE2303', name: 'Charlie Brown', section: 'B', attendance: '95%', assignmentsCompleted: '10/10', midTerm: 90, final: 92 }
        ],
        assignments: [
            { title: 'Basic Syntax', dueDate: '2023-09-15', totalMarks: 20, submissions: '42/45' },
            { title: 'Functions', dueDate: '2023-10-05', totalMarks: 30, submissions: '40/45' },
            { title: 'Data Structures', dueDate: '2023-11-10', totalMarks: 50, submissions: '38/45' }
        ]
    },
    {
        id: 'CSE202',
        name: 'Data Structures',
        department: 'CSE',
        faculty: 'Dr. Alice Johnson',
        facultyId: 2,
        studentsCount: 38,
        description: 'Advanced data structures and algorithms with Java implementation.',
        credits: 4,
        batch: '2022',
        students: [
            { id: 'CSE2201', name: 'David Miller', section: 'A', attendance: '90%', assignmentsCompleted: '7/8', midTerm: 88, final: 85 },
            { id: 'CSE2202', name: 'Emily Davis', section: 'A', attendance: '85%', assignmentsCompleted: '8/8', midTerm: 92, final: 90 }
        ],
        assignments: [
            { title: 'Linked Lists', dueDate: '2023-09-20', totalMarks: 25, submissions: '36/38' },
            { title: 'Tree Structures', dueDate: '2023-10-15', totalMarks: 35, submissions: '35/38' }
        ]
    },
    {
        id: 'ME105',
        name: 'Engineering Mechanics',
        department: 'ME',
        faculty: 'Prof. Robert Davis',
        facultyId: 3,
        studentsCount: 42,
        description: 'Fundamental principles of mechanical engineering and statics.',
        credits: 3,
        batch: '2023',
        students: [
            { id: 'ME2301', name: 'Frank Wilson', section: 'A', attendance: '88%', assignmentsCompleted: '6/7', midTerm: 75, final: 82 },
            { id: 'ME2302', name: 'Grace Taylor', section: 'B', attendance: '92%', assignmentsCompleted: '7/7', midTerm: 86, final: 90 }
        ],
        assignments: [
            { title: 'Force Analysis', dueDate: '2023-09-25', totalMarks: 20, submissions: '39/42' },
            { title: 'Equilibrium', dueDate: '2023-10-20', totalMarks: 30, submissions: '40/42' }
        ]
    }
];

// Default faculty information for the system
const defaultFacultyMembers = [
    { 
        id: 1, 
        name: 'Dr. John Smith', 
        designation: 'Associate Professor', 
        department: 'Department of CSE', 
        email: 'john.smith@university.edu', 
        image: '/assets/images/faculty_placeholder.png' 
    },
    { 
        id: 2, 
        name: 'Dr. Alice Johnson', 
        designation: 'Assistant Professor', 
        department: 'Department of CSE', 
        email: 'alice.johnson@university.edu', 
        image: '/assets/images/faculty_placeholder.png' 
    },
    { 
        id: 3, 
        name: 'Prof. Robert Davis', 
        designation: 'Professor', 
        department: 'Department of ME', 
        email: 'robert.davis@university.edu', 
        image: '/assets/images/faculty_placeholder.png' 
    }
];

// Helper function for debug logging
function logDebug(message, data) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`, data || '');
}

// Initialize local storage with default data if it doesn't exist
function initializeLocalStorage() {
    logDebug("Initializing localStorage...");
    
    try {
        // Check if database has been initialized before
        const isInitialized = localStorage.getItem('db_initialized');
        logDebug("DB already initialized:", isInitialized);
        
        // Check storage availability
        if (typeof localStorage === 'undefined') {
            console.error("localStorage is not available in this browser");
            return;
        }
        
        // Check if courses exist in localStorage
        const existingCourses = localStorage.getItem('courses');
        if (!existingCourses) {
            logDebug("Setting default courses in localStorage");
            const coursesJson = JSON.stringify(defaultCourses);
            localStorage.setItem('courses', coursesJson);
            logDebug("Courses JSON set:", coursesJson.substring(0, 50) + "...");
        } else {
            logDebug("Courses already exist in localStorage");
        }
        
        // Check if faculty exists in localStorage
        const existingFaculty = localStorage.getItem('faculty');
        if (!existingFaculty) {
            logDebug("Setting default faculty in localStorage");
            const facultyJson = JSON.stringify(defaultFacultyMembers);
            localStorage.setItem('faculty', facultyJson);
            logDebug("Faculty JSON set:", facultyJson.substring(0, 50) + "...");
        } else {
            logDebug("Faculty already exists in localStorage");
        }
        
        // Verify data was saved successfully and can be retrieved
        const courses = localStorage.getItem('courses');
        const faculty = localStorage.getItem('faculty');
        
        if (courses && faculty) {
            try {
                // Verify we can parse the JSON
                const coursesData = JSON.parse(courses);
                const facultyData = JSON.parse(faculty);
                
                logDebug("localStorage initialized successfully");
                logDebug(`Found ${coursesData.length} courses and ${facultyData.length} faculty members`);
                
                // Mark as initialized
                localStorage.setItem('db_initialized', 'true');
            } catch (e) {
                console.error("Failed to parse stored JSON:", e);
            }
        } else {
            console.error("Failed to initialize localStorage");
        }
    } catch (error) {
        console.error("Error during localStorage initialization:", error);
    }
}

// Get courses from local storage
function getCourses() {
    return JSON.parse(localStorage.getItem('courses')) || [];
}

// Save courses to local storage
function saveCourses(courses) {
    localStorage.setItem('courses', JSON.stringify(courses));
}

// Get faculty members from local storage
function getFaculty() {
    return JSON.parse(localStorage.getItem('faculty')) || [];
}

// Save faculty to local storage
function saveFaculty(faculty) {
    localStorage.setItem('faculty', JSON.stringify(faculty));
}

// Variables to store the current course being viewed/edited
let currentCourse = null;

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("=== DOM CONTENT LOADED ===");
    
    // Direct test of localStorage functionality
    try {
        // Test if localStorage is available
        localStorage.setItem('test', 'test');
        console.log("LocalStorage test write successful");
        
        // Try to read it back
        const testValue = localStorage.getItem('test');
        console.log("LocalStorage test read result:", testValue);
        
        if (testValue === 'test') {
            console.log("✅ Basic localStorage functionality works");
        } else {
            console.error("❌ localStorage read verification failed");
        }
        
        // Clean up test
        localStorage.removeItem('test');
    } catch (error) {
        console.error("❌ localStorage test failed with error:", error);
        alert("This browser doesn't support localStorage or it's disabled. Features requiring data storage will not work.");
    }
    
    // Initialize local storage
    initializeLocalStorage();
    
    // Load profile information
    loadProfileInfo();
    
    // Initialize the courses table
    populateCourseTable();
    
    // Set up event listeners for the course detail modal
    setupCourseDetailModal();
    
    // Set up event listeners for the new course modal
    setupNewCourseModal();
    
    // Set up event listeners for modify course options
    setupModifyCourseOptions();
    
    // Set up navigation to separate pages
    setupNavigation();
});

// Set up navigation to separate pages
function setupNavigation() {
    document.getElementById('modifyCourse').addEventListener('click', function() {
        window.location.href = '/admin/modify-courses.html';
    });
    
    document.getElementById('createCourse').addEventListener('click', function() {
        window.location.href = '/admin/create-course.html';
    });
    
    document.getElementById('manageFaculty').addEventListener('click', function() {
        window.location.href = '/admin/faculty-assignments.html';
    });
}

// Load profile information
function loadProfileInfo() {
    // In a real application, this would fetch from a server
    const profilePic = document.getElementById('ProfilePic');
    const profileName = document.getElementById('Profile_userName');
    const profileDetail = document.getElementById('Profile_userDetail');
    
    profilePic.src = '/assets/images/profile_placeholder.png';
    profileName.textContent = 'Admin User';
    profileDetail.textContent = 'University Admin';
}

// Populate the course table with data
function populateCourseTable() {
    const courseTableBody = document.getElementById('courseTableBody');
    if (!courseTableBody) return; // Exit if element doesn't exist on this page
    
    // Clear the table first
    courseTableBody.innerHTML = '';
    
    // Get courses from localStorage
    const courses = getCourses();
    
    // Filter courses based on selected department and section
    const selectedDepartment = document.getElementById('departmentDropdown').value;
    const selectedSection = document.getElementById('sectionDropdown')?.value;
    
    let filteredCourses = courses;
    if (selectedDepartment) {
        filteredCourses = filteredCourses.filter(course => course.department === selectedDepartment);
    }
    
    // Add each course to the table
    filteredCourses.forEach(course => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${course.id}</td>
            <td>${course.name}</td>
            <td>${course.department}</td>
            <td>${course.faculty}</td>
            <td>${course.isCoordinator ? 'Yes' : 'No'}</td>
            <td>${course.studentsCount}</td>
            <td>
                <button class="action-btn view-btn" data-course-id="${course.id}">View Details</button>
                <button class="action-btn edit-btn" data-course-id="${course.id}">Edit</button>
            </td>
        `;
        
        courseTableBody.appendChild(row);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course-id');
            openCourseModal(courseId, 'view');
        });
    });
    
    // Add event listeners to edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course-id');
            openCourseModal(courseId, 'edit');
        });
    });
}

// Set up event listeners for the course detail modal
function setupCourseDetailModal() {
    const courseDetailsForm = document.getElementById('courseDetailsForm');
    if (!courseDetailsForm) return; // Exit if element doesn't exist on this page
    
    // Form submission for course details
    courseDetailsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveCourseDetails();
    });
    
    // Add assignment button
    const addAssignmentBtn = document.getElementById('addAssignmentBtn');
    if (addAssignmentBtn) {
        addAssignmentBtn.addEventListener('click', function() {
            // In a real application, this would open a form to add a new assignment
            alert('Add assignment functionality would be implemented here');
        });
    }
    
    // Change faculty button
    const changeFacultyBtn = document.getElementById('changeFacultyBtn');
    if (changeFacultyBtn) {
        changeFacultyBtn.addEventListener('click', function() {
            // In a real application, this would open a dialog to select a new faculty
            alert('Change faculty functionality would be implemented here');
        });
    }
    
    // Filter marks button
    const filterMarksBtn = document.getElementById('filterMarksBtn');
    if (filterMarksBtn) {
        filterMarksBtn.addEventListener('click', function() {
            // In a real application, this would provide filter options
            alert('Filter marks functionality would be implemented here');
        });
    }
    
    // Export list button
    const exportListBtn = document.getElementById('exportListBtn');
    if (exportListBtn) {
        exportListBtn.addEventListener('click', function() {
            // In a real application, this would export the student list to CSV or PDF
            alert('Export list functionality would be implemented here');
        });
    }
}

// Populate department dropdown in the new course form
function populateDepartmentDropdown() {
    const departmentDropdown = document.getElementById('newCourseDept');
    if (!departmentDropdown) return;
    
    // Clear existing options except the first one
    while (departmentDropdown.options.length > 1) {
        departmentDropdown.remove(1);
    }
    
    // Add department options
    const departments = [
        { value: 'CSE', label: 'Computer Science Engineering' },
        { value: 'ECE', label: 'Electronics & Communication Engineering' },
        { value: 'ME', label: 'Mechanical Engineering' },
        { value: 'CE', label: 'Civil Engineering' },
        { value: 'EE', label: 'Electrical Engineering' },
        { value: 'IT', label: 'Information Technology' }
    ];
    
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.value;
        option.textContent = dept.label;
        departmentDropdown.appendChild(option);
    });
}

// Populate faculty dropdown in the new course form
function populateFacultyDropdown() {
    const facultyDropdown = document.getElementById('newCourseFaculty');
    if (!facultyDropdown) return;
    
    // Clear existing options except the first one
    while (facultyDropdown.options.length > 1) {
        facultyDropdown.remove(1);
    }
    
    // Get faculty from localStorage
    const facultyMembers = getFaculty();
    
    // Add each faculty member to the dropdown
    facultyMembers.forEach(faculty => {
        const option = document.createElement('option');
        option.value = faculty.id;
        option.textContent = faculty.name;
        facultyDropdown.appendChild(option);
    });
}

// Set up event listeners for the new course modal
function setupNewCourseModal() {
    console.log("Setting up new course modal");
    const newCourseForm = document.getElementById('newCourseForm');
    if (!newCourseForm) {
        console.error("newCourseForm element not found");
        return;
    }
    
    console.log("Found newCourseForm element, setting up listeners");
    
    // Populate department dropdown
    populateDepartmentDropdown();
    
    // Populate faculty dropdown
    populateFacultyDropdown();
    
    // Form submission
    console.log("Adding submit event listener to newCourseForm");
    newCourseForm.addEventListener('submit', function(e) {
        console.log("New course form submitted (from setupNewCourseModal listener)");
        e.preventDefault();
        createNewCourse();
    });
    
    // Add direct click handler to the form submit button as backup
    const formSubmitBtn = newCourseForm.querySelector('button[type="submit"]');
    if (formSubmitBtn) {
        console.log("Adding direct click handler to form submit button");
        formSubmitBtn.addEventListener('click', function(e) {
            console.log("Form submit button clicked directly");
            e.preventDefault();
            createNewCourse();
        });
    } else {
        console.error("Could not find form submit button");
    }
}

// Set up event listeners for modify course options
function setupModifyCourseOptions() {
    // Already handled in setupNavigation()
}

// Open the course modal with a specific course
function openCourseModal(courseId, mode) {
    // Find the course from localStorage
    const courses = getCourses();
    currentCourse = courses.find(course => course.id === courseId);
    
    if (!currentCourse) {
        alert('Course not found!');
        return;
    }
    
    // Populate the details tab
    document.getElementById('courseCode').value = currentCourse.id;
    document.getElementById('courseName').value = currentCourse.name;
    document.getElementById('courseDept').value = currentCourse.department;
    document.getElementById('courseCredits').value = currentCourse.credits;
    document.getElementById('courseDescription').value = currentCourse.description;
    document.getElementById('courseCoordinator').checked = currentCourse.isCoordinator || false;
    
    // Populate the student list tab
    populateStudentList(currentCourse.students);
    
    // Populate the assignments tab
    populateAssignmentList(currentCourse.assignments);
    
    // Populate the faculty tab
    populateFacultyInfo(currentCourse.facultyId);
    
    // Show the modal
    document.getElementById('courseModal').style.display = 'block';
    
    // Set read-only if in view mode
    if (mode === 'view') {
        document.getElementById('courseName').readOnly = true;
        document.getElementById('courseDept').disabled = true;
        document.getElementById('courseCredits').readOnly = true;
        document.getElementById('courseDescription').readOnly = true;
        document.getElementById('courseCoordinator').disabled = true;
    } else {
        document.getElementById('courseName').readOnly = false;
        document.getElementById('courseDept').disabled = false;
        document.getElementById('courseCredits').readOnly = false;
        document.getElementById('courseDescription').readOnly = false;
        document.getElementById('courseCoordinator').disabled = false;
    }
}

// Populate the student list in the modal
function populateStudentList(students) {
    const studentTableBody = document.getElementById('studentTableBody');
    if (!studentTableBody) return;
    
    // Clear the table first
    studentTableBody.innerHTML = '';
    
    // Add each student to the table
    students.forEach(student => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.section}</td>
            <td>${student.attendance}</td>
            <td>${student.assignmentsCompleted}</td>
            <td>${student.midTerm}</td>
            <td>${student.final}</td>
            <td>
                <button class="action-btn view-btn">View</button>
            </td>
        `;
        
        studentTableBody.appendChild(row);
    });
}

// Populate the assignment list in the modal
function populateAssignmentList(assignments) {
    const assignmentTableBody = document.getElementById('assignmentTableBody');
    if (!assignmentTableBody) return;
    
    // Clear the table first
    assignmentTableBody.innerHTML = '';
    
    // Add each assignment to the table
    assignments.forEach(assignment => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${assignment.title}</td>
            <td>${assignment.dueDate}</td>
            <td>${assignment.totalMarks}</td>
            <td>${assignment.submissions}</td>
            <td>
                <button class="action-btn view-btn">View</button>
                <button class="action-btn edit-btn">Edit</button>
            </td>
        `;
        
        assignmentTableBody.appendChild(row);
    });
}

// Populate faculty information in the modal
function populateFacultyInfo(facultyId) {
    const facultyName = document.getElementById('facultyName');
    if (!facultyName) return;
    
    // Get faculty from localStorage
    const facultyMembers = getFaculty();
    const faculty = facultyMembers.find(f => f.id === facultyId);
    
    if (!faculty) {
        console.error('Faculty not found!');
        return;
    }
    
    // Update the faculty information
    document.querySelector('.faculty-img').src = faculty.image;
    document.getElementById('facultyName').textContent = faculty.name;
    document.getElementById('facultyDesignation').textContent = faculty.designation;
    document.getElementById('facultyDepartment').textContent = faculty.department;
    document.getElementById('facultyEmail').textContent = faculty.email;
    
    // In a real application, we would also populate the faculty history
}

// Save the course details after editing
function saveCourseDetails() {
    if (!currentCourse) {
        alert('No course is currently being edited!');
        return;
    }
    
    // Update the course object
    currentCourse.name = document.getElementById('courseName').value;
    currentCourse.department = document.getElementById('courseDept').value;
    currentCourse.credits = parseInt(document.getElementById('courseCredits').value);
    currentCourse.description = document.getElementById('courseDescription').value;
    
    // Get courses from localStorage
    const courses = getCourses();
    
    // Find the index of the current course
    const index = courses.findIndex(course => course.id === currentCourse.id);
    
    if (index !== -1) {
        // Update the course in the array
        courses[index] = currentCourse;
        
        // Save the updated courses to localStorage
        saveCourses(courses);
        
        // Show success message
        alert('Course details saved successfully!');
        
        // Close the modal
        document.getElementById('courseModal').style.display = 'none';
        
        // Refresh the course table
        populateCourseTable();
    } else {
        alert('Error: Course not found in the database!');
    }
}

// Function to check if a faculty member can be a coordinator
function canBeCoordinator(facultyId) {
    const courses = getCourses();
    const coordinatorCount = courses.filter(course => 
        course.facultyId === facultyId && course.isCoordinator
    ).length;
    return coordinatorCount < 2;
}

// Function to get coordinator count for a faculty member
function getCoordinatorCount(facultyId) {
    const courses = getCourses();
    return courses.filter(course => 
        course.facultyId === facultyId && course.isCoordinator
    ).length;
}

// Modify the createNewCourse function
function createNewCourse() {
    console.log("createNewCourse function called");
    
    try {
        // Get form values
        const courseCode = document.getElementById('newCourseCode').value;
        const courseName = document.getElementById('newCourseName').value;
        const courseDept = document.getElementById('newCourseDept').value;
        const courseBatch = document.getElementById('newCourseBatch').value;
        const courseCredits = parseInt(document.getElementById('newCourseCredits').value);
        const courseDescription = document.getElementById('newCourseDescription').value;
        const facultyId = parseInt(document.getElementById('newCourseFaculty').value);
        const isCoordinator = document.getElementById('newCourseCoordinator').checked;
        
        console.log("Form values collected:", { 
            courseCode, courseName, courseDept, courseBatch, 
            courseCredits, courseDescription, facultyId, isCoordinator 
        });
        
        // Get faculty from localStorage
        const facultyMembers = getFaculty();
        console.log("Faculty members from localStorage:", facultyMembers);
        
        const faculty = facultyMembers.find(f => f.id === facultyId);
        console.log("Selected faculty:", faculty);
        
        if (!faculty) {
            console.error("Faculty not found for ID:", facultyId);
            alert('Please select a valid faculty!');
            return;
        }

        // Check if faculty can be coordinator
        if (isCoordinator && !canBeCoordinator(facultyId)) {
            alert('This faculty member is already a coordinator for 2 courses. Cannot assign as coordinator for more courses.');
            return;
        }
        
        // Get courses from localStorage
        const courses = getCourses();
        console.log("Current courses from localStorage:", courses);
        
        // Check if course code already exists
        if (courses.some(course => course.id === courseCode)) {
            console.error("Course code already exists:", courseCode);
            alert('Course code already exists! Please use a different code.');
            return;
        }
        
        // Create the new course object
        const newCourse = {
            id: courseCode,
            name: courseName,
            department: courseDept,
            faculty: faculty.name,
            facultyId: facultyId,
            studentsCount: 0,
            description: courseDescription,
            credits: courseCredits,
            batch: courseBatch,
            students: [],
            assignments: [],
            isCoordinator: isCoordinator
        };
        
        console.log("New course object created:", newCourse);
        
        // Add the new course to the array
        courses.push(newCourse);
        console.log("Courses array after adding new course:", courses);
        
        // Save the updated courses to localStorage
        console.log("Attempting to save courses to localStorage");
        saveCourses(courses);
        
        // Verify the course was saved
        const updatedCourses = getCourses();
        const savedCourse = updatedCourses.find(c => c.id === courseCode);
        console.log("Verification - Course saved:", savedCourse ? "yes" : "no");
        
        if (!savedCourse) {
            console.error("Failed to save the course to localStorage");
            alert("Failed to save the course. Please try again.");
            return;
        }
        
        // Show a success message
        console.log("Course creation successful");
        alert('New course created successfully!');
        
        // Close the modal and refresh the course list
        document.getElementById('newCourseModal').style.display = 'none';
        populateCourseTable();
        
    } catch (error) {
        console.error("Error creating new course:", error);
        alert("Error creating course: " + error.message);
    }
}

// Function to update the course list when department or section changes
function updateCourseList() {
    populateCourseTable();
}

// Function to check and display localStorage contents
function checkLocalStorage() {
    const courses = localStorage.getItem('courses');
    const faculty = localStorage.getItem('faculty');
    
    console.log('==== LOCAL STORAGE CONTENT ====');
    console.log('Courses:', courses ? JSON.parse(courses) : 'Not found');
    console.log('Faculty:', faculty ? JSON.parse(faculty) : 'Not found');
    
    // Display an alert with summary
    if (courses && faculty) {
        const coursesCount = JSON.parse(courses).length;
        const facultyCount = JSON.parse(faculty).length;
        alert(`LocalStorage contains:\n- ${coursesCount} courses\n- ${facultyCount} faculty members`);
    } else {
        alert('LocalStorage data not found. Please initialize the application first.');
    }
}

// Test function to force initialize localStorage
function forceInitializeStorage() {
    try {
        console.log("==== FORCE INITIALIZING STORAGE ====");
        
        // Clear existing localStorage data
        console.log("Removing existing items...");
        localStorage.removeItem('courses');
        localStorage.removeItem('faculty');
        
        // Create direct string versions to avoid any potential serialization issues
        const coursesJson = JSON.stringify(defaultCourses);
        const facultyJson = JSON.stringify(defaultFacultyMembers);
        
        console.log("Setting courses JSON:", coursesJson.substring(0, 100) + "...");
        console.log("Setting faculty JSON:", facultyJson.substring(0, 100) + "...");
        
        // Force initialize with default data using direct assignment
        localStorage.setItem('courses', coursesJson);
        localStorage.setItem('faculty', facultyJson);
        
        // Verify data was saved
        const courses = localStorage.getItem('courses');
        const faculty = localStorage.getItem('faculty');
        
        console.log("Verification - Courses retrieved:", courses ? "yes" : "no");
        console.log("Verification - Faculty retrieved:", faculty ? "yes" : "no");
        
        if (courses && faculty) {
            try {
                // Try to parse the JSON
                const coursesObj = JSON.parse(courses);
                const facultyObj = JSON.parse(faculty);
                
                console.log("Successfully parsed courses:", coursesObj.length);
                console.log("Successfully parsed faculty:", facultyObj.length);
                
                alert(`Storage initialized successfully with:\n- ${coursesObj.length} courses\n- ${facultyObj.length} faculty members`);
                
                // Set a flag to indicate successful initialization
                localStorage.setItem('db_initialized', 'true');
                
                console.log("Storage initialization complete. Reloading page...");
                
                // Refresh the page to load new data
                window.location.reload();
            } catch (parseError) {
                console.error("Failed to parse JSON:", parseError);
                alert("Failed to parse the saved data. Error: " + parseError.message);
            }
        } else {
            console.error("Failed to save data to localStorage");
            alert('Failed to initialize localStorage. Please check browser settings.\n\nCourses: ' + (courses ? 'YES' : 'NO') + '\nFaculty: ' + (faculty ? 'YES' : 'NO'));
        }
    } catch (error) {
        console.error("Error during force initialization:", error);
        alert("Error during initialization: " + error.message);
    }
}

// Test function to add a sample course
function addTestCourse() {
    // Get existing courses
    const courses = getCourses();
    
    // Create a new test course
    const testCourse = {
        id: 'TEST' + Date.now().toString().slice(-3),
        name: 'Test Course ' + new Date().toLocaleTimeString(),
        department: 'CSE',
        faculty: 'Test Faculty',
        facultyId: 1,
        studentsCount: 10,
        description: 'This is a test course created to verify localStorage functionality.',
        credits: 3,
        batch: '2024',
        students: [],
        assignments: []
    };
    
    // Add the course to the array
    courses.push(testCourse);
    
    // Save back to localStorage
    saveCourses(courses);
    
    // Verify it was saved
    const updatedCourses = getCourses();
    const found = updatedCourses.find(course => course.id === testCourse.id);
    
    if (found) {
        alert(`Test course "${testCourse.name}" was successfully added and saved to localStorage!`);
        
        // Refresh the course list if on the right page
        if (document.getElementById('courseTableBody')) {
            populateCourseTable();
        }
    } else {
        alert('Failed to save the test course to localStorage. Please check browser settings or permissions.');
    }
    
    return found !== undefined;
}

// Save course changes
function saveCourse() {
    try {
        // Get form values
        const courseId = document.getElementById('courseCode').value;
        const courseName = document.getElementById('courseName').value;
        const courseDept = document.getElementById('courseDept').value;
        const courseCredits = parseInt(document.getElementById('courseCredits').value);
        const courseDescription = document.getElementById('courseDescription').value;
        const isCoordinator = document.getElementById('courseCoordinator').checked;
        
        // Get courses from localStorage
        const courses = getCourses();
        const courseIndex = courses.findIndex(course => course.id === courseId);
        
        if (courseIndex === -1) {
            alert('Course not found!');
            return;
        }
        
        // Check if coordinator status is being changed to true
        if (isCoordinator && !courses[courseIndex].isCoordinator) {
            if (!canBeCoordinator(courses[courseIndex].facultyId)) {
                alert('This faculty member is already a coordinator for 2 courses. Cannot assign as coordinator for more courses.');
                return;
            }
        }
        
        // Update course details
        courses[courseIndex].name = courseName;
        courses[courseIndex].department = courseDept;
        courses[courseIndex].credits = courseCredits;
        courses[courseIndex].description = courseDescription;
        courses[courseIndex].isCoordinator = isCoordinator;
        
        // Save changes to localStorage
        saveCourses(courses);
        
        // Close modal and refresh table
        document.getElementById('courseModal').style.display = 'none';
        populateCourseTable();
        
        alert('Course updated successfully!');
    } catch (error) {
        console.error('Error saving course:', error);
        alert('Error saving course: ' + error.message);
    }
} 
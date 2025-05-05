import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Supabase configuration
const supabase_projectURL = 'https://klmnijdogskxbpdhtrsj.supabase.co';
const supabase_anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsbW5pamRvZ3NreGJwZGh0cnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMDQzMzYsImV4cCI6MjA2MDg4MDMzNn0.Cc59VkplcMpNrX3EFvtAunQy0vzZzuNHHoFRoktM_q8';
const supabase = createClient(supabase_projectURL, supabase_anonKey);

// DOM Elements
const maindiv = document.querySelector(".maindiv");
const navbar = document.querySelector(".navbar");
const content = document.querySelector(".content");
const totalMentorsElement = document.getElementById("total-mentors");
const programmeSelect = document.getElementById("selected-programme");
const mentorSelect = document.getElementById("selected-mentor");
const mentorshipTable = document.getElementById("mentorshipTable");
const assignMentorBtn = document.getElementById("assign-mentor");
const mentorModal = document.getElementById("mentorModal");
const closeModal = document.querySelector(".close");
const studentSelect = document.getElementById("student-select");
const modalMentorSelect = document.getElementById("mentor-select");
const confirmAssignmentBtn = document.getElementById("confirm-assignment");

// State variables
let allMentorshipData = [];
let filteredData = [];
let programmes = [];
let mentors = [];
let unassignedStudents = [];

// Initialize data on page load
initializeData();

async function initializeData() {
  try {
    await Promise.all([
      loadProgrammes(),
      loadMentors(),
      loadMentorshipData()
    ]);
    applyFilters();
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

async function loadProgrammes() {
  try {
    const { data, error } = await supabase
      .from('Branch')
      .select('*')
      .order('branch_name');
    
    if (error) throw error;
    
    programmes = data;
    populateDropdown(programmeSelect, programmes, 'branch_id', item => item.branch_name);
  } catch (error) {
    console.error("Error loading programmes:", error);
  }
}

async function loadMentors() {
  try {
    const { data, error } = await supabase
      .from('Teachers')
      .select('*')
      .order('t_name');
    
    if (error) throw error;
    
    mentors = data;
    totalMentorsElement.textContent = mentors.length;
    populateDropdown(mentorSelect, mentors, 'teacher_id', item => item.t_name);
  } catch (error) {
    console.error("Error loading mentors:", error);
  }
}

async function loadMentorshipData() {
  try {
    const { data, error } = await supabase
      .from('Mentorship')
      .select(`
        *,
        students (
          s_name,
          enrollment_no,
          BatchBranch (
            branch_id,
            Branch (
              branch_name
            )
          )
        ),
        Teachers (
          t_name,
          email
        )
      `);
    
    if (error) throw error;
    
    allMentorshipData = data.map(record => ({
      mentorship_id: record.mentorship_id,
      student_name: record.students?.s_name || 'Unknown',
      enrollment_no: record.enrollment_no,
      mentor_name: record.Teachers?.t_name || 'Unknown',
      mentor_email: record.Teachers?.email || 'Unknown',
      programme: record.students?.BatchBranch?.Branch?.branch_name || 'Unknown',
      branch_id: record.students?.BatchBranch?.branch_id || null,
      teacher_id: record.teacher_id,
      assigned_date: record.assigned_date,
      status: record.status
    }));
    
    filteredData = [...allMentorshipData];
    renderTable(filteredData);
  } catch (error) {
    console.error("Error loading mentorship data:", error);
  }
}

function populateDropdown(selectElement, items, valueField, labelFunction) {
  selectElement.innerHTML = '';
  
  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = 'All';
  selectElement.appendChild(allOption);
  
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item[valueField];
    option.textContent = labelFunction(item);
    selectElement.appendChild(option);
  });
}

function applyFilters() {
  const selectedProgramme = programmeSelect.value;
  const selectedMentor = mentorSelect.value;
  
  filteredData = allMentorshipData.filter(record => {
    const programmeMatch = !selectedProgramme || record.branch_id == selectedProgramme;
    const mentorMatch = !selectedMentor || record.teacher_id == selectedMentor;
    return programmeMatch && mentorMatch;
  });
  
  renderTable(filteredData);
}

function renderTable(data) {
  mentorshipTable.innerHTML = '';
  
  if (data.length === 0) {
    const noDataMessage = document.createElement('div');
    noDataMessage.className = 'no-data-message';
    noDataMessage.textContent = 'No mentorship assignments found matching the selected filters';
    mentorshipTable.appendChild(noDataMessage);
    return;
  }
  
  const table = document.createElement('table');
  table.className = 'mentorship-table';
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  
  const headers = ['Student Name', 'Enrollment No', 'Programme', 'Mentor', 'Email', 'Assigned Date', 'Status'];
  const headerRow = document.createElement('tr');
  
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  data.forEach(record => {
    const row = document.createElement('tr');
    
    const cells = [
      record.student_name,
      record.enrollment_no,
      record.programme,
      record.mentor_name,
      record.mentor_email,
      new Date(record.assigned_date).toLocaleDateString(),
      `<span class="status-badge status-${record.status}">${record.status}</span>`
    ];
    
    cells.forEach(cellData => {
      const cell = document.createElement('td');
      cell.innerHTML = cellData;
      row.appendChild(cell);
    });
    
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  mentorshipTable.appendChild(table);
}

// Event Listeners
programmeSelect.addEventListener('change', applyFilters);
mentorSelect.addEventListener('change', applyFilters);

// Modal functionality
assignMentorBtn.addEventListener('click', async () => {
  await loadUnassignedStudents();
  populateStudentDropdown();
  populateModalMentorDropdown();
  mentorModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
  mentorModal.style.display = 'none';
});

async function loadUnassignedStudents() {
  try {
    // Get all students
    const { data: allStudents, error: studentsError } = await supabase
      .from('students')
      .select(`
        *,
        BatchBranch (
          branch_id,
          Branch (
            branch_name
          )
        )
      `);
    
    if (studentsError) throw studentsError;
    
    // Get assigned students
    const { data: assignedStudents, error: assignedError } = await supabase
      .from('Mentorship')
      .select('enrollment_no');
    
    if (assignedError) throw assignedError;
    
    const assignedEnrollmentNos = new Set(assignedStudents.map(s => s.enrollment_no));
    
    unassignedStudents = allStudents.filter(student => !assignedEnrollmentNos.has(student.enrollment_no));
  } catch (error) {
    console.error("Error loading unassigned students:", error);
  }
}

function populateStudentDropdown() {
  studentSelect.innerHTML = '';
  
  unassignedStudents.forEach(student => {
    const option = document.createElement('option');
    option.value = student.enrollment_no;
    option.textContent = `${student.s_name} (${student.enrollment_no})`;
    studentSelect.appendChild(option);
  });
}

function populateModalMentorDropdown() {
  modalMentorSelect.innerHTML = '';
  
  const selectedStudent = unassignedStudents.find(s => s.enrollment_no == studentSelect.value);
  if (!selectedStudent) return;
  
  const compatibleMentors = mentors.filter(mentor => 
    mentor.branch_id === selectedStudent.BatchBranch.branch_id
  );
  
  compatibleMentors.forEach(mentor => {
    const option = document.createElement('option');
    option.value = mentor.teacher_id;
    option.textContent = `${mentor.t_name} (${mentor.email})`;
    modalMentorSelect.appendChild(option);
  });
}

studentSelect.addEventListener('change', populateModalMentorDropdown);

confirmAssignmentBtn.addEventListener('click', async () => {
  const studentId = studentSelect.value;
  const mentorId = modalMentorSelect.value;
  
  if (!studentId || !mentorId) {
    alert('Please select both student and mentor');
    return;
  }
  
  try {
    const { error } = await supabase
      .from('Mentorship')
      .insert([
        {
          enrollment_no: studentId,
          teacher_id: mentorId,
          status: 'active'
        }
      ]);
    
    if (error) throw error;
    
    mentorModal.style.display = 'none';
    await loadMentorshipData();
    applyFilters();
    alert('Mentor assigned successfully!');
  } catch (error) {
    console.error("Error assigning mentor:", error);
    alert('Error assigning mentor. Please try again.');
  }
}); 
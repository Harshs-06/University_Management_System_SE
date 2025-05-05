import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Supabase configuration
const supabase_projectURL = 'https://klmnijdogskxbpdhtrsj.supabase.co';
const supabase_anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsbW5pamRvZ3NreGJwZGh0cnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMDQzMzYsImV4cCI6MjA2MDg4MDMzNn0.Cc59VkplcMpNrX3EFvtAunQy0vzZzuNHHoFRoktM_q8';
const supabase = createClient(supabase_projectURL, supabase_anonKey);

// DOM Elements
const maindiv = document.querySelector(".maindiv");
const navbar = document.querySelector(".navbar");
const content = document.querySelector(".content");
const totalStudentsElement = document.getElementById("total-students");
const batchSelect = document.getElementById("selected-batch");
const programmeSelect = document.getElementById("selected-programme");
const subjectSelect = document.getElementById("selected-subject");
const tableContainer = document.getElementById("tableContainer");

// Responsive layout
maindiv.style.cssText = `height:${deviceHeight(100)}px;width:${deviceWidth(100)}px;`;
navbar.style.cssText = `height:${deviceHeight(100)}px;width:${deviceWidth(16)}px;`;
content.style.cssText = `height:${deviceHeight(100)}px;width:${deviceWidth(84)}px;`;

// Style nav items
const navitems = document.querySelectorAll(".navitems");
const logo = document.querySelector("#logo");
logo.style.width = `${navbarWidth(70)}px`;

navitems.forEach(item => {
  item.style.cssText = `
    margin-top:${navbarHeight(2.4)}px;
    height: ${navbarHeight(6)}px;
    width: ${navbarWidth(80)}px;
    border-radius: ${navbarWidth(3)}px;
    font-size: ${navbarWidth(6.6)}px;
  `;
});

navitems.forEach(item => {
  item.addEventListener('click', () => {
    navitems.forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
  });
});

document.querySelector("#result").classList.add("selected");

// Utility functions
function deviceHeight(percent) { return (window.innerHeight * percent) / 100; }
function deviceWidth(percent) { return (window.innerWidth * percent) / 100; }
function navbarHeight(percent) { return (navbar.offsetHeight * percent) / 100; }
function navbarWidth(percent) { return (navbar.offsetWidth * percent) / 100; }
function contentHeight(percent) { return (content.offsetHeight * percent) / 100; }
function contentWidth(percent) { return (content.offsetWidth * percent) / 100; }

// State variables
let allStudentData = [];
let filteredData = [];
let batches = [];
let programmes = [];
let subjects = [];

// Add event listeners for filter changes
batchSelect.addEventListener('change', applyFilters);
programmeSelect.addEventListener('change', applyFilters);
subjectSelect.addEventListener('change', applyFilters);

// Initialize data on page load
initializeData();

async function initializeData() {
  try {
    // Load all necessary data
    await Promise.all([
      loadBatches(),
      loadProgrammes(),
      loadSubjects(),
      loadStudentData()
    ]);
    
    // Set initial filters and display data
    applyFilters();
  } catch (error) {
    console.error("Error initializing data:", error);
    alert("Error loading data. Please check console for details.");
  }
}

async function loadBatches() {
  try {
    const { data, error } = await supabase
      .from('Batch')
      .select('*')
      .order('start_year', { ascending: false });
    
    if (error) throw error;
    
    batches = data;
    populateDropdown(batchSelect, batches, 'batch_id', item => `${item.start_year} - ${item.end_year}`);
  } catch (error) {
    console.error("Error loading batches:", error);
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

async function loadSubjects() {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('subject_name');
    
    if (error) throw error;
    
    subjects = data;
    populateDropdown(subjectSelect, subjects, 'subject_code', item => `${item.subject_name} (${item.semester})`);
  } catch (error) {
    console.error("Error loading subjects:", error);
  }
}

async function loadStudentData() {
  try {
    // Fetch student grades with all related information
    const { data, error } = await supabase
      .from('StudentGrades')
      .select('*, students(*, BatchBranch(*, Batch(*), Branch(*))), GradingActivity(*, subjects(*))');
    
    allStudentData = data.map(record => ({
      enrollment_no: record.enrollment_no,
      student_name: record.students?.s_name || 'Unknown',
      batch: record.students?.BatchBranch?.Batch?.start_year + '-' + record.students?.BatchBranch?.Batch?.end_year || 'Unknown',
      batch_id: record.students?.BatchBranch?.batch_id || null,
      programme: record.students?.BatchBranch?.Branch?.branch_name || 'Unknown',
      branch_id: record.students?.BatchBranch?.branch_id || null,
      subject: record.GradingActivity?.subjects?.subject_name || 'Unknown',
      subject_code: record.GradingActivity?.subject_code || null,
      marks: record.marks_obtained || 0,
      max_marks: record.GradingActivity?.max_marks || 100,
      activity_title: record.GradingActivity?.title || 'Unknown',
      weightage: record.GradingActivity?.weightage || 0
    }));
    
    totalStudentsElement.textContent = new Set(allStudentData.map(item => item.enrollment_no)).size;
    filteredData = [...allStudentData];
  } catch (error) {
    console.error("Error loading student data:", error);
  }
}

function populateDropdown(selectElement, items, valueField, labelFunction) {
  // Clear existing options
  selectElement.innerHTML = '';
  
  // Add "All" option
  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = 'All';
  selectElement.appendChild(allOption);
  
  // Add options from data
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item[valueField];
    option.textContent = labelFunction(item);
    selectElement.appendChild(option);
  });
}

function applyFilters() {
  const selectedBatch = batchSelect.value;
  const selectedProgramme = programmeSelect.value;
  const selectedSubject = subjectSelect.value;
  
  filteredData = allStudentData.filter(record => {
    return (!selectedBatch || record.batch_id == selectedBatch) &&
           (!selectedProgramme || record.branch_id == selectedProgramme) &&
           (!selectedSubject || record.subject_code == selectedSubject);
  });
  
  renderTable(filteredData);
}

function renderTable(data) {
  // Clear existing table
  tableContainer.innerHTML = '';
  
  if (data.length === 0) {
    const noDataMessage = document.createElement('div');
    noDataMessage.className = 'no-data-message';
    noDataMessage.textContent = 'No data found matching the selected filters';
    tableContainer.appendChild(noDataMessage);
    return;
  }
  
  // Create table structure
  const table = document.createElement('table');
  table.className = 'grades-table';
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  
  // Add table headers
  const headers = ['Enrollment No', 'Student Name', 'Batch', 'Programme', 'Subject', 'Activity', 'Marks', 'Max Marks',  'Percentage'];
  const headerRow = document.createElement('tr');
  
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Add table rows
  data.forEach(record => {
    const row = document.createElement('tr');
    const percentage = ((record.marks / record.max_marks) * 100).toFixed(2);
    
    const cells = [
      record.enrollment_no,
      record.student_name,
      record.batch,
      record.programme,
      record.subject,
      record.activity_title,
      record.marks,
      record.max_marks,
      
      percentage + '%'
    ];
    
    cells.forEach(cellData => {
      const cell = document.createElement('td');
      cell.textContent = cellData;
      row.appendChild(cell);
    });
    
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  tableContainer.appendChild(table);
}

// Toggle function for filter options
window.toggleOptions = function(optionType) {
  const optionsElement = document.getElementById(`${optionType}-options`);
  optionsElement.style.display = optionsElement.style.display === 'none' ? 'block' : 'none';
};
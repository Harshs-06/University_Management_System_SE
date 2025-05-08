//od-management.js

// Initialize Supabase client
const SUPABASE_URL = 'https://klmnijdogskxbpdhtrsj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsbW5pamRvZ3NreGJwZGh0cnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMDQzMzYsImV4cCI6MjA2MDg4MDMzNn0.Cc59VkplcMpNrX3EFvtAunQy0vzZzuNHHoFRoktM_q8'
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM loaded, initializing OD Management");
    
    const modal = document.getElementById("details-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalReason = document.getElementById("modal-reason");
    const modalStudentList = document.getElementById("modal-student-list");
    const closeModal = document.getElementById("close-modal");
    const odRequestsContainer = document.querySelector('.od-requests');
    const searchInput = document.querySelector('.search-input');
    const statusDropdown = document.querySelector('.status-dropdown');
    
    // Show loading state
    odRequestsContainer.innerHTML = '<div class="loading">Loading OD requests...</div>';

    // Function to fetch OD requests
    async function fetchODRequests(status = '', search = '') {
        try {
            console.log("Fetching OD requests...");
            let query = supabaseClient.from('od_requests').select('*');
            
            if (status) {
                query = query.eq('status', status);
            }
            
            if (search) {
                query = query.or(`teamname.ilike.%${search}%,event.ilike.%${search}%`);
            }

            const { data, error } = await query.order('created_at', { ascending: false });
            
            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
            
            console.log("Fetched data:", data);
            return data || [];
        } catch (err) {
            console.error('Error fetching OD requests:', err);
            odRequestsContainer.innerHTML = `<div class="error">Error: ${err.message}</div>`;
            return [];
        }
    }

    // Function to render OD request cards
    function renderODRequests(requests) {
        console.log("Rendering OD requests:", requests);
        
        if (!requests || requests.length === 0) {
            odRequestsContainer.innerHTML = '<div class="no-data">No OD requests found</div>';
            return;
        }
        
        odRequestsContainer.innerHTML = requests.map(request => `
            <div class="od-card">
                <h3>${request.teamname}</h3>
                <p><strong>Event:</strong> ${request.event}</p>
                <p><strong>Status:</strong> <span class="status-${request.status.toLowerCase()}">${request.status}</span></p>
                <div class="od-actions">
                    <button class="accept-btn" data-id="${request.id}">Accept</button>
                    <button class="view-details-btn" data-id="${request.id}">View Details</button>
                    <button class="reject-btn" data-id="${request.id}">Reject</button>
                </div>
            </div>
        `).join('');

        // Reattach event listeners
        attachEventListeners();
    }

    // Function to update request status
    async function updateStatus(id, newStatus) {
        try {
            const { error } = await supabaseClient
                .from('od_requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Error updating status:', err);
            return false;
        }
    }

    // Function to get request details
    async function getRequestDetails(id) {
        try {
            const { data, error } = await supabaseClient
                .from('od_requests')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            
            console.log("Request details:", data);
            return data;
        } catch (err) {
            console.error('Error fetching request details:', err);
            return null;
        }
    }

    // Function to attach event listeners
    function attachEventListeners() {
        // Accept buttons
        document.querySelectorAll('.accept-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const success = await updateStatus(button.dataset.id, 'approved');
                if (success) {
                    const requests = await fetchODRequests(statusDropdown.value, searchInput.value);
                    renderODRequests(requests);
                }
            });
        });

        // Reject buttons
        document.querySelectorAll('.reject-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const success = await updateStatus(button.dataset.id, 'rejected');
                if (success) {
                    const requests = await fetchODRequests(statusDropdown.value, searchInput.value);
                    renderODRequests(requests);
                }
            });
        });

        // View details buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const data = await getRequestDetails(button.dataset.id);
                if (data) {
                    modalTitle.textContent = data.teamname;
                    modalReason.textContent = `Reason: ${data.reason}`;
                    
                    if (data.students && data.students.length > 0) {
                        modalStudentList.innerHTML = "<strong>Students:</strong>";
                        data.students.forEach(student => {
                            const li = document.createElement("li");
                            li.textContent = student;
                            modalStudentList.appendChild(li);
                        });
                        modalStudentList.classList.remove("hidden");
                    } else {
                        modalStudentList.innerHTML = "";
                        modalStudentList.classList.add("hidden");
                    }

                    modal.style.display = "block";
                }
            });
        });
    }

    // Search and filter event listeners
    searchInput.addEventListener('input', async () => {
        const requests = await fetchODRequests(statusDropdown.value, searchInput.value);
        renderODRequests(requests);
    });

    statusDropdown.addEventListener('change', async () => {
        const requests = await fetchODRequests(statusDropdown.value, searchInput.value);
        renderODRequests(requests);
    });

    // Close modal event
    closeModal.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Set up real-time subscription
    try {
        const subscription = supabaseClient
            .channel('od_requests_changes')
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'od_requests' 
            }, async () => {
                console.log("Received real-time update");
                const requests = await fetchODRequests(statusDropdown.value, searchInput.value);
                renderODRequests(requests);
            })
            .subscribe();
        console.log("Subscribed to real-time updates");
    } catch (err) {
        console.error("Error setting up real-time subscription:", err);
    }

    // Initial load
    console.log("Initial load of OD requests");
    try {
        const initialRequests = await fetchODRequests();
        console.log("Initial requests loaded:", initialRequests);
        renderODRequests(initialRequests);
    } catch (err) {
        console.error("Error during initial load:", err);
        odRequestsContainer.innerHTML = `<div class="error">Failed to load data: ${err.message}</div>`;
    }
});

let dashboard = document.querySelector("#dashboard");
dashboard.addEventListener('click',function() {
    window.location.href="/admin/dashboard.html";
});
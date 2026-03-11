// ========================================
// Main Application Logic
// ========================================

// Global state
let currentPage = 'dashboard';
let currentTablePage = 1;
let itemsPerPage = 10;
let currentFilters = {};
let currentSort = { field: 'date', direction: 'desc' };
let selectedComplaints = [];
let currentComplaintId = null;
let selectedRating = 0;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check for auto-escalation
    checkAutoEscalation();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Load initial page
    loadPage('dashboard');
    
    // Initialize forms
    initializeComplaintForm();
    initializeFileUpload();
    
    // Initialize rating input
    initializeRatingInput();
    
    // Set up periodic checks
    setInterval(checkAutoEscalation, 60000); // Check every minute
}

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            navigateToPage(page);
        });
    });
    
    // Handle hash navigation
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            navigateToPage(hash);
        }
    });
}

function navigateToPage(page) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });
    
    // Load page content
    loadPage(page);
    
    // Update URL hash
    window.location.hash = page;
    
    // Close mobile menu
    closeMobileMenu();
}

function loadPage(page) {
    currentPage = page;
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const pageElement = document.getElementById(`page-${page}`);
    if (pageElement) {
        pageElement.classList.add('active');
    }
    
    // Load page-specific content
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'register':
            resetComplaintForm();
            break;
        case 'track':
            break;
        case 'complaints':
            loadComplaintsTable();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'admin':
            loadAdminPanel();
            break;
    }
}

// Mobile Menu
function initializeMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const close = document.getElementById('sidebarClose');
    
    toggle.addEventListener('click', function() {
        sidebar.classList.add('active');
    });
    
    close.addEventListener('click', function() {
        closeMobileMenu();
    });
    
    // Close on overlay click
    sidebar.addEventListener('click', function(e) {
        if (e.target === sidebar) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    document.getElementById('sidebar').classList.remove('active');
}

// Dashboard
function loadDashboard() {
    //const stats = getStatistics();
    
    // Update stats
    //document.getElementById('stat-total').textContent = stats.total;
    //document.getElementById('stat-pending').textContent = stats.pending;
    //document.getElementById('stat-progress').textContent = stats.inProgress;
    //document.getElementById('stat-escalated').textContent = stats.escalated;
    //document.getElementById('stat-resolved').textContent = stats.resolved;
    //document.getElementById('stat-closed').textContent = stats.closed;
    
    // Load charts
    initializeCharts();
    
    // Load recent activity
    loadRecentActivity();
}

function loadRecentActivity() {
    const complaints = getComplaints();
    const recent = complaints.slice(0, 10);
    
    const activityContainer = document.getElementById('recentActivity');
    
    if (recent.length === 0) {
        activityContainer.innerHTML = '<div class="empty-state"><p>No recent activity</p></div>';
        return;
    }
    
    activityContainer.innerHTML = recent.map(complaint => `
        <div class="activity-item" onclick="viewComplaint('${complaint.id}')">
            <div class="activity-icon" style="background: ${getStatusColor(complaint.status)}20; color: ${getStatusColor(complaint.status)};">
                <i class="fas ${getStatusIcon(complaint.status)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${complaint.id} - ${complaint.subject}</div>
                <div class="activity-description">
                    ${complaint.complainantName} • ${complaint.category}
                </div>
                <div class="activity-time">${formatDate(complaint.createdAt, 'relative')}</div>
            </div>
        </div>
    `).join('');
}

function getStatusColor(status) {
    const colors = {
        'New': '#3b82f6',
        'In Progress': '#f59e0b',
        'Escalated': '#ef4444',
        'Resolved': '#10b981',
        'Closed': '#6b7280'
    };
    return colors[status] || '#6b7280';
}

function getStatusIcon(status) {
    const icons = {
        'New': 'fa-circle',
        'In Progress': 'fa-spinner',
        'Escalated': 'fa-exclamation-triangle',
        'Resolved': 'fa-check-circle',
        'Closed': 'fa-archive'
    };
    return icons[status] || 'fa-circle';
}

// Complaint Form
function initializeComplaintForm() {
    const form = document.getElementById('complaintForm');
    
    form.addEventListener('submit', function(e) {
        return true;
    });
}

function submitComplaint() {
    const form = document.getElementById('complaintForm');
    const formData = new FormData(form);
    
    const complaint = {
        complainantName: formData.get('complainantName'),
        complainantEmail: formData.get('complainantEmail'),
        complainantPhone: formData.get('complainantPhone'),
        category: formData.get('category'),
        priority: formData.get('priority'),
        subject: formData.get('subject'),
        description: formData.get('description'),
        attachments: [],
        notes: []
    };
    addComplaint(complaint);
    window.location.href = "/";
    loadDashboard();
    
    // Validate
    if (!validateEmail(complaint.complainantEmail)) {
        showToast('error', 'Validation Error', 'Please enter a valid email address');
        return;
    }
    
    if (!validatePhone(complaint.complainantPhone)) {
        showToast('error', 'Validation Error', 'Please enter a valid phone number');
        return;
    }
    
    // Add complaint
    const newComplaint = addComplaint(complaint);
    
    // Show success message
    showToast('success', 'Complaint Registered', `Your complaint ${newComplaint.id} has been registered successfully`);
    
    // Reset form
    form.reset();
    
    // Show complaint ID
    setTimeout(() => {
        if (confirm(`Complaint ${newComplaint.id} has been registered.\n\nWould you like to track it now?`)) {
            navigateToPage('track');
            document.getElementById('trackById').value = newComplaint.id;
            trackComplaint('id');
        }
    }, 500);
}

function resetComplaintForm() {
    const form = document.getElementById('complaintForm');
    if (form) {
        form.reset();
        document.getElementById('fileList').innerHTML = '';
    }
}

// File Upload
function initializeFileUpload() {
    const uploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('attachments');
    
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--primary-blue)';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '';
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
    
    fileInput.addEventListener('change', function(e) {
        handleFiles(this.files);
    });
}

function handleFiles(files) {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <i class="fas fa-file"></i>
            <span class="file-name">${file.name}</span>
            <span class="file-remove" onclick="removeFile(${index})">
                <i class="fas fa-times"></i>
            </span>
        `;
        fileList.appendChild(fileItem);
    });
}

function removeFile(index) {
    const fileInput = document.getElementById('attachments');
    const dt = new DataTransfer();
    const files = Array.from(fileInput.files);
    
    files.forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });
    
    fileInput.files = dt.files;
    handleFiles(fileInput.files);
}

// Track Complaint
function switchTrackTab(tab) {
    document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.search-panel').forEach(p => p.classList.remove('active'));
    
    document.querySelector(`.search-tab[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`search-${tab}`).classList.add('active');
}

function handleTrackSearch(event, type) {
    if (event.key === 'Enter') {
        trackComplaint(type);
    }
}

function trackComplaint(type) {
    const resultsContainer = document.getElementById('trackResults');
    let complaints = [];
    
    if (type === 'id') {
        const id = document.getElementById('trackById').value.trim();
        if (!id) {
            showToast('error', 'Search Error', 'Please enter a complaint ID');
            return;
        }
        const complaint = getComplaintById(id);
        if (complaint) {
            complaints = [complaint];
        }
    } else if (type === 'email') {
        const email = document.getElementById('trackByEmail').value.trim();
        if (!email) {
            showToast('error', 'Search Error', 'Please enter an email address');
            return;
        }
        complaints = getComplaintsByEmail(email);
    }
    
    if (complaints.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No Complaints Found</h3>
                <p>We couldn't find any complaints matching your search criteria.</p>
                <button class="btn btn-primary" onclick="navigateToPage('register')">
                    <i class="fas fa-plus"></i> Register New Complaint
                </button>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = complaints.map(complaint => `
        <div class="track-result-card">
            <div class="complaint-header">
                <div>
                    <div class="complaint-id-badge">${complaint.id}</div>
                    <p>${complaint.subject}</p>
                </div>
                <div style="text-align: right;">
                    ${getStatusBadge(complaint.status)}
                    ${getPriorityBadge(complaint.priority)}
                </div>
            </div>
            
            <div class="complaint-meta">
                <div class="meta-item">
                    <div class="meta-label">Complainant</div>
                    <div class="meta-value">${complaint.complainantName}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Category</div>
                    <div class="meta-value">${complaint.category}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Created</div>
                    <div class="meta-value">${formatDate(complaint.createdAt, 'date')}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Last Updated</div>
                    <div class="meta-value">${formatDate(complaint.updatedAt, 'relative')}</div>
                </div>
            </div>
            
            <div class="form-section">
                <h3 class="section-title">Status Timeline</h3>
                <div class="timeline">
                    ${complaint.history ? complaint.history.map((item, index) => `
                        <div class="timeline-item ${index === complaint.history.length - 1 ? 'active' : ''}">
                            <div class="timeline-content">
                                <div class="timeline-title">${item.status}</div>
                                <div class="timeline-description">${item.description}</div>
                                <div class="timeline-date">
                                    ${formatDate(item.timestamp, 'full')}
                                </div>
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
            </div>
            
            <div class="form-actions">
                <button class="btn btn-secondary" onclick="viewComplaint('${complaint.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
                <button class="btn btn-primary" onclick="copyToClipboard('${complaint.id}')">
                    <i class="fas fa-copy"></i> Copy ID
                </button>
            </div>
        </div>
    `).join('');
}

// Complaints Table
function loadComplaintsTable() {
    currentTablePage = 1;
    renderComplaintsTable();
}

function applyFilters() {
    currentFilters = {
        status: document.getElementById('filterStatus').value,
        priority: document.getElementById('filterPriority').value,
        category: document.getElementById('filterCategory').value,
        dateRange: document.getElementById('filterDate').value,
        search: document.getElementById('filterSearch').value
    };
    
    currentTablePage = 1;
    renderComplaintsTable();
}

function resetFilters() {
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterPriority').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterDate').value = '';
    document.getElementById('filterSearch').value = '';
    
    currentFilters = {};
    currentTablePage = 1;
    renderComplaintsTable();
}

function sortTable(field) {
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = 'asc';
    }
    
    renderComplaintsTable();
}

function renderComplaintsTable() {
    let complaints = getComplaints();
    
    // Apply filters
    complaints = filterComplaints(complaints, currentFilters);
    
    // Apply sorting
    complaints = sortComplaints(complaints, currentSort.field, currentSort.direction);
    
    // Pagination
    const totalItems = complaints.length;
    const paginatedComplaints = paginate(complaints, currentTablePage, itemsPerPage);
    
    // Render table
    const tbody = document.getElementById('complaintsTableBody');
    
    if (paginatedComplaints.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>No Complaints Found</h3>
                        <p>No complaints match your current filters.</p>
                    </div>
                </td>
            </tr>
        `;
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    tbody.innerHTML = paginatedComplaints.map(complaint => `
        <tr>
            <td>
                <input type="checkbox" value="${complaint.id}" onchange="toggleComplaintSelection('${complaint.id}')">
            </td>
            <td onclick="viewComplaint('${complaint.id}')" style="cursor: pointer;">
                <strong>${complaint.id}</strong>
            </td>
            <td>
                <div class="complaint-name">${complaint.complainantName}</div>
                <div class="complaint-email">${complaint.complainantEmail}</div>
            </td>
            <td>${complaint.category}</td>
            <td>${getPriorityBadge(complaint.priority)}</td>
            <td>${getStatusBadge(complaint.status)}</td>
            <td>${formatDate(complaint.createdAt, 'date')}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn" onclick="viewComplaint('${complaint.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="editComplaint('${complaint.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="confirmDelete('${complaint.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Render pagination
    const paginationHTML = generatePaginationHTML(totalItems, currentTablePage, itemsPerPage);
    document.getElementById('pagination').innerHTML = paginationHTML;
}

function goToPage(page) {
    currentTablePage = page;
    renderComplaintsTable();
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('#complaintsTableBody input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
        const id = checkbox.value;
        if (selectAll.checked) {
            if (!selectedComplaints.includes(id)) {
                selectedComplaints.push(id);
            }
        } else {
            selectedComplaints = selectedComplaints.filter(cid => cid !== id);
        }
    });
    
    updateBulkActions();
}

function toggleComplaintSelection(id) {
    if (selectedComplaints.includes(id)) {
        selectedComplaints = selectedComplaints.filter(cid => cid !== id);
    } else {
        selectedComplaints.push(id);
    }
    
    updateBulkActions();
}

function updateBulkActions() {
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.getElementById('selectedCount');
    
    if (selectedComplaints.length > 0) {
        bulkActions.style.display = 'flex';
        selectedCount.textContent = `${selectedComplaints.length} selected`;
    } else {
        bulkActions.style.display = 'none';
    }
}

// View Complaint Detail
function viewComplaint(id) {
    const complaint = getComplaintById(id);
    if (!complaint) {
        showToast('error', 'Error', 'Complaint not found');
        return;
    }
    
    currentComplaintId = id;
    
    const modal = document.getElementById('complaintDetailModal');
    const content = document.getElementById('complaintDetailContent');
    
    content.innerHTML = generateComplaintDetailHTML(complaint);
    
    modal.classList.add('show');
}

function closeComplaintDetail() {
    const modal = document.getElementById('complaintDetailModal');
    modal.classList.remove('show');
    currentComplaintId = null;
}

function editComplaint(id) {
    showToast('info', 'Edit Feature', 'Edit functionality coming soon');
}

function confirmDelete(id) {
    confirmAction('Are you sure you want to delete this complaint?', () => {
        deleteComplaint(id);
        showToast('success', 'Deleted', 'Complaint has been deleted');
        renderComplaintsTable();
        updateCharts();
    });
}

function exportComplaints() {
    exportComplaintsData();
    showToast('success', 'Export Successful', 'Complaints data has been exported');
}

// Bulk Actions
function bulkUpdateStatus() {
    if (selectedComplaints.length === 0) return;
    
    const modal = document.getElementById('bulkStatusModal');
    modal.classList.add('show');
}

function closeBulkStatusModal() {
    const modal = document.getElementById('bulkStatusModal');
    modal.classList.remove('show');
}

function confirmBulkStatusUpdate() {
    const newStatus = document.getElementById('bulkStatusSelect').value;
    
    selectedComplaints.forEach(id => {
        updateComplaint(id, {
            status: newStatus,
            historyDescription: `Status updated to ${newStatus} (Bulk Action)`,
            historyUser: 'Admin'
        });
    });
    
    showToast('success', 'Updated', `${selectedComplaints.length} complaints updated`);
    selectedComplaints = [];
    updateBulkActions();
    closeBulkStatusModal();
    renderComplaintsTable();
    updateCharts();
}

function bulkEscalate() {
    if (selectedComplaints.length === 0) return;
    
    confirmAction(`Escalate ${selectedComplaints.length} complaints?`, () => {
        selectedComplaints.forEach(id => {
            updateComplaint(id, {
                status: 'Escalated',
                escalationLevel: 'L1',
                historyDescription: 'Escalated (Bulk Action)',
                historyUser: 'Admin'
            });
        });
        
        showToast('success', 'Escalated', `${selectedComplaints.length} complaints escalated`);
        selectedComplaints = [];
        updateBulkActions();
        renderComplaintsTable();
        updateCharts();
    });
}

function bulkDelete() {
    if (selectedComplaints.length === 0) return;
    
    confirmAction(`Delete ${selectedComplaints.length} complaints? This cannot be undone.`, () => {
        selectedComplaints.forEach(id => {
            deleteComplaint(id);
        });
        
        showToast('success', 'Deleted', `${selectedComplaints.length} complaints deleted`);
        selectedComplaints = [];
        updateBulkActions();
        renderComplaintsTable();
        updateCharts();
    });
}

// Status Update
function updateComplaintStatus(id, status) {
    updateComplaint(id, {
        status: status,
        historyDescription: `Status changed to ${status}`,
        historyUser: 'Admin'
    });
    
    showToast('success', 'Status Updated', `Complaint ${id} status updated to ${status}`);
    closeComplaintDetail();
    
    // Refresh current view
    if (currentPage === 'complaints') {
        renderComplaintsTable();
    } else if (currentPage === 'dashboard') {
        loadDashboard();
    }
    
    updateCharts();
}

// Escalation
function openEscalateModal(id) {
    currentComplaintId = id;
    const modal = document.getElementById('escalateModal');
    modal.classList.add('show');
}

function closeEscalateModal() {
    const modal = document.getElementById('escalateModal');
    modal.classList.remove('show');
    currentComplaintId = null;
}

function confirmEscalation() {
    if (!currentComplaintId) return;
    
    const level = document.getElementById('escalationLevel').value;
    const reason = document.getElementById('escalationReason').value;
    
    if (!reason.trim()) {
        showToast('error', 'Validation Error', 'Please provide a reason for escalation');
        return;
    }
    
    updateComplaint(currentComplaintId, {
        status: 'Escalated',
        escalationLevel: level,
        historyDescription: `Escalated to ${level}: ${reason}`,
        historyUser: 'Admin'
    });
    
    showToast('success', 'Escalated', `Complaint ${currentComplaintId} has been escalated`);
    closeEscalateModal();
    closeComplaintDetail();
    
    // Refresh current view
    if (currentPage === 'complaints') {
        renderComplaintsTable();
    } else if (currentPage === 'dashboard') {
        loadDashboard();
    }
    
    updateCharts();
}

// Resolution
function openResolutionModal(id) {
    currentComplaintId = id;
    selectedRating = 0;
    updateRatingDisplay();
    const modal = document.getElementById('resolutionModal');
    modal.classList.add('show');
}

function closeResolutionModal() {
    const modal = document.getElementById('resolutionModal');
    modal.classList.remove('show');
    currentComplaintId = null;
    selectedRating = 0;
    document.getElementById('resolutionNotes').value = '';
}

function initializeRatingInput() {
    const stars = document.querySelectorAll('#satisfactionRating i');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.dataset.rating);
            updateRatingDisplay();
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
    });
    
    document.getElementById('satisfactionRating').addEventListener('mouseleave', function() {
        updateRatingDisplay();
    });
}

function updateRatingDisplay() {
    highlightStars(selectedRating);
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('#satisfactionRating i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

function confirmResolution() {
    if (!currentComplaintId) return;
    
    const notes = document.getElementById('resolutionNotes').value;
    
    if (!notes.trim()) {
        showToast('error', 'Validation Error', 'Please provide resolution notes');
        return;
    }
    
    if (selectedRating === 0) {
        showToast('error', 'Validation Error', 'Please provide a satisfaction rating');
        return;
    }
    
    updateComplaint(currentComplaintId, {
        status: 'Resolved',
        resolutionNotes: notes,
        satisfactionRating: selectedRating,
        historyDescription: `Complaint resolved with ${selectedRating} star rating`,
        historyUser: 'Admin'
    });
    
    showToast('success', 'Resolved', `Complaint ${currentComplaintId} has been marked as resolved`);
    closeResolutionModal();
    closeComplaintDetail();
    
    // Refresh current view
    if (currentPage === 'complaints') {
        renderComplaintsTable();
    } else if (currentPage === 'dashboard') {
        loadDashboard();
    }
    
    updateCharts();
}

// Analytics
function loadAnalytics() {
    const stats = getStatistics();
    
    // Update metrics
    document.getElementById('avgResolutionTime').textContent = stats.avgResolutionTime;
    document.getElementById('resolutionRate').textContent = stats.resolutionRate + '%';
    document.getElementById('avgRating').textContent = stats.avgRating;
    document.getElementById('escalationRate').textContent = stats.escalationRate + '%';
    
    // Load charts
    initAnalyticsCharts();
}

// Admin Panel
function loadAdminPanel() {
    switchAdminTab('agents');
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    
    document.querySelector(`.admin-tab:nth-child(${tab === 'agents' ? 1 : tab === 'assignments' ? 2 : 3})`).classList.add('active');
    document.getElementById(`admin-${tab}`).classList.add('active');
    
    if (tab === 'agents') {
        loadAgents();
    } else if (tab === 'assignments') {
        loadAssignments();
    } else if (tab === 'settings') {
        loadSettings();
    }
}

function loadAgents() {
    const agents = getAgents();
    const grid = document.getElementById('agentsGrid');
    
    grid.innerHTML = agents.map(agent => `
        <div class="agent-card">
            <div class="agent-header">
                <div class="agent-avatar">${getInitials(agent.name)}</div>
                <div class="agent-info">
                    <h4>${agent.name}</h4>
                    <div class="agent-role">${agent.role}</div>
                </div>
            </div>
            <div class="agent-stats">
                <div class="agent-stat">
                    <div class="agent-stat-value">${agent.assignedCount}</div>
                    <div class="agent-stat-label">Assigned</div>
                </div>
                <div class="agent-stat">
                    <div class="agent-stat-value">${agent.resolvedCount}</div>
                    <div class="agent-stat-label">Resolved</div>
                </div>
            </div>
            <div class="agent-actions">
                <button class="btn btn-sm btn-secondary" onclick="editAgent('${agent.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-secondary" onclick="viewAgentDetails('${agent.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
    `).join('');
}

function openAddAgentModal() {
    const modal = document.getElementById('addAgentModal');
    modal.classList.add('show');
}

function closeAddAgentModal() {
    const modal = document.getElementById('addAgentModal');
    modal.classList.remove('show');
    
    // Reset form
    document.getElementById('agentName').value = '';
    document.getElementById('agentEmail').value = '';
    document.getElementById('agentRole').value = 'Agent';
    document.getElementById('agentDepartment').value = 'Technical';
}

function confirmAddAgent() {
    const name = document.getElementById('agentName').value.trim();
    const email = document.getElementById('agentEmail').value.trim();
    const role = document.getElementById('agentRole').value;
    const department = document.getElementById('agentDepartment').value;
    
    if (!name || !email) {
        showToast('error', 'Validation Error', 'Please fill in all required fields');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('error', 'Validation Error', 'Please enter a valid email address');
        return;
    }
    
    const agent = {
        name: name,
        email: email,
        role: role,
        department: department
    };
    
    addAgent(agent);
    
    showToast('success', 'Agent Added', `${name} has been added successfully`);
    closeAddAgentModal();
    loadAgents();
}

function editAgent(id) {
    showToast('info', 'Edit Agent', 'Edit agent functionality coming soon');
}

function viewAgentDetails(id) {
    showToast('info', 'Agent Details', 'Agent details view coming soon');
}

function loadAssignments() {
    // Load complaints for assignment dropdown
    const complaints = getComplaints().filter(c => c.status !== 'Resolved' && c.status !== 'Closed');
    const agents = getAgents();
    
    const complaintSelect = document.getElementById('assignComplaint');
    const agentSelect = document.getElementById('assignAgent');
    
    complaintSelect.innerHTML = '<option value="">Select Complaint</option>' + 
        complaints.map(c => `<option value="${c.id}">${c.id} - ${c.subject}</option>`).join('');
    
    agentSelect.innerHTML = '<option value="">Select Agent</option>' + 
        agents.map(a => `<option value="${a.id}">${a.name} (${a.department})</option>`).join('');
    
    // Show assignments list
    const assignmentsList = document.getElementById('assignmentsList');
    const assignedComplaints = getComplaints().filter(c => c.assignedTo);
    
    if (assignedComplaints.length === 0) {
        assignmentsList.innerHTML = '<div class="empty-state"><p>No assignments yet</p></div>';
        return;
    }
    
    assignmentsList.innerHTML = assignedComplaints.map(c => {
        const agent = agents.find(a => a.id === c.assignedTo);
        return `
            <div class="assignment-item">
                <div>
                    <strong>${c.id}</strong> - ${c.subject}
                    <br>
                    <small>Assigned to: ${agent ? agent.name : 'Unknown'}</small>
                </div>
                <button class="btn btn-sm btn-secondary" onclick="unassignComplaint('${c.id}')">
                    <i class="fas fa-times"></i> Unassign
                </button>
            </div>
        `;
    }).join('');
}

function assignComplaintToAgent() {
    const complaintId = document.getElementById('assignComplaint').value;
    const agentId = document.getElementById('assignAgent').value;
    
    if (!complaintId || !agentId) {
        showToast('error', 'Selection Required', 'Please select both complaint and agent');
        return;
    }
    
    updateComplaint(complaintId, {
        assignedTo: agentId,
        historyDescription: 'Complaint assigned to agent',
        historyUser: 'Admin'
    });
    
    // Update agent stats
    const agents = getAgents();
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
        agent.assignedCount++;
        updateAgent(agentId, agent);
    }
    
    showToast('success', 'Assigned', 'Complaint has been assigned successfully');
    loadAssignments();
}

function unassignComplaint(id) {
    const complaint = getComplaintById(id);
    if (complaint && complaint.assignedTo) {
        // Update agent stats
        const agents = getAgents();
        const agent = agents.find(a => a.id === complaint.assignedTo);
        if (agent && agent.assignedCount > 0) {
            agent.assignedCount--;
            updateAgent(agent.id, agent);
        }
    }
    
    updateComplaint(id, {
        assignedTo: null,
        historyDescription: 'Complaint unassigned',
        historyUser: 'Admin'
    });
    
    showToast('success', 'Unassigned', 'Complaint has been unassigned');
    loadAssignments();
}

function loadSettings() {
    const settings = getSettings();
    
    document.getElementById('escalationHours').value = settings.escalationHours;
    document.getElementById('criticalEscalationHours').value = settings.criticalEscalationHours;
    document.getElementById('emailNotifications').checked = settings.emailNotifications;
    document.getElementById('smsNotifications').checked = settings.smsNotifications;
    document.getElementById('autoAssignment').checked = settings.autoAssignment;
}

function saveEscalationSettings() {
    const settings = getSettings();
    
    settings.escalationHours = parseInt(document.getElementById('escalationHours').value);
    settings.criticalEscalationHours = parseInt(document.getElementById('criticalEscalationHours').value);
    
    saveSettings(settings);
    showToast('success', 'Settings Saved', 'Escalation settings have been updated');
}

function saveNotificationSettings() {
    const settings = getSettings();
    
    settings.emailNotifications = document.getElementById('emailNotifications').checked;
    settings.smsNotifications = document.getElementById('smsNotifications').checked;
    settings.autoAssignment = document.getElementById('autoAssignment').checked;
    
    saveSettings(settings);
    showToast('success', 'Settings Saved', 'Notification settings have been updated');
}

// Close modals on overlay click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

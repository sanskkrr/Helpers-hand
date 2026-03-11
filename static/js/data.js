// ========================================
// Data Management & Mock Data
// ========================================

// Storage keys
const STORAGE_KEYS = {
    COMPLAINTS: 'cms_complaints',
    AGENTS: 'cms_agents',
    ASSIGNMENTS: 'cms_assignments',
    SETTINGS: 'cms_settings'
};

// Initialize sample data
function initializeData() {
    // Do not generate demo complaints anymore
}

// Generate sample complaints
function generateSampleComplaints() {
    const categories = ['Technical', 'Billing', 'Service', 'Product', 'Delivery', 'Other'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const statuses = ['New', 'In Progress', 'Escalated', 'Resolved', 'Closed'];
    
    const names = [
        'John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis',
        'David Wilson', 'Lisa Anderson', 'James Taylor', 'Jennifer Martinez',
        'Robert Garcia', 'Mary Rodriguez', 'William Lee', 'Patricia Harris',
        'Christopher Clark', 'Linda Lewis', 'Daniel Walker', 'Nancy Hall',
        'Matthew Young', 'Karen King', 'Joseph Wright', 'Betty Lopez'
    ];

    const subjects = [
        'Unable to access my account',
        'Incorrect billing amount charged',
        'Poor customer service experience',
        'Product not working as advertised',
        'Delayed delivery of order',
        'Payment processing issue',
        'Feature not functioning properly',
        'Missing items in order',
        'Refund not received',
        'Technical error on website',
        'Account security concern',
        'Subscription cancellation issue',
        'Data synchronization problem',
        'Mobile app crashing frequently',
        'Email notifications not working'
    ];

    const complaints = [];
    const now = Date.now();

    for (let i = 0; i < 25; i++) {
        const daysAgo = Math.floor(Math.random() * 90);
        const hoursAgo = Math.floor(Math.random() * 24);
        const createdAt = now - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000);
        
        const name = names[i % names.length];
        const email = name.toLowerCase().replace(' ', '.') + '@example.com';
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        
        const complaint = {
            id: `CMP-2024-${String(i + 1).padStart(3, '0')}`,
            complainantName: name,
            complainantEmail: email,
            complainantPhone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            category: category,
            priority: priority,
            subject: subject,
            description: `Detailed description of the ${subject.toLowerCase()}. This issue has been affecting my experience and I would appreciate a prompt resolution.`,
            status: status,
            createdAt: createdAt,
            updatedAt: createdAt + (Math.random() * 5 * 24 * 60 * 60 * 1000),
            assignedTo: null,
            escalationLevel: status === 'Escalated' ? ['L1', 'L2', 'L3'][Math.floor(Math.random() * 3)] : null,
            resolutionNotes: status === 'Resolved' || status === 'Closed' ? 'Issue has been resolved successfully. Customer has been notified.' : null,
            satisfactionRating: status === 'Resolved' || status === 'Closed' ? Math.floor(Math.random() * 3) + 3 : null,
            history: generateComplaintHistory(status, createdAt),
            attachments: [],
            notes: []
        };

        complaints.push(complaint);
    }

    return complaints;
}

// Generate complaint history based on status
function generateComplaintHistory(status, createdAt) {
    const history = [
        {
            status: 'New',
            timestamp: createdAt,
            description: 'Complaint registered in the system',
            user: 'System'
        }
    ];

    if (status === 'In Progress' || status === 'Escalated' || status === 'Resolved' || status === 'Closed') {
        history.push({
            status: 'In Progress',
            timestamp: createdAt + (2 * 60 * 60 * 1000),
            description: 'Complaint assigned to support team',
            user: 'Admin'
        });
    }

    if (status === 'Escalated' || status === 'Resolved' || status === 'Closed') {
        history.push({
            status: 'Escalated',
            timestamp: createdAt + (24 * 60 * 60 * 1000),
            description: 'Escalated to senior management',
            user: 'Supervisor'
        });
    }

    if (status === 'Resolved' || status === 'Closed') {
        history.push({
            status: 'Resolved',
            timestamp: createdAt + (48 * 60 * 60 * 1000),
            description: 'Issue resolved and customer notified',
            user: 'Support Agent'
        });
    }

    if (status === 'Closed') {
        history.push({
            status: 'Closed',
            timestamp: createdAt + (72 * 60 * 60 * 1000),
            description: 'Complaint closed after customer confirmation',
            user: 'System'
        });
    }

    return history;
}

// Generate sample agents
function generateSampleAgents() {
    return [
        {
            id: 'AGT-001',
            name: 'Alex Thompson',
            email: 'alex.thompson@company.com',
            role: 'Senior Agent',
            department: 'Technical',
            assignedCount: 8,
            resolvedCount: 45,
            active: true
        },
        {
            id: 'AGT-002',
            name: 'Maria Garcia',
            email: 'maria.garcia@company.com',
            role: 'Agent',
            department: 'Billing',
            assignedCount: 5,
            resolvedCount: 32,
            active: true
        },
        {
            id: 'AGT-003',
            name: 'James Wilson',
            email: 'james.wilson@company.com',
            role: 'Supervisor',
            department: 'Service',
            assignedCount: 12,
            resolvedCount: 67,
            active: true
        },
        {
            id: 'AGT-004',
            name: 'Sarah Chen',
            email: 'sarah.chen@company.com',
            role: 'Agent',
            department: 'General',
            assignedCount: 6,
            resolvedCount: 28,
            active: true
        },
        {
            id: 'AGT-005',
            name: 'Michael Brown',
            email: 'michael.brown@company.com',
            role: 'Manager',
            department: 'Technical',
            assignedCount: 10,
            resolvedCount: 89,
            active: true
        },
        {
            id: 'AGT-006',
            name: 'Emily Davis',
            email: 'emily.davis@company.com',
            role: 'Senior Agent',
            department: 'Service',
            assignedCount: 7,
            resolvedCount: 54,
            active: true
        }
    ];
}

// Data Access Functions
function getComplaints() {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
    return data ? JSON.parse(data) : [];
}

function saveComplaints(complaints) {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
}

function getComplaintById(id) {
    const complaints = getComplaints();
    return complaints.find(c => c.id === id);
}

function getComplaintsByEmail(email) {
    const complaints = getComplaints();
    return complaints.filter(c => c.complainantEmail.toLowerCase() === email.toLowerCase());
}

function addComplaint(complaint) {
    const complaints = getComplaints();
    
    // Generate complaint ID
    const year = new Date().getFullYear();
    const nextNumber = complaints.length + 1;
    complaint.id = `CMP-${year}-${String(nextNumber).padStart(3, '0')}`;
    
    // Set timestamps
    complaint.createdAt = Date.now();
    complaint.updatedAt = Date.now();
    complaint.status = 'New';
    
    // Initialize history
    complaint.history = [{
        status: 'New',
        timestamp: complaint.createdAt,
        description: 'Complaint registered in the system',
        user: 'System'
    }];
    
    complaints.unshift(complaint);
    saveComplaints(complaints);
    
    // Check for auto-escalation
    checkAutoEscalation();
    
    return complaint;
}

function updateComplaint(id, updates) {
    const complaints = getComplaints();
    const index = complaints.findIndex(c => c.id === id);
    
    if (index !== -1) {
        complaints[index] = {
            ...complaints[index],
            ...updates,
            updatedAt: Date.now()
        };
        
        // Add to history if status changed
        if (updates.status && updates.status !== complaints[index].status) {
            if (!complaints[index].history) {
                complaints[index].history = [];
            }
            complaints[index].history.push({
                status: updates.status,
                timestamp: Date.now(),
                description: updates.historyDescription || `Status changed to ${updates.status}`,
                user: updates.historyUser || 'Admin'
            });
        }
        
        saveComplaints(complaints);
        return complaints[index];
    }
    
    return null;
}

function deleteComplaint(id) {
    let complaints = getComplaints();
    complaints = complaints.filter(c => c.id !== id);
    saveComplaints(complaints);
}

// Agent functions
function getAgents() {
    const data = localStorage.getItem(STORAGE_KEYS.AGENTS);
    return data ? JSON.parse(data) : [];
}

function saveAgents(agents) {
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
}

function addAgent(agent) {
    const agents = getAgents();
    const nextNumber = agents.length + 1;
    agent.id = `AGT-${String(nextNumber).padStart(3, '0')}`;
    agent.assignedCount = 0;
    agent.resolvedCount = 0;
    agent.active = true;
    
    agents.push(agent);
    saveAgents(agents);
    return agent;
}

function updateAgent(id, updates) {
    const agents = getAgents();
    const index = agents.findIndex(a => a.id === id);
    
    if (index !== -1) {
        agents[index] = { ...agents[index], ...updates };
        saveAgents(agents);
        return agents[index];
    }
    
    return null;
}

// Settings functions
function getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
        escalationHours: 48,
        criticalEscalationHours: 24,
        emailNotifications: true,
        smsNotifications: false,
        autoAssignment: true
    };
}

function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// Auto-escalation check
function checkAutoEscalation() {
    const complaints = getComplaints();
    const settings = getSettings();
    const now = Date.now();
    let updated = false;
    
    complaints.forEach(complaint => {
        if (complaint.status === 'New' || complaint.status === 'In Progress') {
            const hoursSinceCreation = (now - complaint.createdAt) / (1000 * 60 * 60);
            const escalationThreshold = complaint.priority === 'Critical' 
                ? settings.criticalEscalationHours 
                : settings.escalationHours;
            
            if (hoursSinceCreation >= escalationThreshold && complaint.status !== 'Escalated') {
                complaint.status = 'Escalated';
                complaint.escalationLevel = 'L1';
                complaint.updatedAt = now;
                
                if (!complaint.history) {
                    complaint.history = [];
                }
                
                complaint.history.push({
                    status: 'Escalated',
                    timestamp: now,
                    description: 'Auto-escalated due to time threshold',
                    user: 'System'
                });
                
                updated = true;
            }
        }
    });
    
    if (updated) {
        saveComplaints(complaints);
    }
}

// Statistics calculations
function getStatistics() {
    const complaints = getComplaints();
    
    const stats = {
        total: complaints.length,
        new: complaints.filter(c => c.status === 'New').length,
        pending: complaints.filter(c => c.status === 'New').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        escalated: complaints.filter(c => c.status === 'Escalated').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
        closed: complaints.filter(c => c.status === 'Closed').length
    };
    
    // Calculate percentages
    const resolvedAndClosed = stats.resolved + stats.closed;
    stats.resolutionRate = stats.total > 0 ? ((resolvedAndClosed / stats.total) * 100).toFixed(1) : 0;
    stats.escalationRate = stats.total > 0 ? ((stats.escalated / stats.total) * 100).toFixed(1) : 0;
    
    // Calculate average resolution time
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed');
    if (resolvedComplaints.length > 0) {
        const totalResolutionTime = resolvedComplaints.reduce((sum, c) => {
            return sum + (c.updatedAt - c.createdAt);
        }, 0);
        stats.avgResolutionTime = ((totalResolutionTime / resolvedComplaints.length) / (1000 * 60 * 60)).toFixed(1);
    } else {
        stats.avgResolutionTime = 0;
    }
    
    // Calculate average rating
    const ratedComplaints = complaints.filter(c => c.satisfactionRating);
    if (ratedComplaints.length > 0) {
        const totalRating = ratedComplaints.reduce((sum, c) => sum + c.satisfactionRating, 0);
        stats.avgRating = (totalRating / ratedComplaints.length).toFixed(1);
    } else {
        stats.avgRating = 0;
    }
    
    return stats;
}

// Get complaints by status for charts
function getComplaintsByStatus() {
    const complaints = getComplaints();
    const statusCounts = {
        'New': 0,
        'In Progress': 0,
        'Escalated': 0,
        'Resolved': 0,
        'Closed': 0
    };
    
    complaints.forEach(c => {
        if (statusCounts.hasOwnProperty(c.status)) {
            statusCounts[c.status]++;
        }
    });
    
    return statusCounts;
}

// Get complaints by priority
function getComplaintsByPriority() {
    const complaints = getComplaints();
    const priorityCounts = {
        'Low': 0,
        'Medium': 0,
        'High': 0,
        'Critical': 0
    };
    
    complaints.forEach(c => {
        if (priorityCounts.hasOwnProperty(c.priority)) {
            priorityCounts[c.priority]++;
        }
    });
    
    return priorityCounts;
}

// Get complaints by category
function getComplaintsByCategory() {
    const complaints = getComplaints();
    const categoryCounts = {};
    
    complaints.forEach(c => {
        categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });
    
    return categoryCounts;
}

// Get monthly trends (last 6 months)
function getMonthlyTrends() {
    const complaints = getComplaints();
    const now = new Date();
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = monthNames[date.getMonth()];
        months.push({
            name: monthName,
            count: 0
        });
    }
    
    // Count complaints per month
    complaints.forEach(c => {
        const complaintDate = new Date(c.createdAt);
        const monthIndex = months.findIndex(m => {
            const targetDate = new Date(now.getFullYear(), now.getMonth() - (5 - months.indexOf(m)), 1);
            return complaintDate.getMonth() === targetDate.getMonth() && 
                   complaintDate.getFullYear() === targetDate.getFullYear();
        });
        
        if (monthIndex !== -1) {
            months[monthIndex].count++;
        }
    });
    
    return months;
}

// Export data
function exportComplaintsData() {
    const complaints = getComplaints();
    const csv = convertToCSV(complaints);
    downloadCSV(csv, 'complaints-export.csv');
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Category', 'Priority', 'Status', 'Subject', 'Created Date'];
    const rows = data.map(c => [
        c.id,
        c.complainantName,
        c.complainantEmail,
        c.complainantPhone,
        c.category,
        c.priority,
        c.status,
        c.subject,
        new Date(c.createdAt).toLocaleString()
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    return csvContent;
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Initialize data on load
//initializeData();

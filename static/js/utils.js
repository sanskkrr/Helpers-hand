// ========================================
// Utility Functions & Helpers
// ========================================

// Toast Notification System
function showToast(type, title, message) {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type] || icons.info}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Format date/time
function formatDate(timestamp, format = 'full') {
    const date = new Date(timestamp);
    
    if (format === 'full') {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (format === 'date') {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } else if (format === 'time') {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (format === 'relative') {
        return getRelativeTime(timestamp);
    }
    
    return date.toLocaleString();
}

// Get relative time (e.g., "2 hours ago")
function getRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    return `${years} year${years > 1 ? 's' : ''} ago`;
}

// Get status badge HTML
function getStatusBadge(status) {
    const statusClass = status.toLowerCase().replace(' ', '-');
    const icons = {
        'New': 'fa-circle',
        'In Progress': 'fa-spinner',
        'Escalated': 'fa-exclamation-triangle',
        'Resolved': 'fa-check-circle',
        'Closed': 'fa-archive'
    };
    
    return `<span class="badge status-${statusClass}">
        <i class="fas ${icons[status] || 'fa-circle'}"></i>
        ${status}
    </span>`;
}

// Get priority badge HTML
function getPriorityBadge(priority) {
    const priorityClass = priority.toLowerCase();
    const icons = {
        'Low': 'fa-chevron-down',
        'Medium': 'fa-minus',
        'High': 'fa-chevron-up',
        'Critical': 'fa-exclamation'
    };
    
    return `<span class="badge priority-${priorityClass}">
        <i class="fas ${icons[priority] || 'fa-minus'}"></i>
        ${priority}
    </span>`;
}

// Get user initials
function getInitials(name) {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone
function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Filter complaints based on criteria
function filterComplaints(complaints, filters) {
    return complaints.filter(complaint => {
        // Status filter
        if (filters.status && complaint.status !== filters.status) {
            return false;
        }
        
        // Priority filter
        if (filters.priority && complaint.priority !== filters.priority) {
            return false;
        }
        
        // Category filter
        if (filters.category && complaint.category !== filters.category) {
            return false;
        }
        
        // Date filter
        if (filters.dateRange) {
            const now = Date.now();
            const complaintDate = complaint.createdAt;
            
            switch (filters.dateRange) {
                case 'today':
                    const today = new Date().setHours(0, 0, 0, 0);
                    if (complaintDate < today) return false;
                    break;
                case 'week':
                    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
                    if (complaintDate < weekAgo) return false;
                    break;
                case 'month':
                    const monthAgo = now - (30 * 24 * 60 * 60 * 1000);
                    if (complaintDate < monthAgo) return false;
                    break;
                case 'quarter':
                    const quarterAgo = now - (90 * 24 * 60 * 60 * 1000);
                    if (complaintDate < quarterAgo) return false;
                    break;
            }
        }
        
        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const searchableText = `
                ${complaint.id}
                ${complaint.complainantName}
                ${complaint.complainantEmail}
                ${complaint.subject}
                ${complaint.description}
                ${complaint.category}
            `.toLowerCase();
            
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
}

// Sort complaints
function sortComplaints(complaints, field, direction = 'asc') {
    return [...complaints].sort((a, b) => {
        let valueA, valueB;
        
        switch (field) {
            case 'id':
                valueA = a.id;
                valueB = b.id;
                break;
            case 'name':
                valueA = a.complainantName;
                valueB = b.complainantName;
                break;
            case 'category':
                valueA = a.category;
                valueB = b.category;
                break;
            case 'priority':
                const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                valueA = priorityOrder[a.priority];
                valueB = priorityOrder[b.priority];
                break;
            case 'status':
                valueA = a.status;
                valueB = b.status;
                break;
            case 'date':
                valueA = a.createdAt;
                valueB = b.createdAt;
                break;
            default:
                return 0;
        }
        
        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
}

// Paginate array
function paginate(array, page, itemsPerPage) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array.slice(startIndex, endIndex);
}

// Generate pagination HTML
function generatePaginationHTML(totalItems, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) return '';
    
    let html = '';
    
    // Previous button
    html += `<button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        html += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            html += `<span>...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span>...</span>`;
        }
        html += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    return html;
}

// Confirm dialog
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Generate complaint detail HTML
function generateComplaintDetailHTML(complaint) {
    return `
        <div class="complaint-detail">
            <div class="complaint-header">
                <div>
                    <h2 class="complaint-id-badge">${complaint.id}</h2>
                    <p class="meta-value">${complaint.subject}</p>
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
                    <div class="meta-label">Email</div>
                    <div class="meta-value">${complaint.complainantEmail}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Phone</div>
                    <div class="meta-value">${complaint.complainantPhone}</div>
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
                <h3 class="section-title">Description</h3>
                <p style="line-height: 1.8; color: var(--text-secondary);">${complaint.description}</p>
            </div>
            
            ${complaint.resolutionNotes ? `
                <div class="form-section">
                    <h3 class="section-title">Resolution Notes</h3>
                    <p style="line-height: 1.8; color: var(--text-secondary);">${complaint.resolutionNotes}</p>
                    ${complaint.satisfactionRating ? `
                        <div style="margin-top: 1rem;">
                            <strong>Customer Rating:</strong>
                            ${generateStarRating(complaint.satisfactionRating)}
                        </div>
                    ` : ''}
                </div>
            ` : ''}
            
            <div class="form-section">
                <h3 class="section-title">Status Timeline</h3>
                <div class="timeline">
                    ${complaint.history ? complaint.history.map((item, index) => `
                        <div class="timeline-item ${index === complaint.history.length - 1 ? 'active' : ''}">
                            <div class="timeline-content">
                                <div class="timeline-title">${item.status}</div>
                                <div class="timeline-description">${item.description}</div>
                                <div class="timeline-date">
                                    ${formatDate(item.timestamp, 'full')} • ${item.user}
                                </div>
                            </div>
                        </div>
                    `).join('') : ''}
                </div>
            </div>
            
            <div class="form-actions">
                ${complaint.status !== 'Resolved' && complaint.status !== 'Closed' ? `
                    <button class="btn btn-secondary" onclick="openEscalateModal('${complaint.id}')">
                        <i class="fas fa-arrow-up"></i> Escalate
                    </button>
                    <button class="btn btn-primary" onclick="updateComplaintStatus('${complaint.id}', 'In Progress')">
                        <i class="fas fa-play"></i> Start Processing
                    </button>
                    <button class="btn btn-success" onclick="openResolutionModal('${complaint.id}')">
                        <i class="fas fa-check"></i> Mark as Resolved
                    </button>
                ` : ''}
                ${complaint.status === 'Resolved' ? `
                    <button class="btn btn-secondary" onclick="updateComplaintStatus('${complaint.id}', 'Closed')">
                        <i class="fas fa-archive"></i> Close Complaint
                    </button>
                ` : ''}
                <button class="btn btn-secondary" onclick="printComplaint('${complaint.id}')">
                    <i class="fas fa-print"></i> Print
                </button>
            </div>
        </div>
    `;
}

// Generate star rating
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star" style="color: ${i <= rating ? '#fbbf24' : '#ddd'};"></i> `;
    }
    return stars;
}

// Print complaint
function printComplaint(id) {
    const complaint = getComplaintById(id);
    if (!complaint) return;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Complaint ${complaint.id}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 2rem; }
                h1 { color: #667eea; }
                .section { margin: 2rem 0; }
                .label { font-weight: bold; margin-top: 1rem; }
                table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                td { padding: 0.5rem; border-bottom: 1px solid #ddd; }
            </style>
        </head>
        <body>
            <h1>Complaint Details - ${complaint.id}</h1>
            <div class="section">
                <div class="label">Complainant:</div>
                <div>${complaint.complainantName}</div>
                <div>${complaint.complainantEmail}</div>
                <div>${complaint.complainantPhone}</div>
            </div>
            <div class="section">
                <div class="label">Subject:</div>
                <div>${complaint.subject}</div>
            </div>
            <div class="section">
                <div class="label">Description:</div>
                <div>${complaint.description}</div>
            </div>
            <div class="section">
                <table>
                    <tr><td><strong>Category</strong></td><td>${complaint.category}</td></tr>
                    <tr><td><strong>Priority</strong></td><td>${complaint.priority}</td></tr>
                    <tr><td><strong>Status</strong></td><td>${complaint.status}</td></tr>
                    <tr><td><strong>Created</strong></td><td>${formatDate(complaint.createdAt)}</td></tr>
                </table>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Print analytics
function printAnalytics() {
    window.print();
}

// Export report
function exportReport() {
    exportComplaintsData();
    showToast('success', 'Export Successful', 'Report has been exported successfully');
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('success', 'Copied', 'Text copied to clipboard');
    }).catch(() => {
        showToast('error', 'Copy Failed', 'Failed to copy text to clipboard');
    });
}

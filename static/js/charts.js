// ========================================
// Charts & Data Visualization
// ========================================

let chartsInstances = {};

// Initialize all charts
function initializeCharts() {
    initStatusChart();
    initMonthlyChart();
    initPriorityChart();
    initAnalyticsCharts();
}

// Status Distribution Chart (Doughnut)
function initStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
  const statusData = chartData;
    
    if (chartsInstances.statusChart) {
        chartsInstances.statusChart.destroy();
    }
    
    chartsInstances.statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusData),
            datasets: [{
                data: [3,6,9,4,7,5],  
                backgroundColor: [
                    '#3b82f6',  // New
                    '#f59e0b',  // In Progress
                    '#ef4444',  // Escalated
                    '#10b981',  // Resolved
                    '#6b7280'   // Closed
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12,
                            family: 'Inter'
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        family: 'Inter'
                    },
                    bodyFont: {
                        size: 13,
                        family: 'Inter'
                    },
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Monthly Trends Chart (Line)
function initMonthlyChart() {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;
    
    const monthlyData = getMonthlyTrends();
    
    if (chartsInstances.monthlyChart) {
        chartsInstances.monthlyChart.destroy();
    }
    
    chartsInstances.monthlyChart = new Chart(ctx, {
        type: 'line',
       data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun'],
        datasets: [{
            label: 'Complaints',
            data: [3,6,9,4,7,5],   // fake values
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.2)',
            fill: true
        }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        family: 'Inter'
                    },
                    bodyFont: {
                        size: 13,
                        family: 'Inter'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: 'Inter'
                        },
                        precision: 0
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: 'Inter'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Priority Distribution Chart (Bar)
function initPriorityChart() {
    const ctx = document.getElementById('priorityChart');
    if (!ctx) return;
    
    const priorityData = getComplaintsByPriority();
    
    if (chartsInstances.priorityChart) {
        chartsInstances.priorityChart.destroy();
    }
    
    chartsInstances.priorityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(priorityData),
            datasets: [{
                label: 'Complaints',
                data: Object.values(priorityData),
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',   // Low
                    'rgba(245, 158, 11, 0.8)',    // Medium
                    'rgba(249, 115, 22, 0.8)',    // High
                    'rgba(220, 38, 38, 0.8)'      // Critical
                ],
                borderWidth: 0,
                borderRadius: 8,
                barThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        family: 'Inter'
                    },
                    bodyFont: {
                        size: 13,
                        family: 'Inter'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: 'Inter'
                        },
                        precision: 0
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: 'Inter',
                            weight: 600
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Analytics Charts
function initAnalyticsCharts() {
    initResolutionTimeChart();
    initCategoryPerformanceChart();
    initEscalationChart();
    initSatisfactionChart();
}

// Resolution Time Chart
function initResolutionTimeChart() {
    const ctx = document.getElementById('resolutionTimeChart');
    if (!ctx) return;
    
    const complaints = getComplaints();
    const resolvedComplaints = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed');
    
    // Calculate resolution time by category
    const categoryTimes = {};
    resolvedComplaints.forEach(c => {
        if (!categoryTimes[c.category]) {
            categoryTimes[c.category] = { total: 0, count: 0 };
        }
        const resolutionTime = (c.updatedAt - c.createdAt) / (1000 * 60 * 60); // hours
        categoryTimes[c.category].total += resolutionTime;
        categoryTimes[c.category].count++;
    });
    
    const categories = Object.keys(categoryTimes);
    const avgTimes = categories.map(cat => 
        (categoryTimes[cat].total / categoryTimes[cat].count).toFixed(1)
    );
    
    if (chartsInstances.resolutionTimeChart) {
        chartsInstances.resolutionTimeChart.destroy();
    }
    
    chartsInstances.resolutionTimeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Avg. Resolution Time (hours)',
                data: avgTimes,
                backgroundColor: 'rgba(79, 172, 254, 0.8)',
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} hours`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { family: 'Inter' },
                        callback: function(value) {
                            return value + 'h';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: { family: 'Inter' }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Category Performance Chart
function initCategoryPerformanceChart() {
    const ctx = document.getElementById('categoryPerformanceChart');
    if (!ctx) return;
    
    const complaints = getComplaints();
    const categoryStats = {};
    
    complaints.forEach(c => {
        if (!categoryStats[c.category]) {
            categoryStats[c.category] = { total: 0, resolved: 0 };
        }
        categoryStats[c.category].total++;
        if (c.status === 'Resolved' || c.status === 'Closed') {
            categoryStats[c.category].resolved++;
        }
    });
    
    const categories = Object.keys(categoryStats);
    const resolutionRates = categories.map(cat => 
        ((categoryStats[cat].resolved / categoryStats[cat].total) * 100).toFixed(1)
    );
    
    if (chartsInstances.categoryPerformanceChart) {
        chartsInstances.categoryPerformanceChart.destroy();
    }
    
    chartsInstances.categoryPerformanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Resolution Rate (%)',
                data: resolutionRates,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.x}% resolved`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        font: { family: 'Inter' },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    ticks: {
                        font: { family: 'Inter' }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Escalation Trends Chart
function initEscalationChart() {
    const ctx = document.getElementById('escalationChart');
    if (!ctx) return;
    
    const monthlyData = getMonthlyTrends();
    const complaints = getComplaints();
    
    // Calculate escalated complaints per month
    const escalatedByMonth = monthlyData.map(month => {
        const monthComplaints = complaints.filter(c => {
            const complaintDate = new Date(c.createdAt);
            const monthDate = new Date();
            const monthIndex = monthlyData.indexOf(month);
            monthDate.setMonth(monthDate.getMonth() - (5 - monthIndex));
            
            return complaintDate.getMonth() === monthDate.getMonth() &&
                   complaintDate.getFullYear() === monthDate.getFullYear() &&
                   c.status === 'Escalated';
        });
        return monthComplaints.length;
    });
    
    if (chartsInstances.escalationChart) {
        chartsInstances.escalationChart.destroy();
    }
    
    chartsInstances.escalationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthlyData.map(m => m.name),
            datasets: [{
                label: 'Escalated Complaints',
                data: escalatedByMonth,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { family: 'Inter' },
                        precision: 0
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: { family: 'Inter' }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Customer Satisfaction Chart
function initSatisfactionChart() {
    const ctx = document.getElementById('satisfactionChart');
    if (!ctx) return;
    
    const complaints = getComplaints();
    const ratedComplaints = complaints.filter(c => c.satisfactionRating);
    
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratedComplaints.forEach(c => {
        ratingCounts[c.satisfactionRating]++;
    });
    
    if (chartsInstances.satisfactionChart) {
        chartsInstances.satisfactionChart.destroy();
    }
    
    chartsInstances.satisfactionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
            datasets: [{
                label: 'Ratings',
                data: Object.values(ratingCounts),
                backgroundColor: [
                    'rgba(220, 38, 38, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(79, 172, 254, 0.8)',
                    'rgba(16, 185, 129, 0.8)'
                ],
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: { family: 'Inter' },
                        precision: 0
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: { family: 'Inter' }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Update all charts
function updateCharts() {
    initializeCharts();
}

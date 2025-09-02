/**
 * Utopia Government Dashboard JavaScript
 * Handles real-time notifications, filtering, and interactive features
 */

class GovernmentDashboard {
    constructor() {
        this.emergencyContainer = document.getElementById('emergencyContainer');
        this.complaintsContainer = document.getElementById('complaintsContainer');
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.addInteractiveFeatures();
        console.log('Government Dashboard initialized successfully');
    }

    setupEventListeners() {
        // Click handlers for items
        document.addEventListener('click', (e) => {
            if (e.target.closest('.request-item') || e.target.closest('.complaint-item')) {
                this.handleItemClick(e.target.closest('.request-item, .complaint-item'));
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Auto-refresh toggle
        this.addRefreshControls();
    }

    handleItemClick(item) {
        // Add visual feedback
        item.classList.add('selected');
        
        // Remove selection after a short delay
        setTimeout(() => {
            item.classList.remove('selected');
        }, 300);

        // Extract item data
        const title = item.querySelector('.item-title').textContent;
        const description = item.querySelector('.item-description').textContent;
        const location = item.querySelector('.item-location span').textContent;
        const priority = item.querySelector('.item-priority').textContent;
        const status = item.querySelector('.status-badge').textContent;

        // Show details (could be expanded to show modal)
        console.log('Item Details:', { title, description, location, priority, status });
        
        // For now, just highlight the item
        this.highlightItem(item);
    }

    highlightItem(item) {
        // Remove existing highlights
        document.querySelectorAll('.highlighted').forEach(el => {
            el.classList.remove('highlighted');
        });

        // Add highlight to clicked item
        item.classList.add('highlighted');
        
        // Auto-remove highlight after 3 seconds
        setTimeout(() => {
            item.classList.remove('highlighted');
        }, 3000);
    }

    addInteractiveFeatures() {
        // Add selection styles
        const style = document.createElement('style');
        style.textContent = `
            .request-item.selected,
            .complaint-item.selected {
                transform: scale(1.02);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }
            
            .request-item.highlighted,
            .complaint-item.highlighted {
                background-color: #fff3cd;
                border-color: #ffc107;
            }
            
            .refresh-controls {
                position: fixed;
                top: 80px;
                right: 20px;
                background: white;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                z-index: 1000;
            }
            
            .refresh-btn {
                background: #007bff;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 5px;
                font-size: 12px;
            }
            
            .refresh-btn:hover {
                background: #0056b3;
            }
            
            .auto-refresh-status {
                font-size: 12px;
                color: #666;
                margin-left: 5px;
            }
        `;
        document.head.appendChild(style);
    }

    addRefreshControls() {
        const refreshControls = document.createElement('div');
        refreshControls.className = 'refresh-controls';
        refreshControls.innerHTML = `
            <button class="refresh-btn" onclick="dashboard.refreshData()">
                <i class="fas fa-sync-alt"></i> Refresh
            </button>
            <button class="refresh-btn" onclick="dashboard.toggleAutoRefresh()">
                <i class="fas fa-play"></i> Auto
            </button>
            <span class="auto-refresh-status" id="refreshStatus">Auto: ON</span>
        `;
        document.body.appendChild(refreshControls);
    }

    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.refreshData();
        }, 30000);
    }

    toggleAutoRefresh() {
        const statusElement = document.getElementById('refreshStatus');
        
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
            statusElement.textContent = 'Auto: OFF';
        } else {
            this.startRealTimeUpdates();
            statusElement.textContent = 'Auto: ON';
        }
    }

    refreshData() {
        // Show loading indicators
        this.showLoading();
        
        // Simulate API call delay
        setTimeout(() => {
            this.updateTimestamps();
            this.simulateNewData();
            this.hideLoading();
            this.showRefreshNotification();
        }, 1000);
    }

    showLoading() {
        const containers = [this.emergencyContainer, this.complaintsContainer];
        containers.forEach(container => {
            container.style.opacity = '0.6';
        });
    }

    hideLoading() {
        const containers = [this.emergencyContainer, this.complaintsContainer];
        containers.forEach(container => {
            container.style.opacity = '1';
        });
    }

    updateTimestamps() {
        // Update "Just now" timestamps to show realistic time progression
        const timeElements = document.querySelectorAll('.item-time');
        timeElements.forEach(element => {
            const currentText = element.textContent;
            if (currentText === 'Just now') {
                element.textContent = Math.floor(Math.random() * 5) + 1 + ' min ago';
            } else if (currentText.includes('min ago')) {
                const minutes = parseInt(currentText) + Math.floor(Math.random() * 3) + 1;
                if (minutes < 60) {
                    element.textContent = minutes + ' min ago';
                } else {
                    element.textContent = Math.floor(minutes / 60) + ' hour ago';
                }
            }
        });
    }

    simulateNewData() {
        // Randomly add new emergency requests (low probability)
        if (Math.random() < 0.1) {
            this.addNewEmergency();
        }

        // Randomly add new complaints (higher probability)
        if (Math.random() < 0.3) {
            this.addNewComplaint();
        }

        // Randomly update status of existing items
        this.updateRandomStatus();
    }

    addNewEmergency() {
        const emergencyTypes = [
            {
                title: 'Gas Leak Emergency',
                description: 'Strong gas smell reported in residential area',
                location: 'Pine Street Apartment Complex',
                priority: 'critical',
                status: 'active'
            },
            {
                title: 'Water Main Break',
                description: 'Major water line rupture flooding street',
                location: 'Commerce Avenue & 5th St',
                priority: 'high',
                status: 'pending'
            }
        ];

        const emergency = emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)];
        const emergencyElement = this.createEmergencyElement(emergency);
        
        // Add with animation
        emergencyElement.classList.add('fadeIn');
        this.emergencyContainer.insertBefore(emergencyElement, this.emergencyContainer.firstChild);
    }

    addNewComplaint() {
        const complaintTypes = [
            {
                title: 'Broken Traffic Light',
                description: 'Traffic signal not functioning properly',
                location: 'Main St & Oak Ave',
                category: 'Infrastructure',
                priority: 'medium',
                status: 'open'
            },
            {
                title: 'Stray Animal Report',
                description: 'Injured stray dog needs assistance',
                location: 'Park Boulevard',
                category: 'Animal Control',
                priority: 'low',
                status: 'pending'
            }
        ];

        const complaint = complaintTypes[Math.floor(Math.random() * complaintTypes.length)];
        const complaintElement = this.createComplaintElement(complaint);
        
        // Add with animation
        complaintElement.classList.add('fadeIn');
        this.complaintsContainer.insertBefore(complaintElement, this.complaintsContainer.firstChild);
    }

    createEmergencyElement(emergency) {
        const div = document.createElement('div');
        div.className = `request-item ${emergency.priority}`;
        div.innerHTML = `
            <div class="item-header">
                <div class="item-title">${emergency.title}</div>
                <div class="item-badges">
                    <span class="item-priority priority-${emergency.priority}">${emergency.priority.toUpperCase()}</span>
                    <span class="status-badge status-${emergency.status}">${emergency.status.toUpperCase()}</span>
                </div>
            </div>
            <div class="item-description">${emergency.description}</div>
            <div class="item-meta">
                <div class="item-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${emergency.location}</span>
                </div>
                <div class="item-time">Just now</div>
            </div>
        `;
        return div;
    }

    createComplaintElement(complaint) {
        const div = document.createElement('div');
        div.className = `complaint-item ${complaint.priority}`;
        div.innerHTML = `
            <div class="item-header">
                <div class="item-title">${complaint.title}</div>
                <div class="item-badges">
                    <span class="item-priority priority-${complaint.priority}">${complaint.priority.toUpperCase()}</span>
                    <span class="status-badge status-${complaint.status}">${complaint.status.toUpperCase().replace('_', '_')}</span>
                </div>
            </div>
            <div class="item-description">${complaint.description}</div>
            <div class="item-meta">
                <div class="item-category">
                    <i class="fas fa-tools"></i>
                    <span>${complaint.category}</span>
                </div>
                <div class="item-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${complaint.location}</span>
                </div>
                <div class="item-time">Just now</div>
            </div>
        `;
        return div;
    }

    updateRandomStatus() {
        const items = document.querySelectorAll('.request-item, .complaint-item');
        const randomItem = items[Math.floor(Math.random() * items.length)];
        
        if (randomItem && Math.random() < 0.2) {
            const statusBadge = randomItem.querySelector('.status-badge');
            const currentStatus = statusBadge.textContent.toLowerCase();
            
            // Status progression logic
            let newStatus = currentStatus;
            if (currentStatus === 'pending') newStatus = 'in_progress';
            else if (currentStatus === 'active') newStatus = 'dispatched';
            else if (currentStatus === 'dispatched') newStatus = 'resolved';
            else if (currentStatus === 'open') newStatus = 'in_progress';
            else if (currentStatus === 'in_progress') newStatus = 'resolved';
            
            if (newStatus !== currentStatus) {
                statusBadge.className = `status-badge status-${newStatus}`;
                statusBadge.textContent = newStatus.toUpperCase().replace('_', '_');
                
                // Highlight the updated item
                randomItem.classList.add('highlighted');
                setTimeout(() => randomItem.classList.remove('highlighted'), 2000);
            }
        }
    }

    showRefreshNotification() {
        // Create and show a brief notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1001;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        notification.innerHTML = '<i class="fas fa-check"></i> Dashboard updated';
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.style.opacity = '1', 100);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
    }

    // Statistics tracking
    getStatistics() {
        const emergencies = document.querySelectorAll('.request-item');
        const complaints = document.querySelectorAll('.complaint-item');
        
        const stats = {
            totalEmergencies: emergencies.length,
            totalComplaints: complaints.length,
            criticalEmergencies: document.querySelectorAll('.request-item.critical').length,
            activeEmergencies: document.querySelectorAll('.status-active').length,
            pendingComplaints: document.querySelectorAll('.status-pending').length,
            resolvedToday: document.querySelectorAll('.status-resolved').length
        };
        
        return stats;
    }

    // Cleanup method
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // Remove event listeners and controls
        const refreshControls = document.querySelector('.refresh-controls');
        if (refreshControls) {
            refreshControls.remove();
        }
    }
}

// Initialize dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', function() {
    dashboard = new GovernmentDashboard();
    
    // Make dashboard globally accessible for debugging
    window.dashboard = dashboard;
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'r':
                    e.preventDefault();
                    dashboard.refreshData();
                    break;
                case 's':
                    e.preventDefault();
                    console.log('Dashboard Statistics:', dashboard.getStatistics());
                    break;
            }
        }
    });
});

// Handle page visibility changes (pause updates when page is hidden)
document.addEventListener('visibilitychange', function() {
    if (dashboard) {
        if (document.hidden) {
            dashboard.toggleAutoRefresh(); // Pause when hidden
        } else {
            if (!dashboard.refreshInterval) {
                dashboard.toggleAutoRefresh(); // Resume when visible
            }
            dashboard.refreshData(); // Refresh immediately when returning
        }
    }
});
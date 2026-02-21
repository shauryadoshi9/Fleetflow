/**
 * FleetHub Core Application Logic
 * Handles routing, page rendering, and UI interactions.
 */

const App = {
    pages: {},
    currentPage: null,

    init() {
        console.log('FleetHub Initializing...');

        // Setup Nav Links
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.navigate(page);
            });
        });

        // Logout listener
        document.getElementById('logout-btn').addEventListener('click', () => {
            Store.logout();
            this.navigate('login');
        });

        // Check Auth and Initial Route
        this.checkAuth();
    },

    checkAuth() {
        const user = Store.getCurrentUser();
        if (!user) {
            this.navigate('login');
        } else {
            this.showShell(true);
            const hash = window.location.hash.replace('#', '') || 'dashboard';
            this.navigate(hash);
        }
    },

    showShell(show) {
        const sidebar = document.getElementById('sidebar');
        const header = document.getElementById('top-header');
        if (show) {
            sidebar.classList.remove('hidden');
            header.classList.remove('hidden');
        } else {
            sidebar.classList.add('hidden');
            header.classList.add('hidden');
        }
    },

    async navigate(pageId) {
        console.log('Navigating to:', pageId);

        // Hide shell for login page
        if (pageId === 'login') {
            this.showShell(false);
        } else if (Store.getCurrentUser()) {
            this.showShell(true);
        } else {
            // Redirect to login if not authenticated
            return this.navigate('login');
        }

        // Update UI state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === pageId);
        });

        // Update URL
        window.location.hash = pageId;

        // Render Page
        const container = document.getElementById('page-container');
        container.innerHTML = '<div class="loading">Loading...</div>';

        try {
            const pageHtml = await this.getPageHtml(pageId);
            container.innerHTML = `<div class="fade-in">${pageHtml}</div>`;
            this.updateHeader(pageId);

            // Post-render initialization
            this.initPage(pageId);
            lucide.createIcons();
        } catch (error) {
            console.error('Navigation error:', error);
            container.innerHTML = `<div class="error">Page not found: ${pageId}</div>`;
        }
    },

    updateHeader(pageId) {
        const titleMap = {
            'dashboard': 'Maritime Command Center',
            'vehicles': 'Vessel Registry',
            'drivers': 'Captain Profiles',
            'trips': 'Maritime Logistics',
            'maintenance': 'Ship Dry-Dock Logs',
            'expenses': 'Bunker & Port Costs',
            'analytics': 'Global Logistics Analytics',
            'login': 'Port Login'
        };
        document.getElementById('page-title').textContent = titleMap[pageId] || pageId;
    },

    async getPageHtml(pageId) {
        // In a real app, these would be separate files. 
        // For this standalone demo, we'll return strings or use dynamic imports if possible.
        if (typeof this.pages[pageId] === 'function') {
            return this.pages[pageId]();
        }
        return `<h2>${pageId} content coming soon...</h2>`;
    },

    initPage(pageId) {
        // Page-specific setup logic
        if (this.pageInits[pageId]) {
            this.pageInits[pageId]();
        }
    },

    pageInits: {}
};

// Utility for status colors
window.getStatusColor = (status) => {
    switch (status) {
        case 'available':
        case 'on duty':
            return 'success';
        case 'on trip':
            return 'info';
        case 'in shop':
        case 'warning':
            return 'warning';
        case 'retired':
        case 'suspended':
        case 'off duty':
            return 'danger';
        default:
            return 'info';
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());

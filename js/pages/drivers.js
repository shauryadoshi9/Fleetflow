/**
 * Captain Profiles & Safety Page Component
 */

App.pages.drivers = () => {
    const drivers = Store.getDrivers();

    return `
    <div class="drivers-page">
        <div class="page-header">
            <div class="header-content">
                <h3>Maritime Captains & Safety Compliance</h3>
                <p style="color: var(--text-muted); font-size: 0.85rem;">Monitor MMSI certifications and behavioral safety scores.</p>
            </div>
            <button class="btn btn-primary" id="register-driver-btn">
                <i data-lucide="user-plus" style="width: 18px; height: 18px;"></i>
                Commission Captain
            </button>
        </div>

        <div class="driver-grid">
            ${drivers.map(d => {
        const isExpired = new Date(d.expiry) < new Date();
        const scoreColor = d.score >= 90 ? 'success' : (d.score >= 80 ? 'warning' : 'danger');

        return `
                <div class="driver-card glass-card">
                    <div class="driver-card-header">
                        <div class="driver-avatar-large">${d.name.split('. ').pop().split(' ').map(n => n[0]).join('')}</div>
                        <div class="driver-main-info">
                            <h4>${d.name}</h4>
                            <span class="pill pill-${getStatusColor(d.status)}">${d.status}</span>
                        </div>
                    </div>
                    
                    <div class="compliance-box ${isExpired ? 'expired' : ''}">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 0.8rem; font-weight: 600;">MMSI/License: ${d.license}</span>
                            <i data-lucide="${isExpired ? 'alert-octagon' : 'check-circle'}" style="width: 16px;"></i>
                        </div>
                        <div style="font-size: 0.75rem; margin-top: 0.25rem;">Cert Expiry: ${d.expiry}</div>
                        ${isExpired ? '<div class="alert-text">VALID MARITIME CERT REQUIRED</div>' : ''}
                    </div>

                    <div class="performance-stats">
                        <div class="stat-item">
                            <span class="stat-label">Safety Rating</span>
                            <span class="stat-value text-${scoreColor}">${d.score}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Voyages</span>
                            <span class="stat-value">${d.trips}</span>
                        </div>
                    </div>

                    <div class="driver-actions">
                        <button class="btn btn-sm btn-outline" style="flex: 1;" onclick="toggleDriverDuty('${d.id}')">
                            ${d.status === 'on duty' ? 'Go Off Duty' : 'Go On Duty'}
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="openDriverModal('${d.id}')">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline text-danger" title="Delete" onclick="deleteDriver('${d.id}')">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                `;
    }).join('')}
        </div>

        <!-- Captain Modal -->
        <div id="driver-modal" class="modal hidden">
            <div class="modal-content glass-card fade-in">
                <div class="modal-header">
                    <h3 id="driver-modal-title">Commission Captain</h3>
                    <button class="btn-close" onclick="closeDriverModal()">&times;</button>
                </div>
                <form id="driver-form">
                    <input type="hidden" id="driver-id">
                    <div class="form-group">
                        <label class="label">Legal Name</label>
                        <input type="text" id="d-name" class="input" required>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="label">MMSI / License</label>
                            <input type="text" id="d-license" class="input" required>
                        </div>
                        <div class="form-group">
                            <label class="label">MMSI Expiry Date</label>
                            <input type="date" id="d-expiry" class="input" required>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Save Certification</button>
                </form>
            </div>
        </div>
    </div>

    <style>
    .driver-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
    }
    .driver-card {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }
    .driver-card-header {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .driver-avatar-large {
        width: 54px;
        height: 54px;
        background: linear-gradient(135deg, #0f172a, #334155);
        border: 2px solid var(--primary);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.25rem;
        color: white;
    }
    .driver-main-info h4 { font-size: 1.1rem; margin-bottom: 0.25rem; }
    
    .compliance-box {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border);
        padding: 0.75rem;
        border-radius: var(--radius-md);
    }
    .compliance-box.expired {
        background: rgba(239, 68, 68, 0.05);
        border-color: var(--danger);
        color: var(--danger);
    }
    .performance-stats {
        display: flex;
        gap: 1rem;
        padding: 1rem 0;
        border-top: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
    }
    .driver-actions {
        display: flex;
        gap: 0.75rem;
    }
    .hidden { display: none !important; }
    </style>
    `;
};

window.openDriverModal = (id = null) => {
    const modal = document.getElementById('driver-modal');
    const form = document.getElementById('driver-form');
    const title = document.getElementById('driver-modal-title');

    modal.classList.remove('hidden');
    form.reset();
    document.getElementById('driver-id').value = id || '';

    if (id) {
        title.textContent = 'Edit Captain Profile';
        const d = Store.getDriverById(id);
        document.getElementById('d-name').value = d.name;
        document.getElementById('d-license').value = d.license;
        document.getElementById('d-expiry').value = d.expiry;
    } else {
        title.textContent = 'Commission New Captain';
    }
};

window.closeDriverModal = () => {
    document.getElementById('driver-modal').classList.add('hidden');
};

window.toggleDriverDuty = (id) => {
    const driver = Store.getDriverById(id);
    if (driver.status === 'on trip') {
        alert("Cannot change duty status while at sea.");
        return;
    }
    driver.status = driver.status === 'on duty' ? 'off duty' : 'on duty';
    Store.save();
    App.navigate('drivers');
};

window.deleteDriver = (id) => {
    if (confirm('Are you sure you want to permanently remove this captain from the registry?')) {
        try {
            Store.deleteDriver(id);
            App.navigate('drivers');
        } catch (e) {
            alert(e.message);
        }
    }
};

App.pageInits.drivers = () => {
    lucide.createIcons();

    const registerBtn = document.getElementById('register-driver-btn');
    if (registerBtn) {
        registerBtn.onclick = () => openDriverModal();
    }

    const form = document.getElementById('driver-form');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const id = document.getElementById('driver-id').value;
            const data = {
                name: document.getElementById('d-name').value,
                license: document.getElementById('d-license').value,
                expiry: document.getElementById('d-expiry').value
            };

            if (id) {
                Store.updateDriver(id, data);
            } else {
                Store.addDriver(data);
            }

            closeDriverModal();
            App.navigate('drivers');
        };
    }
};

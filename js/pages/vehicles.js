/**
 * Vessel Registry Page Component
 */

App.pages.vehicles = () => {
    const vehicles = Store.getVehicles();

    return `
    <div class="vehicles-page">
        <div class="page-header">
            <div class="search-filter">
                <input type="text" id="vehicle-search" class="input" placeholder="Search by name or IMO..." style="width: 300px;">
                <select id="vehicle-type-filter" class="input" style="width: 150px;">
                    <option value="all">All Vessels</option>
                    <option value="Container">Container</option>
                    <option value="Bulk">Bulk Carrier</option>
                    <option value="Tanker">Tanker</option>
                </select>
            </div>
            <button class="btn btn-primary" id="add-vehicle-btn">
                <i data-lucide="plus" style="width: 18px; height: 18px;"></i>
                Add Vessel
            </button>
        </div>

        <div class="data-table-container glass-card">
            <table id="vehicles-table">
                <thead>
                    <tr>
                        <th>Vessel Name</th>
                        <th>IMO Number</th>
                        <th>Type / Class</th>
                        <th>Max DWT (Tons)</th>
                        <th>Nautical Miles</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${vehicles.map(v => `
                        <tr>
                            <td>
                                <div style="font-weight: 600;">${v.name}</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted);">${v.region} Fleet</div>
                            </td>
                            <td><code>${v.plate}</code></td>
                            <td>${v.model}</td>
                            <td>${v.capacity.toLocaleString()} T</td>
                            <td>${v.odometer.toLocaleString()} nm</td>
                            <td><span class="pill pill-${getStatusColor(v.status)}">${v.status}</span></td>
                            <td>
                                <div style="display: flex; gap: 0.5rem;">
                                    <button class="btn-icon" title="Edit" onclick="openVehicleModal('${v.id}')">
                                        <i data-lucide="edit-3"></i>
                                    </button>
                                    <button class="btn-icon text-warning" title="Toggle Status" onclick="toggleRetire('${v.id}')">
                                        <i data-lucide="power"></i>
                                    </button>
                                    <button class="btn-icon text-danger" title="Delete" onclick="deleteVehicle('${v.id}')">
                                        <i data-lucide="trash-2"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Vessel Modal -->
        <div id="vehicle-modal" class="modal hidden">
            <div class="modal-content glass-card fade-in">
                <div class="modal-header">
                    <h3 id="modal-title">Register New Vessel</h3>
                    <button class="btn-close" onclick="closeVehicleModal()">&times;</button>
                </div>
                <form id="vehicle-form">
                    <input type="hidden" id="vehicle-id">
                    <div class="form-group">
                        <label class="label">Vessel Name</label>
                        <input type="text" id="v-name" class="input" required>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="label">Class/Model</label>
                            <input type="text" id="v-model" class="input" required>
                        </div>
                        <div class="form-group">
                            <label class="label">IMO Number</label>
                            <input type="text" id="v-plate" class="input" required>
                        </div>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="label">Type</label>
                            <select id="v-type" class="input">
                                <option value="Container">Container</option>
                                <option value="Bulk">Bulk Carrier</option>
                                <option value="Tanker">Tanker</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="label">Primary Fleet (Region)</label>
                            <input type="text" id="v-region" class="input" required>
                        </div>
                    </div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="label">Deadweight Tonnage (DWT)</label>
                            <input type="number" id="v-capacity" class="input" required>
                        </div>
                        <div class="form-group">
                            <label class="label">Total Nautical Miles</label>
                            <input type="number" id="v-odometer" class="input" required>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Save Vessel</button>
                </form>
            </div>
        </div>
    </div>

    <style>
    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    .search-filter {
        display: flex;
        gap: 1rem;
    }
    .btn-icon {
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0.25rem;
        transition: color 0.2s;
    }
    .btn-icon:hover {
        color: var(--text-main);
    }
    .btn-icon i {
        width: 18px;
        height: 18px;
    }

    /* Modal Styling */
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    .modal-content {
        width: 100%;
        max-width: 500px;
        padding: 2rem;
    }
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    .btn-close {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 1.5rem;
        cursor: pointer;
    }
    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    .hidden { display: none !important; }
    </style>
    `;
};

// Global scope functions
window.openVehicleModal = (id = null) => {
    const modal = document.getElementById('vehicle-modal');
    const form = document.getElementById('vehicle-form');
    const title = document.getElementById('modal-title');

    modal.classList.remove('hidden');
    form.reset();
    document.getElementById('vehicle-id').value = id || '';

    if (id) {
        title.textContent = 'Edit Vessel Data';
        const v = Store.getVehicleById(id);
        document.getElementById('v-name').value = v.name;
        document.getElementById('v-model').value = v.model;
        document.getElementById('v-plate').value = v.plate;
        document.getElementById('v-type').value = v.type;
        document.getElementById('v-region').value = v.region;
        document.getElementById('v-capacity').value = v.capacity;
        document.getElementById('v-odometer').value = v.odometer;
    } else {
        title.textContent = 'Register New Vessel';
    }
};

window.closeVehicleModal = () => {
    document.getElementById('vehicle-modal').classList.add('hidden');
};

window.toggleRetire = (id) => {
    const v = Store.getVehicleById(id);
    const newStatus = v.status === 'retired' ? 'available' : 'retired';
    Store.updateVehicleStatus(id, newStatus);
    App.navigate('vehicles');
};

window.deleteVehicle = (id) => {
    if (confirm('Are you sure you want to permanently delete this vessel? This action cannot be undone.')) {
        try {
            Store.deleteVehicle(id);
            App.navigate('vehicles');
        } catch (e) {
            alert(e.message);
        }
    }
};

App.pageInits.vehicles = () => {
    lucide.createIcons();

    const addBtn = document.getElementById('add-vehicle-btn');
    addBtn.onclick = () => openVehicleModal();

    const form = document.getElementById('vehicle-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById('vehicle-id').value;
        const data = {
            name: document.getElementById('v-name').value,
            model: document.getElementById('v-model').value,
            plate: document.getElementById('v-plate').value,
            type: document.getElementById('v-type').value,
            region: document.getElementById('v-region').value,
            capacity: parseInt(document.getElementById('v-capacity').value),
            odometer: parseInt(document.getElementById('v-odometer').value)
        };

        if (id) {
            Store.updateVehicle(id, data);
        } else {
            Store.addVehicle(data);
        }

        closeVehicleModal();
        App.navigate('vehicles');
    };

    // Filter logic
    const searchInput = document.getElementById('vehicle-search');
    const typeFilter = document.getElementById('vehicle-type-filter');
    const table = document.getElementById('vehicles-table');

    const filterTable = () => {
        const query = searchInput.value.toLowerCase();
        const type = typeFilter.value;
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const matchesSearch = text.includes(query);
            const matchesType = type === 'all' || text.includes(type.toLowerCase());
            row.style.display = (matchesSearch && matchesType) ? '' : 'none';
        });
    };

    searchInput.addEventListener('input', filterTable);
    typeFilter.addEventListener('change', filterTable);
};

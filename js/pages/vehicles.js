/**
 * Vessel Registry Page Component
 */

App.pages.vehicles = () => {
    const vehicles = Store.getVehicles();

    return `
    <div class="vehicles-page fade-in">
        <div class="split-layout">
            <!-- Registration Form Section -->
            <div class="registration-section glass-card">
                <div class="section-header">
                    <div class="logo-icon-small red"></div>
                    <h3>Vessel Registration</h3>
                </div>
                <form id="vehicle-form-split">
                    <input type="hidden" id="v-id">
                    <div class="form-group">
                        <label class="label">Vessel Name</label>
                        <input type="text" id="v-name" class="input" placeholder="Enter Vessel Name" required>
                    </div>
                    <div class="form-group">
                        <label class="label">Vessel Imei No</label>
                        <input type="text" id="v-plate" class="input" placeholder="Enter Imei No" required>
                    </div>
                    <div class="form-group">
                        <label class="label">Port of Registry</label>
                        <input type="text" id="v-region" class="input" placeholder="Enter Port" required>
                    </div>
                    <div class="form-group">
                        <label class="label">Vessel Description</label>
                        <textarea id="v-model" class="input" placeholder="Enter Description" style="height: 80px;"></textarea>
                    </div>
                    <div class="form-grid-small">
                        <div class="form-group">
                            <label class="label">Speed</label>
                            <input type="text" id="v-odometer" class="input" placeholder="Enter Speed">
                        </div>
                        <div class="form-group">
                            <label class="label">Status</label>
                            <select id="v-status" class="input">
                                <option value="available">Available</option>
                                <option value="on trip">On Trip</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" style="background: var(--success); flex: 1;">Save</button>
                        <button type="button" class="btn btn-outline" style="flex: 1;" onclick="App.navigate('dashboard')">Cancel</button>
                    </div>
                </form>
            </div>

            <!-- Table Section -->
            <div class="table-section glass-card">
                <div class="section-header">
                    <h3>Vehicle Registry (Summary)</h3>
                    <div class="search-box">
                         <input type="text" placeholder="Search..." class="input input-sm">
                    </div>
                </div>
                <div class="data-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Ship ID</th>
                                <th>Vessel</th>
                                <th>Imei</th>
                                <th>Property Converter</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${vehicles.map((v, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>#8322</td>
                                <td>${v.name}</td>
                                <td>${v.plate}</td>
                                <td>WCC12</td>
                                <td><span class="pill pill-${getStatusColor(v.status)}">${v.status}</span></td>
                                <td>
                                    <button class="btn-icon" onclick="deleteVehicle('${v.id}')"><i data-lucide="trash-2"></i></button>
                                </td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <style>
    .split-layout {
        display: grid;
        grid-template-columns: 350px 1fr;
        gap: 2rem;
        align-items: start;
    }
    .section-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    .logo-icon-small {
        width: 24px;
        height: 24px;
        border: 2px solid var(--primary);
        border-radius: 50%;
    }
    .logo-icon-small.red { border-color: var(--danger); }
    .form-grid-small {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    .input-sm { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
    .btn-icon { background: none; border: none; color: var(--text-muted); cursor: pointer; }
    .btn-icon:hover { color: var(--danger); }
    </style>
    `;
};

App.pageInits.vehicles = () => {
    lucide.createIcons();
    const form = document.getElementById('vehicle-form-split');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById('v-name').value,
            plate: document.getElementById('v-plate').value,
            region: document.getElementById('v-region').value,
            model: document.getElementById('v-model').value,
            odometer: parseInt(document.getElementById('v-odometer').value) || 0,
            status: document.getElementById('v-status').value,
            capacity: 0 // Default
        };
        Store.addVehicle(data);
        App.navigate('vehicles');
    });
};


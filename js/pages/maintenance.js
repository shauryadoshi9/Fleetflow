/**
 * Maintenance & Service Logging Page Component
 */

App.pages.maintenance = () => {
    const vehicles = Store.getVehicles();
    const serviceLogs = Store.getVehicles().filter(v => v.status === 'in shop');

    return `
    <div class="maintenance-page fade-in">
        <div class="split-layout">
            <!-- Logging Section -->
            <div class="logging-section glass-card">
                <div class="section-header">
                    <h3>Service & Maintenance Log</h3>
                </div>
                <form id="maintenance-form-new">
                    <div class="form-group">
                        <label class="label">Vessel</label>
                        <select id="m-vehicle" class="input" required>
                            <option value="">Select Vessel</option>
                            ${vehicles.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="label">Service Center / Port</label>
                        <input type="text" id="m-center" class="input" placeholder="Enter Facility Name">
                    </div>
                    <div class="form-group">
                        <label class="label">Work Description</label>
                        <textarea id="m-desc" class="input" placeholder="Describe service required" style="height: 100px;"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; background: var(--warning);">Initiate Service</button>
                </form>
            </div>

            <!-- Active Maintenance Section -->
            <div class="active-maintenance glass-card">
                <div class="section-header">
                    <h3>Active Service Logs</h3>
                </div>
                <div class="data-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Vessel</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${serviceLogs.length ? serviceLogs.map((v, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${v.name}</td>
                                <td><span class="pill pill-warning">In Shop</span></td>
                                <td>
                                    <button class="btn btn-sm btn-outline" onclick="releaseVehicle('${v.id}')">Release</button>
                                </td>
                            </tr>
                            `).join('') : '<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">No vessels in service</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <style>
    .split-layout { display: grid; grid-template-columns: 350px 1fr; gap: 2rem; }
    </style>
    `;
};

App.pageInits.maintenance = () => {
    lucide.createIcons();
    const form = document.getElementById('maintenance-form-new');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const vid = document.getElementById('m-vehicle').value;
        Store.updateVehicleStatus(vid, 'in shop');
        App.navigate('maintenance');
    });
};

window.releaseVehicle = (id) => {
    Store.updateVehicleStatus(id, 'available');
    App.navigate('maintenance');
};


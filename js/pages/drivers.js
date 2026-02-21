/**
 * Captain Profiles & Safety Page Component
 */

App.pages.drivers = () => {
    const drivers = Store.getDrivers();

    return `
    <div class="drivers-page fade-in">
        <div class="split-layout">
            <!-- Registration Section -->
            <div class="registration-section glass-card">
                <div class="section-header">
                    <div class="logo-icon-small red"></div>
                    <h3>Captain Registration</h3>
                </div>
                <form id="driver-form-split">
                    <div class="form-group">
                        <label class="label">Full Name</label>
                        <input type="text" id="d-name" class="input" placeholder="Enter Full Name" required>
                    </div>
                    <div class="form-group">
                        <label class="label">License MMSI</label>
                        <input type="text" id="d-license" class="input" placeholder="Enter MMSI-XXXX" required>
                    </div>
                    <div class="form-group">
                        <label class="label">License Expiry</label>
                        <input type="date" id="d-expiry" class="input" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" style="background: var(--success); width: 100%;">Save Captain</button>
                    </div>
                </form>
            </div>

            <!-- Table Section -->
            <div class="table-section glass-card">
                <div class="section-header">
                    <h3>Captain Profiles & Safety Compliance</h3>
                </div>
                <div class="data-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Driver</th>
                                <th>Trips</th>
                                <th>Safety Score</th>
                                <th>Compliance</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${drivers.map((d, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <div class="driver-avatar-sm">${d.name.charAt(0)}</div>
                                        <div style="font-weight: 600;">${d.name}</div>
                                    </div>
                                </td>
                                <td>${d.trips || 0}</td>
                                <td><span class="text-success" style="font-weight: 700;">${d.score}%</span></td>
                                <td><span class="pill pill-success">Active</span></td>
                                <td>
                                    <button class="btn-icon" onclick="deleteDriver('${d.id}')"><i data-lucide="trash-2"></i></button>
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
    .split-layout { display: grid; grid-template-columns: 350px 1fr; gap: 2rem; align-items: start; }
    .driver-avatar-sm {
        width: 32px; height: 32px; background: #f1f5f9; border: 1px solid var(--border);
        border-radius: 4px; display: flex; align-items: center; justify-content: center;
        font-weight: 700; font-size: 0.8rem;
    }
    .text-success { color: var(--success); }
    </style>
    `;
};

App.pageInits.drivers = () => {
    lucide.createIcons();
    const form = document.getElementById('driver-form-split');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('d-name').value,
                license: document.getElementById('d-license').value,
                expiry: document.getElementById('d-expiry').value
            };
            Store.addDriver(data);
            App.navigate('drivers');
        });
    }
};

window.deleteDriver = (id) => {
    if (confirm('Permanently remove this captain?')) {
        Store.deleteDriver(id);
        App.navigate('drivers');
    }
};


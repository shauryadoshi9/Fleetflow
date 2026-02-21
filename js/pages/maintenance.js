/**
 * Maintenance & Service Logs Page Component
 */

App.pages.maintenance = () => {
    const vehicles = Store.getVehicles();
    const maintenanceLogs = Store.data.expenses.filter(e => e.type === 'Maintenance');

    return `
    <div class="maintenance-page">
        <div class="maintenance-layout">
            <!-- Add Service Log Form -->
            <div class="log-form-container glass-card">
                <h3>Log Maintenance Service</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">
                    Logging a service will automatically set the vehicle to "In Shop".
                </p>
                <form id="maintenance-form">
                    <div class="form-group">
                        <label class="label">Select Vehicle</label>
                        <select id="maint-vehicle" class="input" required>
                            <option value="">Select Asset...</option>
                            ${vehicles.map(v => `
                                <option value="${v.id}">${v.name} (Current: ${v.status})</option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="label">Service Type</label>
                        <select id="maint-type" class="input" required>
                            <option value="Oil Change">Oil Change</option>
                            <option value="Tire Rotation">Tire Rotation</option>
                            <option value="Brake Pad Replacement">Brake Pad Replacement</option>
                            <option value="Engine Repair">Engine Repair</option>
                            <option value="General Inspection">General Inspection</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="label">Service Description</label>
                        <textarea id="maint-desc" class="input" style="height: 100px;" placeholder="Details of the service performed..."></textarea>
                    </div>

                    <div class="form-group">
                        <label class="label">Cost (₹)</label>
                        <input type="number" id="maint-cost" class="input" placeholder="0.00" required>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        <i data-lucide="wrench" style="width: 18px; height: 18px;"></i>
                        Record & Set "In Shop"
                    </button>
                </form>
            </div>

            <!-- Service History -->
            <div class="history-container glass-card">
                <div class="section-header">
                    <h3>Service History</h3>
                </div>
                <div class="data-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Vehicle</th>
                                <th>Service</th>
                                <th>Cost</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${maintenanceLogs.map(log => {
        const v = Store.getVehicleById(log.vehicleId);
        return `
                                <tr>
                                    <td>${log.date}</td>
                                    <td>${v ? v.name : 'Unknown'}</td>
                                    <td>
                                        <div style="font-weight: 500;">${log.description || 'Routine Maintenance'}</div>
                                    </td>
                                    <td style="font-weight: 600;">₹${log.amount}</td>
                                    <td>
                                        ${v && v.status === 'in shop' ? `
                                            <button class="btn btn-sm btn-outline" onclick="releaseFromShop('${v.id}')">Release</button>
                                        ` : '<span style="color: var(--text-muted); font-size: 0.8rem;">Completed</span>'}
                                    </td>
                                </tr>
                                `;
    }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <style>
    .maintenance-layout {
        display: grid;
        grid-template-columns: 380px 1fr;
        gap: 2rem;
    }
    </style>
    `;
};

window.releaseFromShop = (id) => {
    Store.updateVehicleStatus(id, 'available');
    App.navigate('maintenance');
};

App.pageInits.maintenance = () => {
    const form = document.getElementById('maintenance-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const vehicleId = document.getElementById('maint-vehicle').value;
        const amount = parseFloat(document.getElementById('maint-cost').value);
        const description = document.getElementById('maint-type').value + ": " + document.getElementById('maint-desc').value;

        // Add expense
        Store.data.expenses.push({
            id: 'e' + Date.now(),
            vehicleId,
            type: 'Maintenance',
            amount,
            description,
            date: new Date().toISOString().split('T')[0]
        });

        // Set status to In Shop
        Store.updateVehicleStatus(vehicleId, 'in shop');

        Store.save();
        App.navigate('maintenance');
    });
};

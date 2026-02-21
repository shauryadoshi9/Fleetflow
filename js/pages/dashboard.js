/**
 * Dashboard Page Component
 */

App.pages.dashboard = () => {
    const vehicles = Store.getVehicles();
    const trips = Store.getTrips().slice(0, 5); // Show latest 5

    // Exact KPIs from reference images
    const totalVehicles = 330;
    const waitInactive = 40;
    const runningShips = 52;

    return `
    <div class="dashboard fade-in">
        <div class="kpi-grid">
            <div class="kpi-card glass-card">
                <div class="kpi-label">Total Vehicles Register In Program</div>
                <div class="kpi-value">${totalVehicles}</div>
                <div class="kpi-icon-row">
                    <i data-lucide="truck" class="text-primary"></i>
                </div>
            </div>
            
            <div class="kpi-card glass-card">
                <div class="kpi-label">Wait / Inactive / Off-Duty / On Port</div>
                <div class="kpi-value text-danger">${waitInactive}</div>
                <div class="kpi-icon-row">
                    <i data-lucide="clock" class="text-danger"></i>
                </div>
            </div>

            <div class="kpi-card glass-card">
                <div class="kpi-label">Running Ships In Program</div>
                <div class="kpi-value text-success">${runningShips}</div>
                <div class="kpi-icon-row">
                    <i data-lucide="ship" class="text-success"></i>
                </div>
            </div>

            <div class="kpi-card glass-card intelligence-card">
                <div class="kpi-label">AI Intelligence Insight</div>
                <div class="intelligence-content">
                    ${(() => {
            const predictions = Store.getMaintenancePredictions();
            if (predictions.length > 0) {
                return `
                                <div class="intel-item text-danger">
                                    <i data-lucide="alert-circle"></i>
                                    <span>${predictions.length} Vessels Critical</span>
                                </div>
                            `;
            }
            return `
                            <div class="intel-item text-success">
                                <i data-lucide="check-circle"></i>
                                <span>Fleet Health: Optimal</span>
                            </div>
                        `;
        })()}
                    <div class="intel-item text-warning">
                        <i data-lucide="zap"></i>
                        <span>Smart Routing Active</span>
                    </div>
                </div>
                <div class="kpi-icon-row">
                    <i data-lucide="brain-circuit" class="text-warning"></i>
                </div>
            </div>
        </div>

        <div class="dashboard-content">
            <div class="glass-card">
                <div class="section-header">
                    <h3>Recent Fleet Activity</h3>
                </div>
                <div class="data-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Trip ID</th>
                                <th>Vehicle</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${trips.length > 0 ? trips.map(trip => `
                                <tr>
                                    <td>#${trip.id}</td>
                                    <td>${trip.vehicle ? trip.vehicle.name : 'Unknown Vessel'}</td>
                                    <td><span class="pill pill-${window.getStatusColor(trip.status)}">${trip.status}</span></td>
                                    <td><button class="btn btn-sm btn-outline view-details" data-id="${trip.id}">View</button></td>
                                </tr>
                            `).join('') : `
                                <tr>
                                    <td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-muted);">No recent activity found.</td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <style>
    .kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        margin-bottom: 2.5rem;
    }
    .kpi-card {
        padding: 1.5rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 160px;
    }
    .kpi-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-muted);
        margin-bottom: 0.75rem;
    }
    .kpi-value {
        font-size: 2.5rem;
        font-weight: 800;
        font-family: 'Outfit', sans-serif;
    }
    .intelligence-card { border: 1px solid rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.05); }
    .intelligence-content { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 0.75rem; }
    .intel-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; font-weight: 600; justify-content: center; }
    .intel-item i { width: 16px; height: 16px; }
    .kpi-icon-row {
        margin-top: 0.75rem;
        display: flex;
        justify-content: center;
    }
    .kpi-icon-row i {
        width: 32px;
        height: 32px;
    }
    .text-primary { color: var(--primary); }
    .text-success { color: var(--success); }
    .text-danger { color: var(--danger); }
    
    .section-header { margin-bottom: 1.5rem; }
    .btn-outline {
        background: transparent;
        border: 1px solid var(--border);
        color: var(--text-main);
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
    }
    </style>
    `;
};

App.pageInits.dashboard = () => {
    lucide.createIcons();

    // Add event listeners for view buttons
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tripId = e.currentTarget.dataset.id;
            const trips = Store.getTrips();
            const trip = trips.find(t => t.id === tripId);

            if (trip) {
                const content = `
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Trip ID</span>
                            <span class="detail-value">#${trip.id}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Status</span>
                            <span class="detail-value pill pill-${window.getStatusColor(trip.status)}">${trip.status}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Vessel</span>
                            <span class="detail-value">${trip.vehicle ? trip.vehicle.name : 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Captain</span>
                            <span class="detail-value">${trip.driver ? trip.driver.name : 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Cargo</span>
                            <span class="detail-value">${trip.cargo || 'General Cargo'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Weight</span>
                            <span class="detail-value">${trip.weight ? trip.weight.toLocaleString() : '0'} kg</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Origin</span>
                            <span class="detail-value">${trip.origin || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Destination</span>
                            <span class="detail-value">${trip.destination || 'N/A'}</span>
                        </div>
                        <div class="detail-item" style="grid-column: span 2;">
                            <span class="detail-label">Estimated Arrival</span>
                            <span class="detail-value">${trip.eta ? new Date(trip.eta).toLocaleString() : 'Pending'}</span>
                        </div>
                    </div>
                `;
                App.showModal(`Trip Details: #${trip.id}`, content);
            }
        });
    });
};



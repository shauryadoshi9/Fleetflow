/**
 * Dashboard Page Component
 */

App.pages.dashboard = () => {
    const vehicles = Store.getVehicles();
    const trips = Store.getTrips();

    // KPI Calculations
    const activeFleet = vehicles.filter(v => v.status === 'on trip').length;
    const inShop = vehicles.filter(v => v.status === 'in shop').length;
    const utilization = Math.round((activeFleet / vehicles.length) * 100);
    const pendingCargo = trips.filter(t => t.status === 'draft').length;

    return `
    <div class="dashboard">
        <!-- KPI Row -->
        <div class="kpi-grid">
            <div class="kpi-card glass-card">
                <div class="kpi-header">
                    <span class="kpi-label">Active Fleet</span>
                    <i data-lucide="truck" class="kpi-icon text-primary"></i>
                </div>
                <div class="kpi-value">${activeFleet}</div>
                <div class="kpi-subtext">Vehicles currently "On Trip"</div>
            </div>
            
            <div class="kpi-card glass-card">
                <div class="kpi-header">
                    <span class="kpi-label">Maintenance Alerts</span>
                    <i data-lucide="alert-triangle" class="kpi-icon text-danger"></i>
                </div>
                <div class="kpi-value">${inShop}</div>
                <div class="kpi-subtext">Vehicles marked "In Shop"</div>
            </div>

            <div class="kpi-card glass-card">
                <div class="kpi-header">
                    <span class="kpi-label">Utilization Rate</span>
                    <i data-lucide="activity" class="kpi-icon text-success"></i>
                </div>
                <div class="kpi-value">${utilization}%</div>
                <div class="kpi-subtext">Fleet assigned vs. idle</div>
            </div>

            <div class="kpi-card glass-card">
                <div class="kpi-header">
                    <span class="kpi-label">Pending Cargo</span>
                    <i data-lucide="package" class="kpi-icon text-warning"></i>
                </div>
                <div class="kpi-value">${pendingCargo}</div>
                <div class="kpi-subtext">Shipments waiting assignment</div>
            </div>
        </div>

        <!-- Charts / Overview Section -->
        <div class="dashboard-content">
            <div class="overview-section glass-card">
                <div class="section-header">
                    <h3>Recent Trips</h3>
                    <button class="btn btn-outline" onclick="App.navigate('trips')">View All</button>
                </div>
                <div class="data-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Trip ID</th>
                                <th>Vehicle</th>
                                <th>Driver</th>
                                <th>Cargo</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${trips.slice(0, 5).map(trip => `
                                <tr>
                                    <td>#${trip.id.slice(-4)}</td>
                                    <td>${trip.vehicle ? trip.vehicle.name : 'N/A'}</td>
                                    <td>${trip.driver ? trip.driver.name : 'N/A'}</td>
                                    <td>${trip.cargo}</td>
                                    <td><span class="pill pill-${trip.status === 'dispatched' ? 'info' : 'success'}">${trip.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="fleet-status glass-card">
                <h3>Fleet Mix</h3>
                <div class="chart-simulation">
                    <div class="chart-bar" style="height: 60%; background: var(--primary);" title="Trucks"></div>
                    <div class="chart-bar" style="height: 30%; background: var(--info);" title="Vans"></div>
                    <div class="chart-bar" style="height: 10%; background: var(--success);" title="Bikes"></div>
                </div>
                <div class="chart-legend">
                    <div class="legend-item"><span class="dot" style="background: var(--primary);"></span> Trucks (60%)</div>
                    <div class="legend-item"><span class="dot" style="background: var(--info);"></span> Vans (30%)</div>
                    <div class="legend-item"><span class="dot" style="background: var(--success);"></span> Bikes (10%)</div>
                </div>
            </div>
        </div>
    </div>

    <style>
    .kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    .kpi-card {
        padding: 1.5rem;
    }
    .kpi-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    .kpi-label {
        font-size: 0.85rem;
        color: var(--text-muted);
        font-weight: 500;
    }
    .kpi-icon {
        width: 24px;
        height: 24px;
    }
    .kpi-value {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.25rem;
        font-family: 'Outfit', sans-serif;
    }
    .kpi-subtext {
        font-size: 0.75rem;
        color: var(--text-muted);
    }
    .text-primary { color: var(--primary); }
    .text-success { color: var(--success); }
    .text-warning { color: var(--warning); }
    .text-danger { color: var(--danger); }

    .dashboard-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 1.5rem;
    }
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }
    .btn-outline {
        background: transparent;
        border: 1px solid var(--border);
        color: var(--text-main);
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
    }
    .btn-outline:hover {
        background: var(--border);
    }

    .chart-simulation {
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        height: 200px;
        margin: 2rem 0;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border);
    }
    .chart-bar {
        width: 30px;
        border-radius: 4px 4px 0 0;
        transition: height 0.5s ease;
    }
    .chart-legend {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
        color: var(--text-muted);
    }
    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }
    </style>
    `;
};

App.pageInits.dashboard = () => {
    // Analytics simulation or real-time data fetchers would go here
};

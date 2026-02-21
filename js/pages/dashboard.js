/**
 * Dashboard Page Component
 */

App.pages.dashboard = () => {
    const vehicles = Store.getVehicles();

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
                            <tr>
                                <td>#8722</td>
                                <td>Scania R450</td>
                                <td><span class="pill pill-info">On Trip</span></td>
                                <td><button class="btn btn-sm btn-outline">View</button></td>
                            </tr>
                            <tr>
                                <td>#8721</td>
                                <td>Volvo FH16</td>
                                <td><span class="pill pill-success">Completed</span></td>
                                <td><button class="btn btn-sm btn-outline">View</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <style>
    .kpi-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        margin-bottom: 2.5rem;
    }
    .kpi-card {
        padding: 2rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 180px;
    }
    .kpi-label {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-muted);
        margin-bottom: 1rem;
    }
    .kpi-value {
        font-size: 3.5rem;
        font-weight: 800;
        font-family: 'Outfit', sans-serif;
    }
    .kpi-icon-row {
        margin-top: 1rem;
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
};


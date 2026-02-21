/**
 * Operational Analytics & Financial Reports Page Component
 */

App.pages.analytics = () => {
    const vehicles = Store.getVehicles();

    // Global Metrics
    const totalFleetCost = Store.data.expenses.reduce((sum, e) => sum + e.amount, 0);
    const avgScore = Math.round(Store.getDrivers().reduce((sum, d) => sum + d.score, 0) / Store.getDrivers().length);

    return `
    <div class="analytics-page">
        <div class="analytics-header">
            <h3>Enterprise Financial Intelligence</h3>
            <div class="export-actions">
                <button class="btn btn-outline" onclick="exportData('csv')">
                    <i data-lucide="download" style="width: 16px;"></i> CSV Export
                </button>
                <button class="btn btn-primary" onclick="exportData('pdf')">
                    <i data-lucide="file-text" style="width: 16px;"></i> Generate PDF Report
                </button>
            </div>
        </div>

        <div class="analytics-row">
            <div class="grid-card glass-card">
                <span class="label">Total Fleet Spend</span>
                <div class="value">₹${totalFleetCost.toLocaleString()}</div>
                <div class="subtext">Cumulative Fuel & Maintenance</div>
            </div>
            <div class="grid-card glass-card">
                <span class="label">Average Safety Score</span>
                <div class="value">${avgScore}%</div>
                <div class="subtext text-success">Optimized Performance</div>
            </div>
        </div>

        <div class="detailed-analytics glass-card">
            <h3>Asset Efficiency & ROI</h3>
            <div class="data-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Vehicle ID</th>
                            <th>Fuel Efficiency</th>
                            <th>Operational ROI</th>
                            <th>Health Audit</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vehicles.map(v => {
        const stats = Store.getVehicleStats(v.id);
        // Simulated Revenue (Trips * fixed rate)
        const revenue = Store.getTrips().filter(t => t.vehicleId === v.id).length * 1500;
        const roi = revenue > 0 ? (((revenue - stats.totalOperationalCost) / 10000) * 100).toFixed(1) : '0'; // 10k is simulated acquisition amortized
        const fuelEff = (v.odometer / (stats.totalFuel / 100 || 1)).toFixed(2); // Simulated km/L

        return `
                            <tr>
                                <td><strong>${v.name}</strong></td>
                                <td>
                                    <div style="font-weight: 500;">${fuelEff} km/L</div>
                                    <div class="progress-bg"><div class="progress-fill" style="width: ${Math.min(parseFloat(fuelEff) * 5, 100)}%;"></div></div>
                                </td>
                                <td>
                                    <div class="roi-badge ${parseFloat(roi) > 0 ? 'pos' : 'neg'}">
                                        ${roi}% ROI
                                    </div>
                                </td>
                                <td><span class="pill pill-${stats.totalMaint > 500 ? 'warning' : 'success'}">${stats.totalMaint > 500 ? 'Needs Review' : 'Healthy'}</span></td>
                            </tr>
                            `;
    }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <style>
    .analytics-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    .export-actions { display: flex; gap: 1rem; }
    .analytics-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    .grid-card { padding: 1.5rem; text-align: center; }
    .grid-card .value { font-size: 2.5rem; font-weight: 800; margin: 0.5rem 0; color: var(--primary); }
    
    .progress-bg { height: 6px; width: 100%; background: var(--border); border-radius: 3px; margin-top: 5px; }
    .progress-fill { height: 100%; background: var(--info); border-radius: 3px; }
    
    .roi-badge {
        display: inline-block;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        font-weight: 700;
        font-size: 0.85rem;
    }
    .roi-badge.pos { background: rgba(16, 185, 129, 0.1); color: var(--success); }
    .roi-badge.neg { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
    </style>
    `;
};

window.exportData = (type) => {
    alert(`Exporting fleet analytics as ${type.toUpperCase()}... \n\n(Demo: File generation would occur here)`);
};

App.pageInits.analytics = () => {
    // Analytics specific triggers
};

/**
 * Operational Analytics & Financial Reports Page Component
 */

App.pages.analytics = () => {
    const vehicles = Store.getVehicles();
    const totalFleetCost = Store.data.expenses.reduce((sum, e) => sum + e.amount, 0);
    const avgScore = Math.round(Store.getDrivers().reduce((sum, d) => sum + d.score, 0) / Store.getDrivers().length);

    return `
    <div class="analytics-page fade-in">
        <!-- New Analytics Graph -->
        <div class="graph-section glass-card" style="margin-bottom: 2rem;">
            <div class="section-header">
                <h3>Weekly Operational Spend</h3>
            </div>
            <div class="chart-container">
                <div class="bar-chart">
                    <div class="bar-group">
                        <div class="bar" style="height: 40%;"><span>40k</span></div>
                        <label>Mon</label>
                    </div>
                    <div class="bar-group">
                        <div class="bar" style="height: 65%;"><span>65k</span></div>
                        <label>Tue</label>
                    </div>
                    <div class="bar-group">
                        <div class="bar" style="height: 80%;"><span>80k</span></div>
                        <label>Wed</label>
                    </div>
                    <div class="bar-group">
                        <div class="bar highlight" style="height: 95%;"><span>95k</span></div>
                        <label>Thu</label>
                    </div>
                    <div class="bar-group">
                        <div class="bar" style="height: 55%;"><span>55k</span></div>
                        <label>Fri</label>
                    </div>
                    <div class="bar-group">
                        <div class="bar" style="height: 30%;"><span>30k</span></div>
                        <label>Sat</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="kpi-grid">
            <div class="kpi-card glass-card">
                <div class="kpi-label">Enterprise Financial Intelligence</div>
                <div class="kpi-value">₹${totalFleetCost.toLocaleString()}</div>
                <div class="kpi-subtext">Total Fleet spend</div>
            </div>
            <div class="kpi-card glass-card">
                <div class="kpi-label">Average Safety Score</div>
                <div class="kpi-value text-success">${avgScore}%</div>
                <div class="kpi-subtext">Optimized performance</div>
            </div>
        </div>

        <div class="detailed-analytics glass-card" style="margin-top: 2rem;">
            <div class="section-header">
                <h3>Asset Efficiency & ROI</h3>
            </div>
            <div class="data-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Ship ID</th>
                            <th>Fuel Efficiency</th>
                            <th>Operational ROI</th>
                            <th>Health Audit</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vehicles.map(v => {
        const stats = Store.getVehicleStats(v.id);
        const fuelEff = (v.odometer / (stats.totalFuel / 100 || 1)).toFixed(2);

        return `
                        <tr>
                            <td><strong>${v.name}</strong></td>
                            <td>${fuelEff} km/L</td>
                            <td><span class="pill pill-success">High ROI</span></td>
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
    .kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .kpi-card { padding: 2rem; text-align: center; }
    .kpi-label { font-size: 1rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.5rem; }
    .kpi-value { font-size: 3rem; font-weight: 800; color: var(--primary); }
    .kpi-subtext { font-size: 0.85rem; color: var(--text-muted); }
    .text-success { color: var(--success); }
    </style>
    `;
};

App.pageInits.analytics = () => {
    lucide.createIcons();
};


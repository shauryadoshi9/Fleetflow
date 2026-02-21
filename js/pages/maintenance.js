/**
 * Maintenance & Service Logging Page Component
 */

App.pages.maintenance = () => {
    const vehicles = Store.getVehicles();
    const serviceLogs = Store.getVehicles().filter(v => v.status === 'in shop');

    return `
    <div class="maintenance-page fade-in">
        <div class="insights-row" style="margin-bottom: 2rem;">
            <div class="glass-card predictive-card">
                <div class="section-header">
                    <i data-lucide="brain-circuit" class="icon-warning"></i>
                    <h3>Predictive Maintenance Insights</h3>
                </div>
                <div class="insights-grid">
                    ${Store.getMaintenancePredictions().map(p => `
                        <div class="insight-item">
                            <span class="vessel-name">${p.name}</span>
                            <span class="prediction-tag tag-${p.health.status}">
                                <i data-lucide="alert-triangle"></i> 
                                Next Service: ~${p.health.nextServiceIn.toLocaleString()} NM
                            </span>
                        </div>
                    `).join('') || '<p class="text-muted">All vessels are operating within safety parameters.</p>'}
                </div>
            </div>
        </div>

        <div class="split-layout">
            <!-- Logging Section -->
            <div class="logging-section glass-card">
                <div class="section-header">
                    <i data-lucide="clipboard-list"></i>
                    <h3>Service & Maintenance Log</h3>
                </div>
                <form id="maintenance-form-new">
                    <div class="form-group">
                        <label class="label">Vessel</label>
                        <select id="m-vehicle" class="input" required>
                            <option value="">Select Vessel</option>
                            ${vehicles.map(v => {
        const health = Store.getVehicleHealth(v.id);
        return `<option value="${v.id}">${v.name} (${health.score}% Health)</option>`;
    }).join('')}
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
                    <button type="submit" class="btn btn-primary" style="width: 100%; background: var(--warning);">
                        <i data-lucide="play" class="btn-icon"></i> Initiate Service
                    </button>
                </form>
            </div>

            <!-- Active Maintenance Section -->
            <div class="active-maintenance glass-card">
                <div class="section-header">
                    <i data-lucide="activity"></i>
                    <h3>Active Service Logs</h3>
                </div>
                <div class="data-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Vessel</th>
                                <th>Health Score</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${serviceLogs.length ? serviceLogs.map((v, index) => {
        const health = Store.getVehicleHealth(v.id);
        return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${v.name}</td>
                                    <td>
                                        <div class="health-bar-container">
                                            <div class="health-bar ${health.status}" style="width: ${health.score}%"></div>
                                            <span class="health-text">${health.score}%</span>
                                        </div>
                                    </td>
                                    <td><span class="pill pill-warning">In Shop</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-outline" onclick="releaseVehicle('${v.id}')">Release</button>
                                    </td>
                                </tr>
                                `;
    }).join('') : '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No vessels in service</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <style>
    .split-layout { display: grid; grid-template-columns: 350px 1fr; gap: 2rem; }
    .insights-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .insight-item { background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; display: flex; flex-direction: column; gap: 0.5rem; border: 1px solid rgba(255,255,255,0.1); }
    .prediction-tag { font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid transparent; }
    .tag-critical { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }
    .tag-warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border-color: rgba(245, 158, 11, 0.2); }
    .health-bar-container { width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; position: relative; }
    .health-bar { height: 100%; transition: width 0.3s ease; }
    .health-bar.healthy { background: var(--success); }
    .health-bar.warning { background: var(--warning); }
    .health-bar.critical { background: var(--danger); }
    .health-text { position: absolute; top: -12px; right: 0; font-size: 0.7rem; color: var(--text-muted); }
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


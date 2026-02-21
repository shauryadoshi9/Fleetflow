/**
 * Maritime Dispatch Page Component
 */

App.pages.trips = () => {
    const trips = Store.getTrips();
    const availableShips = Store.getVehicles().filter(v => v.status === 'available');

    return `
    <div class="trips-page fade-in">
        <div class="dispatch-layout">
            <!-- Dispatch Selection Area -->
            <div class="dispatch-controls glass-card">
                <h3>Authorize New Shipment</h3>
                <form id="dispatch-form-new">
                    <div class="form-group">
                        <label class="label">Vessel Name</label>
                        <select id="t-vehicle" class="input" required>
                            <option value="">Select Vessel</option>
                            ${availableShips.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-grid-small">
                        <div class="form-group">
                            <label class="label">Source / Port</label>
                            <input type="text" id="t-origin" class="input" placeholder="Origin Port">
                        </div>
                        <div class="form-group">
                            <label class="label">Destination / Port</label>
                            <input type="text" id="t-dest" class="input" placeholder="Dest Port">
                        </div>
                    </div>
                    
                    <div class="optimization-zone glass-card-inner" id="route-optimization-box" style="display: none; margin-bottom: 1rem;">
                        <div class="opt-header">
                            <i data-lucide="sparkles" class="text-warning"></i>
                            <span class="text-warning" style="font-weight: 700; font-size: 0.8rem;">SMART ROUTE CALCULATION</span>
                        </div>
                        <div id="route-details" style="font-size: 0.85rem; margin-top: 0.5rem;">
                            <!-- Dynamic route content -->
                        </div>
                    </div>

                    <div class="form-actions-row" style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <button type="button" id="btn-optimize" class="btn btn-outline" style="flex: 1;">
                            <i data-lucide="map"></i> AI Route
                        </button>
                        <button type="submit" class="btn btn-primary" style="flex: 2;">
                            <i data-lucide="anchor"></i> Authorize Dispatch
                        </button>
                    </div>

                    <div class="form-group">
                        <label class="label">Scheduled Arrival / Date</label>
                        <input type="datetime-local" id="t-eta" class="input">
                    </div>
                    <div class="form-group">
                        <label class="label">Instruction for Lead / Driver</label>
                        <textarea id="t-cargo" class="input" placeholder="Enter Instructions"></textarea>
                    </div>
                </form>
            </div>

            <!-- List Area -->
            <div class="trips-list glass-card">
                <div class="section-header">
                    <h3>Active Global Shipments</h3>
                    <div class="search-box">
                        <input type="text" placeholder="Filter..." class="input input-sm">
                    </div>
                </div>
                <div class="data-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Ship ID</th>
                                <th>Vessel</th>
                                <th>Source/Port</th>
                                <th>Dest/Port</th>
                                <th>Status</th>
                                <th>Time Left</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                             ${trips.length ? trips.map(t => {
        const tripId = t.id.toString().startsWith('t') ? t.id.slice(-4) : t.id;
        return `
                                <tr>
                                    <td>#${tripId}</td>
                                    <td>${t.vehicle ? t.vehicle.name : 'N/A'}</td>
                                    <td>${t.origin}</td>
                                    <td>${t.destination}</td>
                                    <td><span class="pill pill-${getStatusColor(t.status)}">${t.status}</span></td>
                                    <td class="${t.status === 'dispatched' ? 'countdown' : ''}" data-eta="${t.eta}">
                                        ${t.status === 'cancelled' ? '<span class="text-danger" style="font-weight:700;">Canceled</span>' :
                t.status === 'arrived' ? '<span class="text-success" style="font-weight:700;">Arrived</span>' : 'Calculating...'}
                                    </td>
                                    <td>
                                        ${t.status === 'dispatched' ? `
                                            <button class="btn btn-sm btn-outline" onclick="cancelTrip('${t.id}')">Abort</button>
                                        ` : '<span style="color: var(--text-muted); font-size: 0.8rem;">-</span>'}
                                    </td>
                                </tr>
                                `;
    }).join('') : '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No active shipments</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <style>
    .dispatch-layout {
        display: grid;
        grid-template-columns: 350px 1fr;
        gap: 2rem;
        align-items: start;
    }
    .form-grid-small { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .input-sm { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
    .btn-sm { padding: 0.3rem 0.6rem; font-size: 0.75rem; }
    .glass-card-inner { background: rgba(255, 255, 255, 0.05); border: 1px dashed rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 1rem; }
    .opt-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
    .route-path { color: var(--text-muted); font-family: monospace; }
    .stat-badge { font-size: 0.75rem; padding: 0.1rem 0.4rem; border-radius: 4px; background: rgba(255, 255, 255, 0.1); margin-right: 0.4rem; }
    </style>
    `;
};

App.pageInits.trips = () => {
    lucide.createIcons();

    const updateCountdowns = () => {
        document.querySelectorAll('.countdown').forEach(el => {
            const eta = new Date(el.dataset.eta);
            const now = new Date();
            const diff = eta - now;

            if (diff <= 0) {
                el.innerHTML = '<span class="text-success" style="font-weight:700;">Arrived</span>';
                el.classList.remove('countdown'); // Stop updating this element
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            let timeStr = "";
            if (days > 0) timeStr += `${days}d `;
            if (hours > 0 || days > 0) timeStr += `${hours}h `;
            timeStr += `${mins}m ${secs}s`;

            el.textContent = timeStr;
        });
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);

    // Safer cleanup: check current page hash before continuing
    const originalNavigate = App.navigate;
    App.navigate = function (pageId) {
        clearInterval(interval);
        console.log('Cleanup Interval for Trips');
        App.navigate = originalNavigate;
        return originalNavigate.apply(this, arguments);
    };

    const optBtn = document.getElementById('btn-optimize');
    optBtn.addEventListener('click', () => {
        const origin = document.getElementById('t-origin').value;
        const dest = document.getElementById('t-dest').value;

        if (!origin || !dest) {
            alert('Please specify origin and destination first.');
            return;
        }

        const route = Store.getOptimizedRoute(origin, dest);
        const optBox = document.getElementById('route-optimization-box');
        const details = document.getElementById('route-details');

        details.innerHTML = `
            <div style="margin-bottom: 0.5rem;">
                <span class="stat-badge">Time Saved: ${route.timeSaved}</span>
                <span class="stat-badge">Risk: ${route.risk}</span>
            </div>
            <div class="route-path">
                ${route.path.join(' ➔ ')}
            </div>
        `;

        optBox.style.display = 'block';
        lucide.createIcons();
    });

    const form = document.getElementById('dispatch-form-new');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            vehicleId: document.getElementById('t-vehicle').value,
            driverId: Store.getDrivers()[0]?.id, // Default to first for demo
            origin: document.getElementById('t-origin').value,
            destination: document.getElementById('t-dest').value,
            eta: document.getElementById('t-eta').value,
            cargo: document.getElementById('t-cargo').value,
            weight: 0 // Default
        };
        Store.createTrip(data);
        App.navigate('trips');
    });
};

window.cancelTrip = (id) => {
    if (confirm('Abort this shipment?')) {
        Store.cancelTrip(id);
        App.navigate('trips');
    }
};


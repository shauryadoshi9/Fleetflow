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
                    <div class="form-group">
                        <label class="label">Scheduled Arrival / Date</label>
                        <input type="datetime-local" id="t-eta" class="input">
                    </div>
                    <div class="form-group">
                        <label class="label">Instruction for Lead / Driver</label>
                        <textarea id="t-cargo" class="input" placeholder="Enter Instructions"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem;">Authorize Dispatch</button>
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
                            ${trips.length ? trips.map(t => `
                            <tr>
                                <td>#8322</td>
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
                            `).join('') : '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No active shipments</td></tr>'}
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

    // Cleanup interval on next navigation
    const originalNavigate = App.navigate;
    App.navigate = function (pageId) {
        clearInterval(interval);
        App.navigate = originalNavigate;
        return originalNavigate.apply(this, arguments);
    };

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


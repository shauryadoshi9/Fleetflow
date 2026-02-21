/**
 * Maritime Dispatch Page Component
 */

App.pages.trips = () => {
    const trips = Store.getTrips();
    const availableShips = Store.getVehicles().filter(v => v.status === 'available');
    const availableCaptains = Store.getDrivers().filter(d => d.status === 'on duty');

    return `
    <div class="trips-page">
        <div class="dispatch-layout">
            <!-- Create Trip Form -->
            <div class="dispatch-form-container glass-card">
                <h3>New Shipping Dispatch</h3>
                <form id="dispatch-form" class="dispatch-form">
                    <div class="form-group">
                        <label class="label">Cargo Description</label>
                        <input type="text" id="cargo-desc" class="input" placeholder="e.g. Industrial Equipment" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="label">Cargo Weight (Metric Tons)</label>
                        <input type="number" id="cargo-weight" class="input" placeholder="5000" required>
                    </div>

                    <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="label">Origin Port</label>
                            <input type="text" id="trip-origin" class="input" placeholder="Singapore (SGSIN)" required>
                        </div>
                        <div class="form-group">
                            <label class="label">Destination Port</label>
                            <input type="text" id="trip-dest" class="input" placeholder="Rotterdam (NLRTM)" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="label">ETA (Full Date & Time)</label>
                        <input type="datetime-local" id="trip-eta" class="input" required>
                    </div>

                    <div class="form-group">
                        <label class="label">Assign Vessel</label>
                        <select id="select-vehicle" class="input" required>
                            <option value="">Choose Available Ship...</option>
                            ${availableShips.map(v => `
                                <option value="${v.id}">${v.name} (${v.type} - ${v.capacity.toLocaleString()}kg)</option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="label">Assign Captain</label>
                        <select id="select-driver" class="input" required>
                            <option value="">Choose On-Duty Captain...</option>
                            ${availableCaptains.map(d => `
                                <option value="${d.id}">${d.name} (MMSI: ${d.license})</option>
                            `).join('')}
                        </select>
                    </div>

                    <div id="validation-errors" class="error-msg hidden"></div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                        <i data-lucide="anchor" style="width: 18px; height: 18px;"></i>
                        Authorize Shipment
                    </button>
                </form>
            </div>

            <!-- Active Trips Table -->
            <div class="trips-list-container glass-card">
                <div class="section-header">
                    <h3>Active Global Shipments</h3>
                </div>
                <div class="data-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Voyage / Date</th>
                                <th>Vessel & Captain</th>
                                <th>Route (Origin &rarr; Dest)</th>
                                <th>Delivery Countdown</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${trips.map(t => {
        // Enhanced Countdown Logic
        const now = new Date();
        const eta = new Date(t.eta);
        const diff = eta - now;

        let countdownStr = '-';
        if (t.status === 'dispatched' && diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            countdownStr = `${days}d ${hours}h ${mins}m`;
        } else if (t.status === 'dispatched' && diff <= 0) {
            countdownStr = 'Delayed / Arriving';
        }

        return `
                                <tr>
                                    <td>
                                        <div style="font-weight: 600;">#${t.id.slice(-4)}</div>
                                        <div style="font-size: 0.7rem; color: var(--text-muted);">${t.date}</div>
                                    </td>
                                    <td>
                                        <div style="font-weight: 500;">${t.vehicle ? t.vehicle.name : 'Unknown'}</div>
                                        <div style="font-size: 0.75rem; color: var(--text-muted);">${t.driver ? t.driver.name : 'Unknown'}</div>
                                    </td>
                                    <td>
                                        <div style="color: var(--primary); font-weight: 600; font-size: 0.85rem;">${t.origin}</div>
                                        <div style="font-size: 0.7rem; opacity: 0.6;">&darr;</div>
                                        <div style="color: var(--success); font-weight: 600; font-size: 0.85rem;">${t.destination}</div>
                                    </td>
                                    <td>
                                        <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 2px;">Estimated Time Left:</div>
                                        <div class="countdown-value ${diff < (1000 * 60 * 60 * 24) ? 'critical' : ''}">${countdownStr}</div>
                                        <div class="progress-bg"><div class="progress-fill" style="width: ${t.status === 'completed' ? 100 : Math.max(10, Math.min(100, 100 - (diff / (1000 * 60 * 60 * 24 * 30) * 100)))}%"></div></div>
                                    </td>
                                    <td><span class="pill pill-${getStatusColor(t.status)}">${t.status}</span></td>
                                    <td>
                                        <div style="display: flex; gap: 0.5rem;">
                                            ${t.status === 'dispatched' ? `
                                                <button class="btn btn-sm btn-outline" onclick="completeTrip('${t.id}')">Docked</button>
                                                <button class="btn btn-sm btn-outline text-danger" onclick="cancelTrip('${t.id}')">Abort</button>
                                            ` : t.status === 'completed' ? `
                                                <span style="color: var(--success); font-size: 0.8rem;">✓ Delivered</span>
                                            ` : `
                                                <span style="color: var(--text-muted); font-size: 0.8rem;">${t.status}</span>
                                            `}
                                        </div>
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
    .dispatch-layout {
        display: grid;
        grid-template-columns: 400px 1fr;
        gap: 2rem;
        align-items: start;
    }
    .dispatch-form h3 { margin-bottom: 1.5rem; }
    .error-msg {
        color: var(--danger);
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid var(--danger);
        padding: 0.75rem;
        border-radius: var(--radius-md);
        font-size: 0.85rem;
        margin-top: 1rem;
    }
    .hidden { display: none; }
    .btn-sm { padding: 0.25rem 0.75rem; font-size: 0.75rem; }
    
    .countdown-value { font-weight: 700; font-size: 0.95rem; color: var(--text-main); }
    .countdown-value.critical { color: var(--warning); }
    
    .progress-bg { height: 4px; width: 100px; background: var(--border); border-radius: 2px; margin-top: 4px; }
    .progress-fill { height: 100%; background: var(--primary); border-radius: 2px; }
    </style>
    `;
};

window.completeTrip = (id) => {
    const trips = Store.getTrips();
    const trip = trips.find(t => t.id === id);
    if (trip) {
        trip.status = 'completed';
        Store.updateVehicleStatus(trip.vehicleId, 'available');
        const driver = Store.getDriverById(trip.driverId);
        if (driver) driver.status = 'on duty';
        Store.save();
        App.navigate('trips');
    }
};

window.cancelTrip = (id) => {
    if (confirm('Are you sure you want to abort this shipment? Vessel will return to port.')) {
        if (Store.cancelTrip(id)) {
            App.navigate('trips');
        }
    }
};

App.pageInits.trips = () => {
    const form = document.getElementById('dispatch-form');
    const errorDiv = document.getElementById('validation-errors');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            errorDiv.classList.add('hidden');

            try {
                const tripData = {
                    cargo: document.getElementById('cargo-desc').value,
                    weight: parseInt(document.getElementById('cargo-weight').value),
                    origin: document.getElementById('trip-origin').value,
                    destination: document.getElementById('trip-dest').value,
                    eta: document.getElementById('trip-eta').value,
                    vehicleId: document.getElementById('select-vehicle').value,
                    driverId: document.getElementById('select-driver').value
                };

                Store.createTrip(tripData);
                App.navigate('trips');
            } catch (error) {
                errorDiv.textContent = error.message;
                errorDiv.classList.remove('hidden');
            }
        });
    }
};

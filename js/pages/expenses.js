/**
 * Expense & Fuel Logging Page Component
 */

App.pages.expenses = () => {
    const vehicles = Store.getVehicles();
    const allExpenses = Store.data.expenses;

    return `
    <div class="expenses-page fade-in">
        <div class="split-layout">
            <!-- Logging Section -->
            <div class="logging-section glass-card">
                <div class="section-header">
                    <h3>Asset Expense & Fuel Log</h3>
                </div>
                <form id="fuel-form-new">
                    <div class="form-group">
                        <label class="label">Vessel</label>
                        <select id="f-vehicle" class="input" required>
                            <option value="">Select Vessel</option>
                            ${vehicles.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="label">Fuel Liters</label>
                        <input type="number" id="f-liters" class="input" placeholder="Liters" required>
                    </div>
                    <div class="form-group">
                        <label class="label">Total Amount (₹)</label>
                        <input type="number" id="f-amount" class="input" placeholder="₹ Amount" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Record Expense</button>
                </form>
            </div>

            <!-- History Section -->
            <div class="history-section glass-card">
                <div class="section-header">
                    <h3>Recent Financial Logs</h3>
                </div>
                <div class="data-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Vessel</th>
                                <th>Type</th>
                                <th>Amt (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allExpenses.slice().reverse().map(e => {
        const v = Store.getVehicleById(e.vehicleId);
        return `
                            <tr>
                                <td>${e.date}</td>
                                <td>${v ? v.name : 'Unknown'}</td>
                                <td><span class="pill pill-info">${e.type}</span></td>
                                <td style="font-weight: 700;">₹${e.amount}</td>
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
    .split-layout { display: grid; grid-template-columns: 350px 1fr; gap: 2rem; }
    </style>
    `;
};

App.pageInits.expenses = () => {
    lucide.createIcons();
    const form = document.getElementById('fuel-form-new');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const vid = document.getElementById('f-vehicle').value;
            const amount = parseFloat(document.getElementById('f-amount').value);
            const liters = parseFloat(document.getElementById('f-liters').value);

            Store.data.expenses.push({
                id: 'e' + Date.now(),
                vehicleId: vid,
                type: 'Fuel',
                amount,
                liters,
                date: new Date().toISOString().split('T')[0]
            });
            Store.save();
            App.navigate('expenses');
        });
    }
};


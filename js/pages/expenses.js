/**
 * Expense & Fuel Logging Page Component
 */

App.pages.expenses = () => {
    const vehicles = Store.getVehicles();
    const allExpenses = Store.data.expenses;

    return `
    <div class="expenses-page">
        <div class="expense-overview-grid">
            ${vehicles.map(v => {
        const stats = Store.getVehicleStats(v.id);
        return `
                <div class="asset-cost-card glass-card">
                    <div class="asset-info">
                        <strong>${v.name}</strong>
                        <span class="pill pill-info" style="font-size: 0.65rem;">${v.plate}</span>
                    </div>
                    <div class="cost-breakdown">
                        <div class="cost-item">
                            <span>Fuel</span>
                            <span>₹${stats.totalFuel}</span>
                        </div>
                        <div class="cost-item">
                            <span>Maint.</span>
                            <span>₹${stats.totalMaint}</span>
                        </div>
                        <div class="cost-total">
                            <span>Total Op. Cost</span>
                            <span>₹${stats.totalOperationalCost}</span>
                        </div>
                    </div>
                </div>
                `;
    }).join('')}
        </div>

        <div class="expense-actions-row">
            <div class="glass-card" style="flex: 1;">
                <h3>Log Fuel Consumption</h3>
                <form id="fuel-form" class="inline-form">
                    <select id="fuel-vehicle" class="input" required>
                        <option value="">Vehicle...</option>
                        ${vehicles.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
                    </select>
                    <input type="number" id="fuel-liters" class="input" placeholder="Liters" required>
                    <input type="number" id="fuel-cost" class="input" placeholder="Cost (₹)" required>
                    <button type="submit" class="btn btn-primary">Record Fuel</button>
                </form>
            </div>
        </div>

        <div class="data-table-container glass-card" style="margin-top: 2rem;">
            <h3>Recent Financial Logs</h3>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Asset</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${allExpenses.slice().reverse().map(e => {
        const v = Store.getVehicleById(e.vehicleId);
        return `
                        <tr>
                            <td>${e.date}</td>
                            <td>${v ? v.name : 'Unknown'}</td>
                            <td><span class="pill pill-${e.type === 'Fuel' ? 'info' : 'warning'}">${e.type}</span></td>
                            <td>${e.description || (e.liters ? e.liters + ' Liters' : '-')}</td>
                            <td style="font-weight: 600;">₹${e.amount}</td>
                        </tr>
                        `;
    }).join('')}
                </tbody>
            </table>
        </div>
    </div>

    <style>
    .expense-overview-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    .asset-cost-card {
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .asset-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--border);
        padding-bottom: 0.75rem;
    }
    .cost-breakdown {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .cost-item {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: var(--text-muted);
    }
    .cost-total {
        display: flex;
        justify-content: space-between;
        font-weight: 700;
        margin-top: 0.5rem;
        color: var(--text-main);
        border-top: 1px dashed var(--border);
        padding-top: 0.5rem;
    }
    .inline-form {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }
    </style>
    `;
};

App.pageInits.expenses = () => {
    const fuelForm = document.getElementById('fuel-form');
    fuelForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const vehicleId = document.getElementById('fuel-vehicle').value;
        const liters = parseFloat(document.getElementById('fuel-liters').value);
        const amount = parseFloat(document.getElementById('fuel-cost').value);

        Store.data.expenses.push({
            id: 'e' + Date.now(),
            vehicleId,
            type: 'Fuel',
            amount,
            liters,
            date: new Date().toISOString().split('T')[0]
        });

        Store.save();
        App.navigate('expenses');
    });
};

/**
 * FleetHub Data Store - Maritime Edition
 * Handles LocalStorage persistence and maritime logistics simulation.
 */

const Store = {
    // Initial State / Seed Data (Maritime)
    defaults: {
        vehicles: [
            { id: 'v1', name: 'Oceanic Voyager', model: 'Container Ship', plate: 'IMO 9876543', capacity: 500000, odometer: 125000, status: 'available', type: 'Container', region: 'Atlantic' },
            { id: 'v2', name: 'Sea Stallion', model: 'Bulk Carrier', plate: 'IMO 1234567', capacity: 300000, odometer: 85000, status: 'on trip', type: 'Bulk', region: 'Pacific' },
            { id: 'v3', name: 'Blue Whale', model: 'VLCC Tanker', plate: 'IMO 5566778', capacity: 2000000, odometer: 42000, status: 'in shop', type: 'Tanker', region: 'Indian' }
        ],
        drivers: [
            { id: 'd1', name: 'Capt. Alex Morgan', license: 'MMSI-9872', expiry: '2026-12-01', status: 'on trip', score: 98, trips: 42 },
            { id: 'd2', name: 'Capt. Sarah Jenkins', license: 'MMSI-1234', expiry: '2025-06-15', status: 'on duty', score: 85, trips: 28 },
            { id: 'd3', name: 'Capt. Mike Miller', license: 'MMSI-5544', expiry: '2023-11-10', status: 'off duty', score: 92, trips: 35 }
        ],
        trips: [
            { id: 't1', vehicleId: 'v2', driverId: 'd1', cargo: 'Grain', weight: 250000, status: 'dispatched', date: '2026-02-15', origin: 'Shanghai, CH', destination: 'Los Angeles, US', eta: '2026-03-12T14:00' }
        ],
        expenses: [
            { id: 'e1', vehicleId: 'v1', type: 'Fuel', amount: 45000, liters: 50000, date: '2024-03-15' },
            { id: 'e2', vehicleId: 'v3', type: 'Maintenance', amount: 15000, date: '2024-03-18', description: 'Engine Overhaul' }
        ],
        currentUser: null
    },

    // Initialization
    init() {
        if (!localStorage.getItem('fleethub_data')) {
            localStorage.setItem('fleethub_data', JSON.stringify(this.defaults));
        }
        this.data = JSON.parse(localStorage.getItem('fleethub_data'));
    },

    // Save current state
    save() {
        localStorage.setItem('fleethub_data', JSON.stringify(this.data));
    },

    // --- Vessel (Vehicle) Operations ---
    getVehicles() { return this.data.vehicles; },
    getVehicleById(id) { return this.data.vehicles.find(v => v.id === id); },
    updateVehicleStatus(id, status) {
        const vehicle = this.getVehicleById(id);
        if (vehicle) {
            vehicle.status = status;
            this.save();
        }
    },
    addVehicle(vehicleData) {
        const newVehicle = {
            id: 'v' + Date.now(),
            ...vehicleData,
            status: 'available'
        };
        this.data.vehicles.push(newVehicle);
        this.save();
        return newVehicle;
    },
    updateVehicle(id, vehicleData) {
        const index = this.data.vehicles.findIndex(v => v.id === id);
        if (index !== -1) {
            this.data.vehicles[index] = { ...this.data.vehicles[index], ...vehicleData };
            this.save();
            return this.data.vehicles[index];
        }
    },

    // --- Captain (Driver) Operations ---
    getDrivers() { return this.data.drivers; },
    getDriverById(id) { return this.data.drivers.find(d => d.id === id); },
    isLicenseValid(driverId) {
        const driver = this.getDriverById(driverId);
        if (!driver) return false;
        return new Date(driver.expiry) > new Date();
    },
    addDriver(driverData) {
        const newDriver = {
            id: 'd' + Date.now(),
            ...driverData,
            status: 'off duty',
            trips: 0,
            score: 100
        };
        this.data.drivers.push(newDriver);
        this.save();
        return newDriver;
    },
    updateDriver(id, driverData) {
        const index = this.data.drivers.findIndex(d => d.id === id);
        if (index !== -1) {
            this.data.drivers[index] = { ...this.data.drivers[index], ...driverData };
            this.save();
            return this.data.drivers[index];
        }
    },
    deleteVehicle(id) {
        // Only allow deletion if not on trip
        const vehicle = this.getVehicleById(id);
        if (vehicle && vehicle.status === 'on trip') {
            throw new Error("Cannot delete a vessel that is currently at sea.");
        }
        this.data.vehicles = this.data.vehicles.filter(v => v.id !== id);
        // Also cleanup related expenses? (Optional, but safer for demo)
        this.data.expenses = this.data.expenses.filter(e => e.vehicleId !== id);
        this.save();
    },
    deleteDriver(id) {
        const driver = this.getDriverById(id);
        if (driver && driver.status === 'on trip') {
            throw new Error("Cannot delete a captain who is currently at sea.");
        }
        this.data.drivers = this.data.drivers.filter(d => d.id !== id);
        this.save();
    },

    // --- Shipping (Trip) Operations ---
    getTrips() {
        return this.data.trips.map(trip => ({
            ...trip,
            vehicle: this.getVehicleById(trip.vehicleId),
            driver: this.getDriverById(trip.driverId)
        }));
    },
    createTrip(tripData) {
        const vehicle = this.getVehicleById(tripData.vehicleId);
        if (tripData.weight > vehicle.capacity) {
            throw new Error(`Cargo weight (${tripData.weight}kg) exceeds vessel capacity (${vehicle.capacity}kg)`);
        }

        if (!this.isLicenseValid(tripData.driverId)) {
            throw new Error(`Captain's maritime license is expired. Cannot assign shipment.`);
        }

        const newTrip = {
            id: 't' + Date.now(),
            ...tripData,
            status: 'dispatched',
            date: new Date().toISOString().split('T')[0]
        };
        this.data.trips.push(newTrip);

        this.updateVehicleStatus(tripData.vehicleId, 'on trip');
        const driver = this.getDriverById(tripData.driverId);
        driver.status = 'on trip';

        this.save();
        return newTrip;
    },
    cancelTrip(id) {
        const trip = this.data.trips.find(t => t.id === id);
        if (trip && trip.status === 'dispatched') {
            trip.status = 'cancelled';
            this.updateVehicleStatus(trip.vehicleId, 'available');
            const driver = this.getDriverById(trip.driverId);
            if (driver) driver.status = 'on duty';
            this.save();
            return true;
        }
        return false;
    },

    // --- Financial Operations ---
    getVehicleStats(id) {
        const fuelCosts = this.data.expenses
            .filter(e => e.vehicleId === id && e.type === 'Fuel')
            .reduce((sum, e) => sum + e.amount, 0);

        const maintCosts = this.data.expenses
            .filter(e => e.vehicleId === id && e.type === 'Maintenance')
            .reduce((sum, e) => sum + e.amount, 0);

        return {
            totalFuel: fuelCosts,
            totalMaint: maintCosts,
            totalOperationalCost: fuelCosts + maintCosts
        };
    },

    // --- Authentication ---
    login(email, password) {
        if (email.includes('admin') && password === 'admin123') {
            this.data.currentUser = { name: 'Port Authority', role: 'manager' };
        } else {
            this.data.currentUser = { name: 'Logistic Specialist', role: 'dispatcher' };
        }
        this.save();
        return this.data.currentUser;
    },
    logout() {
        this.data.currentUser = null;
        this.save();
    },
    getCurrentUser() { return this.data.currentUser; }
};

Store.init();

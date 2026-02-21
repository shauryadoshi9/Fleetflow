/**
 * Login Page Component
 */

App.pages.login = () => `
<div class="login-wrapper">
    <div class="login-card glass-card fade-in">
        <div class="login-header">
            <i data-lucide="zap" style="color: var(--primary); width: 48px; height: 48px; margin-bottom: 1rem;"></i>
            <h2>Welcome Back</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Secure access for Planet Fleet Managers</p>
        </div>
        <form id="login-form" class="login-form">
            <div class="form-group">
                <label class="label">Email Address</label>
                <input type="email" id="login-email" class="input" placeholder="admin@fleethub.com" required value="admin@fleethub.com">
            </div>
            <div class="form-group">
                <label class="label">Password</label>
                <input type="password" id="login-password" class="input" placeholder="••••••••" required value="admin123">
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">
                    <input type="checkbox"> Remember me
                </label>
                <a href="#" style="color: var(--primary); font-size: 0.85rem; text-decoration: none;">Forgot Password?</a>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.875rem;">Sign In</button>
        </form>
    </div>
</div>

<style>
.login-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 4rem);
}
.login-card {
    width: 100%;
    max-width: 420px;
    padding: 3rem 2.5rem;
    text-align: center;
}
.login-header h2 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
}
.login-form {
    margin-top: 2rem;
    text-align: left;
}
</style>
`;

App.pageInits.login = () => {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        const user = Store.login(email, pass);
        if (user) {
            App.navigate('dashboard');
        }
    });

    // Update user display if already logged in (unlikely here but good practice)
    const user = Store.getCurrentUser();
    if (user) {
        document.querySelector('.user-name').textContent = user.name;
        document.querySelector('.user-role').textContent = user.role.toUpperCase();
    }
};

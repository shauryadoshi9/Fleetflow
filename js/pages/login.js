/**
 * Login Page Component
 */

App.pages.login = () => `
<div class="login-container fade-in">
    <div class="login-content">
        <!-- Login Section -->
        <div class="auth-section">
            <div class="auth-card glass-card">
                <div class="auth-header">
                    <div class="logo-icon-large"></div>
                    <h2>Login</h2>
                </div>
                <form id="login-form">
                    <div class="form-group">
                        <label class="label">Email Address</label>
                        <input type="email" id="login-email" class="input" placeholder="Enter your email" required value="admin@fleethub.com">
                    </div>
                    <div class="form-group">
                        <label class="label">Password</label>
                        <input type="password" id="login-password" class="input" placeholder="Enter your password" required value="admin123">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Login</button>
                    <div class="auth-links">
                        <a href="#">Forgot Password?</a>
                    </div>
                </form>
            </div>
        </div>

        <!-- Register Section -->
        <div class="auth-section">
            <div class="auth-card glass-card">
                <div class="auth-header">
                    <div class="logo-icon-large red"></div>
                    <h2>Register</h2>
                    <p>Register as a Fleet Partner/Lead Owner & Manage Company Resources</p>
                </div>
                <form id="register-form">
                    <div class="form-group">
                        <label class="label">Full Name</label>
                        <input type="text" id="reg-name" class="input" placeholder="Enter your name" required>
                    </div>
                    <div class="form-group">
                        <label class="label">Email Address</label>
                        <input type="email" id="reg-email" class="input" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label class="label">Password</label>
                        <input type="password" id="reg-password" class="input" placeholder="Create a password" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Register</button>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 4rem);
    padding: 2rem;
}
.login-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    max-width: 1000px;
    width: 100%;
}
.auth-card {
    padding: 3rem 2.5rem;
}
.auth-header {
    text-align: center;
    margin-bottom: 2rem;
}
.auth-header h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}
.auth-header p {
    color: var(--text-muted);
    font-size: 0.9rem;
}
.logo-icon-large {
    width: 60px;
    height: 60px;
    border: 4px solid var(--primary);
    border-radius: 50%;
    margin: 0 auto 1.5rem;
}
.logo-icon-large.red {
    border-color: var(--danger);
}
.auth-links {
    margin-top: 1.5rem;
    text-align: center;
}
.auth-links a {
    color: var(--primary);
    text-decoration: none;
    font-size: 0.9rem;
}
</style>
`;

App.pageInits.login = () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        const user = Store.login(email, pass);
        if (user) {
            App.navigate('dashboard');
        } else {
            alert('Invalid email or password.');
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value
        };

        try {
            Store.register(userData);
            alert('Registration successful! Please login with your new credentials.');
            registerForm.reset();
        } catch (error) {
            alert(error.message);
        }
    });
};


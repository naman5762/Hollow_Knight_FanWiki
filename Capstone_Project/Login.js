const overlay    = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const panelLogin = document.getElementById('panel-login');
const panelReg   = document.getElementById('panel-register');
const navRight   = document.getElementById('nav-right');

function openModal(panel) {
    clearErrors();
    if (panel === 'login') {
        panelLogin.classList.remove('hidden');
        panelReg.classList.add('hidden');
    } else {
        panelReg.classList.remove('hidden');
        panelLogin.classList.add('hidden');
    }
    overlay.classList.add('open');
}

function closeModal() {
    overlay.classList.remove('open');
    clearErrors();
}

function clearErrors() {
    const els = document.querySelectorAll('.form-error, .form-success');
    els.forEach(el => el.textContent = '');
}

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
});

modalClose.addEventListener('click', closeModal);

/* Escape key */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

document.getElementById('go-register').addEventListener('click', () => openModal('register'));
document.getElementById('go-login').addEventListener('click', () => openModal('login'));

const heroBtn = document.getElementById('btn-open-login');
if (heroBtn) heroBtn.addEventListener('click', () => openModal('login'));

function getUsers() {
    return JSON.parse(localStorage.getItem('hk_users') || '{}');
}

function saveUsers(users) {
    localStorage.setItem('hk_users', JSON.stringify(users));
}

function getSession() {
    return localStorage.getItem('hk_session') || null;
}

function setSession(username) {
    localStorage.setItem('hk_session', username);
}

function clearSession() {
    localStorage.removeItem('hk_session');
}

function renderNav() {
    const user = getSession();

    if (!user) {
        navRight.innerHTML = `
            <button class="nav-btn-login"    id="nav-login-btn">Sign In</button>
            <button class="nav-btn-register" id="nav-reg-btn">Register</button>
        `;
        document.getElementById('nav-login-btn').addEventListener('click', () => openModal('login'));
        document.getElementById('nav-reg-btn').addEventListener('click', () => openModal('register'));
    } else {
        const initials = user.slice(0, 2).toUpperCase();
        navRight.innerHTML = `
            <div class="nav-user">
                <div class="nav-avatar">${initials}</div>
                <span class="nav-username">${user}</span>
                <button class="nav-btn-logout" id="nav-logout-btn">Sign Out</button>
            </div>
        `;
        document.getElementById('nav-logout-btn').addEventListener('click', () => {
            clearSession();
            renderNav();
        });
    }
}

document.getElementById('btn-register').addEventListener('click', () => {
    const username = document.getElementById('reg-username').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm  = document.getElementById('reg-confirm').value;
    const errEl    = document.getElementById('reg-error');
    const okEl     = document.getElementById('reg-success');

    errEl.textContent = '';
    okEl.textContent  = '';

    if (!username || !email || !password || !confirm) {
        errEl.textContent = 'Please fill in all fields.'; return;
    }
    if (username.length < 3) {
        errEl.textContent = 'Username must be at least 3 characters.'; return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errEl.textContent = 'Please enter a valid email.'; return;
    }
    if (password.length < 6) {
        errEl.textContent = 'Password must be at least 6 characters.'; return;
    }
    if (password !== confirm) {
        errEl.textContent = 'Passwords do not match.'; return;
    }

    const users = getUsers();
    if (users[username.toLowerCase()]) {
        errEl.textContent = 'That username is already taken.'; return;
    }

    /* Save user */
    users[username.toLowerCase()] = { username, email, password };
    saveUsers(users);

    okEl.textContent = 'Account created! Signing you in…';

    setTimeout(() => {
        setSession(username);
        renderNav();
        closeModal();
    }, 1200);
});

document.getElementById('btn-login').addEventListener('click', () => {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl    = document.getElementById('login-error');

    errEl.textContent = '';

    if (!username || !password) {
        errEl.textContent = 'Please enter your username and password.'; return;
    }

    const users = getUsers();
    const user  = users[username.toLowerCase()];

    if (!user || user.password !== password) {
        errEl.textContent = 'Incorrect username or password.'; return;
    }

    setSession(user.username);
    renderNav();
    closeModal();
});

document.getElementById('login-password').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('btn-login').click();
});
document.getElementById('reg-confirm').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('btn-register').click();
});

renderNav();
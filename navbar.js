function renderNavbar(role, activePage = '') {
    const navContainer = document.getElementById('navbar-container');
    let links = '';
    let brandLink = 'index.html';
    let brandName = 'Smart Meal Management System';

    const isActive = (page) => page === activePage ? 'active fw-bold text-primary' : 'text-dark';

    const profileBtn = `<li class="nav-item"><button class="btn btn-link nav-link text-dark fw-bold" onclick="openProfileModal()"><i class="bi bi-person-circle me-1"></i>Profile</button></li>`;
    const logoutBtn = `<li class="nav-item"><button class="btn btn-sm btn-outline-primary ms-2 fw-bold" onclick="logout()">Logout</button></li>`;

    if (role === 'student') {
        links = `
            ${profileBtn}
            ${logoutBtn}
        `;
        brandLink = 'student_dashboard.html';
    } 
    else if (role === 'admin') {
        links = `
            ${profileBtn}
            ${logoutBtn}
        `;
        brandLink = 'admin_dashboard.html';
    } 
    else if (role === 'kitchen') {
        links = `
            ${profileBtn}
            ${logoutBtn}
        `;
        brandLink = 'kitchen_staff_dashboard.html';
    } 
    else {
        links = `
            <li class="nav-item"><a class="nav-link ${isActive('home')}" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link ${isActive('features')}" href="index.html#features">Features</a></li>
            <li class="nav-item"><a class="nav-link ${isActive('login')}" href="login.html">Login</a></li>
            <li class="nav-item"><a class="btn btn-primary btn-sm ms-3 px-3 fw-bold" href="signup.html">Sign Up</a></li>
        `;
    }

    navContainer.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom fixed-top shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold text-secondary d-flex align-items-center" href="${brandLink}">
                <img src="assets/duet-logo.png" alt="Logo" width="32" height="32" class="me-2">
                ${brandName}
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav ms-auto align-items-center" id="navLinks">
                    ${links}
                </ul>
            </div>
        </div>
    </nav>
    `;
}
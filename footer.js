function renderFooter() {
    const container = document.getElementById('footer-container');
    if (container) {
        container.innerHTML = `
        <footer class="bg-white text-center py-4 border-top mt-auto">
            <div class="container small text-muted">&copy; 2025 Smart Meal Management System. All rights reserved.</div>
        </footer>
        `;
    }
}
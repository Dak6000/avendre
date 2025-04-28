// Fonction pour charger un composant HTML
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Erreur lors du chargement du composant ${componentPath}:`, error);
    }
}

// Fonction pour gérer l'affichage du bouton Dashboard
function updateDashboardVisibility() {
    const user = JSON.parse(localStorage.getItem('user'));
    const dashboardLink = document.getElementById('dashboard-link');
    const mobileDashboardLink = document.getElementById('mobile-dashboard-link');

    if (user && user.is_admin) {
        dashboardLink.classList.remove('hidden');
        mobileDashboardLink.classList.remove('hidden');
    } else {
        dashboardLink.classList.add('hidden');
        mobileDashboardLink.classList.add('hidden');
    }
}

// Charger la navbar et le footer
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('footer-container', '/components/footer.html');
    updateDashboardVisibility();
});
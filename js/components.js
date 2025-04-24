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

// Charger la navbar et le footer
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('footer-container', '/components/footer.html');
}); 
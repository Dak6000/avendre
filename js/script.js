document.addEventListener('DOMContentLoaded', function() {
    // [Vos autres scripts existants...]
    
    // Gestion du menu mobile - Version corrigée
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            // Basculer la classe 'hidden' et 'open'
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('open');
            
            // Changer l'icône entre burger et croix
            const icon = mobileMenuButton.querySelector('i');
            if (mobileMenu.classList.contains('open')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Fermer le menu mobile lorsqu'un lien est cliqué
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('open');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) icon.classList.replace('fa-times', 'fa-bars');
            });
        });

        // Fermer le menu si on clique à l'extérieur
        document.addEventListener('click', function(event) {
            const isClickInside = mobileMenu.contains(event.target) || mobileMenuButton.contains(event.target);
            if (!isClickInside && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('open');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }
});
// Category filter
const categoryButtons = document.querySelectorAll('.category-btn');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        // Ici vous pourriez ajouter le filtrage des produits
    });
});

// Favorite toggle
const heartIcons = document.querySelectorAll('.heart-icon');

heartIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        const heart = icon.querySelector('i');
        heart.classList.toggle('far');
        heart.classList.toggle('fas');
        heart.classList.toggle('active');
    });
});

// Hero slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.slide-indicator');
const prevButton = document.getElementById('prev-slide');
const nextButton = document.getElementById('next-slide');
let slideInterval;

function showSlide(index) {
    // Masquer tous les slides avec une transition
    slides.forEach(slide => {
        slide.style.opacity = '0';
        slide.style.transition = 'opacity 0.5s ease-in-out';
        slide.classList.remove('active');
    });
    
    // Désactiver tous les indicateurs
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
        indicator.classList.remove('bg-indigo-500');
        indicator.classList.add('bg-gray-500');
    });
    
    // Afficher le slide actuel avec une transition
    slides[index].style.opacity = '1';
    slides[index].classList.add('active');
    
    // Activer l'indicateur correspondant
    indicators[index].classList.add('active');
    indicators[index].classList.remove('bg-gray-500');
    indicators[index].classList.add('bg-indigo-500');
    
    currentSlide = index;
}

function nextSlide() {
    let next = currentSlide + 1;
    if (next >= slides.length) {
        next = 0;
    }
    showSlide(next);
}

function prevSlide() {
    let prev = currentSlide - 1;
    if (prev < 0) {
        prev = slides.length - 1;
    }
    showSlide(prev);
}

function startSlideInterval() {
    stopSlideInterval(); // Arrêter l'intervalle existant si présent
    slideInterval = setInterval(nextSlide, 10000); // Change de slide toutes les 5 secondes
}

function stopSlideInterval() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// Initialiser le slider
if (slides.length > 0) {
    // Ajouter les événements aux boutons de navigation
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', function() {
            stopSlideInterval();
            prevSlide();
            startSlideInterval();
        });

        nextButton.addEventListener('click', function() {
            stopSlideInterval();
            nextSlide();
            startSlideInterval();
        });
    }

    // Ajouter les événements aux indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopSlideInterval();
            showSlide(index);
            startSlideInterval();
        });
    });

    // Ajouter les événements de survol pour arrêter/démarrer le défilement automatique
    const sliderContainer = document.querySelector('.hero-slide').parentElement;
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopSlideInterval);
        sliderContainer.addEventListener('mouseleave', startSlideInterval);
    }

    // Initialiser le premier slide
    showSlide(0);
    startSlideInterval();
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer les valeurs du formulaire
        const formData = {
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Validation basique
        if (!formData.firstname || !formData.lastname || !formData.email || !formData.subject || !formData.message) {
            showNotification('Veuillez remplir tous les champs du formulaire.', 'error');
            return;
        }
        
        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        // Afficher le loader
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitButton.disabled = true;
        
        // Préparer les paramètres pour EmailJS
        const templateParams = {
            to_email: 'luxbagsavandre@gmail.com',
            from_name: `${formData.firstname} ${formData.lastname}`,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message
        };
        
        console.log('Envoi de l\'email avec les paramètres:', templateParams);
        
        // Envoyer l'email
        emailjs.send('service_gv73c9h', 'template_srcmo2a', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showNotification('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
                contactForm.reset();
            }, function(error) {
                console.error('FAILED...', error);
                let errorMessage = 'Une erreur est survenue lors de l\'envoi du message.';
                
                // Messages d'erreur plus spécifiques
                if (error.text) {
                    switch(error.text) {
                        case 'Invalid template ID':
                            errorMessage = 'Erreur de configuration du template. Veuillez contacter l\'administrateur.';
                            break;
                        case 'Invalid service ID':
                            errorMessage = 'Erreur de configuration du service. Veuillez contacter l\'administrateur.';
                            break;
                        case 'Invalid user ID':
                            errorMessage = 'Erreur de configuration de l\'utilisateur. Veuillez contacter l\'administrateur.';
                            break;
                        default:
                            errorMessage = `Erreur: ${error.text}`;
                    }
                }
                
                showNotification(errorMessage, 'error');
            })
            .finally(function() {
                // Réinitialiser le bouton
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            });
    });
}

// Fonction pour afficher les notifications
function showNotification(message, type = 'success') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Ajouter la notification au DOM
    document.body.appendChild(notification);
    
    // Supprimer la notification après 5 secondes
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Map Initialization pour la carte de localisation
const mapElement = document.getElementById('map');

if (mapElement) {
    // Coordonnées de la boutique (Atakpamé)
    const boutiqueLocation = [7.5333, 1.1333]; // Coordonnées approximatives d'Atakpamé
    
    // Initialiser la carte
    const map = L.map('map').setView(boutiqueLocation, 13);
    
    // Ajouter le fond de carte
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Ajouter un marqueur pour la boutique
    L.marker(boutiqueLocation)
        .addTo(map)
        .bindPopup('Avandre - Boutique Atakpamé')
        .openPopup();
}

// Éléments DOM pour la page de collections
const productsGrid = document.querySelector('.grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const loadMoreBtn = document.getElementById('load-more');

// Variables pour la page de collections
let currentCategory = 'Tous';
let displayedProducts = 8;
const productsPerLoad = 8;

// Fonction pour créer une carte produit
function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="relative">
                <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
                ${product.badge ? `<span class="badge ${getBadgeClass(product.badge)}">${getBadgeText(product.badge)}</span>` : ''}
                
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-white mb-2">${product.name}</h3>
                <p class="text-gray-400 mb-4">${product.description}</p>
                <div class="flex justify-between items-center">
                    <div>
                        <span class="price">${product.price} FCFA</span>
                        ${product.originalPrice ? `<span class="price-original">${product.originalPrice} FCFA</span>` : ''}
                    </div>
                    
                </div>
            </div>
        </div>
    `;
}

// Fonction pour obtenir la classe CSS du badge
function getBadgeClass(badge) {
    switch(badge) {
        case 'Nouveau':
            return 'badge-new';
        case 'Promo':
            return 'badge-sale';
        case 'limitee':
            return 'badge-limited';
        default:
            return '';
    }
}

// Fonction pour obtenir le texte du badge
function getBadgeText(badge) {
    switch(badge) {
        case 'Nouveau':
            return 'Nouveau';
        case 'Promo':
            return 'Promo';
        case 'limitee':
            return 'Édition limitée';
        default:
            return '';
    }
}

// Fonction pour filtrer les produits
function filterProducts(category) {
    const filteredProducts = category === 'Tous' 
        ? products 
        : products.filter(product => product.category === category);
    
    productsGrid.innerHTML = '';
    displayedProducts = productsPerLoad;
    
    filteredProducts.slice(0, displayedProducts).forEach(product => {
        productsGrid.innerHTML += createProductCard(product);
    });
    
    loadMoreBtn.style.display = filteredProducts.length > displayedProducts ? 'inline-block' : 'none';
}

// Fonction pour charger plus de produits
function loadMoreProducts() {
    const filteredProducts = currentCategory === 'Tous' 
        ? products 
        : products.filter(product => product.category === currentCategory);
    
    const nextProducts = filteredProducts.slice(displayedProducts, displayedProducts + productsPerLoad);
    
    nextProducts.forEach(product => {
        productsGrid.innerHTML += createProductCard(product);
    });
    
    displayedProducts += productsPerLoad;
    
    if (displayedProducts >= filteredProducts.length) {
        loadMoreBtn.style.display = 'none';
    }
}

// Événements pour la page de collections
if (productsGrid && filterButtons.length > 0 && loadMoreBtn) {
    // Initialiser l'affichage
    filterProducts(currentCategory);
    
    // Gérer les filtres
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.textContent;
            filterProducts(currentCategory);
        });
    });
    
    // Gérer le bouton "Charger plus"
    loadMoreBtn.addEventListener('click', loadMoreProducts);
}

// Initialisation des produits sur la page d'accueil
document.addEventListener('DOMContentLoaded', () => {
    const homeProductsGrid = document.querySelector('#collections .grid');
    const homeFilterButtons = document.querySelectorAll('#collections .filter-btn');
    
    if (homeProductsGrid && homeFilterButtons.length > 0) {
        // Afficher les 6 premiers produits
        const initialProducts = products.slice(0, 6);
        initialProducts.forEach(product => {
            homeProductsGrid.innerHTML += createProductCard(product);
        });
        
        // Gérer les filtres
        homeFilterButtons.forEach(button => {
            button.addEventListener('click', () => {
                homeFilterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const category = button.textContent;
                
                // Filtrer les produits
                const filteredProducts = category === 'Tous' 
                    ? products.slice(0, 6)
                    : products.filter(product => product.category === category).slice(0, 6);
                
                // Mettre à jour l'affichage
                homeProductsGrid.innerHTML = '';
                filteredProducts.forEach(product => {
                    homeProductsGrid.innerHTML += createProductCard(product);
                });
            });
        });
    }
});
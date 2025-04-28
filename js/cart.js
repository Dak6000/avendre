// Fonction pour mettre à jour le compteur du panier
async function updateCartCount() {
    const token = localStorage.getItem('token');
    if (!token) {
        document.getElementById('cart-count').textContent = '0';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/cart', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const cartItems = await response.json();
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantite, 0);
            document.getElementById('cart-count').textContent = totalItems;
        } else {
            document.getElementById('cart-count').textContent = '0';
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du compteur du panier:', error);
        document.getElementById('cart-count').textContent = '0';
    }
}

// Fonction pour ajouter un produit au panier
async function addToCart(productId, quantity = 1) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'utilisateurs/login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity })
        });

        if (response.ok) {
            // Mettre à jour le compteur du panier
            await updateCartCount();

            // Afficher une notification de succès
            showNotification('Produit ajouté au panier avec succès', 'success');
        } else {
            const data = await response.json();
            showNotification(data.message || 'Erreur lors de l\'ajout au panier', 'error');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        showNotification('Erreur lors de l\'ajout au panier', 'error');
    }
}

// Fonction pour afficher une notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Fonction pour créer le bouton "Ajouter au panier"
function createAddToCartButton(productId) {
    const button = document.createElement('button');
    button.className = 'mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-300';
    button.innerHTML = '<i class="fas fa-shopping-cart mr-2"></i>Ajouter au panier';
    button.onclick = () => addToCart(productId);
    return button;
}

// Fonction pour créer le compteur du panier dans la navbar
function createCartCounter() {
    const cartLink = document.createElement('a');
    cartLink.href = 'cart.html';
    cartLink.className = 'text-gray-400 hover:text-white relative';
    cartLink.innerHTML = `
        <i class="fas fa-shopping-cart text-lg"></i>
        <span id="cart-count" class="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
    `;
    return cartLink;
}

// Initialiser le panier
document.addEventListener('DOMContentLoaded', () => {
    // Mettre à jour le compteur du panier
    updateCartCount();

    // Ajouter le bouton "Ajouter au panier" à chaque produit
    document.querySelectorAll('.product-card').forEach(card => {
        const productId = card.dataset.productId;
        const buttonContainer = card.querySelector('.product-actions');
        if (buttonContainer) {
            buttonContainer.appendChild(createAddToCartButton(productId));
        }
    });
});
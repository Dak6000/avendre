const express = require('express');
const router = express.Router();
const db = require('../database');

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({ message: 'Accès non autorisé' });
    }
    next();
};

// Route pour obtenir les statistiques
router.get('/stats', isAdmin, (req, res) => {
    // Compter le nombre d'utilisateurs
    db.get('SELECT COUNT(*) as count FROM users', (err, usersRow) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        // Compter le nombre de produits (à implémenter plus tard)
        const productsCount = 0;

        // Compter le nombre de commandes (à implémenter plus tard)
        const ordersCount = 0;

        res.json({
            usersCount: usersRow.count,
            productsCount,
            ordersCount
        });
    });
});

// Route pour obtenir les dernières commandes
router.get('/orders', isAdmin, (req, res) => {
    // À implémenter plus tard
    res.json([]);
});

module.exports = router;
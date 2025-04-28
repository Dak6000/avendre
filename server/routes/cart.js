const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Récupérer le panier de l'utilisateur
router.get('/', authenticateToken, async(req, res) => {
    try {
        const userId = req.user.id;

        // Récupérer le panier et ses éléments
        const result = await pool.query(
            `SELECT p.*, pe.quantite, pr.nom, pr.prix, pr.image_url
             FROM paniers p
             JOIN panier_elements pe ON p.id = pe.panier_id
             JOIN produits pr ON pe.produit_id = pr.id
             WHERE p.utilisateur_id = $1`, [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération du panier:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Ajouter un produit au panier
router.post('/add', authenticateToken, async(req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // Vérifier si le produit existe
        const product = await pool.query('SELECT * FROM produits WHERE id = $1', [productId]);
        if (product.rows.length === 0) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        // Vérifier si le stock est suffisant
        if (product.rows[0].stock < quantity) {
            return res.status(400).json({ message: 'Stock insuffisant' });
        }

        // Récupérer ou créer le panier de l'utilisateur
        let cart = await pool.query(
            'SELECT * FROM paniers WHERE utilisateur_id = $1', [userId]
        );

        if (cart.rows.length === 0) {
            cart = await pool.query(
                'INSERT INTO paniers (utilisateur_id) VALUES ($1) RETURNING *', [userId]
            );
        }

        const cartId = cart.rows[0].id;

        // Vérifier si le produit est déjà dans le panier
        const existingItem = await pool.query(
            'SELECT * FROM panier_elements WHERE panier_id = $1 AND produit_id = $2', [cartId, productId]
        );

        if (existingItem.rows.length > 0) {
            // Mettre à jour la quantité
            await pool.query(
                'UPDATE panier_elements SET quantite = quantite + $1 WHERE panier_id = $2 AND produit_id = $3', [quantity, cartId, productId]
            );
        } else {
            // Ajouter le produit au panier
            await pool.query(
                'INSERT INTO panier_elements (panier_id, produit_id, quantite) VALUES ($1, $2, $3)', [cartId, productId, quantity]
            );
        }

        // Récupérer le panier mis à jour
        const updatedCart = await pool.query(
            `SELECT p.*, pe.quantite, pr.nom, pr.prix, pr.image_url
             FROM paniers p
             JOIN panier_elements pe ON p.id = pe.panier_id
             JOIN produits pr ON pe.produit_id = pr.id
             WHERE p.utilisateur_id = $1`, [userId]
        );

        res.json(updatedCart.rows);
    } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Mettre à jour la quantité d'un produit dans le panier
router.put('/update', authenticateToken, async(req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // Vérifier si le produit existe
        const product = await pool.query('SELECT * FROM produits WHERE id = $1', [productId]);
        if (product.rows.length === 0) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        // Vérifier si le stock est suffisant
        if (product.rows[0].stock < quantity) {
            return res.status(400).json({ message: 'Stock insuffisant' });
        }

        // Récupérer le panier de l'utilisateur
        const cart = await pool.query(
            'SELECT * FROM paniers WHERE utilisateur_id = $1', [userId]
        );

        if (cart.rows.length === 0) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        const cartId = cart.rows[0].id;

        // Mettre à jour la quantité
        await pool.query(
            'UPDATE panier_elements SET quantite = $1 WHERE panier_id = $2 AND produit_id = $3', [quantity, cartId, productId]
        );

        // Récupérer le panier mis à jour
        const updatedCart = await pool.query(
            `SELECT p.*, pe.quantite, pr.nom, pr.prix, pr.image_url
             FROM paniers p
             JOIN panier_elements pe ON p.id = pe.panier_id
             JOIN produits pr ON pe.produit_id = pr.id
             WHERE p.utilisateur_id = $1`, [userId]
        );

        res.json(updatedCart.rows);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du panier:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer un produit du panier
router.delete('/remove/:productId', authenticateToken, async(req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        // Récupérer le panier de l'utilisateur
        const cart = await pool.query(
            'SELECT * FROM paniers WHERE utilisateur_id = $1', [userId]
        );

        if (cart.rows.length === 0) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        const cartId = cart.rows[0].id;

        // Supprimer le produit du panier
        await pool.query(
            'DELETE FROM panier_elements WHERE panier_id = $1 AND produit_id = $2', [cartId, productId]
        );

        // Récupérer le panier mis à jour
        const updatedCart = await pool.query(
            `SELECT p.*, pe.quantite, pr.nom, pr.prix, pr.image_url
             FROM paniers p
             JOIN panier_elements pe ON p.id = pe.panier_id
             JOIN produits pr ON pe.produit_id = pr.id
             WHERE p.utilisateur_id = $1`, [userId]
        );

        res.json(updatedCart.rows);
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Vider le panier
router.delete('/clear', authenticateToken, async(req, res) => {
    try {
        const userId = req.user.id;

        // Récupérer le panier de l'utilisateur
        const cart = await pool.query(
            'SELECT * FROM paniers WHERE utilisateur_id = $1', [userId]
        );

        if (cart.rows.length === 0) {
            return res.status(404).json({ message: 'Panier non trouvé' });
        }

        const cartId = cart.rows[0].id;

        // Supprimer tous les éléments du panier
        await pool.query(
            'DELETE FROM panier_elements WHERE panier_id = $1', [cartId]
        );

        res.json({ message: 'Panier vidé avec succès' });
    } catch (error) {
        console.error('Erreur lors du vidage du panier:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
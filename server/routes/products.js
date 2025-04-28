const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = 'uploads/products';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'image') {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Seules les images sont autorisées'));
            }
        } else if (file.fieldname === 'video') {
            if (!file.mimetype.startsWith('video/')) {
                return cb(new Error('Seules les vidéos sont autorisées'));
            }
        }
        cb(null, true);
    }
});

// Récupérer tous les produits
router.get('/', async(req, res) => {
    try {
        const { category, badge, search } = req.query;
        let query = 'SELECT * FROM produits WHERE 1=1';
        const params = [];

        if (category) {
            query += ' AND categorie = $' + (params.length + 1);
            params.push(category);
        }

        if (badge) {
            query += ' AND badge = $' + (params.length + 1);
            params.push(badge);
        }

        if (search) {
            query += ' AND (nom ILIKE $' + (params.length + 1) + ' OR description ILIKE $' + (params.length + 1) + ')';
            params.push(`%${search}%`);
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Récupérer les produits récents (pour le dashboard admin)
router.get('/recent', authenticateToken, isAdmin, async(req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM produits ORDER BY created_at DESC LIMIT 6'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits récents:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Récupérer un produit par ID
router.get('/:id', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produits WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Créer un nouveau produit (admin uniquement)
router.post('/', authenticateToken, isAdmin, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async(req, res) => {
    try {
        const { name, description, price, original_price, category, badge, stock } = req.body;

        // Vérification des champs obligatoires
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
        }

        // Traitement des fichiers
        const image_url = req.files['image'] ? `/uploads/products/${req.files['image'][0].filename}` : null;
        const video_url = req.files['video'] ? `/uploads/products/${req.files['video'][0].filename}` : null;

        const result = await pool.query(
            `INSERT INTO produits (nom, description, prix, prix_original, categorie, badge, image_url, video_url, stock)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`, [name, description, price, original_price, category, badge, image_url, video_url, stock]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la création du produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Mettre à jour un produit (admin uniquement)
router.put('/:id', authenticateToken, isAdmin, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async(req, res) => {
    try {
        const { name, description, price, original_price, category, badge, stock } = req.body;
        const productId = req.params.id;

        // Vérification de l'existence du produit
        const existingProduct = await pool.query('SELECT * FROM produits WHERE id = $1', [productId]);
        if (existingProduct.rows.length === 0) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        // Traitement des fichiers
        const image_url = req.files['image'] ?
            `/uploads/products/${req.files['image'][0].filename}` :
            existingProduct.rows[0].image_url;

        const video_url = req.files['video'] ?
            `/uploads/products/${req.files['video'][0].filename}` :
            existingProduct.rows[0].video_url;

        const result = await pool.query(
            `UPDATE produits 
             SET nom = $1, description = $2, prix = $3, prix_original = $4, 
                 categorie = $5, badge = $6, image_url = $7, video_url = $8, 
                 stock = $9, updated_at = CURRENT_TIMESTAMP
             WHERE id = $10
             RETURNING *`, [name, description, price, original_price, category, badge,
                image_url, video_url, stock, productId
            ]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer un produit (admin uniquement)
router.delete('/:id', authenticateToken, isAdmin, async(req, res) => {
    try {
        const productId = req.params.id;

        // Vérification de l'existence du produit
        const existingProduct = await pool.query('SELECT * FROM produits WHERE id = $1', [productId]);
        if (existingProduct.rows.length === 0) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        // Suppression des fichiers associés
        if (existingProduct.rows[0].image_url) {
            const imagePath = path.join(__dirname, '..', existingProduct.rows[0].image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        if (existingProduct.rows[0].video_url) {
            const videoPath = path.join(__dirname, '..', existingProduct.rows[0].video_url);
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
            }
        }

        // Suppression du produit
        await pool.query('DELETE FROM produits WHERE id = $1', [productId]);
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
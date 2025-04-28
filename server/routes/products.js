const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

// Configuration de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Récupérer tous les produits
router.get('/', (req, res) => {
    const { category, badge, search } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }

    if (badge) {
        query += ' AND badge = ?';
        params.push(badge);
    }

    if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        res.json(rows);
    });
});

// Récupérer les produits récents (pour le dashboard admin)
router.get('/recent', auth, (req, res) => {
    db.all('SELECT * FROM products ORDER BY created_at DESC LIMIT 6', [], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits récents:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        res.json(rows);
    });
});

// Récupérer un produit par ID
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            console.error('Erreur lors de la récupération du produit:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        if (!row) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.json(row);
    });
});

// Route pour ajouter un produit
router.post('/', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), (req, res) => {
    const { name, description, price, category, stock, original_price, badge } = req.body;

    if (!name || !description || !price || !category || !stock) {
        // Nettoyer les fichiers uploadés en cas d'erreur
        if (req.files) {
            Object.values(req.files).forEach(files => {
                files.forEach(file => fs.unlinkSync(file.path));
            });
        }
        return res.status(400).json({ error: 'Tous les champs requis doivent être remplis' });
    }

    const imagePath = req.files.image ? `/uploads/${req.files.image[0].filename}` : null;
    const videoPath = req.files.video ? `/uploads/${req.files.video[0].filename}` : null;

    const sql = `
      INSERT INTO products (name, description, price, category, stock, original_price, badge, image_path, video_path, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;

    db.run(sql, [
        name,
        description,
        price,
        category,
        stock,
        original_price || null,
        badge || null,
        imagePath,
        videoPath
    ], function(err) {
        if (err) {
            console.error('Erreur DB:', err);
            if (req.files) {
                Object.values(req.files).forEach(files => {
                    files.forEach(file => fs.unlinkSync(file.path));
                });
            }
            return res.status(500).json({ error: 'Erreur lors de l\'ajout du produit' });
        }

        res.status(201).json({
            success: true,
            productId: this.lastID,
            message: 'Produit ajouté avec succès'
        });
    });
});

// Mettre à jour un produit
router.put('/:id', auth, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), (req, res) => {
    const { name, description, price, original_price, category, badge, stock } = req.body;
    const productId = req.params.id;

    // Vérification de l'existence du produit
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err) {
            console.error('Erreur lors de la vérification du produit:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        // Traitement des fichiers
        const imagePath = req.files['image'] ?
            `/uploads/${req.files['image'][0].filename}` :
            product.image_path;

        const videoPath = req.files['video'] ?
            `/uploads/${req.files['video'][0].filename}` :
            product.video_path;

        const sql = `
            UPDATE products 
            SET name = ?, description = ?, price = ?, original_price = ?, 
                category = ?, badge = ?, image_path = ?, video_path = ?, 
                stock = ?, updated_at = datetime('now')
            WHERE id = ?
        `;

        db.run(sql, [
            name,
            description,
            price,
            original_price || null,
            category,
            badge || null,
            imagePath,
            videoPath,
            stock,
            productId
        ], function(err) {
            if (err) {
                console.error('Erreur lors de la mise à jour du produit:', err);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
            res.json({
                success: true,
                message: 'Produit mis à jour avec succès'
            });
        });
    });
});

// Supprimer un produit
router.delete('/:id', auth, (req, res) => {
    const productId = req.params.id;

    // Vérification de l'existence du produit
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err) {
            console.error('Erreur lors de la vérification du produit:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        if (!product) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        // Suppression des fichiers associés
        if (product.image_path) {
            const imagePath = path.join(__dirname, '../..', product.image_path);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        if (product.video_path) {
            const videoPath = path.join(__dirname, '../..', product.video_path);
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
            }
        }

        // Suppression du produit
        db.run('DELETE FROM products WHERE id = ?', [productId], (err) => {
            if (err) {
                console.error('Erreur lors de la suppression du produit:', err);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
            res.json({ message: 'Produit supprimé avec succès' });
        });
    });
});

module.exports = router;
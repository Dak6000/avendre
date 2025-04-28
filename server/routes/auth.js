const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

// Middleware pour vérifier le token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'Token non fourni' });
    }

    jwt.verify(token, 'votre_secret_jwt', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide' });
        }
        req.user = decoded;
        next();
    });
};

// Route d'inscription
router.post('/register', async(req, res) => {
    const { first_name, last_name, email, password, confirm_password, phone, address, city, country } = req.body;

    // Validation des données
    if (!first_name || !last_name || !email || !password || !confirm_password) {
        return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }

    // Vérification si l'email existe déjà
    db.get('SELECT * FROM users WHERE email = ?', [email], async(err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        if (row) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertion du nouvel utilisateur
        db.run(`INSERT INTO users (first_name, last_name, email, password, phone, address, city, country)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [first_name, last_name, email, hashedPassword, phone, address, city, country],
            function(err) {
                if (err) {
                    return res.status(500).json({ message: 'Erreur lors de la création du compte' });
                }
                res.status(201).json({ message: 'Compte créé avec succès' });
            });
    });
});

// Route de connexion
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async(err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Création du token JWT
        const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin },
            'votre_secret_jwt', { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                address: user.address,
                city: user.city,
                country: user.country,
                is_admin: user.is_admin
            }
        });
    });
});

// Route pour obtenir les informations du profil
router.get('/me', verifyToken, (req, res) => {
    db.get('SELECT id, email, first_name, last_name, phone, address, city, country, is_admin FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(user);
    });
});

// Route pour mettre à jour le profil
router.put('/profile', verifyToken, async(req, res) => {
    const { first_name, last_name, email, phone, address, city, country } = req.body;

    // Vérification si l'email est déjà utilisé par un autre utilisateur
    db.get('SELECT id FROM users WHERE email = ? AND id != ?', [email, req.user.id], async(err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        if (row) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Mise à jour du profil
        db.run(`UPDATE users SET 
                first_name = ?, 
                last_name = ?, 
                email = ?, 
                phone = ?, 
                address = ?, 
                city = ?, 
                country = ? 
                WHERE id = ?`, [first_name, last_name, email, phone, address, city, country, req.user.id],
            function(err) {
                if (err) {
                    return res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
                }
                res.json({ message: 'Profil mis à jour avec succès' });
            });
    });
});

// Route pour changer le mot de passe
router.put('/password', verifyToken, async(req, res) => {
    const { current_password, new_password } = req.body;

    // Récupération de l'utilisateur
    db.get('SELECT password FROM users WHERE id = ?', [req.user.id], async(err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérification du mot de passe actuel
        const validPassword = await bcrypt.compare(current_password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
        }

        // Hashage du nouveau mot de passe
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // Mise à jour du mot de passe
        db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors du changement de mot de passe' });
            }
            res.json({ message: 'Mot de passe mis à jour avec succès' });
        });
    });
});

module.exports = router;
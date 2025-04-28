const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Création de la connexion à la base de données
const db = new sqlite3.Database('database.sqlite', (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données:', err);
    } else {
        console.log('Connecté à la base de données SQLite');
        createTables();
    }
});

// Création des tables
function createTables() {
    db.serialize(() => {
        // Table des utilisateurs
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            address TEXT,
            city TEXT,
            country TEXT,
            is_admin BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Table des produits
        db.run(`CREATE TABLE IF NOT EXISTS produits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            description TEXT,
            prix DECIMAL(10, 2) NOT NULL,
            prix_original DECIMAL(10, 2),
            categorie TEXT NOT NULL,
            badge TEXT,
            image_url TEXT,
            video_url TEXT,
            stock INTEGER NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Table des paniers
        db.run(`CREATE TABLE IF NOT EXISTS paniers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            utilisateur_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (utilisateur_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

        // Table des éléments du panier
        db.run(`CREATE TABLE IF NOT EXISTS panier_elements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            panier_id INTEGER NOT NULL,
            produit_id INTEGER NOT NULL,
            quantite INTEGER NOT NULL DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (panier_id) REFERENCES paniers(id) ON DELETE CASCADE,
            FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
        )`);

        // Table des commandes
        db.run(`CREATE TABLE IF NOT EXISTS commandes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            utilisateur_id INTEGER NOT NULL,
            statut TEXT NOT NULL DEFAULT 'en_attente',
            montant_total DECIMAL(10, 2) NOT NULL,
            adresse_livraison TEXT NOT NULL,
            ville_livraison TEXT NOT NULL,
            pays_livraison TEXT NOT NULL,
            telephone TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (utilisateur_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

        // Table des éléments de commande
        db.run(`CREATE TABLE IF NOT EXISTS commande_elements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            commande_id INTEGER NOT NULL,
            produit_id INTEGER NOT NULL,
            quantite INTEGER NOT NULL,
            prix_unitaire DECIMAL(10, 2) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
            FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
        )`);

        // Table des factures
        db.run(`CREATE TABLE IF NOT EXISTS factures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            commande_id INTEGER NOT NULL,
            numero_facture TEXT NOT NULL UNIQUE,
            montant_ht DECIMAL(10, 2) NOT NULL,
            tva DECIMAL(10, 2) NOT NULL,
            montant_ttc DECIMAL(10, 2) NOT NULL,
            date_emission DATETIME DEFAULT CURRENT_TIMESTAMP,
            statut TEXT NOT NULL DEFAULT 'non_payee',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE
        )`);

        // Table des paiements
        db.run(`CREATE TABLE IF NOT EXISTS paiements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            facture_id INTEGER NOT NULL,
            montant DECIMAL(10, 2) NOT NULL,
            methode_paiement TEXT NOT NULL,
            reference_paiement TEXT,
            statut TEXT NOT NULL DEFAULT 'en_attente',
            date_paiement DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (facture_id) REFERENCES factures(id) ON DELETE CASCADE
        )`);

        // Création des index
        db.run('CREATE INDEX IF NOT EXISTS idx_produits_categorie ON produits(categorie)');
        db.run('CREATE INDEX IF NOT EXISTS idx_commandes_utilisateur ON commandes(utilisateur_id)');
        db.run('CREATE INDEX IF NOT EXISTS idx_commandes_statut ON commandes(statut)');
        db.run('CREATE INDEX IF NOT EXISTS idx_factures_commande ON factures(commande_id)');
        db.run('CREATE INDEX IF NOT EXISTS idx_factures_numero ON factures(numero_facture)');
        db.run('CREATE INDEX IF NOT EXISTS idx_paniers_utilisateur ON paniers(utilisateur_id)');

        // Création des administrateurs par défaut
        const defaultAdmins = [{
                first_name: 'Admin',
                last_name: 'One',
                email: 'admin1@gmail.com',
                password: bcrypt.hashSync('admin123', 10),
                is_admin: 1
            },
            {
                first_name: 'Admin',
                last_name: 'Two',
                email: 'admin2@gmail.com',
                password: bcrypt.hashSync('admin123', 10),
                is_admin: 1
            }
        ];

        // Insertion des administrateurs par défaut
        defaultAdmins.forEach(admin => {
            db.get('SELECT * FROM users WHERE email = ?', [admin.email], (err, row) => {
                if (err) {
                    console.error('Erreur lors de la vérification des administrateurs:', err);
                } else if (!row) {
                    db.run(`INSERT INTO users (first_name, last_name, email, password, is_admin)
                            VALUES (?, ?, ?, ?, ?)`, [admin.first_name, admin.last_name, admin.email, admin.password, admin.is_admin],
                        (err) => {
                            if (err) {
                                console.error('Erreur lors de l\'insertion de l\'administrateur:', err);
                            }
                        });
                }
            });
        });

        // Ajout de quelques produits de démonstration
        db.get('SELECT COUNT(*) AS count FROM produits', (err, row) => {
            if (err) {
                console.error('Erreur lors de la vérification des produits:', err);
            } else if (row.count === 0) {
                const demoProducts = [{
                        nom: 'Sac à main pour femme',
                        description: 'Sac à main en cuir pour femme',
                        prix: 15000,
                        prix_original: 18000,
                        categorie: 'femme',
                        badge: 'nouveauté',
                        image_url: '/images/femme/sac_15000_1.jpg',
                        stock: 50
                    },
                    {
                        nom: 'Sac à main pour homme',
                        description: 'Sac à main en cuir pour homme',
                        prix: 15000,
                        prix_original: 18000,
                        categorie: 'homme',
                        badge: 'nouveauté',
                        image_url: '/images/femme/sac_15000_2.jpeg',
                        stock: 30
                    }
                ];

                demoProducts.forEach(product => {
                    db.run(`INSERT INTO produits (nom, description, prix, prix_original, categorie, badge, image_url, stock)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [product.nom, product.description, product.prix, product.prix_original,
                            product.categorie, product.badge, product.image_url, product.stock
                        ],
                        (err) => {
                            if (err) {
                                console.error('Erreur lors de l\'insertion du produit:', err);
                            }
                        });
                });
            }
        });
    });
}

module.exports = db;
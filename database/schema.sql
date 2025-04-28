-- Table des produits
CREATE TABLE IF NOT EXISTS produits (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10, 2) NOT NULL,
    prix_original DECIMAL(10, 2),
    categorie VARCHAR(50) NOT NULL,
    badge VARCHAR(50),
    image_url VARCHAR(255),
    video_url VARCHAR(255),
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des paniers
CREATE TABLE IF NOT EXISTS paniers (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- Table des éléments du panier
CREATE TABLE IF NOT EXISTS panier_elements (
    id SERIAL PRIMARY KEY,
    panier_id INTEGER NOT NULL,
    produit_id INTEGER NOT NULL,
    quantite INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (panier_id) REFERENCES paniers(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS commandes (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER NOT NULL,
    statut VARCHAR(50) NOT NULL DEFAULT 'en_attente',
    montant_total DECIMAL(10, 2) NOT NULL,
    adresse_livraison TEXT NOT NULL,
    ville_livraison VARCHAR(100) NOT NULL,
    pays_livraison VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- Table des éléments de commande
CREATE TABLE IF NOT EXISTS commande_elements (
    id SERIAL PRIMARY KEY,
    commande_id INTEGER NOT NULL,
    produit_id INTEGER NOT NULL,
    quantite INTEGER NOT NULL,
    prix_unitaire DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
);

-- Table des factures
CREATE TABLE IF NOT EXISTS factures (
    id SERIAL PRIMARY KEY,
    commande_id INTEGER NOT NULL,
    numero_facture VARCHAR(50) NOT NULL UNIQUE,
    montant_ht DECIMAL(10, 2) NOT NULL,
    tva DECIMAL(10, 2) NOT NULL,
    montant_ttc DECIMAL(10, 2) NOT NULL,
    date_emission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(50) NOT NULL DEFAULT 'non_payee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS paiements (
    id SERIAL PRIMARY KEY,
    facture_id INTEGER NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    methode_paiement VARCHAR(50) NOT NULL,
    reference_paiement VARCHAR(100),
    statut VARCHAR(50) NOT NULL DEFAULT 'en_attente',
    date_paiement TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (facture_id) REFERENCES factures(id) ON DELETE CASCADE
);

-- Index pour optimiser les recherches
CREATE INDEX idx_produits_categorie ON produits(categorie);
CREATE INDEX idx_commandes_utilisateur ON commandes(utilisateur_id);
CREATE INDEX idx_commandes_statut ON commandes(statut);
CREATE INDEX idx_factures_commande ON factures(commande_id);
CREATE INDEX idx_factures_numero ON factures(numero_facture);
CREATE INDEX idx_paniers_utilisateur ON paniers(utilisateur_id); 
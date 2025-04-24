// Données des produits
const products = [
    // Catégorie Femme
    {
        id: 1,
        name: "Sac à main Avandre Élégance",
        description: "Sac à main élégant en cuir avec finitions métalliques dorées et bandoulière amovible.",
        price: 8500,
        image: "images/femme/femme1.jpg",
        category: "Femme",
        badge: "Nouveau"
    },
    {
        id: 2,
        name: "Sac Avandre Prestige",
        description: "Sac à main structuré avec compartiment sécurisé et poignées en cuir.",
        price: 9500,
        image: "images/femme/femme2.jpg",
        category: "Femme"
    },
    {
        id: 3,
        name: "Sac Avandre Classic",
        description: "Sac à main classique en cuir avec détails métalliques et bandoulière ajustable.",
        price: 7800,
        image: "images/femme/femme3.jpg",
        category: "Femme"
    },
    {
        id: 4,
        name: "Sac Avandre Modern",
        description: "Sac à main moderne avec design épuré et finitions soignées.",
        price: 8200,
        image: "images/femme/femme4.jpg",
        category: "Femme"
    },
    {
        id: 5,
        name: "Sac Avandre Luxe",
        description: "Sac à main luxueux en cuir avec détails métalliques et compartiments multiples.",
        price: 12000,
        originalPrice: 15000,
        image: "images/femme/femme5.jpg",
        category: "Femme",
        badge: "Promo"
    },

    // Catégorie Homme
    {
        id: 6,
        name: "Sac Avandre Business",
        description: "Sac professionnel en cuir avec compartiment pour ordinateur et accessoires.",
        price: 7500,
        image: "images/homme/homme1.jpg",
        category: "Homme"
    },
    {
        id: 7,
        name: "Sac Avandre Executive",
        description: "Sac élégant pour homme avec design moderne et finitions soignées.",
        price: 6800,
        image: "images/homme/homme2.jpg",
        category: "Homme"
    },
    {
        id: 8,
        name: "Sac Avandre Urban",
        description: "Sac urbain polyvalent avec style contemporain et praticité.",
        price: 5500,
        image: "images/homme/homme3.jpg",
        category: "Homme"
    },

    // Catégorie Voyage
    {
        id: 9,
        name: "Valise Avandre Voyage",
        description: "Valise de voyage spacieuse avec roulettes silencieuses et compartiments multiples.",
        price: 15000,
        image: "images/voyage/voyage1.jpg",
        category: "Voyage"
    },
    {
        id: 10,
        name: "Sac de Voyage Avandre",
        description: "Sac de voyage pratique avec bandoulière confortable et compartiments organisés.",
        price: 12000,
        image: "images/voyage/voyage2.jpg",
        category: "Voyage"
    },
    {
        id: 11,
        name: "Valise Avandre Premium",
        description: "Valise haut de gamme avec système de roulettes avancé et design élégant.",
        price: 18000,
        originalPrice: 20000,
        image: "images/voyage/voyage3.jpg",
        category: "Voyage",
        badge: "Promo"
    },

    // Catégorie Enfant
    {
        id: 12,
        name: "Sac à dos Avandre Kids",
        description: "Sac à dos coloré et léger pour les enfants, avec compartiments pratiques.",
        price: 3500,
        image: "images/enfant/enfant1.jpg",
        category: "Enfant"
    },
    {
        id: 13,
        name: "Sac Avandre Junior",
        description: "Sac à dos ergonomique pour enfants avec dos rembourré et bretelles ajustables.",
        price: 4000,
        image: "images/enfant/enfant2.jpg",
        category: "Enfant"
    },

    // Catégorie Scolaire
    {
        id: 14,
        name: "Sac à dos Avandre School",
        description: "Sac à dos scolaire robuste avec compartiments multiples et dos rembourré.",
        price: 4500,
        image: "images/scolaire/scolaire1.jpg",
        category: "Scolaire"
    },
    {
        id: 15,
        name: "Sac Avandre Campus",
        description: "Sac à dos élégant pour la ville avec compartiment pour ordinateur 15\".",
        price: 5000,
        image: "images/scolaire/Sans titre.jpg",
        category: "Scolaire",
        badge: "Nouveau"
    },

    // Catégorie Nouveautés
    {
        id: 16,
        name: "Sac Avandre Édition Limitée",
        description: "Sac exclusif en cuir avec finitions métalliques et design unique.",
        price: 15000,
        image: "images/nouveauté/nouveauté1.jpg",
        category: "Nouveautés",
        badge: "limitee"
    }
];
// Données des produits
const products = [
    // Catégorie Femme
    {
        id: 1,
        name: "Sac à main pour femme",
        description: "Sac à main élégant en cuir avec finitions métalliques dorées et bandoulière amovible.",
        price: 10000,
        image: "images/femme/femme1.jpg",
        category: "Femme",
        badge: "Nouveau"
    },
    {
        id: 2,
        name: "Sac à main pour femme",
        description: "Sac à main structuré avec compartiment sécurisé et poignées en cuir.",
        price: 10000,
        image: "images/femme/femme2.jpg",
        category: "Femme"
    },
    {
        id: 3,
        name: "Sac à main pour femme",
        description: "Sac à main classique en cuir avec détails métalliques et bandoulière ajustable.",
        price: 10000,
        image: "images/femme/femme3.jpg",
        category: "Femme"
    },
    {
        id: 4,
        name: "Sac à main pour femme",
        description: "Sac à main moderne avec design épuré et finitions soignées.",
        price: 10000,
        image: "images/femme/femme4.jpg",
        category: "Femme"
    },
    {
        id: 5,
        name: "Sac à main pour femme",
        description: "Sac à main luxueux en cuir avec détails métalliques et compartiments multiples.",
        price: 10000,
        originalPrice: 15000,
        image: "images/femme/femme5.jpg",
        category: "Femme",
        badge: "Promo"
    },

    // Catégorie Homme
    {
        id: 6,
        name: "Sac à main pour homme",
        description: "Sac professionnel en cuir avec compartiment pour ordinateur et accessoires.",
        price: 10000,
        image: "images/femme/femme6.jpg",
        category: "femme"
    },
    {
        id: 7,
        name: "Sac à main pour femme",
        description: "Sac élégant pour homme avec design moderne et finitions soignées.",
        price: 10000,
        image: "images/femme/femme7.jpg",
        category: "femme"
    },
    {
        id: 8,
        name: "Sac à main pour femme",
        description: "Sac urbain polyvalent avec style contemporain et praticité.",
        price: 10000,
        image: "images/femme/sac.jpg",
        category: "femme"
    },

    // Catégorie Voyage
    {
        id: 9,
        name: "Sac à main pour femme",
        description: "Valise de voyage spacieuse avec roulettes silencieuses et compartiments multiples.",
        price: 13000,
        image: "images/femme/sac_13000_1.jpeg",
        category: "femme"
    },
    {
        id: 10,
        name: "Sac de Voyage pour femme",
        description: "Sac de voyage pratique avec bandoulière confortable et compartiments organisés.",
        price: 13000,
        image: "images/femme/sac_13000_2.jpeg",
        category: "femme"
    },
    {
        id: 11,
        name: "Valise pour femme",
        description: "Valise haut de gamme avec système de roulettes avancé et design élégant.",
        price: 13000,
        originalPrice: 15000,
        image: "images/femme/sac_13000_3.jpeg",
        category: "femme",
        badge: "Promo"
    },

    // Catégorie Enfant
    {
        id: 12,
        name: "Sac à dos pour femme",
        description: "Sac à dos coloré et léger pour les enfants, avec compartiments pratiques.",
        price: 13000,
        image: "images/femme/sac_13000_4.jpeg",
        category: "femme"
    },
    {
        id: 13,
        name: "Sac Avandre femme",
        description: "Sac à dos ergonomique pour enfants avec dos rembourré et bretelles ajustables.",
        price: 13000,
        image: "images/femme/sac_13000_5.jpeg",
        category: "femme"
    },

    // Catégorie Scolaire
    {
        id: 14,
        name: "Sac à dos pour femme",
        description: "Sac à dos scolaire robuste avec compartiments multiples et dos rembourré.",
        price: 13000,
        image: "images/femme/sac_13000_6.jpeg",
        category: "femme"
    },
    {
        id: 15,
        name: "Sac à dos pour femme",
        description: "Sac à dos élégant pour la ville avec compartiment pour ordinateur 15\".",
        price: 13000,
        image: "images/femme/sac_13000_7.jpeg",
        category: "femme",
        badge: "Nouveau"
    },

    // Catégorie Nouveautés
    {
        id: 16,
        name: "Sac Avandre Édition Limitée",
        description: "Sac exclusif en cuir avec finitions métalliques et design unique.",
        price: 15000,
        image: "images/femme/sac_15000_3.jpeg",
        video: "images/videos/video1.mp4",
        category: "femme",
        badge: "limitee"
    },
    {
        id: 17,
        name: "Sac Avandre Édition Limitée",
        description: "Sac exclusif en cuir avec finitions métalliques et design unique.",
        price: 13000,
        image: "images/femme/sac_13000_11.jpeg",
        video: "images/videos/video2.mp4",
        category: "femme",
    },
    {
        id: 18,
        name: "Sac Avandre Édition Limitée",
        description: "Sac exclusif en cuir avec finitions métalliques et design unique.",
        price: 15000,
        image: "images/femme/sac_15000_1.jpg",
        video: "images/videos/video3.mp4",
        category: "femme",
    },
    {
        id: 19,
        name: "Sac Avandre Édition Limitée",
        description: "Sac exclusif en cuir avec finitions métalliques et design unique.",
        price: 15000,
        image: "images/femme/sac_15000_2.jpeg",
        category: "femme",
    },
    {
        id: 20,
        name: "Sac Avandre Édition Limitée",
        description: "Sac exclusif en cuir avec finitions métalliques et design unique.",
        price: 15000,
        image: "images/femme/sac_15000_4.jpeg",
        category: "femme",
    },
    {
        id: 21,
        name: "Sac Avandre Édition Limitée",
        description: "Sac exclusif en cuir avec finitions métalliques et design unique.",
        price: 13000,
        image: "images/femme/sac_13000_11.jpeg",
        category: "femme",
    },
    {
        id: 22,
        name: "Sac Avandre Édition Limitée",
        description: "Sac exclusif en cuir avec finitions métalliques et design unique.",
        price: 13000,
        image: "images/femme/sac_13000_9.jpeg",
        category: "femme",
    },
];
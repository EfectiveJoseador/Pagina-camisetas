const products = [
    {
        id: 101,
        name: "Alavés 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Alaves2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 102,
        name: "Albacete 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Albacete2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 103,
        name: "Athletic Club 25/26 Tercera",
        category: "futbol",
        league: "laliga",
        price: 64.99,
        image: "/assets/productos/La Liga/AthelticKids2526T/1.webp",
        new: true,
        sale: false,
        kids: true,
        slug: "athletic-club-2526-tercera"
    },
    {
        id: 104,
        name: "Athletic Club 01/03 Visitante Retro",
        category: "futbol",
        league: "laliga",
        price: 89.99,
        image: "/assets/productos/La Liga/Athletic0103FR/1.webp",
        new: false,
        sale: false,
        retro: true
    },
    {
        id: 105,
        name: "Athletic Club 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Athletic2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 106,
        name: "Atlético Madrid 02/03 Local Retro",
        category: "futbol",
        league: "laliga",
        price: 89.99,
        image: "/assets/productos/La Liga/Atletico0203LR/1.webp",
        new: false,
        sale: false,
        retro: true
    },
    {
        id: 107,
        name: "Atlético Madrid 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Atletico2526F/1.webp",
        new: true,
        sale: false
    },
    {
        id: 108,
        name: "Atlético Madrid 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Atletico2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 109,
        name: "Atlético Madrid 95/96 Tercera Retro",
        category: "futbol",
        league: "laliga",
        price: 89.99,
        image: "/assets/productos/La Liga/Atletico9596TR/1.webp",
        new: false,
        sale: false,
        retro: true
    },
    {
        id: 110,
        name: "Atlético Madrid 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        price: 64.99,
        image: "/assets/productos/La Liga/AtleticoKids2526F/1.webp",
        new: true,
        sale: false,
        kids: true,
        slug: "atltico-madrid-2526-visitante"
    },
    {
        id: 111,
        name: "FC Barcelona 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        price: 84.99,
        image: "/assets/productos/La Liga/Barcelona2526F/1.webp",
        new: true,
        sale: false
    },
    {
        id: 112,
        name: "FC Barcelona 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 84.99,
        image: "/assets/productos/La Liga/Barcelona2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 113,
        name: "FC Barcelona 25/26 Tercera",
        category: "futbol",
        league: "laliga",
        price: 84.99,
        image: "/assets/productos/La Liga/Barcelona2526T/1.webp",
        new: true,
        sale: false
    },
    {
        id: 114,
        name: "FC Barcelona 96/97 Local Retro",
        category: "futbol",
        league: "laliga",
        price: 94.99,
        image: "/assets/productos/La Liga/Barcelona9697LR/1.webp",
        new: false,
        sale: false,
        retro: true
    },
    {
        id: 115,
        name: "Real Betis 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Betis2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 116,
        name: "Celta de Vigo 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Celta2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 117,
        name: "Elche 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        price: 74.99,
        image: "/assets/productos/La Liga/Elche2526F/1.webp",
        new: true,
        sale: false
    },
    {
        id: 119,
        name: "Espanyol 99/00 Local Retro",
        category: "futbol",
        league: "laliga",
        price: 89.99,
        image: "/assets/productos/La Liga/Espanyol9920LR/1.webp",
        new: false,
        sale: false,
        retro: true
    },
    {
        id: 120,
        name: "Getafe 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Getafe2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 121,
        name: "Girona 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Girona2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 122,
        name: "Granada 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 74.99,
        image: "/assets/productos/La Liga/Granada2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 123,
        name: "Las Palmas 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/LasPalmas2526F/1.webp",
        new: true,
        sale: false
    },
    {
        id: 124,
        name: "Las Palmas 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/LasPalmas2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 125,
        name: "Leganés 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 74.99,
        image: "/assets/productos/La Liga/Leganes2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 126,
        name: "Levante 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 74.99,
        image: "/assets/productos/La Liga/Levante2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 127,
        name: "Málaga 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 74.99,
        image: "/assets/productos/La Liga/Malaga2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 128,
        name: "Málaga 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 59.99,
        image: "/assets/productos/La Liga/MalagaKids2526L/1.webp",
        new: true,
        sale: false,
        kids: true,
        slug: "mlaga-2526-local"
    },
    {
        id: 129,
        name: "Mallorca 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Mallorca2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 130,
        name: "Osasuna 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Osasuna2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 131,
        name: "Real Oviedo 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 74.99,
        image: "/assets/productos/La Liga/Oviedo2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 133,
        name: "Real Madrid 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        price: 89.99,
        image: "/assets/productos/La Liga/RealMadrid2526F/1.webp",
        new: true,
        sale: false
    },
    {
        id: 134,
        name: "Real Madrid 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 89.99,
        image: "/assets/productos/La Liga/RealMadrid2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 135,
        name: "Real Madrid 25/26 Tercera",
        category: "futbol",
        league: "laliga",
        price: 89.99,
        image: "/assets/productos/La Liga/RealMadrid2526T/1.webp",
        new: true,
        sale: false
    },
    {
        id: 136,
        name: "Real Sociedad 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/RealSociedad2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 137,
        name: "Sevilla 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Sevilla2526F/1.webp",
        new: true,
        sale: false
    },
    {
        id: 138,
        name: "Sevilla 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Sevilla2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 139,
        name: "Sevilla 25/26 Tercera",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Sevilla2526T/1.webp",
        new: true,
        sale: false
    },
    {
        id: 140,
        name: "Valencia 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Valencia2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 141,
        name: "Valladolid 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Valladolid2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 142,
        name: "Villarreal 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 79.99,
        image: "/assets/productos/La Liga/Villarreal2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 201,
        name: "Arsenal 25/26 Local",
        category: "futbol",
        league: "premier",
        price: 84.99,
        image: "/assets/productos/Premier League/Arsenal2525L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 202,
        name: "Arsenal 25/26 Visitante",
        category: "futbol",
        league: "premier",
        price: 84.99,
        image: "/assets/productos/Premier League/Arsenal2526F/1.webp",
        new: true,
        sale: false
    },
    {
        id: 203,
        name: "Aston Villa 25/26 Visitante",
        category: "futbol",
        league: "premier",
        price: 79.99,
        image: "/assets/productos/Premier League/AstonVilla2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 204,
        name: "Chelsea 25/26 Local",
        category: "futbol",
        league: "premier",
        price: 84.99,
        image: "/assets/productos/Premier League/Chealsea2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 205,
        name: "Crystal Palace 25/26 Local",
        category: "futbol",
        league: "premier",
        price: 79.99,
        image: "/assets/productos/Premier League/CrystalPalace2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 206,
        name: "Man City 25/26 Visitante",
        category: "futbol",
        league: "premier",
        price: 89.99,
        image: "/assets/productos/Premier League/ManCity2526F/1.webp",
        new: true,
        sale: false
    },
    {
        id: 207,
        name: "Man United 25/26 Local",
        category: "futbol",
        league: "premier",
        price: 89.99,
        image: "/assets/productos/Premier League/ManUnited2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 208,
        name: "Newcastle 25/26 Local",
        category: "futbol",
        league: "premier",
        price: 84.99,
        image: "/assets/productos/Premier League/Newcastle2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 209,
        name: "Man United 25/26 Visitante",
        category: "futbol",
        league: "premier",
        price: 64.99,
        image: "/assets/productos/Premier League/UnitedKids2526F/1.webp",
        new: true,
        sale: false,
        kids: true,
        slug: "man-united-2526-visitante"
    },
    {
        id: 301,
        name: "Lazio 25/26 Visitante",
        category: "futbol",
        league: "seriea",
        price: 79.99,
        image: "/assets/productos/Serie A/Lazio2526F/1.webp",
        new: true,
        sale: false
    },
    {
        id: 302,
        name: "AC Milan 97/98 Local Retro",
        category: "futbol",
        league: "seriea",
        price: 94.99,
        image: "/assets/productos/Serie A/Milan9798LR/1.webp",
        new: false,
        sale: false,
        retro: true
    },
    {
        id: 303,
        name: "Napoli 25/26 Local",
        category: "futbol",
        league: "seriea",
        price: 84.99,
        image: "/assets/productos/Serie A/Napoli2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 304,
        name: "AS Roma 25/26 Local",
        category: "futbol",
        league: "seriea",
        price: 64.99,
        image: "/assets/productos/Serie A/RomaKids2526L/1.webp",
        new: true,
        sale: false,
        kids: true,
        slug: "as-roma-2526-local"
    },
    {
        id: 401,
        name: "Bayern Munich 25/26 Local",
        category: "futbol",
        league: "bundesliga",
        price: 89.99,
        image: "/assets/productos/Bundesliga/Munich2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 402,
        name: "Schalke 04 25/26 Local",
        category: "futbol",
        league: "bundesliga",
        price: 79.99,
        image: "/assets/productos/Bundesliga/Schalke2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 501,
        name: "Marseille 25/26 Visitante",
        category: "futbol",
        league: "ligue1",
        price: 64.99,
        image: "/assets/productos/Ligue 1/MarseillaKids2526F/1.webp",
        new: true,
        sale: false,
        kids: true,
        slug: "marseille-2526-visitante"
    },
    {
        id: 502,
        name: "Monaco 25/26 Visitante",
        category: "futbol",
        league: "ligue1",
        price: 79.99,
        image: "/assets/productos/Ligue 1/Monaco2526F/1.webp",
        new: true,
        sale: false
    },
    {
        id: 503,
        name: "PSG 25/26 Local",
        category: "futbol",
        league: "ligue1",
        price: 89.99,
        image: "/assets/productos/Ligue 1/Paris2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 504,
        name: "PSG 25/26 Tercera",
        category: "futbol",
        league: "ligue1",
        price: 89.99,
        image: "/assets/productos/Ligue 1/PSG2526T/1.webp",
        new: true,
        sale: false
    },
    {
        id: 601,
        name: "España 08/09 Local Retro",
        category: "futbol",
        league: "selecciones",
        price: 99.99,
        image: "/assets/productos/Internacional/España0809LR/1.webp",
        new: false,
        sale: false,
        retro: true
    },
    {
        id: 602,
        name: "España 24/25 Local",
        category: "futbol",
        league: "selecciones",
        price: 89.99,
        image: "/assets/productos/Internacional/España2425L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 603,
        name: "Francia 98/99 Local Retro",
        category: "futbol",
        league: "selecciones",
        price: 99.99,
        image: "/assets/productos/Internacional/Francia9899LR/1.webp",
        new: false,
        sale: false,
        retro: true
    },
    {
        id: 604,
        name: "Holanda 98/99 Local Retro",
        category: "futbol",
        league: "selecciones",
        price: 99.99,
        image: "/assets/productos/Internacional/Holanda9899LR/1.webp",
        new: false,
        sale: false,
        retro: true
    },
    {
        id: 551,
        name: "Flamengo 25/26 Tercera",
        category: "futbol",
        league: "brasileirao",
        price: 74.99,
        image: "/assets/productos/Brasileirão Série A/Flamengo2526T/1.webp",
        new: true,
        sale: false
    },
    {
        id: 561,
        name: "Al-Nassr 25/26 Local",
        category: "futbol",
        league: "ligaarabe",
        price: 79.99,
        image: "/assets/productos/Liga Arabe/Al-Nassr2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 571,
        name: "Boca Juniors 01/02 Local Retro",
        category: "futbol",
        league: "saf",
        price: 89.99,
        image: "/assets/productos/SAF (Argentina)/Boca0102LR/1.webp",
        new: false,
        sale: false,
        retro: true
    },
    {
        id: 572,
        name: "River Plate 25/26 Local",
        category: "futbol",
        league: "saf",
        price: 74.99,
        image: "/assets/productos/SAF (Argentina)/River2526L/1.webp",
        new: true,
        sale: false
    },
    {
        id: 573,
        name: "River Plate 25/26 Local",
        category: "futbol",
        league: "saf",
        price: 59.99,
        image: "/assets/productos/SAF (Argentina)/RiverKids2526L/1.webp",
        new: true,
        sale: false,
        kids: true,
        slug: "river-plate-2526-local"
    },
    {
        id: 701,
        name: "Lakers 25/26 Local",
        category: "nba",
        league: "nba",
        price: 95,
        image: "/assets/productos/NBA/Lakers1/1.webp",
        new: false,
        sale: true
    },
    {
        id: 702,
        name: "Oklahoma City Thunder",
        category: "nba",
        league: "nba",
        price: 95,
        image: "/assets/productos/NBA/Oklahoma/1.webp",
        new: true,
        sale: false
    },
    {
        id: 703,
        name: "Philadelphia 76ers",
        category: "nba",
        league: "nba",
        price: 95,
        image: "/assets/productos/NBA/Phila1/1.webp",
        new: false,
        sale: false
    },
    {
        id: 937715,
        name: "Japón 2026 Local",
        slug: "japn-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/219491642/1.webp",
        images: [
            "/assets/productos/Yupoo/219491642/2.webp"
        ],
        imageAlt: "Japón 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/219491642?uid=1",
            albumId: "219491642"
        },
        tipo: "local",
        tallas: "S-4XL",
        temporada: "2026"
    },
    {
        id: 978161,
        name: "Palmeiras 25/26 Visitante",
        slug: "palmeiras-2526-visitante",
        category: "futbol",
        league: "brasileirao",
        price: 0,
        image: "/assets/productos/Yupoo/210081096/1.webp",
        images: [
            "/assets/productos/Yupoo/210081096/2.webp"
        ],
        imageAlt: "Palmeiras 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/210081096?uid=1",
            albumId: "210081096"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 362332,
        name: "Alaves 25/26 Local",
        slug: "alaves-2526-local",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/216419940/1.webp",
        images: [
            "/assets/productos/Yupoo/216419940/2.webp"
        ],
        imageAlt: "Alaves 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216419940?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "216419940"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 948475,
        name: "Real Murcia 25/26 Local",
        slug: "real-murcia-2526-local",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/216806487/1.webp",
        images: [
            "/assets/productos/Yupoo/216806487/2.webp"
        ],
        imageAlt: "Real Murcia 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216806487?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "216806487"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 892563,
        name: "Osasuna 25/26 Visitante",
        slug: "osasuna-2526-visitante",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/211234491/1.webp",
        images: [
            "/assets/productos/Yupoo/211234491/2.webp",
            "/assets/productos/Yupoo/211234491/3.webp",
            "/assets/productos/Yupoo/211234491/4.webp",
            "/assets/productos/Yupoo/211234491/5.webp",
            "/assets/productos/Yupoo/211234491/6.webp",
            "/assets/productos/Yupoo/211234491/7.webp",
            "/assets/productos/Yupoo/211234491/8.webp"
        ],
        imageAlt: "Osasuna 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/211234491?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "211234491"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 388938,
        name: "Real Betis 25/26 Visitante",
        slug: "real-betis-2526-visitante",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/211234641/1.webp",
        images: [
            "/assets/productos/Yupoo/211234641/2.webp",
            "/assets/productos/Yupoo/211234641/3.webp",
            "/assets/productos/Yupoo/211234641/4.webp",
            "/assets/productos/Yupoo/211234641/5.webp",
            "/assets/productos/Yupoo/211234641/6.webp",
            "/assets/productos/Yupoo/211234641/7.webp",
            "/assets/productos/Yupoo/211234641/8.webp"
        ],
        imageAlt: "Real Betis 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/211234641?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "211234641"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 105061,
        name: "Valladolid 25/26 Visitante",
        slug: "valladolid-2526-visitante",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/207563358/1.webp",
        images: [
            "/assets/productos/Yupoo/207563358/2.webp",
            "/assets/productos/Yupoo/207563358/3.webp",
            "/assets/productos/Yupoo/207563358/4.webp",
            "/assets/productos/Yupoo/207563358/5.webp",
            "/assets/productos/Yupoo/207563358/6.webp",
            "/assets/productos/Yupoo/207563358/7.webp",
            "/assets/productos/Yupoo/207563358/8.webp"
        ],
        imageAlt: "Valladolid 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207563358?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "207563358"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 945475,
        name: "Real Betis 25/26 Tercera",
        slug: "real-betis-2526-tercera",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/207560329/1.webp",
        images: [
            "/assets/productos/Yupoo/207560329/2.webp",
            "/assets/productos/Yupoo/207560329/3.webp",
            "/assets/productos/Yupoo/207560329/4.webp",
            "/assets/productos/Yupoo/207560329/5.webp",
            "/assets/productos/Yupoo/207560329/6.webp",
            "/assets/productos/Yupoo/207560329/7.webp",
            "/assets/productos/Yupoo/207560329/8.webp",
            "/assets/productos/Yupoo/207560329/9.webp",
            "/assets/productos/Yupoo/207560329/10.webp",
            "/assets/productos/Yupoo/207560329/11.webp"
        ],
        imageAlt: "Real Betis 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207560329?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "207560329"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 520253,
        name: "Deportivo La Coruna 25/26 Local",
        slug: "deportivo-la-coruna-2526-local",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/207558615/1.webp",
        images: [
            "/assets/productos/Yupoo/207558615/2.webp",
            "/assets/productos/Yupoo/207558615/3.webp",
            "/assets/productos/Yupoo/207558615/4.webp",
            "/assets/productos/Yupoo/207558615/5.webp",
            "/assets/productos/Yupoo/207558615/6.webp",
            "/assets/productos/Yupoo/207558615/7.webp",
            "/assets/productos/Yupoo/207558615/8.webp",
            "/assets/productos/Yupoo/207558615/9.webp"
        ],
        imageAlt: "Deportivo La Coruna 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207558615?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "207558615"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 811678,
        name: "Deportivo La Coruna 25/26 Tercera",
        slug: "deportivo-la-coruna-2526-tercera",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/207558748/1.webp",
        images: [
            "/assets/productos/Yupoo/207558748/2.webp",
            "/assets/productos/Yupoo/207558748/3.webp",
            "/assets/productos/Yupoo/207558748/4.webp",
            "/assets/productos/Yupoo/207558748/5.webp",
            "/assets/productos/Yupoo/207558748/6.webp",
            "/assets/productos/Yupoo/207558748/7.webp",
            "/assets/productos/Yupoo/207558748/8.webp"
        ],
        imageAlt: "Deportivo La Coruna 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207558748?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "207558748"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 199666,
        name: "Celta 25/26 Tercera",
        slug: "celta-2526-tercera",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/207557734/1.webp",
        images: [
            "/assets/productos/Yupoo/207557734/2.webp",
            "/assets/productos/Yupoo/207557734/3.webp",
            "/assets/productos/Yupoo/207557734/4.webp",
            "/assets/productos/Yupoo/207557734/5.webp",
            "/assets/productos/Yupoo/207557734/6.webp",
            "/assets/productos/Yupoo/207557734/7.webp",
            "/assets/productos/Yupoo/207557734/8.webp",
            "/assets/productos/Yupoo/207557734/9.webp"
        ],
        imageAlt: "Celta 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207557734?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "207557734"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 987640,
        name: "Celta 25/26 Visitante",
        slug: "celta-2526-visitante",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/203698925/1.webp",
        images: [
            "/assets/productos/Yupoo/203698925/2.webp",
            "/assets/productos/Yupoo/203698925/3.webp",
            "/assets/productos/Yupoo/203698925/4.webp",
            "/assets/productos/Yupoo/203698925/5.webp",
            "/assets/productos/Yupoo/203698925/6.webp",
            "/assets/productos/Yupoo/203698925/7.webp",
            "/assets/productos/Yupoo/203698925/8.webp",
            "/assets/productos/Yupoo/203698925/9.webp"
        ],
        imageAlt: "Celta 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/203698925?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "203698925"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 951872,
        name: "Real Madrid 90/92 Local Retro",
        slug: "real-madrid-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/201351646/1.webp",
        images: [
            "/assets/productos/Yupoo/201351646/2.webp",
            "/assets/productos/Yupoo/201351646/3.webp",
            "/assets/productos/Yupoo/201351646/4.webp",
            "/assets/productos/Yupoo/201351646/5.webp",
            "/assets/productos/Yupoo/201351646/6.webp",
            "/assets/productos/Yupoo/201351646/7.webp",
            "/assets/productos/Yupoo/201351646/8.webp"
        ],
        imageAlt: "Real Madrid Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/201351646?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "201351646"
        },
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 385774,
        name: "Girona 25/26 Visitante",
        slug: "girona-2526-visitante",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/201350059/1.webp",
        images: [
            "/assets/productos/Yupoo/201350059/2.webp",
            "/assets/productos/Yupoo/201350059/3.webp",
            "/assets/productos/Yupoo/201350059/4.webp",
            "/assets/productos/Yupoo/201350059/5.webp",
            "/assets/productos/Yupoo/201350059/6.webp",
            "/assets/productos/Yupoo/201350059/7.webp",
            "/assets/productos/Yupoo/201350059/8.webp",
            "/assets/productos/Yupoo/201350059/9.webp",
            "/assets/productos/Yupoo/201350059/10.webp"
        ],
        imageAlt: "Girona 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/201350059?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "201350059"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-XXL"
    },
    {
        id: 126754,
        name: "Cadiz 25/26 Local",
        slug: "cadiz-2526-local",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/200370927/1.webp",
        images: [
            "/assets/productos/Yupoo/200370927/2.webp",
            "/assets/productos/Yupoo/200370927/3.webp",
            "/assets/productos/Yupoo/200370927/4.webp",
            "/assets/productos/Yupoo/200370927/5.webp",
            "/assets/productos/Yupoo/200370927/6.webp",
            "/assets/productos/Yupoo/200370927/7.webp",
            "/assets/productos/Yupoo/200370927/8.webp"
        ],
        imageAlt: "Cadiz 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/200370927?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "200370927"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 489081,
        name: "Zaragoza Local Retro",
        slug: "zaragoza-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/199217731/1.webp",
        images: [
            "/assets/productos/Yupoo/199217731/2.webp",
            "/assets/productos/Yupoo/199217731/3.webp",
            "/assets/productos/Yupoo/199217731/4.webp",
            "/assets/productos/Yupoo/199217731/5.webp",
            "/assets/productos/Yupoo/199217731/6.webp",
            "/assets/productos/Yupoo/199217731/7.webp",
            "/assets/productos/Yupoo/199217731/8.webp"
        ],
        imageAlt: "Zaragoza Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/199217731?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "199217731"
        },
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 891737,
        name: "Real Madrid 25/26 Black",
        slug: "real-madrid-2526-black",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/197579658/1.webp",
        images: [
            "/assets/productos/Yupoo/197579658/2.webp",
            "/assets/productos/Yupoo/197579658/3.webp",
            "/assets/productos/Yupoo/197579658/4.webp",
            "/assets/productos/Yupoo/197579658/5.webp",
            "/assets/productos/Yupoo/197579658/6.webp",
            "/assets/productos/Yupoo/197579658/7.webp",
            "/assets/productos/Yupoo/197579658/8.webp"
        ],
        imageAlt: "Real Madrid 25/26 Black - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/197579658?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "197579658"
        },
        temporada: "25/26",
        tallas: "S-XXL"
    },
    {
        id: 737878,
        name: "Zaragoza 97/98 Local Retro",
        slug: "zaragoza-9798-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/197575643/1.webp",
        images: [
            "/assets/productos/Yupoo/197575643/2.webp",
            "/assets/productos/Yupoo/197575643/3.webp",
            "/assets/productos/Yupoo/197575643/4.webp",
            "/assets/productos/Yupoo/197575643/5.webp",
            "/assets/productos/Yupoo/197575643/6.webp",
            "/assets/productos/Yupoo/197575643/7.webp",
            "/assets/productos/Yupoo/197575643/8.webp"
        ],
        imageAlt: "Zaragoza 97/98 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/197575643?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "197575643"
        },
        temporada: "97/98",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 745212,
        name: "Getafe 09/10 Local Retro",
        slug: "getafe-0910-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/192258362/1.webp",
        images: [
            "/assets/productos/Yupoo/192258362/2.webp",
            "/assets/productos/Yupoo/192258362/3.webp",
            "/assets/productos/Yupoo/192258362/4.webp",
            "/assets/productos/Yupoo/192258362/5.webp",
            "/assets/productos/Yupoo/192258362/6.webp",
            "/assets/productos/Yupoo/192258362/7.webp",
            "/assets/productos/Yupoo/192258362/8.webp"
        ],
        imageAlt: "Getafe 09/10 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/192258362?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "192258362"
        },
        temporada: "09/10",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 144708,
        name: "Málaga CF Stadium Local Retro",
        slug: "malaga-cf-stadium-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/187757557/1.webp",
        images: [
            "/assets/productos/Yupoo/187757557/2.webp",
            "/assets/productos/Yupoo/187757557/3.webp",
            "/assets/productos/Yupoo/187757557/4.webp",
            "/assets/productos/Yupoo/187757557/5.webp",
            "/assets/productos/Yupoo/187757557/6.webp",
            "/assets/productos/Yupoo/187757557/7.webp",
            "/assets/productos/Yupoo/187757557/8.webp"
        ],
        imageAlt: "Málaga CF Stadium Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/187757557?uid=1&isSubCate=false&referrercate=2962411",
            albumId: "187757557"
        },
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 294032,
        name: "Italia 2026 Local",
        slug: "italia-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/219491302/1.webp",
        images: [
            "/assets/productos/Yupoo/219491302/2.webp"
        ],
        imageAlt: "Italia 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/219491302?uid=1&isSubCate=false&referrercate=545635",
            albumId: "219491302"
        },
        tipo: "local",
        tallas: "S-4XL",
        temporada: "2026"
    },
    {
        id: 737806,
        name: "Inglaterra 2026 Local",
        slug: "inglaterra-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/219490998/1.webp",
        images: [
            "/assets/productos/Yupoo/219490998/2.webp"
        ],
        imageAlt: "Inglaterra 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/219490998?uid=1&isSubCate=false&referrercate=545635",
            albumId: "219490998"
        },
        tipo: "local",
        tallas: "S-4XL",
        temporada: "2026"
    },
    {
        id: 120417,
        name: "Alemania 2026 Local",
        slug: "alemania-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/219463186/1.webp",
        images: [
            "/assets/productos/Yupoo/219463186/2.webp"
        ],
        imageAlt: "Alemania 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/219463186?uid=1&isSubCate=false&referrercate=545635",
            albumId: "219463186"
        },
        tipo: "local",
        tallas: "S-4XL",
        temporada: "2026"
    },
    {
        id: 905466,
        name: "Venezuela 2026 Local",
        slug: "venezuela-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/218139532/1.webp",
        images: [
            "/assets/productos/Yupoo/218139532/2.webp"
        ],
        imageAlt: "Venezuela Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/218139532?uid=1&isSubCate=false&referrercate=545635",
            albumId: "218139532"
        },
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 882796,
        name: "España 2026 Local",
        slug: "espaa-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/218139402/1.webp",
        images: [
            "/assets/productos/Yupoo/218139402/2.webp"
        ],
        imageAlt: "España 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/218139402?uid=1&isSubCate=false&referrercate=545635",
            albumId: "218139402"
        },
        tipo: "local",
        tallas: "S-4XL",
        temporada: "2026"
    },
    {
        id: 431137,
        name: "Costa Rica 2026 Local",
        slug: "costa-rica-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/218138743/1.webp",
        images: [
            "/assets/productos/Yupoo/218138743/2.webp"
        ],
        imageAlt: "Costa Rica Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/218138743?uid=1&isSubCate=false&referrercate=545635",
            albumId: "218138743"
        },
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 238510,
        name: "Atlético Mineiro 25/26 Tercera",
        slug: "atletico-mineiro-2526-tercera",
        category: "futbol",
        league: "brasileirao",
        price: 0,
        image: "/assets/productos/Yupoo/216807613/1.webp",
        images: [
            "/assets/productos/Yupoo/216807613/2.webp"
        ],
        imageAlt: "Atlético Mineiro 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216807613?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216807613"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 671227,
        name: "Al-Hilal 25/26 Local",
        slug: "al-hilal-2526-local",
        category: "futbol",
        league: "ligaarabe",
        price: 0,
        image: "/assets/productos/Yupoo/216806586/1.webp",
        images: [
            "/assets/productos/Yupoo/216806586/2.webp"
        ],
        imageAlt: "Al-Hilal 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216806586?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216806586"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 729212,
        name: "Al-Hilal 25/26 Local",
        slug: "al-hilal-2526-local-dorado",
        category: "futbol",
        league: "ligaarabe",
        price: 0,
        image: "/assets/productos/Yupoo/216806631/1.webp",
        images: [
            "/assets/productos/Yupoo/216806631/2.webp"
        ],
        imageAlt: "Al-Hilal 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216806631?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216806631"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 984139,
        name: "Al-Hilal 25/26 Tercera",
        slug: "al-hilal-2526-tercera",
        category: "futbol",
        league: "ligaarabe",
        price: 0,
        image: "/assets/productos/Yupoo/216806537/1.webp",
        images: [
            "/assets/productos/Yupoo/216806537/2.webp"
        ],
        imageAlt: "Al-Hilal 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216806537?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216806537"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 144601,
        name: "Flamengo 25/26",
        slug: "flamengo-2526",
        category: "futbol",
        league: "brasileirao",
        price: 0,
        image: "/assets/productos/Yupoo/216806071/1.webp",
        images: [
            "/assets/productos/Yupoo/216806071/2.webp"
        ],
        imageAlt: "Flamengo 25/26 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216806071?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216806071"
        },
        temporada: "25/26",
        tallas: "S-4XL"
    },
    {
        id: 666279,
        name: "Flamengo black 25/26",
        slug: "flamengo-black-2526",
        category: "futbol",
        league: "brasileirao",
        price: 0,
        image: "/assets/productos/Yupoo/216806004/1.webp",
        images: [
            "/assets/productos/Yupoo/216806004/2.webp"
        ],
        imageAlt: "Flamengo black 25/26 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216806004?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216806004"
        },
        temporada: "25/26",
        tallas: "S-4XL"
    },
    {
        id: 791626,
        name: "México 2026 Local",
        slug: "mxico-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/216441726/1.webp",
        images: [
            "/assets/productos/Yupoo/216441726/2.webp"
        ],
        imageAlt: "México 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216441726?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216441726"
        },
        tipo: "local",
        tallas: "S-4XL",
        temporada: "2026"
    },
    {
        id: 405261,
        name: "Alemania 2026 Visitante",
        slug: "alemania-2026-visitante",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/216441793/1.webp",
        images: [
            "/assets/productos/Yupoo/216441793/2.webp"
        ],
        imageAlt: "Alemania 2026 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216441793?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216441793"
        },
        tipo: "visitante",
        tallas: "S-4XL",
        temporada: "2026"
    },
    {
        id: 613571,
        name: "Portugal 2026 Local",
        slug: "portugal-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/216441953/1.webp",
        images: [
            "/assets/productos/Yupoo/216441953/2.webp"
        ],
        imageAlt: "Portugal 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216441953?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216441953"
        },
        temporada: "2026",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 851677,
        name: "Al Ahli 26/27 Visitante",
        slug: "al-ahli-2627-visitante",
        category: "futbol",
        league: "ligaarabe",
        price: 0,
        image: "/assets/productos/Yupoo/216423857/1.webp",
        images: [
            "/assets/productos/Yupoo/216423857/2.webp"
        ],
        imageAlt: "Al Ahli 26/27 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216423857?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216423857"
        },
        temporada: "26/27",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 382204,
        name: "Al Ahli 26/27 Local",
        slug: "al-ahli-2627-local",
        category: "futbol",
        league: "ligaarabe",
        price: 0,
        image: "/assets/productos/Yupoo/216423781/1.webp",
        images: [
            "/assets/productos/Yupoo/216423781/2.webp"
        ],
        imageAlt: "Al Ahli 26/27 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216423781?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216423781"
        },
        temporada: "26/27",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 523301,
        name: "Inter Milan 25/26 Tercera",
        slug: "inter-milan-2526-tercera",
        category: "futbol",
        league: "seriea",
        price: 0,
        image: "/assets/productos/Yupoo/216420875/1.webp",
        images: [
            "/assets/productos/Yupoo/216420875/2.webp"
        ],
        imageAlt: "Inter Milan 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216420875?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216420875"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 968048,
        name: "Chelsea 25/26 Tercera",
        slug: "chelsea-2526-tercera",
        category: "futbol",
        league: "premier",
        price: 0,
        image: "/assets/productos/Yupoo/216420668/1.webp",
        images: [
            "/assets/productos/Yupoo/216420668/2.webp"
        ],
        imageAlt: "Chelsea 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216420668?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216420668"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 407027,
        name: "Atlético Mineiro 25/26",
        slug: "atletico-mineiro-2526",
        category: "futbol",
        league: "brasileirao",
        price: 0,
        image: "/assets/productos/Yupoo/213836929/1.webp",
        images: [
            "/assets/productos/Yupoo/213836929/2.webp"
        ],
        imageAlt: "Atlético Mineiro 25/26 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/213836929?uid=1&isSubCate=false&referrercate=545635",
            albumId: "213836929"
        },
        temporada: "25/26",
        tallas: "S-4XL"
    },
    {
        id: 851556,
        name: "Santos 25/26 Visitante",
        slug: "santos-2526-visitante",
        category: "futbol",
        league: "brasileirao",
        price: 0,
        image: "/assets/productos/Yupoo/213836761/1.webp",
        images: [
            "/assets/productos/Yupoo/213836761/2.webp"
        ],
        imageAlt: "Santos 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/213836761?uid=1&isSubCate=false&referrercate=545635",
            albumId: "213836761"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 382182,
        name: "Santa Cruz 25/26 Visitante",
        slug: "santa-cruz-2526-visitante",
        category: "futbol",
        league: "brasileirao",
        price: 0,
        image: "/assets/productos/Yupoo/213836701/1.webp",
        images: [
            "/assets/productos/Yupoo/213836701/2.webp"
        ],
        imageAlt: "Santa Cruz 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/213836701?uid=1&isSubCate=false&referrercate=545635",
            albumId: "213836701"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 162492,
        name: "Inter Milan 25/26 Local",
        slug: "inter-milan-2526-local",
        category: "futbol",
        league: "seriea",
        price: 0,
        image: "/assets/productos/Yupoo/212532108/1.webp",
        images: [
            "/assets/productos/Yupoo/212532108/2.webp"
        ],
        imageAlt: "Inter Milan 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/212532108?uid=1&isSubCate=false&referrercate=545635",
            albumId: "212532108"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 637422,
        name: "West Ham United 25/26 Tercera",
        slug: "west-ham-united-2526-tercera",
        category: "futbol",
        league: "premier",
        price: 0,
        image: "/assets/productos/Yupoo/211519379/1.webp",
        images: [
            "/assets/productos/Yupoo/211519379/2.webp",
            "/assets/productos/Yupoo/211519379/3.webp",
            "/assets/productos/Yupoo/211519379/4.webp",
            "/assets/productos/Yupoo/211519379/5.webp",
            "/assets/productos/Yupoo/211519379/6.webp",
            "/assets/productos/Yupoo/211519379/7.webp",
            "/assets/productos/Yupoo/211519379/8.webp"
        ],
        imageAlt: "West Ham United 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/211519379?uid=1&isSubCate=false&referrercate=545635",
            albumId: "211519379"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 580856,
        name: "Wolves 25/26 Local",
        slug: "wolves-2526-local",
        category: "futbol",
        league: "premier",
        price: 0,
        image: "/assets/productos/Yupoo/211519500/1.webp",
        images: [
            "/assets/productos/Yupoo/211519500/2.webp",
            "/assets/productos/Yupoo/211519500/3.webp",
            "/assets/productos/Yupoo/211519500/4.webp",
            "/assets/productos/Yupoo/211519500/5.webp",
            "/assets/productos/Yupoo/211519500/6.webp",
            "/assets/productos/Yupoo/211519500/7.webp",
            "/assets/productos/Yupoo/211519500/8.webp"
        ],
        imageAlt: "Wolves 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/211519500?uid=1&isSubCate=false&referrercate=545635",
            albumId: "211519500"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 638151,
        name: "PSG 00/01 Local Retro",
        slug: "psg-0001-local-retro",
        category: "futbol",
        league: "ligue1",
        price: 0,
        image: "/assets/productos/Yupoo/211235324/1.webp",
        images: [
            "/assets/productos/Yupoo/211235324/2.webp",
            "/assets/productos/Yupoo/211235324/3.webp",
            "/assets/productos/Yupoo/211235324/4.webp",
            "/assets/productos/Yupoo/211235324/5.webp",
            "/assets/productos/Yupoo/211235324/6.webp"
        ],
        imageAlt: "PSG 00/01 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/211235324?uid=1&isSubCate=false&referrercate=545635",
            albumId: "211235324"
        },
        temporada: "00/01",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 829143,
        name: "Alemania 2008 Local Retro",
        slug: "alemania-2008-local-retro",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/211517757/1.webp",
        images: [
            "/assets/productos/Yupoo/211517757/2.webp",
            "/assets/productos/Yupoo/211517757/3.webp",
            "/assets/productos/Yupoo/211517757/4.webp",
            "/assets/productos/Yupoo/211517757/5.webp",
            "/assets/productos/Yupoo/211517757/6.webp"
        ],
        imageAlt: "Alemania 2008 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/211517757?uid=1&isSubCate=false&referrercate=545635",
            albumId: "211517757"
        },
        temporada: "2008",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 861810,
        name: "Holanda 2004 Local Retro",
        slug: "holanda-2004-local-retro",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/211235265/1.webp",
        images: [
            "/assets/productos/Yupoo/211235265/2.webp",
            "/assets/productos/Yupoo/211235265/3.webp",
            "/assets/productos/Yupoo/211235265/4.webp",
            "/assets/productos/Yupoo/211235265/5.webp",
            "/assets/productos/Yupoo/211235265/6.webp"
        ],
        imageAlt: "Holanda 2004 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/211235265?uid=1&isSubCate=false&referrercate=545635",
            albumId: "211235265"
        },
        temporada: "2004",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 740108,
        name: "Holanda 2004 Visitante Retro",
        slug: "holanda-2004-visitante-retro",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/211235213/1.webp",
        images: [
            "/assets/productos/Yupoo/211235213/2.webp",
            "/assets/productos/Yupoo/211235213/3.webp",
            "/assets/productos/Yupoo/211235213/4.webp",
            "/assets/productos/Yupoo/211235213/5.webp",
            "/assets/productos/Yupoo/211235213/6.webp",
            "/assets/productos/Yupoo/211235213/7.webp"
        ],
        imageAlt: "Holanda 2004 Visitante Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/211235213?uid=1&isSubCate=false&referrercate=545635",
            albumId: "211235213"
        },
        temporada: "2004",
        tipo: "visitante",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 431236,
        name: "Sao Paulo 25/26 Tercera",
        slug: "sao-paulo-2526-tercera",
        category: "futbol",
        league: "brasileirao",
        price: 0,
        image: "/assets/productos/Yupoo/211234781/1.webp",
        images: [
            "/assets/productos/Yupoo/211234781/2.webp",
            "/assets/productos/Yupoo/211234781/3.webp",
            "/assets/productos/Yupoo/211234781/4.webp",
            "/assets/productos/Yupoo/211234781/5.webp",
            "/assets/productos/Yupoo/211234781/6.webp",
            "/assets/productos/Yupoo/211234781/7.webp",
            "/assets/productos/Yupoo/211234781/8.webp"
        ],
        imageAlt: "Sao Paulo 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/211234781?uid=1&isSubCate=false&referrercate=545635",
            albumId: "211234781"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 549694,
        name: "Sporting Lisboa 25/26",
        slug: "sporting-Lisboa-2526",
        category: "futbol",
        league: "Primeira Liga",
        price: 0,
        image: "/assets/productos/Yupoo/208905010/1.webp",
        images: [
            "/assets/productos/Yupoo/208905010/2.webp",
            "/assets/productos/Yupoo/208905010/3.webp",
            "/assets/productos/Yupoo/208905010/4.webp",
            "/assets/productos/Yupoo/208905010/5.webp",
            "/assets/productos/Yupoo/208905010/6.webp",
            "/assets/productos/Yupoo/208905010/7.webp"
        ],
        imageAlt: "Sporting Lisboa 25/26 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/208905010?uid=1&isSubCate=false&referrercate=545635",
            albumId: "208905010"
        },
        temporada: "25/26",
        tallas: "S-4XL"
    },
    {
        id: 535164,
        name: "Sporting Lisboa Green 25/26",
        slug: "sporting-Lisboa-green-2526",
        category: "futbol",
        league: "Primeira Liga",
        price: 0,
        image: "/assets/productos/Yupoo/216420441/1.webp",
        images: [
            "/assets/productos/Yupoo/216420441/2.webp"
        ],
        imageAlt: "Sporting Lisboa Green 25/26 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216420441?uid=1",
            albumId: "216420441"
        },
        temporada: "25/26",
        tallas: "S-4XL"
    },
    {
        id: 351327,
        name: "Sporting Lisboa cyan 25/26",
        slug: "sporting-Lisboa-cyan-2526",
        category: "futbol",
        league: "Primeira Liga",
        price: 0,
        image: "/assets/productos/Yupoo/216420176/1.webp",
        images: [
            "/assets/productos/Yupoo/216420176/2.webp"
        ],
        imageAlt: "Sporting Lisboa cyan 25/26 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216420176?uid=1",
            albumId: "216420176"
        },
        temporada: "25/26",
        tallas: "S-4XL"
    },
    {
        id: 316255,
        name: "Sporting Lisboa Edición Conmemorativa 25/26",
        slug: "sporting-Lisboa-commemorative-edition-2526",
        category: "futbol",
        league: "Primeira Liga",
        price: 0,
        image: "/assets/productos/Yupoo/216420592/1.webp",
        images: [
            "/assets/productos/Yupoo/216420592/2.webp"
        ],
        imageAlt: "Sporting Lisboa Commemorative Edition 25/26 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216420592?uid=1",
            albumId: "216420592"
        },
        temporada: "25/26",
        tallas: "S-4XL"
    },
    {
        id: 755900,
        name: "Colombia 2026 Visitante",
        slug: "colombia-2026-visitante",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/219490648/1.webp",
        images: [
            "/assets/productos/Yupoo/219490648/2.webp"
        ],
        imageAlt: "Colombia 2026 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/219490648?uid=1&isSubCate=false&referrercate=545635",
            albumId: "219490648"
        },
        temporada: "2026",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 475090,
        name: "Bélgica 2026 Local",
        slug: "belgica-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/219490303/1.webp",
        images: [
            "/assets/productos/Yupoo/219490303/2.webp"
        ],
        imageAlt: "Bélgica 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/219490303?uid=1&isSubCate=false&referrercate=545635",
            albumId: "219490303"
        },
        temporada: "2026",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 122777,
        name: "Portugal 2026 Visitante",
        slug: "portugal-2026-visitante",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/219464146/1.webp",
        images: [
            "/assets/productos/Yupoo/219464146/2.webp"
        ],
        imageAlt: "Portugal 2026 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/219464146?uid=1&isSubCate=false&referrercate=545635",
            albumId: "219464146"
        },
        temporada: "2026",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 443462,
        name: "Norway 2026 Local",
        slug: "norway-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/219490239/1.webp",
        images: [
            "/assets/productos/Yupoo/219490239/2.webp"
        ],
        imageAlt: "Norway 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/219490239?uid=1&isSubCate=false&referrercate=545635",
            albumId: "219490239"
        },
        temporada: "2026",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 935379,
        name: "Wales 2026 Local",
        slug: "wales-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/219464881/1.webp",
        images: [
            "/assets/productos/Yupoo/219464881/2.webp"
        ],
        imageAlt: "Wales 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/219464881?uid=1&isSubCate=false&referrercate=545635",
            albumId: "219464881"
        },
        temporada: "2026",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 938860,
        name: "Portugal 2026",
        slug: "portugal-2026",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/219464642/1.webp",
        images: [
            "/assets/productos/Yupoo/219464642/2.webp"
        ],
        imageAlt: "Portugal 2026 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/219464642?uid=1&isSubCate=false&referrercate=545635",
            albumId: "219464642"
        },
        temporada: "2026",
        tallas: "S-4XL"
    },
    {
        id: 159689,
        name: "Argentina 2026 Local",
        slug: "argentina-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/219462514/1.webp",
        images: [
            "/assets/productos/Yupoo/219462514/2.webp"
        ],
        imageAlt: "Argentina 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/219462514?uid=1&isSubCate=false&referrercate=545635",
            albumId: "219462514"
        },
        temporada: "2026",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 623155,
        name: "Argentina 2026 Portero",
        slug: "argentina-2026-portero",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/219462414/1.webp",
        images: [
            "/assets/productos/Yupoo/219462414/2.webp"
        ],
        imageAlt: "Argentina 2026 Portero - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/219462414?uid=1&isSubCate=false&referrercate=545635",
            albumId: "219462414"
        },
        temporada: "2026",
        tipo: "portero",
        tallas: "S-4XL"
    },
    {
        id: 792005,
        name: "Sweden 2026 Local",
        slug: "sweden-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/218139468/1.webp",
        images: [
            "/assets/productos/Yupoo/218139468/2.webp"
        ],
        imageAlt: "Sweden 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/218139468?uid=1&isSubCate=false&referrercate=545635",
            albumId: "218139468"
        },
        temporada: "2026",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 381663,
        name: "Peru 2026 Local",
        slug: "peru-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/218139206/1.webp",
        images: [
            "/assets/productos/Yupoo/218139206/2.webp"
        ],
        imageAlt: "Peru 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/218139206?uid=1&isSubCate=false&referrercate=545635",
            albumId: "218139206"
        },
        temporada: "2026",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 433188,
        name: "Brasil 2025 Local",
        slug: "brasil-2025-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/216806220/1.webp",
        images: [
            "/assets/productos/Yupoo/216806220/2.webp"
        ],
        imageAlt: "Brasil 2025 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216806220?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216806220"
        },
        temporada: "2025",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 448046,
        name: "Flamengo Red 25/26",
        slug: "flamengo-red-2526",
        category: "futbol",
        league: "brasileirao",
        price: 0,
        image: "/assets/productos/Yupoo/216805953/1.webp",
        images: [
            "/assets/productos/Yupoo/216805953/2.webp"
        ],
        imageAlt: "Flamengo Red 25/26 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216805953?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216805953"
        },
        temporada: "25/26",
        tallas: "S-4XL"
    },
    {
        id: 571063,
        name: "Chile 2026 Local",
        slug: "chile-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/216442420/1.webp",
        images: [
            "/assets/productos/Yupoo/216442420/2.webp"
        ],
        imageAlt: "Chile 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216442420?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216442420"
        },
        temporada: "2026",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 711830,
        name: "Portugal 2026 Visitante",
        slug: "portugal-2026-visitante",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/216442463/1.webp",
        images: [
            "/assets/productos/Yupoo/216442463/2.webp"
        ],
        imageAlt: "Portugal 2026 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216442463?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216442463"
        },
        temporada: "2026",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 320201,
        name: "Colombia 2026 Local",
        slug: "Colombia-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/216442560/2.webp",
        images: [
            "/assets/productos/Yupoo/216442560/1.webp"
        ],
        imageAlt: "Colombia 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216442560?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216442560"
        },
        temporada: "2026",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 670833,
        name: "México 2026 Visitante",
        slug: "mexico-2026-visitante",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/216442511/1.webp",
        images: [
            "/assets/productos/Yupoo/216442511/2.webp"
        ],
        imageAlt: "México 2026 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216442511?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216442511"
        },
        temporada: "2026",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 417471,
        name: "Italia 2026 Visitante",
        slug: "italia-2026-visitante",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/216441659/1.webp",
        images: [
            "/assets/productos/Yupoo/216441659/2.webp"
        ],
        imageAlt: "Italia 2026 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216441659?uid=1&isSubCate=false&referrercate=545635",
            albumId: "216441659"
        },
        temporada: "2026",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 993378,
        name: "Celta Tercera Retro",
        slug: "celta-tercera-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/207564422/1.webp",
        images: [
            "/assets/productos/Yupoo/207564422/2.webp",
            "/assets/productos/Yupoo/207564422/3.webp",
            "/assets/productos/Yupoo/207564422/4.webp",
            "/assets/productos/Yupoo/207564422/5.webp",
            "/assets/productos/Yupoo/207564422/6.webp",
            "/assets/productos/Yupoo/207564422/7.webp",
            "/assets/productos/Yupoo/207564422/8.webp"
        ],
        imageAlt: "Celta Tercera Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207564422?uid=1&isSubCate=false&referrercate=545635",
            albumId: "207564422"
        },
        tipo: "tercera",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 553992,
        name: "Real Oviedo 90/91 Local Retro",
        slug: "real-oviedo-9091-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/207564621/1.webp",
        images: [
            "/assets/productos/Yupoo/207564621/2.webp",
            "/assets/productos/Yupoo/207564621/3.webp",
            "/assets/productos/Yupoo/207564621/4.webp",
            "/assets/productos/Yupoo/207564621/5.webp",
            "/assets/productos/Yupoo/207564621/6.webp",
            "/assets/productos/Yupoo/207564621/7.webp",
            "/assets/productos/Yupoo/207564621/8.webp"
        ],
        imageAlt: "Real Oviedo 90/91 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207564621?uid=1&isSubCate=false&referrercate=545635",
            albumId: "207564621"
        },
        temporada: "90/91",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 484880,
        name: "Atletico Madrid 02/03 Visitante Retro",
        slug: "atletico-madrid-0203-visitante-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/207563853/1.webp",
        images: [
            "/assets/productos/Yupoo/207563853/2.webp",
            "/assets/productos/Yupoo/207563853/3.webp",
            "/assets/productos/Yupoo/207563853/4.webp",
            "/assets/productos/Yupoo/207563853/5.webp",
            "/assets/productos/Yupoo/207563853/6.webp",
            "/assets/productos/Yupoo/207563853/7.webp",
            "/assets/productos/Yupoo/207563853/8.webp"
        ],
        imageAlt: "Atletico Madrid 02/03 Visitante Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207563853?uid=1&isSubCate=false&referrercate=545635",
            albumId: "207563853"
        },
        temporada: "02/03",
        tipo: "visitante",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 113368,
        name: "Atletico Madrid 10/11 Visitante Retro",
        slug: "atletico-madrid-1011-visitante-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/207564138/1.webp",
        images: [
            "/assets/productos/Yupoo/207564138/2.webp",
            "/assets/productos/Yupoo/207564138/3.webp",
            "/assets/productos/Yupoo/207564138/4.webp",
            "/assets/productos/Yupoo/207564138/5.webp",
            "/assets/productos/Yupoo/207564138/6.webp",
            "/assets/productos/Yupoo/207564138/7.webp",
            "/assets/productos/Yupoo/207564138/8.webp",
            "/assets/productos/Yupoo/207564138/9.webp"
        ],
        imageAlt: "Atletico Madrid 10/11 Visitante Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207564138?uid=1&isSubCate=false&referrercate=545635",
            albumId: "207564138"
        },
        temporada: "10/11",
        tipo: "visitante",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 497909,
        name: "Newcastle United 25/26 Visitante",
        slug: "newcastle-united-2526-visitante",
        category: "futbol",
        league: "premier",
        price: 0,
        image: "/assets/productos/Yupoo/207559992/1.webp",
        images: [
            "/assets/productos/Yupoo/207559992/2.webp",
            "/assets/productos/Yupoo/207559992/3.webp",
            "/assets/productos/Yupoo/207559992/4.webp",
            "/assets/productos/Yupoo/207559992/5.webp",
            "/assets/productos/Yupoo/207559992/6.webp",
            "/assets/productos/Yupoo/207559992/7.webp",
            "/assets/productos/Yupoo/207559992/8.webp"
        ],
        imageAlt: "Newcastle United 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207559992?uid=1&isSubCate=false&referrercate=545635",
            albumId: "207559992"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 540044,
        name: "Schalke 04 25/26 Tercera",
        slug: "schalke-04-2526-tercera",
        category: "futbol",
        league: "bundesliga",
        price: 0,
        image: "/assets/productos/Yupoo/207561041/1.webp",
        images: [
            "/assets/productos/Yupoo/207561041/2.webp",
            "/assets/productos/Yupoo/207561041/3.webp",
            "/assets/productos/Yupoo/207561041/4.webp",
            "/assets/productos/Yupoo/207561041/5.webp",
            "/assets/productos/Yupoo/207561041/6.webp",
            "/assets/productos/Yupoo/207561041/7.webp",
            "/assets/productos/Yupoo/207561041/8.webp"
        ],
        imageAlt: "Schalke 04 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207561041?uid=1&isSubCate=false&referrercate=545635",
            albumId: "207561041"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 985030,
        name: "Brighton 25/26 Local",
        slug: "brighton-2526-local",
        category: "futbol",
        league: "premier",
        price: 0,
        image: "/assets/productos/Yupoo/207557639/1.webp",
        images: [
            "/assets/productos/Yupoo/207557639/2.webp",
            "/assets/productos/Yupoo/207557639/3.webp",
            "/assets/productos/Yupoo/207557639/4.webp",
            "/assets/productos/Yupoo/207557639/5.webp",
            "/assets/productos/Yupoo/207557639/6.webp",
            "/assets/productos/Yupoo/207557639/7.webp",
            "/assets/productos/Yupoo/207557639/8.webp"
        ],
        imageAlt: "Brighton 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207557639?uid=1&isSubCate=false&referrercate=545635",
            albumId: "207557639"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 744047,
        name: "Sporting Gijon 25/26 Local",
        slug: "sporting-gijon-2526-local",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/207450991/1.webp",
        images: [
            "/assets/productos/Yupoo/207450991/2.webp",
            "/assets/productos/Yupoo/207450991/3.webp",
            "/assets/productos/Yupoo/207450991/4.webp",
            "/assets/productos/Yupoo/207450991/5.webp"
        ],
        imageAlt: "Sporting Gijon 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207450991?uid=1&isSubCate=false&referrercate=545635",
            albumId: "207450991"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 255670,
        name: "Rayo Vallecano 97/98 Visitante Retro",
        slug: "rayo-vallecano-9798-visitante-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/207451208/1.webp",
        images: [
            "/assets/productos/Yupoo/207451208/2.webp",
            "/assets/productos/Yupoo/207451208/3.webp",
            "/assets/productos/Yupoo/207451208/4.webp",
            "/assets/productos/Yupoo/207451208/5.webp",
            "/assets/productos/Yupoo/207451208/6.webp",
            "/assets/productos/Yupoo/207451208/7.webp",
            "/assets/productos/Yupoo/207451208/8.webp"
        ],
        imageAlt: "Rayo Vallecano 97/98 Visitante Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207451208?uid=1&isSubCate=false&referrercate=545635",
            albumId: "207451208"
        },
        temporada: "97/98",
        tipo: "visitante",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 178706,
        name: "Rayo Vallecano 97/98 Local Retro",
        slug: "rayo-vallecano-9798-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/207451307/1.webp",
        images: [
            "/assets/productos/Yupoo/207451307/2.webp",
            "/assets/productos/Yupoo/207451307/3.webp",
            "/assets/productos/Yupoo/207451307/4.webp",
            "/assets/productos/Yupoo/207451307/5.webp"
        ],
        imageAlt: "Rayo Vallecano 97/98 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/207451307?uid=1&isSubCate=false&referrercate=545635",
            albumId: "207451307"
        },
        temporada: "97/98",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 155990,
        name: "Monaco 25/26 Local",
        slug: "monaco-2526-local",
        category: "futbol",
        league: "ligue1",
        price: 0,
        image: "/assets/productos/Yupoo/204720362/1.webp",
        images: [
            "/assets/productos/Yupoo/204720362/2.webp",
            "/assets/productos/Yupoo/204720362/3.webp",
            "/assets/productos/Yupoo/204720362/4.webp",
            "/assets/productos/Yupoo/204720362/5.webp"
        ],
        imageAlt: "Monaco 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/204720362?uid=1&isSubCate=false&referrercate=545635",
            albumId: "204720362"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-XXL"
    },
    {
        id: 776038,
        name: "Monaco 25/26 Tercera",
        slug: "monaco-2526-tercera",
        category: "futbol",
        league: "ligue1",
        price: 0,
        image: "/assets/productos/Yupoo/204720483/1.webp",
        images: [
            "/assets/productos/Yupoo/204720483/2.webp",
            "/assets/productos/Yupoo/204720483/3.webp",
            "/assets/productos/Yupoo/204720483/4.webp",
            "/assets/productos/Yupoo/204720483/5.webp",
            "/assets/productos/Yupoo/204720483/6.webp",
            "/assets/productos/Yupoo/204720483/7.webp",
            "/assets/productos/Yupoo/204720483/8.webp"
        ],
        imageAlt: "Monaco 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/204720483?uid=1&isSubCate=false&referrercate=545635",
            albumId: "204720483"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-XXL"
    },
    {
        id: 803718,
        name: "Monaco 25/26 Visitante",
        slug: "monaco-2526-visitante",
        category: "futbol",
        league: "ligue1",
        price: 0,
        image: "/assets/productos/Yupoo/204720187/1.webp",
        images: [
            "/assets/productos/Yupoo/204720187/2.webp",
            "/assets/productos/Yupoo/204720187/3.webp",
            "/assets/productos/Yupoo/204720187/4.webp",
            "/assets/productos/Yupoo/204720187/5.webp",
            "/assets/productos/Yupoo/204720187/6.webp",
            "/assets/productos/Yupoo/204720187/7.webp",
            "/assets/productos/Yupoo/204720187/8.webp"
        ],
        imageAlt: "Monaco 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/204720187?uid=1&isSubCate=false&referrercate=545635",
            albumId: "204720187"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-XXL"
    },
    {
        id: 210794,
        name: "Everton 25/26 Local",
        slug: "everton-2526-local",
        category: "futbol",
        league: "premier",
        price: 0,
        image: "/assets/productos/Yupoo/204718775/1.webp",
        images: [
            "/assets/productos/Yupoo/204718775/2.webp",
            "/assets/productos/Yupoo/204718775/3.webp",
            "/assets/productos/Yupoo/204718775/4.webp",
            "/assets/productos/Yupoo/204718775/5.webp",
            "/assets/productos/Yupoo/204718775/6.webp"
        ],
        imageAlt: "Everton 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/204718775?uid=1&isSubCate=false&referrercate=545635",
            albumId: "204718775"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 762229,
        name: "Roma 25/26 Local",
        slug: "roma-2526-local",
        category: "futbol",
        league: "seriea",
        price: 0,
        image: "/assets/productos/Yupoo/203703113/1.webp",
        images: [
            "/assets/productos/Yupoo/203703113/2.webp",
            "/assets/productos/Yupoo/203703113/3.webp",
            "/assets/productos/Yupoo/203703113/4.webp",
            "/assets/productos/Yupoo/203703113/5.webp",
            "/assets/productos/Yupoo/203703113/6.webp"
        ],
        imageAlt: "Roma 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/203703113?uid=1&isSubCate=false&referrercate=545635",
            albumId: "203703113"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 676633,
        name: "RCD Mallorca 25/26 Visitante",
        slug: "rcd-mallorca-2526-visitante",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/203701729/1.webp",
        images: [
            "/assets/productos/Yupoo/203701729/2.webp",
            "/assets/productos/Yupoo/203701729/3.webp",
            "/assets/productos/Yupoo/203701729/4.webp",
            "/assets/productos/Yupoo/203701729/5.webp",
            "/assets/productos/Yupoo/203701729/6.webp",
            "/assets/productos/Yupoo/203701729/7.webp",
            "/assets/productos/Yupoo/203701729/8.webp"
        ],
        imageAlt: "RCD Mallorca 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/203701729?uid=1&isSubCate=false&referrercate=545635",
            albumId: "203701729"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 869699,
        name: "Marseille 25/26 Visitante",
        slug: "marseille-2526-visitante",
        category: "futbol",
        league: "ligue1",
        price: 0,
        image: "/assets/productos/Yupoo/203701585/1.webp",
        images: [
            "/assets/productos/Yupoo/203701585/2.webp",
            "/assets/productos/Yupoo/203701585/3.webp",
            "/assets/productos/Yupoo/203701585/4.webp",
            "/assets/productos/Yupoo/203701585/5.webp"
        ],
        imageAlt: "Marseille 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/203701585?uid=1&isSubCate=false&referrercate=545635",
            albumId: "203701585"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 747923,
        name: "Marseille 25/26 Local",
        slug: "marseille-2526-local",
        category: "futbol",
        league: "ligue1",
        price: 0,
        image: "/assets/productos/Yupoo/203701618/1.webp",
        images: [
            "/assets/productos/Yupoo/203701618/2.webp",
            "/assets/productos/Yupoo/203701618/3.webp",
            "/assets/productos/Yupoo/203701618/4.webp",
            "/assets/productos/Yupoo/203701618/5.webp"
        ],
        imageAlt: "Marseille 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/203701618?uid=1&isSubCate=false&referrercate=545635",
            albumId: "203701618"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 464510,
        name: "Internacional 25/26 Visitante",
        slug: "internacional-2526-visitante",
        category: "futbol",
        league: "brasileirao",
        price: 0,
        image: "/assets/productos/Yupoo/203701302/1.webp",
        images: [
            "/assets/productos/Yupoo/203701302/2.webp",
            "/assets/productos/Yupoo/203701302/3.webp",
            "/assets/productos/Yupoo/203701302/4.webp",
            "/assets/productos/Yupoo/203701302/5.webp"
        ],
        imageAlt: "Internacional 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/203701302?uid=1&isSubCate=false&referrercate=545635",
            albumId: "203701302"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 881988,
        name: "Sporting Lisboa 25/26 Local",
        slug: "sporting-Lisboa-2526-local",
        category: "futbol",
        league: "Primeira Liga",
        price: 0,
        image: "/assets/productos/Yupoo/202779885/1.webp",
        images: [
            "/assets/productos/Yupoo/202779885/2.webp",
            "/assets/productos/Yupoo/202779885/3.webp",
            "/assets/productos/Yupoo/202779885/4.webp",
            "/assets/productos/Yupoo/202779885/5.webp"
        ],
        imageAlt: "Sporting Lisboa 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/202779885?uid=1&isSubCate=false&referrercate=545635",
            albumId: "202779885"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 959227,
        name: "Athletic Bilbao 25/26 Visitante",
        slug: "athletic-bilbao-2526-visitante",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/203698766/1.webp",
        images: [
            "/assets/productos/Yupoo/203698766/2.webp",
            "/assets/productos/Yupoo/203698766/3.webp",
            "/assets/productos/Yupoo/203698766/4.webp",
            "/assets/productos/Yupoo/203698766/5.webp"
        ],
        imageAlt: "Athletic Bilbao 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/203698766?uid=1&isSubCate=false&referrercate=545635",
            albumId: "203698766"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 883948,
        name: "Inter Milan 25/26 Visitante",
        slug: "inter-milan-2526-visitante",
        category: "futbol",
        league: "seriea",
        price: 0,
        image: "/assets/productos/Yupoo/202779358/1.webp",
        images: [
            "/assets/productos/Yupoo/202779358/2.webp",
            "/assets/productos/Yupoo/202779358/3.webp",
            "/assets/productos/Yupoo/202779358/4.webp",
            "/assets/productos/Yupoo/202779358/5.webp"
        ],
        imageAlt: "Inter Milan 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/202779358?uid=1&isSubCate=false&referrercate=545635",
            albumId: "202779358"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 511048,
        name: "Dortmund 25/26 Local",
        slug: "dortmund-2526-local",
        category: "futbol",
        league: "bundesliga",
        price: 0,
        image: "/assets/productos/Yupoo/202779313/1.webp",
        images: [
            "/assets/productos/Yupoo/202779313/2.webp",
            "/assets/productos/Yupoo/202779313/3.webp",
            "/assets/productos/Yupoo/202779313/4.webp",
            "/assets/productos/Yupoo/202779313/5.webp"
        ],
        imageAlt: "Dortmund 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/202779313?uid=1&isSubCate=false&referrercate=545635",
            albumId: "202779313"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 218012,
        name: "Benfica 25/26 Entrenamiento Negra",
        slug: "benfica-2526-entrenamiento-negra",
        category: "futbol",
        league: "Primeira Liga",
        price: 0,
        image: "/assets/productos/Yupoo/202779248/1.webp",
        images: [
            "/assets/productos/Yupoo/202779248/2.webp",
            "/assets/productos/Yupoo/202779248/3.webp"
        ],
        imageAlt: "Benfica 25/26 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/202779248?uid=1&isSubCate=false&referrercate=545635",
            albumId: "202779248"
        },
        temporada: "25/26",
        tallas: "S-4XL"
    },
    {
        id: 240084,
        name: "Aston Villa 25/26 Local",
        slug: "aston-villa-2526-local",
        category: "futbol",
        league: "premier",
        price: 0,
        image: "/assets/productos/Yupoo/202778698/1.webp",
        images: [
            "/assets/productos/Yupoo/202778698/2.webp",
            "/assets/productos/Yupoo/202778698/3.webp",
            "/assets/productos/Yupoo/202778698/4.webp"
        ],
        imageAlt: "Aston Villa 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/202778698?uid=1&isSubCate=false&referrercate=545635",
            albumId: "202778698"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 899447,
        name: "Ajax 25/26 Local",
        slug: "ajax-2526-local",
        category: "futbol",
        league: "Eredivise",
        price: 0,
        image: "/assets/productos/Yupoo/202778041/1.webp",
        images: [
            "/assets/productos/Yupoo/202778041/2.webp",
            "/assets/productos/Yupoo/202778041/3.webp",
            "/assets/productos/Yupoo/202778041/4.webp"
        ],
        imageAlt: "Ajax 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/202778041?uid=1&isSubCate=false&referrercate=545635",
            albumId: "202778041"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 385548,
        name: "AC Milan 25/26 Tercera",
        slug: "ac-milan-2526-tercera",
        category: "futbol",
        league: "seriea",
        price: 0,
        image: "/assets/productos/Yupoo/202777830/1.webp",
        images: [
            "/assets/productos/Yupoo/202777830/2.webp",
            "/assets/productos/Yupoo/202777830/3.webp",
            "/assets/productos/Yupoo/202777830/4.webp"
        ],
        imageAlt: "AC Milan 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/202777830?uid=1&isSubCate=false&referrercate=545635",
            albumId: "202777830"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 850115,
        name: "Bayern Munich 17/18 Local Retro",
        slug: "bayern-munich-1718-local-retro",
        category: "futbol",
        league: "bundesliga",
        price: 0,
        image: "/assets/productos/Yupoo/202776893/1.webp",
        images: [
            "/assets/productos/Yupoo/202776893/2.webp",
            "/assets/productos/Yupoo/202776893/3.webp"
        ],
        imageAlt: "Bayern Munich 17/18 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/202776893?uid=1&isSubCate=false&referrercate=545635",
            albumId: "202776893"
        },
        temporada: "17/18",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 608983,
        name: "Man City 19/20 Local Retro",
        slug: "man-city-1920-local-retro",
        category: "futbol",
        league: "premier",
        price: 0,
        image: "/assets/productos/Yupoo/202656896/1.webp",
        images: [
            "/assets/productos/Yupoo/202656896/2.webp",
            "/assets/productos/Yupoo/202656896/3.webp",
            "/assets/productos/Yupoo/202656896/4.webp"
        ],
        imageAlt: "Man City 19/20 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/202656896?uid=1&isSubCate=false&referrercate=545635",
            albumId: "202656896"
        },
        temporada: "19/20",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 529738,
        name: "Man Utd 19/20 Visitante Retro",
        slug: "man-utd-1920-visitante-retro",
        category: "futbol",
        league: "premier",
        price: 0,
        image: "/assets/productos/Yupoo/202657093/1.webp",
        images: [
            "/assets/productos/Yupoo/202657093/2.webp",
            "/assets/productos/Yupoo/202657093/3.webp",
            "/assets/productos/Yupoo/202657093/4.webp"
        ],
        imageAlt: "Man Utd 19/20 Visitante Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/202657093?uid=1&isSubCate=false&referrercate=545635",
            albumId: "202657093"
        },
        temporada: "19/20",
        tipo: "visitante",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 457426,
        name: "Porto 25/26 Local",
        slug: "porto-2526-local",
        category: "futbol",
        league: "Primeira Liga",
        price: 0,
        image: "/assets/productos/Yupoo/201350547/1.webp",
        images: [
            "/assets/productos/Yupoo/201350547/2.webp",
            "/assets/productos/Yupoo/201350547/3.webp",
            "/assets/productos/Yupoo/201350547/4.webp"
        ],
        imageAlt: "Porto 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/201350547?uid=1&isSubCate=false&referrercate=545635",
            albumId: "201350547"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 903135,
        name: "Porto 25/26 Visitante",
        slug: "porto-2526-visitante",
        category: "futbol",
        league: "Primeira Liga",
        price: 0,
        image: "/assets/productos/Yupoo/201350489/1.webp",
        images: [
            "/assets/productos/Yupoo/201350489/2.webp",
            "/assets/productos/Yupoo/201350489/3.webp",
            "/assets/productos/Yupoo/201350489/4.webp"
        ],
        imageAlt: "Porto 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/201350489?uid=1&isSubCate=false&referrercate=545635",
            albumId: "201350489"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 705945,
        name: "Benfica 25/26 Especial",
        slug: "benfica-2526",
        category: "futbol",
        league: "Primeira Liga",
        price: 0,
        image: "/assets/productos/Yupoo/201349762/1.webp",
        images: [
            "/assets/productos/Yupoo/201349762/2.webp",
            "/assets/productos/Yupoo/201349762/3.webp",
            "/assets/productos/Yupoo/201349762/4.webp"
        ],
        imageAlt: "Benfica 25/26 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/201349762?uid=1&isSubCate=false&referrercate=545635",
            albumId: "201349762"
        },
        temporada: "25/26",
        tallas: "S-4XL"
    },
    {
        id: 102616,
        name: "Benfica 25/26 Visitante",
        slug: "benfica-2526-visitante",
        category: "futbol",
        league: "Primeira Liga",
        price: 0,
        image: "/assets/productos/Yupoo/201349635/1.webp",
        images: [
            "/assets/productos/Yupoo/201349635/2.webp",
            "/assets/productos/Yupoo/201349635/3.webp",
            "/assets/productos/Yupoo/201349635/4.webp"
        ],
        imageAlt: "Benfica 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/201349635?uid=1&isSubCate=false&referrercate=545635",
            albumId: "201349635"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 479020,
        name: "Benfica 25/26 Tercera",
        slug: "benfica-2526-tercera",
        category: "futbol",
        league: "Primeira Liga",
        price: 0,
        image: "/assets/productos/Yupoo/200370613/1.webp",
        images: [
            "/assets/productos/Yupoo/200370613/2.webp",
            "/assets/productos/Yupoo/200370613/3.webp",
            "/assets/productos/Yupoo/200370613/4.webp"
        ],
        imageAlt: "Benfica 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/200370613?uid=1&isSubCate=false&referrercate=545635",
            albumId: "200370613"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 255538,
        name: "Porto 99/00 Local Retro",
        slug: "porto-9900-local-retro",
        category: "futbol",
        league: "Primeira Liga",
        price: 0,
        image: "/assets/productos/Yupoo/200365393/1.webp",
        images: [
            "/assets/productos/Yupoo/200365393/2.webp",
            "/assets/productos/Yupoo/200365393/3.webp",
            "/assets/productos/Yupoo/200365393/4.webp"
        ],
        imageAlt: "Porto 99/00 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/200365393?uid=1&isSubCate=false&referrercate=545635",
            albumId: "200365393"
        },
        temporada: "99/00",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 592754,
        name: "Man Utd 25/26 Tercera",
        slug: "man-utd-2526-tercera",
        category: "futbol",
        league: "premier",
        price: 0,
        image: "/assets/productos/Yupoo/199227576/1.webp",
        images: [
            "/assets/productos/Yupoo/199227576/2.webp",
            "/assets/productos/Yupoo/199227576/3.webp",
            "/assets/productos/Yupoo/199227576/4.webp"
        ],
        imageAlt: "Man Utd 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/199227576?uid=1&isSubCate=false&referrercate=545635",
            albumId: "199227576"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 489628,
        name: "Boca Juniors Stadium 25/26 Local",
        slug: "boca-juniors-stadium-2526-local",
        category: "futbol",
        league: "saf",
        price: 0,
        image: "/assets/productos/Yupoo/197577020/1.webp",
        images: [
            "/assets/productos/Yupoo/197577020/2.webp",
            "/assets/productos/Yupoo/197577020/3.webp"
        ],
        imageAlt: "Boca Juniors Stadium 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/197577020?uid=1&isSubCate=false&referrercate=545635",
            albumId: "197577020"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 100332,
        name: "Real Madrid 14/15 Local Retro",
        slug: "real-madrid-1415-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/197575196/1.webp",
        images: [
            "/assets/productos/Yupoo/197575196/2.webp",
            "/assets/productos/Yupoo/197575196/3.webp",
            "/assets/productos/Yupoo/197575196/4.webp"
        ],
        imageAlt: "Real Madrid 14/15 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/197575196?uid=1&isSubCate=false&referrercate=545635",
            albumId: "197575196"
        },
        temporada: "14/15",
        tipo: "local",
        tallas: "S-4XL",
        retro: true
    },
    {
        id: 302194,
        name: "São Paulo 25/26 Visitante",
        slug: "sao-paulo-2526-visitante",
        category: "futbol",
        league: "brasileirao",
        price: 0,
        image: "/assets/productos/Yupoo/197477146/1.webp",
        images: [
            "/assets/productos/Yupoo/197477146/2.webp",
            "/assets/productos/Yupoo/197477146/3.webp",
            "/assets/productos/Yupoo/197477146/4.webp"
        ],
        imageAlt: "São Paulo 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/197477146?uid=1&isSubCate=false&referrercate=545635",
            albumId: "197477146"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 875632,
        name: "Miami 25/26 Visitante",
        slug: "miami-2526-visitante",
        category: "futbol",
        league: "MLS",
        price: 0,
        image: "/assets/productos/Yupoo/193931028/1.webp",
        images: [
            "/assets/productos/Yupoo/193931028/2.webp"
        ],
        imageAlt: "Miami Women 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/193931028?uid=1&isSubCate=false&referrercate=545635",
            albumId: "193931028"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-XXL"
    },
    {
        id: 286288,
        name: "Boca Juniors 25/26",
        slug: "boca-juniors-2526",
        category: "futbol",
        league: "saf",
        price: 0,
        image: "/assets/productos/Yupoo/193927751/1.webp",
        images: [
            "/assets/productos/Yupoo/193927751/2.webp",
            "/assets/productos/Yupoo/193927751/3.webp",
            "/assets/productos/Yupoo/193927751/4.webp"
        ],
        imageAlt: "Boca Juniors 25/26 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/193927751?uid=1&isSubCate=false&referrercate=545635",
            albumId: "193927751"
        },
        temporada: "25/26",
        tallas: "S-XXL"
    },
    {
        id: 279168,
        name: "Manchester City 13/14 Local Retro",
        slug: "manchester-city-1314-local-retro",
        category: "futbol",
        league: "premier",
        price: 0,
        image: "/assets/productos/Yupoo/193883573/1.webp",
        images: [
            "/assets/productos/Yupoo/193883573/2.webp",
            "/assets/productos/Yupoo/193883573/3.webp",
            "/assets/productos/Yupoo/193883573/4.webp"
        ],
        imageAlt: "Manchester City 13/14 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/193883573?uid=1&isSubCate=false&referrercate=545635",
            albumId: "193883573"
        },
        temporada: "13/14",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 625429,
        name: "Brazil Juese 2025",
        slug: "brazil-juese-2025",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/193882594/1.webp",
        images: [
            "/assets/productos/Yupoo/193882594/2.webp",
            "/assets/productos/Yupoo/193882594/3.webp",
            "/assets/productos/Yupoo/193882594/4.webp"
        ],
        imageAlt: "Brazil Juese 2025 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/193882594?uid=1&isSubCate=false&referrercate=545635",
            albumId: "193882594"
        },
        temporada: "2025",
        tallas: "S-XXL"
    },
    {
        id: 115407,
        name: "Mexico golden&amp;amp; Player 2025",
        slug: "mexico-goldenampamp-player-2025",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/192260006/1.webp",
        images: [
            "/assets/productos/Yupoo/192260006/2.webp",
            "/assets/productos/Yupoo/192260006/3.webp",
            "/assets/productos/Yupoo/192260006/4.webp"
        ],
        imageAlt: "Mexico golden&amp;amp; Player 2025 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/192260006?uid=1&isSubCate=false&referrercate=545635",
            albumId: "192260006"
        },
        temporada: "2025",
        tallas: "S-4XL"
    },
    {
        id: 655802,
        name: "Brasil 2025",
        slug: "brasil-2025",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/192260092/1.webp",
        images: [
            "/assets/productos/Yupoo/192260092/2.webp",
            "/assets/productos/Yupoo/192260092/3.webp",
            "/assets/productos/Yupoo/192260092/4.webp"
        ],
        imageAlt: "Brasil 2025 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/192260092?uid=1&isSubCate=false&referrercate=545635",
            albumId: "192260092"
        },
        temporada: "2025",
        tallas: "S-XXL"
    },
    {
        id: 435415,
        name: "Internacional 25/26 Local",
        slug: "internacional-2526-local",
        category: "futbol",
        league: "brasileirao",
        price: 0,
        image: "/assets/productos/Yupoo/192259967/1.webp",
        images: [
            "/assets/productos/Yupoo/192259967/2.webp",
            "/assets/productos/Yupoo/192259967/3.webp"
        ],
        imageAlt: "Internacional 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/192259967?uid=1&isSubCate=false&referrercate=545635",
            albumId: "192259967"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 224087,
        name: "Roma 00/01 Local Retro",
        slug: "roma-0001-local-retro",
        category: "futbol",
        league: "seriea",
        price: 0,
        image: "/assets/productos/Yupoo/192257942/1.webp",
        images: [
            "/assets/productos/Yupoo/192257942/2.webp",
            "/assets/productos/Yupoo/192257942/3.webp",
            "/assets/productos/Yupoo/192257942/4.webp"
        ],
        imageAlt: "Roma 00/01 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/192257942?uid=1&isSubCate=false&referrercate=545635",
            albumId: "192257942"
        },
        temporada: "00/01",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 833095,
        name: "Roma Local Retro",
        slug: "roma-local-retro",
        category: "futbol",
        league: "seriea",
        price: 0,
        image: "/assets/productos/Yupoo/192257870/1.webp",
        images: [
            "/assets/productos/Yupoo/192257870/2.webp",
            "/assets/productos/Yupoo/192257870/3.webp",
            "/assets/productos/Yupoo/192257870/4.webp"
        ],
        imageAlt: "Roma Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/192257870?uid=1&isSubCate=false&referrercate=545635",
            albumId: "192257870"
        },
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 635969,
        name: "Roma 95/96 Local Retro",
        slug: "roma-9596-local-retro",
        category: "futbol",
        league: "seriea",
        price: 0,
        image: "/assets/productos/Yupoo/192257826/1.webp",
        images: [
            "/assets/productos/Yupoo/192257826/2.webp",
            "/assets/productos/Yupoo/192257826/3.webp",
            "/assets/productos/Yupoo/192257826/4.webp"
        ],
        imageAlt: "Roma 95/96 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/192257826?uid=1&isSubCate=false&referrercate=545635",
            albumId: "192257826"
        },
        temporada: "95/96",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 945452,
        name: "River Plate 13/14 Local Retro",
        slug: "river-plate-1314-local-retro",
        category: "futbol",
        league: "saf",
        price: 0,
        image: "/assets/productos/Yupoo/192252827/1.webp",
        images: [
            "/assets/productos/Yupoo/192252827/2.webp",
            "/assets/productos/Yupoo/192252827/3.webp",
            "/assets/productos/Yupoo/192252827/4.webp"
        ],
        imageAlt: "River Plate 13/14 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/192252827?uid=1&isSubCate=false&referrercate=545635",
            albumId: "192252827"
        },
        temporada: "13/14",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 588525,
        name: "Real Madrid Visitante Retro",
        slug: "real-madrid-visitante-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/189209051/1.webp",
        images: [
            "/assets/productos/Yupoo/189209051/2.webp",
            "/assets/productos/Yupoo/189209051/3.webp"
        ],
        imageAlt: "Real Madrid Visitante Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/189209051?uid=1",
            albumId: "189209051"
        },
        tipo: "visitante",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 766126,
        name: "Real Madrid Tercera Retro",
        slug: "real-madrid-tercera-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/167010565/1.webp",
        images: [
            "/assets/productos/Yupoo/167010565/2.webp",
            "/assets/productos/Yupoo/167010565/3.webp",
            "/assets/productos/Yupoo/167010565/4.webp"
        ],
        imageAlt: "Real Madrid Tercera Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/167010565?uid=1",
            albumId: "167010565"
        },
        tipo: "tercera",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 523343,
        name: "Real Madrid 17/18 Local Retro",
        slug: "real-madrid-1718-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/117031712/1.webp",
        images: [
            "/assets/productos/Yupoo/117031712/2.webp",
            "/assets/productos/Yupoo/117031712/3.webp",
            "/assets/productos/Yupoo/117031712/4.webp"
        ],
        imageAlt: "Real Madrid 17/18 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/117031712?uid=1",
            albumId: "117031712"
        },
        temporada: "17/18",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 348972,
        name: "Real Madrid 2000 Local Retro",
        slug: "real-madrid-2000-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/114619503/1.webp",
        images: [
            "/assets/productos/Yupoo/114619503/2.webp",
            "/assets/productos/Yupoo/114619503/3.webp",
            "/assets/productos/Yupoo/114619503/4.webp"
        ],
        imageAlt: "Real Madrid 2000 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/114619503?uid=1",
            albumId: "114619503"
        },
        temporada: "2000",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 167625,
        name: "Real Madrid Local Retro",
        slug: "real-madrid-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/169073222/1.webp",
        images: [
            "/assets/productos/Yupoo/169073222/2.webp",
            "/assets/productos/Yupoo/169073222/3.webp"
        ],
        imageAlt: "Real Madrid Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/169073222?uid=1",
            albumId: "169073222"
        },
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 419589,
        name: "Barcelona 2007 Retro",
        slug: "barcelona-2007-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/69556791/1.webp",
        images: [
            "/assets/productos/Yupoo/69556791/2.webp",
            "/assets/productos/Yupoo/69556791/3.webp"
        ],
        imageAlt: "Barcelona 2007 Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/69556791?uid=1",
            albumId: "69556791"
        },
        temporada: "2007",
        retro: true
    },
    {
        id: 938026,
        name: "Barcelona 16/17 Visitante Retro",
        slug: "barcelona-1617-visitante-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/138944331/1.webp",
        images: [
            "/assets/productos/Yupoo/138944331/2.webp",
            "/assets/productos/Yupoo/138944331/3.webp",
            "/assets/productos/Yupoo/138944331/4.webp"
        ],
        imageAlt: "Barcelona 16/17 Visitante Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/138944331?uid=1",
            albumId: "138944331"
        },
        temporada: "16/17",
        tipo: "visitante",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 769552,
        name: "Barcelona 17/18 Tercera Retro",
        slug: "barcelona-1718-tercera-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/192251388/1.webp",
        images: [
            "/assets/productos/Yupoo/192251388/2.webp",
            "/assets/productos/Yupoo/192251388/3.webp",
            "/assets/productos/Yupoo/192251388/4.webp"
        ],
        imageAlt: "Barcelona 17/18 Tercera Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/192251388?uid=1",
            albumId: "192251388"
        },
        temporada: "17/18",
        tipo: "tercera",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 820529,
        name: "Barcelona 09/10 Local Retro",
        slug: "barcelona-0910-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/138944262/1.webp",
        images: [
            "/assets/productos/Yupoo/138944262/2.webp",
            "/assets/productos/Yupoo/138944262/3.webp"
        ],
        imageAlt: "Barcelona 09/10 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/138944262?uid=1",
            albumId: "138944262"
        },
        temporada: "09/10",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 736040,
        name: "Barcelona 13/14 Local Retro",
        slug: "barcelona-1314-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/146962779/1.webp",
        images: [
            "/assets/productos/Yupoo/146962779/2.webp",
            "/assets/productos/Yupoo/146962779/3.webp"
        ],
        imageAlt: "Barcelona 13/14 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/146962779?uid=1",
            albumId: "146962779"
        },
        temporada: "13/14",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 497972,
        name: "Barcelona 08/09 Local Retro",
        slug: "barcelona-0809-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/134230348/1.webp",
        images: [
            "/assets/productos/Yupoo/134230348/2.webp",
            "/assets/productos/Yupoo/134230348/3.webp"
        ],
        imageAlt: "Barcelona 08/09 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/134230348?uid=1",
            albumId: "134230348"
        },
        temporada: "08/09",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 421151,
        name: "Malaga 12/13 Local Retro",
        slug: "malaga-1213-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/215727648/1.webp",
        images: [
            "/assets/productos/Yupoo/215727648/2.webp"
        ],
        imageAlt: "Malaga 12/13 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/215727648?uid=1&isSubCate=false&referrercate=680717",
            albumId: "215727648"
        },
        temporada: "12/13",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 351350,
        name: "Burgos 25/26 Tercera",
        slug: "burgos-2526-tercera",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/213790918/1.webp",
        images: [
            "/assets/productos/Yupoo/213790918/2.webp"
        ],
        imageAlt: "Burgos 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/213790918?uid=1&isSubCate=false&referrercate=680717",
            albumId: "213790918"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-XXL"
    },
    {
        id: 567203,
        name: "Burgos 25/26 Visitante",
        slug: "burgos-2526-visitante",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/213790880/1.webp",
        images: [
            "/assets/productos/Yupoo/213790880/2.webp"
        ],
        imageAlt: "Burgos 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/213790880?uid=1&isSubCate=false&referrercate=680717",
            albumId: "213790880"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-XXL"
    },
    {
        id: 921620,
        name: "Real Betis 88/89 Local Retro",
        slug: "real-betis-8889-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/213865644/1.webp",
        images: [
            "/assets/productos/Yupoo/213865644/2.webp"
        ],
        imageAlt: "Real Betis 88/89 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/213865644?uid=1&isSubCate=false&referrercate=680717",
            albumId: "213865644"
        },
        temporada: "88/89",
        tipo: "local",
        tallas: "S-4XL",
        retro: true
    },
    {
        id: 379818,
        name: "Athletic Bilbao 86/87 Local Retro",
        slug: "athletic-bilbao-8687-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/214131342/1.webp",
        images: [
            "/assets/productos/Yupoo/214131342/2.webp"
        ],
        imageAlt: "Athletic Bilbao 86/87 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/214131342?uid=1&isSubCate=false&referrercate=680717",
            albumId: "214131342"
        },
        temporada: "86/87",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 506078,
        name: "Athletic Bilbao Visitante Retro",
        slug: "athletic-bilbao-visitante-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/214136150/1.webp",
        images: [
            "/assets/productos/Yupoo/214136150/2.webp"
        ],
        imageAlt: "Athletic Bilbao Visitante Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/214136150?uid=1&isSubCate=false&referrercate=680717",
            albumId: "214136150"
        },
        tipo: "visitante",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 570007,
        name: "Real Madrid 12/13 Visitante Retro",
        slug: "real-madrid-1213-visitante-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/212822016/1.webp",
        images: [
            "/assets/productos/Yupoo/212822016/2.webp"
        ],
        imageAlt: "Real Madrid 12/13 Visitante Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/212822016?uid=1&isSubCate=false&referrercate=680717",
            albumId: "212822016"
        },
        temporada: "12/13",
        tipo: "visitante",
        tallas: "S-3XL",
        retro: true
    },
    {
        id: 835385,
        name: "Atletico Madrid 16/17 Local Retro",
        slug: "atletico-madrid-1617-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/214403910/1.webp",
        images: [
            "/assets/productos/Yupoo/214403910/2.webp"
        ],
        imageAlt: "Atletico Madrid 16/17 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/214403910?uid=1&isSubCate=false&referrercate=680717",
            albumId: "214403910"
        },
        temporada: "16/17",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 228891,
        name: "Atletico Madrid 82/83 Local Retro",
        slug: "atletico-madrid-8283-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/214401832/1.webp",
        images: [
            "/assets/productos/Yupoo/214401832/2.webp"
        ],
        imageAlt: "Atletico Madrid 82/83 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/214401832?uid=1&isSubCate=false&referrercate=680717",
            albumId: "214401832"
        },
        temporada: "82/83",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 483007,
        name: "Barcelona Fourth S-XXL 25/26",
        slug: "barcelona-fourth-s-xxl-2526",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/213273196/1.webp",
        images: [
            "/assets/productos/Yupoo/213273196/2.webp"
        ],
        imageAlt: "Barcelona Fourth S-XXL 25/26 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "http://minkang.x.yupoo.com/albums/213273196?uid=1&isSubCate=false&referrercate=680717",
            albumId: "213273196"
        },
        temporada: "25/26"
    },
    {
        id: 887491,
        name: "Barcelona 14/15 Local Retro",
        slug: "barcelona-1415-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/212822675/1.webp",
        images: [
            "/assets/productos/Yupoo/212822675/2.webp"
        ],
        imageAlt: "Barcelona 14/15 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/212822675?uid=1&isSubCate=false&referrercate=680717",
            albumId: "212822675"
        },
        temporada: "14/15",
        tipo: "local",
        tallas: "S-3XL",
        retro: true
    },
    {
        id: 552798,
        name: "Real Madrid 14/15 Local Retro",
        slug: "real-madrid-1415-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/212822679/1.webp",
        images: [
            "/assets/productos/Yupoo/212822679/2.webp"
        ],
        imageAlt: "Real Madrid 14/15 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/212822679?uid=1&isSubCate=false&referrercate=680717",
            albumId: "212822679"
        },
        temporada: "14/15",
        tipo: "local",
        tallas: "S-3XL",
        retro: true
    },
    {
        id: 900814,
        name: "Real Madrid 17/18 Visitante Retro",
        slug: "real-madrid-1718-visitante-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/212821987/1.webp",
        images: [
            "/assets/productos/Yupoo/212821987/2.webp"
        ],
        imageAlt: "Real Madrid 17/18 Visitante Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/212821987?uid=1&isSubCate=false&referrercate=680717",
            albumId: "212821987"
        },
        temporada: "17/18",
        tipo: "visitante",
        tallas: "S-3XL",
        retro: true
    },
    {
        id: 992598,
        name: "Real Madrid 13/14 Visitante Retro",
        slug: "real-madrid-1314-visitante-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/212822009/1.webp",
        images: [
            "/assets/productos/Yupoo/212822009/2.webp"
        ],
        imageAlt: "Real Madrid 13/14 Visitante Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/212822009?uid=1&isSubCate=false&referrercate=680717",
            albumId: "212822009"
        },
        temporada: "13/14",
        tipo: "visitante",
        tallas: "S-3XL",
        retro: true
    },
    {
        id: 422613,
        name: "Real Madrid 11/12 Visitante Retro",
        slug: "real-madrid-1112-visitante-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/212821912/1.webp",
        images: [
            "/assets/productos/Yupoo/212821912/2.webp"
        ],
        imageAlt: "Real Madrid 11/12 Visitante Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/212821912?uid=1&isSubCate=false&referrercate=680717",
            albumId: "212821912"
        },
        temporada: "11/12",
        tipo: "visitante",
        tallas: "S-3XL",
        retro: true
    },
    {
        id: 487998,
        name: "Zaragoza Second 95/96 Visitante Retro",
        slug: "zaragoza-second-9596-visitante-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/212487006/1.webp",
        images: [
            "/assets/productos/Yupoo/212487006/2.webp"
        ],
        imageAlt: "Zaragoza Second 95/96 Visitante Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/212487006?uid=1&isSubCate=false&referrercate=680717",
            albumId: "212487006"
        },
        temporada: "95/96",
        tipo: "visitante",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 798155,
        name: "Barcelona 17/18 Local Retro",
        slug: "barcelona-1718-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/212389897/1.webp",
        images: [
            "/assets/productos/Yupoo/212389897/2.webp"
        ],
        imageAlt: "Barcelona 17/18 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/212389897?uid=1&isSubCate=false&referrercate=680717",
            albumId: "212389897"
        },
        temporada: "17/18",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 804311,
        name: "Barcelona 12/13 Local Retro",
        slug: "barcelona-1213-local-retro",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/212390713/1.webp",
        images: [
            "/assets/productos/Yupoo/212390713/2.webp"
        ],
        imageAlt: "Barcelona 12/13 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/212390713?uid=1&isSubCate=false&referrercate=680717",
            albumId: "212390713"
        },
        temporada: "12/13",
        tipo: "local",
        tallas: "S-XXL",
        retro: true
    },
    {
        id: 501778,
        name: "Rayo Vallecano 25/26 Visitante",
        slug: "rayo-vallecano-2526-visitante",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/209571129/1.webp",
        images: [
            "/assets/productos/Yupoo/209571129/2.webp",
            "/assets/productos/Yupoo/209571129/3.webp"
        ],
        imageAlt: "Rayo Vallecano 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/209571129?uid=1&isSubCate=false&referrercate=680717",
            albumId: "209571129"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-XXL"
    },
    {
        id: 553431,
        name: "Rayo Vallecano 25/26 Tercera",
        slug: "rayo-vallecano-2526-tercera",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/209571144/1.webp",
        images: [
            "/assets/productos/Yupoo/209571144/2.webp",
            "/assets/productos/Yupoo/209571144/3.webp"
        ],
        imageAlt: "Rayo Vallecano 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/209571144?uid=1&isSubCate=false&referrercate=680717",
            albumId: "209571144"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-XXL"
    },
    {
        id: 593027,
        name: "Zaragoza 25/26 Visitante",
        slug: "zaragoza-2526-visitante",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/209571071/1.webp",
        images: [
            "/assets/productos/Yupoo/209571071/2.webp",
            "/assets/productos/Yupoo/209571071/3.webp"
        ],
        imageAlt: "Zaragoza 25/26 Visitante - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/209571071?uid=1&isSubCate=false&referrercate=680717",
            albumId: "209571071"
        },
        temporada: "25/26",
        tipo: "visitante",
        tallas: "S-4XL"
    },
    {
        id: 386584,
        name: "Zaragoza 25/26 Local",
        slug: "zaragoza-2526-local",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/210323914/1.webp",
        images: [
            "/assets/productos/Yupoo/210323914/2.webp",
            "/assets/productos/Yupoo/210323914/3.webp"
        ],
        imageAlt: "Zaragoza 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/210323914?uid=1",
            albumId: "210323914"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 716949,
        name: "Napoli 25/26",
        slug: "napoli-2526",
        category: "futbol",
        league: "seriea",
        price: 0,
        image: "/assets/productos/Yupoo/216807171/1.webp",
        images: [
            "/assets/productos/Yupoo/216807171/2.webp"
        ],
        imageAlt: "Napoli 25/26 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/216807171?uid=1&isSubCate=false&referrercate=2962415",
            albumId: "216807171"
        },
        temporada: "25/26",
        tallas: "S-4XL"
    },
    {
        id: 276794,
        name: "Feyenoord 25/26 Local",
        slug: "feyenoord-2526-local",
        category: "futbol",
        league: "Eredivise",
        price: 0,
        image: "/assets/productos/Yupoo/201349993/1.webp",
        images: [
            "/assets/productos/Yupoo/201349993/2.webp",
            "/assets/productos/Yupoo/201349993/3.webp",
            "/assets/productos/Yupoo/201349993/4.webp"
        ],
        imageAlt: "Feyenoord 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/201349993?uid=1&isSubCate=false&referrercate=3786848",
            albumId: "201349993"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 728985,
        name: "Croacia 2026 Local",
        slug: "croacia-2026-local",
        category: "futbol",
        league: "selecciones",
        price: 0,
        image: "/assets/productos/Yupoo/219700516/1.webp",
        images: [
            "/assets/productos/Yupoo/219700516/2.webp"
        ],
        imageAlt: "Croacia 2026 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/219700516?uid=1&isSubCate=false&referrercate=712891",
            albumId: "219700516"
        },
        temporada: "2026",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 384796,
        name: "Tottenham Hotspur 87/89 Local Retro",
        slug: "tottenham-hotspur-8789-local-retro",
        category: "futbol",
        league: "premier",
        price: 0,
        image: "/assets/productos/Yupoo/215724075/1.webp",
        images: [
            "/assets/productos/Yupoo/215724075/2.webp"
        ],
        imageAlt: "Tottenham Hotspur 87/89 Local Retro - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/215724075?uid=1&isSubCate=false&referrercate=680719",
            albumId: "215724075"
        },
        tipo: "local",
        tallas: "S-XXL",
        retro: true,
        temporada: "87/89"
    },
    {
        id: 154366,
        name: "Como 25/26 Local",
        slug: "como-2526-local",
        category: "futbol",
        league: "seriea",
        price: 0,
        image: "/assets/productos/Yupoo/211234031/1.webp",
        images: [
            "/assets/productos/Yupoo/211234031/2.webp",
            "/assets/productos/Yupoo/211234031/3.webp",
            "/assets/productos/Yupoo/211234031/4.webp"
        ],
        imageAlt: "Como 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/211234031?uid=1",
            albumId: "211234031"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-XXL"
    },
    {
        id: 894216,
        name: "Miami 25/26 Tercera",
        slug: "miami-2526-tercera",
        category: "futbol",
        league: "MLS",
        price: 0,
        image: "/assets/productos/Yupoo/192250021/1.webp",
        images: [
            "/assets/productos/Yupoo/192250021/2.webp",
            "/assets/productos/Yupoo/192250021/3.webp"
        ],
        imageAlt: "Miami 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/192250021?uid=1",
            albumId: "192250021"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 308311,
        name: "Miami 25/26 Local",
        slug: "miami-2526-local",
        category: "futbol",
        league: "MLS",
        price: 0,
        image: "/assets/productos/Yupoo/187746737/1.webp",
        images: [
            "/assets/productos/Yupoo/187746737/2.webp",
            "/assets/productos/Yupoo/187746737/3.webp",
            "/assets/productos/Yupoo/187746737/4.webp"
        ],
        imageAlt: "Miami 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/187746737?uid=1",
            albumId: "187746737"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 570882,
        name: "Marseille 25/26 Tercera",
        slug: "marseille-2526-tercera",
        category: "futbol",
        league: "ligue1",
        price: 0,
        image: "/assets/productos/Yupoo/211234336/1.webp",
        images: [
            "/assets/productos/Yupoo/211234336/2.webp",
            "/assets/productos/Yupoo/211234336/3.webp"
        ],
        imageAlt: "Marseille 25/26 Tercera - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/211234336?uid=1",
            albumId: "211234336"
        },
        temporada: "25/26",
        tipo: "tercera",
        tallas: "S-4XL"
    },
    {
        id: 229242,
        name: "Palmeiras 25/26 Local",
        slug: "palmeiras-2526-local",
        category: "futbol",
        league: "brasileirao",
        price: 0,
        image: "/assets/productos/Yupoo/187764069/1.webp",
        images: [
            "/assets/productos/Yupoo/187764069/2.webp",
            "/assets/productos/Yupoo/187764069/3.webp"
        ],
        imageAlt: "Palmeiras 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/187764069?uid=1",
            albumId: "187764069"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 128909,
        name: "Flamengo 25/26 Local",
        slug: "flamengo-2526-local",
        category: "futbol",
        league: "brasileirao",
        price: 0,
        image: "/assets/productos/Yupoo/187670662/1.webp",
        images: [
            "/assets/productos/Yupoo/187670662/2.webp",
            "/assets/productos/Yupoo/187670662/3.webp"
        ],
        imageAlt: "Flamengo 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/187670662?uid=1",
            albumId: "187670662"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 703398,
        name: "Barcelona 25/26",
        slug: "barcelona-2526",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/193879799/1.webp",
        images: [
            "/assets/productos/Yupoo/193879799/2.webp",
            "/assets/productos/Yupoo/193879799/3.webp"
        ],
        imageAlt: "Barcelona 25/26 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/193879799?uid=1",
            albumId: "193879799"
        },
        temporada: "25/26",
        tallas: "S-XXL"
    },
    {
        id: 203152,
        name: "Miami 25/26 Local (Niño)",
        slug: "miami-2526-local-nino",
        category: "futbol",
        league: "MLS",
        price: 0,
        image: "/assets/productos/Yupoo/189206799/1.webp",
        images: [
            "/assets/productos/Yupoo/189206799/2.webp",
            "/assets/productos/Yupoo/189206799/3.webp"
        ],
        imageAlt: "Miami 25/26 Local (Niño) - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/189206799?uid=1",
            albumId: "189206799"
        },
        temporada: "25/26",
        tipo: "local",
        kids: true
    },
    {
        id: 866849,
        name: "Miami 25/26 Visitante (Niño)",
        slug: "miami-2526-visitante-nino",
        category: "futbol",
        league: "MLS",
        price: 0,
        image: "/assets/productos/Yupoo/187758478/1.webp",
        images: [
            "/assets/productos/Yupoo/187758478/2.webp",
            "/assets/productos/Yupoo/187758478/3.webp"
        ],
        imageAlt: "Miami 25/26 Visitante (Niño) - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/187758478?uid=1",
            albumId: "187758478"
        },
        temporada: "25/26",
        tipo: "visitante",
        kids: true
    },
    {
        id: 974000,
        name: "Miami 24/25",
        slug: "miami-2425",
        category: "futbol",
        league: "MLS",
        price: 0,
        image: "/assets/productos/Yupoo/178962329/1.webp",
        images: [
            "/assets/productos/Yupoo/178962329/2.webp"
        ],
        imageAlt: "Miami FC 24/25 - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/178962329?uid=1",
            albumId: "178962329"
        },
        temporada: "24/25",
        tallas: "S-XXL"
    },
    {
        id: 896413,
        name: "Benfica 25/26 Entrenamiento",
        slug: "benfica-2526-entrenamiento",
        category: "futbol",
        league: "Primeira Liga",
        price: 0,
        image: "/assets/productos/Yupoo/188021703/1.webp",
        images: [
            "/assets/productos/Yupoo/188021703/2.webp",
            "/assets/productos/Yupoo/188021703/3.webp",
            "/assets/productos/Yupoo/188021703/4.webp"
        ],
        imageAlt: "Benfica 25/26 Entrenamiento - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://pandasportjersey.x.yupoo.com/albums/188021703?uid=1",
            albumId: "188021703"
        },
        temporada: "25/26",
        tipo: "entrenamiento",
        tallas: "S-XXL"
    },
    {
        id: 378241,
        name: "Elche 25/26 Local",
        slug: "elche-2526-local",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/214401561/1.webp",
        images: [
            "/assets/productos/Yupoo/214401561/2.webp"
        ],
        imageAlt: "Elche 25/26 Local - Vista principal",
        new: true,
        sale: false,
        source: {
            provider: "yupoo",
            url: "https://minkang.x.yupoo.com/albums/214401561?uid=1",
            albumId: "214401561"
        },
        temporada: "25/26",
        tipo: "local",
        tallas: "S-4XL"
    },
    {
        id: 821734,
        name: "Rayo Vallecano 25/26 Local",
        category: "futbol",
        league: "laliga",
        price: 0,
        image: "/assets/productos/Yupoo/821734/1.webp",
        images: [
            "/assets/productos/Yupoo/821734/2.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    }
];

export default products;

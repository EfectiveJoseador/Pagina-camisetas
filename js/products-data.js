const products = [
    {
        id: 101,
        name: "Alavés 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Alaves2526L/1.webp"
    },
    {
        id: 102,
        name: "Albacete 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Albacete2526L/1.webp"
    },
    {
        id: 103,
        name: "Athletic Club 25/26 Tercera (Niño)",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/AthelticKids2526T/1.webp",
        kids: true
    },
    {
        id: 104,
        name: "Athletic Club 01/03 Visitante Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Athletic0103FR/1.webp",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 105,
        name: "Athletic Club 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Athletic2526L/1.webp"
    },
    {
        id: 106,
        name: "Atlético Madrid 02/03 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Atletico0203LR/1.webp",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 107,
        name: "Atlético Madrid 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Atletico2526F/1.webp"
    },
    {
        id: 108,
        name: "Atlético Madrid 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Atletico2526L/1.webp"
    },
    {
        id: 109,
        name: "Atlético Madrid 95/96 Tercera Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Atletico9596TR/1.webp",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 110,
        name: "Atlético Madrid 25/26 Visitante (Niño)",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/AtleticoKids2526F/1.webp",
        kids: true
    },
    {
        id: 111,
        name: "FC Barcelona 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Barcelona2526F/1.webp"
    },
    {
        id: 112,
        name: "FC Barcelona 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Barcelona2526L/1.webp"
    },
    {
        id: 113,
        name: "FC Barcelona 25/26 Tercera",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Barcelona2526T/1.webp"
    },
    {
        id: 114,
        name: "FC Barcelona 96/97 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Barcelona9697LR/1.webp",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 115,
        name: "Real Betis 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Betis2526L/1.webp"
    },
    {
        id: 116,
        name: "Celta de Vigo 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Celta2526L/1.webp"
    },
    {
        id: 117,
        name: "Elche 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Elche2526F/1.webp"
    },
    {
        id: 119,
        name: "Espanyol 99/00 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Espanyol9920LR/1.webp",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 120,
        name: "Getafe 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Getafe2526L/1.webp"
    },
    {
        id: 121,
        name: "Girona 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Girona2526L/1.webp"
    },
    {
        id: 122,
        name: "Granada 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Granada2526L/1.webp"
    },
    {
        id: 123,
        name: "Las Palmas 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/LasPalmas2526F/1.webp"
    },
    {
        id: 124,
        name: "Las Palmas 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/LasPalmas2526L/1.webp"
    },
    {
        id: 125,
        name: "Leganés 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Leganes2526L/1.webp"
    },
    {
        id: 126,
        name: "Levante 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Levante2526L/1.webp"
    },
    {
        id: 127,
        name: "Málaga CF 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Malaga2526L/1.webp"
    },
    {
        id: 128,
        name: "Málaga CF 25/26 Local (Niño)",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/MalagaKids2526L/1.webp",
        kids: true
    },
    {
        id: 129,
        name: "Mallorca 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Mallorca2526L/1.webp"
    },
    {
        id: 130,
        name: "Osasuna 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Osasuna2526L/1.webp"
    },
    {
        id: 131,
        name: "Real Oviedo 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Oviedo2526L/1.webp"
    },
    {
        id: 133,
        name: "Real Madrid 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/RealMadrid2526F/1.webp"
    },
    {
        id: 134,
        name: "Real Madrid 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/RealMadrid2526L/1.webp"
    },
    {
        id: 135,
        name: "Real Madrid 25/26 Tercera",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/RealMadrid2526T/1.webp"
    },
    {
        id: 136,
        name: "Real Sociedad 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/RealSociedad2526L/1.webp"
    },
    {
        id: 137,
        name: "Sevilla 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Sevilla2526F/1.webp"
    },
    {
        id: 138,
        name: "Sevilla 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Sevilla2526L/1.webp"
    },
    {
        id: 139,
        name: "Sevilla 25/26 Tercera",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Sevilla2526T/1.webp"
    },
    {
        id: 140,
        name: "Valencia 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Valencia2526L/1.webp"
    },
    {
        id: 141,
        name: "Valladolid 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Valladolid2526L/1.webp"
    },
    {
        id: 142,
        name: "Villarreal 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/La Liga/Villarreal2526L/1.webp"
    },
    {
        id: 201,
        name: "Arsenal 25/26 Local",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Premier League/Arsenal2525L/1.webp"
    },
    {
        id: 202,
        name: "Arsenal 25/26 Visitante",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Premier League/Arsenal2526F/1.webp"
    },
    {
        id: 203,
        name: "Aston Villa 25/26 Visitante",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Premier League/AstonVilla2526L/1.webp"
    },
    {
        id: 204,
        name: "Chelsea 25/26 Local",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Premier League/Chealsea2526L/1.webp"
    },
    {
        id: 205,
        name: "Crystal Palace 25/26 Local",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Premier League/CrystalPalace2526L/1.webp"
    },
    {
        id: 206,
        name: "Manchester City 25/26 Visitante",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Premier League/ManCity2526F/1.webp"
    },
    {
        id: 207,
        name: "Manchester United 25/26 Local",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Premier League/ManUnited2526L/1.webp"
    },
    {
        id: 208,
        name: "Newcastle 25/26 Local",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Premier League/Newcastle2526L/1.webp"
    },
    {
        id: 209,
        name: "Manchester United 25/26 Visitante (Niño)",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Premier League/UnitedKids2526F/1.webp",
        kids: true
    },
    {
        id: 301,
        name: "Lazio 25/26 Visitante",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Serie A/Lazio2526F/1.webp"
    },
    {
        id: 302,
        name: "AC Milan 97/98 Local Retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Serie A/Milan9798LR/1.webp",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 303,
        name: "Napoli 25/26 Local",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Serie A/Napoli2526L/1.webp"
    },
    {
        id: 304,
        name: "AS Roma 25/26 Local (Niño)",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Serie A/RomaKids2526L/1.webp",
        kids: true
    },
    {
        id: 401,
        name: "Bayern Munich 25/26 Local",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Bundesliga/Munich2526L/1.webp"
    },
    {
        id: 402,
        name: "Schalke 04 25/26 Local",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Bundesliga/Schalke2526L/1.webp"
    },
    {
        id: 501,
        name: "Marseille 25/26 Visitante (Niño)",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Ligue 1/MarseillaKids2526F/1.webp",
        kids: true
    },
    {
        id: 502,
        name: "Monaco 25/26 Visitante",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Ligue 1/Monaco2526F/1.webp"
    },
    {
        id: 503,
        name: "PSG 25/26 Local",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Ligue 1/Paris2526L/1.webp"
    },
    {
        id: 504,
        name: "PSG 25/26 Tercera",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Ligue 1/PSG2526T/1.webp"
    },
    {
        id: 601,
        name: "España 08/09 Local Retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Internacional/España0809LR/1.webp",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 602,
        name: "España 24/25 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Internacional/España2425L/1.webp"
    },
    {
        id: 603,
        name: "Francia 98/99 Local Retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Internacional/Francia9899LR/1.webp",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 604,
        name: "Holanda 98/99 Local Retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Internacional/Holanda9899LR/1.webp",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 551,
        name: "Flamengo 25/26 Tercera",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Brasileirão Série A/Flamengo2526T/1.webp"
    },
    {
        id: 561,
        name: "Al-Nassr 25/26 Local",
        category: "futbol",
        league: "ligaarabe",
        image: "/assets/productos/Liga Arabe/Al-Nassr2526L/1.webp"
    },
    {
        id: 571,
        name: "Boca Juniors 01/02 Local Retro",
        category: "futbol",
        league: "saf",
        image: "/assets/productos/SAF (Argentina)/Boca0102LR/1.webp",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 572,
        name: "River Plate 25/26 Local",
        category: "futbol",
        league: "saf",
        image: "/assets/productos/SAF (Argentina)/River2526L/1.webp"
    },
    {
        id: 573,
        name: "River Plate 25/26 Local (Niño)",
        category: "futbol",
        league: "saf",
        image: "/assets/productos/SAF (Argentina)/RiverKids2526L/1.webp",
        kids: true
    },
    {
        id: 701,
        name: "Lakers 25/26 Local",
        category: "nba",
        league: "nba",
        image: "/assets/productos/NBA/Lakers1/1.webp"
    },
    {
        id: 702,
        name: "Oklahoma City Thunder",
        category: "nba",
        league: "nba",
        image: "/assets/productos/NBA/Oklahoma/1.webp"
    },
    {
        id: 703,
        name: "Philadelphia 76ers",
        category: "nba",
        league: "nba",
        image: "/assets/productos/NBA/Phila1/1.webp"
    },
    {
        id: 937715,
        name: "Japón 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/219491642/1.webp",
        images: [
            "/assets/productos/Yupoo/219491642/2.webp"
        ],
        tipo: "local",
        temporada: "2026"
    },
    {
        id: 978161,
        name: "Palmeiras 25/26 Visitante",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/210081096/1.webp",
        images: [
            "/assets/productos/Yupoo/210081096/2.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 362332,
        name: "Alaves 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/216419940/1.webp",
        images: [
            "/assets/productos/Yupoo/216419940/2.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 948475,
        name: "Real Murcia 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/216806487/1.webp",
        images: [
            "/assets/productos/Yupoo/216806487/2.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 892563,
        name: "Osasuna 25/26 Visitante",
        category: "futbol",
        league: "laliga",
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
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 388938,
        name: "Real Betis 25/26 Visitante",
        category: "futbol",
        league: "laliga",
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
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 105061,
        name: "Valladolid 25/26 Visitante",
        category: "futbol",
        league: "laliga",
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
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 945475,
        name: "Real Betis 25/26 Tercera",
        category: "futbol",
        league: "laliga",
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
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 520253,
        name: "Deportivo La Coruña 25/26 Local",
        category: "futbol",
        league: "laliga",
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
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 811678,
        name: "Deportivo La Coruña 25/26 Tercera",
        category: "futbol",
        league: "laliga",
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
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 199666,
        name: "Celta 25/26 Tercera",
        category: "futbol",
        league: "laliga",
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
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 987640,
        name: "Celta 25/26 Visitante",
        category: "futbol",
        league: "laliga",
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
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 951872,
        name: "Real Madrid 90/92 Local Retro",
        category: "futbol",
        league: "laliga",
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
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 385774,
        name: "Girona 25/26 Visitante",
        category: "futbol",
        league: "laliga",
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
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 126754,
        name: "Cadiz 25/26 Local",
        category: "futbol",
        league: "laliga",
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
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 489081,
        name: "Zaragoza 04/05 Local Retro",
        category: "futbol",
        league: "laliga",
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
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 891737,
        name: "Real Madrid 25/26 Portero Tercera",
        category: "futbol",
        league: "laliga",
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
        temporada: "25/26"
    },
    {
        id: 737878,
        name: "Zaragoza 97/98 Local Retro",
        category: "futbol",
        league: "laliga",
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
        temporada: "97/98",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 745212,
        name: "Getafe 09/10 Local Retro",
        category: "futbol",
        league: "laliga",
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
        temporada: "09/10",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 144708,
        name: "Málaga CF 97/98 Local Retro",
        category: "futbol",
        league: "laliga",
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
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 294032,
        name: "Italia 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/219491302/1.webp",
        images: [
            "/assets/productos/Yupoo/219491302/2.webp"
        ],
        tipo: "local",
        temporada: "2026"
    },
    {
        id: 737806,
        name: "Inglaterra 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/219490998/1.webp",
        images: [
            "/assets/productos/Yupoo/219490998/2.webp"
        ],
        tipo: "local",
        temporada: "2026"
    },
    {
        id: 120417,
        name: "Alemania 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/219463186/1.webp",
        images: [
            "/assets/productos/Yupoo/219463186/2.webp"
        ],
        tipo: "local",
        temporada: "2026"
    },
    {
        id: 905466,
        name: "Venezuela 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/218139532/1.webp",
        images: [
            "/assets/productos/Yupoo/218139532/2.webp"
        ],
        tipo: "local"
    },
    {
        id: 882796,
        name: "España 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/218139402/1.webp",
        images: [
            "/assets/productos/Yupoo/218139402/2.webp"
        ],
        tipo: "local",
        temporada: "2026"
    },
    {
        id: 431137,
        name: "Costa Rica 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/218138743/1.webp",
        images: [
            "/assets/productos/Yupoo/218138743/2.webp"
        ],
        tipo: "local"
    },
    {
        id: 238510,
        name: "Atlético Mineiro 25/26 Tercera",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/216807613/1.webp",
        images: [
            "/assets/productos/Yupoo/216807613/2.webp"
        ],
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 671227,
        name: "Al-Hilal 25/26 Local",
        category: "futbol",
        league: "ligaarabe",
        image: "/assets/productos/Yupoo/216806586/1.webp",
        images: [
            "/assets/productos/Yupoo/216806586/2.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 729212,
        name: "Al-Hilal 25/26 Local",
        category: "futbol",
        league: "ligaarabe",
        image: "/assets/productos/Yupoo/216806631/1.webp",
        images: [
            "/assets/productos/Yupoo/216806631/2.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 984139,
        name: "Al-Hilal 25/26 Tercera",
        category: "futbol",
        league: "ligaarabe",
        image: "/assets/productos/Yupoo/216806537/1.webp",
        images: [
            "/assets/productos/Yupoo/216806537/2.webp"
        ],
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 144601,
        name: "Flamengo 25/26",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/216806071/1.webp",
        images: [
            "/assets/productos/Yupoo/216806071/2.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 666279,
        name: "Flamengo 25/26 Especial",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/216806004/1.webp",
        images: [
            "/assets/productos/Yupoo/216806004/2.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 791626,
        name: "México 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/216441726/1.webp",
        images: [
            "/assets/productos/Yupoo/216441726/2.webp"
        ],
        tipo: "local",
        temporada: "2026"
    },
    {
        id: 405261,
        name: "Alemania 2026 Visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/216441793/1.webp",
        images: [
            "/assets/productos/Yupoo/216441793/2.webp"
        ],
        tipo: "visitante",
        temporada: "2026"
    },
    {
        id: 613571,
        name: "Portugal 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/216441953/1.webp",
        images: [
            "/assets/productos/Yupoo/216441953/2.webp"
        ],
        temporada: "2026",
        tipo: "local"
    },
    {
        id: 851677,
        name: "Al Ahli 26/27 Visitante",
        category: "futbol",
        league: "ligaarabe",
        image: "/assets/productos/Yupoo/216423857/1.webp",
        images: [
            "/assets/productos/Yupoo/216423857/2.webp"
        ],
        temporada: "26/27",
        tipo: "visitante"
    },
    {
        id: 382204,
        name: "Al Ahli 26/27 Local",
        category: "futbol",
        league: "ligaarabe",
        image: "/assets/productos/Yupoo/216423781/1.webp",
        images: [
            "/assets/productos/Yupoo/216423781/2.webp"
        ],
        temporada: "26/27",
        tipo: "local"
    },
    {
        id: 523301,
        name: "Inter Milan 25/26 Tercera",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/216420875/1.webp",
        images: [
            "/assets/productos/Yupoo/216420875/2.webp"
        ],
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 968048,
        name: "Chelsea 25/26 Tercera",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/216420668/1.webp",
        images: [
            "/assets/productos/Yupoo/216420668/2.webp"
        ],
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 407027,
        name: "Atlético Mineiro 25/26",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/213836929/1.webp",
        images: [
            "/assets/productos/Yupoo/213836929/2.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 851556,
        name: "Santos 25/26 Visitante",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/213836761/1.webp",
        images: [
            "/assets/productos/Yupoo/213836761/2.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 382182,
        name: "Santa Cruz 25/26 Visitante",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/213836701/1.webp",
        images: [
            "/assets/productos/Yupoo/213836701/2.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 162492,
        name: "Inter Milan 25/26 Local",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/212532108/1.webp",
        images: [
            "/assets/productos/Yupoo/212532108/2.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 637422,
        name: "West Ham United 25/26 Tercera",
        category: "futbol",
        league: "premier",
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
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 580856,
        name: "Wolves 25/26 Local",
        category: "futbol",
        league: "premier",
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
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 638151,
        name: "PSG 00/01 Local Retro",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/211235324/1.webp",
        images: [
            "/assets/productos/Yupoo/211235324/2.webp",
            "/assets/productos/Yupoo/211235324/3.webp",
            "/assets/productos/Yupoo/211235324/4.webp",
            "/assets/productos/Yupoo/211235324/5.webp",
            "/assets/productos/Yupoo/211235324/6.webp"
        ],
        temporada: "00/01",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 829143,
        name: "Alemania 2008 Local Retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/211517757/1.webp",
        images: [
            "/assets/productos/Yupoo/211517757/2.webp",
            "/assets/productos/Yupoo/211517757/3.webp",
            "/assets/productos/Yupoo/211517757/4.webp",
            "/assets/productos/Yupoo/211517757/5.webp",
            "/assets/productos/Yupoo/211517757/6.webp"
        ],
        temporada: "2008",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 861810,
        name: "Holanda 2004 Local Retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/211235265/1.webp",
        images: [
            "/assets/productos/Yupoo/211235265/2.webp",
            "/assets/productos/Yupoo/211235265/3.webp",
            "/assets/productos/Yupoo/211235265/4.webp",
            "/assets/productos/Yupoo/211235265/5.webp",
            "/assets/productos/Yupoo/211235265/6.webp"
        ],
        temporada: "2004",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 740108,
        name: "Holanda 2004 Visitante Retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/211235213/1.webp",
        images: [
            "/assets/productos/Yupoo/211235213/2.webp",
            "/assets/productos/Yupoo/211235213/3.webp",
            "/assets/productos/Yupoo/211235213/4.webp",
            "/assets/productos/Yupoo/211235213/5.webp",
            "/assets/productos/Yupoo/211235213/6.webp",
            "/assets/productos/Yupoo/211235213/7.webp"
        ],
        temporada: "2004",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 431236,
        name: "Sao Paulo 25/26 Tercera",
        category: "futbol",
        league: "brasileirao",
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
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 549694,
        name: "Sporting Lisboa 25/26",
        category: "futbol",
        league: "Primeira Liga",
        image: "/assets/productos/Yupoo/208905010/1.webp",
        images: [
            "/assets/productos/Yupoo/208905010/2.webp",
            "/assets/productos/Yupoo/208905010/3.webp",
            "/assets/productos/Yupoo/208905010/4.webp",
            "/assets/productos/Yupoo/208905010/5.webp",
            "/assets/productos/Yupoo/208905010/6.webp",
            "/assets/productos/Yupoo/208905010/7.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 535164,
        name: "Sporting Lisboa 25/26 Portero Cuarta",
        category: "futbol",
        league: "Primeira Liga",
        image: "/assets/productos/Yupoo/216420441/1.webp",
        images: [
            "/assets/productos/Yupoo/216420441/2.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 351327,
        name: "Sporting Lisboa 25/26 Tercera",
        category: "futbol",
        league: "Primeira Liga",
        image: "/assets/productos/Yupoo/216420176/1.webp",
        images: [
            "/assets/productos/Yupoo/216420176/2.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 316255,
        name: "Sporting Lisboa 25/26 Edición Conmemorativa",
        category: "futbol",
        league: "Primeira Liga",
        image: "/assets/productos/Yupoo/216420592/1.webp",
        images: [
            "/assets/productos/Yupoo/216420592/2.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 755900,
        name: "Colombia 2026 Visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/219490648/1.webp",
        images: [
            "/assets/productos/Yupoo/219490648/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante"
    },
    {
        id: 475090,
        name: "Bélgica 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/219490303/1.webp",
        images: [
            "/assets/productos/Yupoo/219490303/2.webp"
        ],
        temporada: "2026",
        tipo: "local"
    },
    {
        id: 122777,
        name: "Portugal 2026 Visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/219464146/1.webp",
        images: [
            "/assets/productos/Yupoo/219464146/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante"
    },
    {
        id: 443462,
        name: "Norway 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/219490239/1.webp",
        images: [
            "/assets/productos/Yupoo/219490239/2.webp"
        ],
        temporada: "2026",
        tipo: "local"
    },
    {
        id: 935379,
        name: "Gales 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/935379/1.webp",
        images: [
            "/assets/productos/Yupoo/935379/2.webp"
        ],
        temporada: "2026",
        tipo: "local",
        slug: "gales-2026-local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 938860,
        name: "Portugal 2026",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/219464642/1.webp",
        images: [
            "/assets/productos/Yupoo/219464642/2.webp"
        ],
        temporada: "2026"
    },
    {
        id: 159689,
        name: "Argentina 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/219462514/1.webp",
        images: [
            "/assets/productos/Yupoo/219462514/2.webp"
        ],
        temporada: "2026",
        tipo: "local"
    },
    {
        id: 623155,
        name: "Argentina 2026 Portero",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/219462414/1.webp",
        images: [
            "/assets/productos/Yupoo/219462414/2.webp"
        ],
        temporada: "2026",
        tipo: "portero"
    },
    {
        id: 792005,
        name: "Sweden 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/218139468/1.webp",
        images: [
            "/assets/productos/Yupoo/218139468/2.webp"
        ],
        temporada: "2026",
        tipo: "local"
    },
    {
        id: 381663,
        name: "Peru 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/218139206/1.webp",
        images: [
            "/assets/productos/Yupoo/218139206/2.webp"
        ],
        temporada: "2026",
        tipo: "local"
    },
    {
        id: 433188,
        name: "Brasil 2025 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/216806220/1.webp",
        images: [
            "/assets/productos/Yupoo/216806220/2.webp"
        ],
        temporada: "2025",
        tipo: "local"
    },
    {
        id: 448046,
        name: "Flamengo 25/26 Portero Tercera",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/216805953/1.webp",
        images: [
            "/assets/productos/Yupoo/216805953/2.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 571063,
        name: "Chile 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/216442420/1.webp",
        images: [
            "/assets/productos/Yupoo/216442420/2.webp"
        ],
        temporada: "2026",
        tipo: "local"
    },
    {
        id: 711830,
        name: "Portugal 2026 Visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/216442463/1.webp",
        images: [
            "/assets/productos/Yupoo/216442463/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante"
    },
    {
        id: 320201,
        name: "Colombia 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/216442560/2.webp",
        images: [
            "/assets/productos/Yupoo/216442560/1.webp"
        ],
        temporada: "2026",
        tipo: "local"
    },
    {
        id: 670833,
        name: "México 2026 Visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/216442511/2.webp",
        images: [
            "/assets/productos/Yupoo/216442511/1.webp"
        ],
        temporada: "2026",
        tipo: "visitante"
    },
    {
        id: 417471,
        name: "Italia 2026 Visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/216441659/1.webp",
        images: [
            "/assets/productos/Yupoo/216441659/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante"
    },
    {
        id: 993378,
        name: "Celta 01/03 Tercera Retro",
        category: "futbol",
        league: "laliga",
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
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 553992,
        name: "Real Oviedo 90/91 Local Retro",
        category: "futbol",
        league: "laliga",
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
        temporada: "90/91",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 484880,
        name: "Atletico Madrid 02/03 Visitante Retro",
        category: "futbol",
        league: "laliga",
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
        temporada: "02/03",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 113368,
        name: "Atletico Madrid 10/11 Visitante Retro",
        category: "futbol",
        league: "laliga",
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
        temporada: "10/11",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 497909,
        name: "Newcastle United 25/26 Visitante",
        category: "futbol",
        league: "premier",
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
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 540044,
        name: "Schalke 04 25/26 Tercera",
        category: "futbol",
        league: "bundesliga",
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
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 985030,
        name: "Brighton 25/26 Local",
        category: "futbol",
        league: "premier",
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
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 744047,
        name: "Sporting Gijon 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/207450991/1.webp",
        images: [
            "/assets/productos/Yupoo/207450991/2.webp",
            "/assets/productos/Yupoo/207450991/3.webp",
            "/assets/productos/Yupoo/207450991/4.webp",
            "/assets/productos/Yupoo/207450991/5.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 255670,
        name: "Rayo Vallecano 97/98 Visitante Retro",
        category: "futbol",
        league: "laliga",
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
        temporada: "97/98",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 178706,
        name: "Rayo Vallecano 97/98 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/207451307/1.webp",
        images: [
            "/assets/productos/Yupoo/207451307/2.webp",
            "/assets/productos/Yupoo/207451307/3.webp",
            "/assets/productos/Yupoo/207451307/4.webp",
            "/assets/productos/Yupoo/207451307/5.webp"
        ],
        temporada: "97/98",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 155990,
        name: "Monaco 25/26 Local",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/204720362/1.webp",
        images: [
            "/assets/productos/Yupoo/204720362/2.webp",
            "/assets/productos/Yupoo/204720362/3.webp",
            "/assets/productos/Yupoo/204720362/4.webp",
            "/assets/productos/Yupoo/204720362/5.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 776038,
        name: "Monaco 25/26 Tercera",
        category: "futbol",
        league: "ligue1",
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
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 803718,
        name: "Monaco 25/26 Visitante",
        category: "futbol",
        league: "ligue1",
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
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 210794,
        name: "Everton 25/26 Local",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/204718775/1.webp",
        images: [
            "/assets/productos/Yupoo/204718775/2.webp",
            "/assets/productos/Yupoo/204718775/3.webp",
            "/assets/productos/Yupoo/204718775/4.webp",
            "/assets/productos/Yupoo/204718775/5.webp",
            "/assets/productos/Yupoo/204718775/6.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 762229,
        name: "AS Roma 25/26 Local",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/203703113/1.webp",
        images: [
            "/assets/productos/Yupoo/203703113/2.webp",
            "/assets/productos/Yupoo/203703113/3.webp",
            "/assets/productos/Yupoo/203703113/4.webp",
            "/assets/productos/Yupoo/203703113/5.webp",
            "/assets/productos/Yupoo/203703113/6.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 676633,
        name: "RCD Mallorca 25/26 Visitante",
        category: "futbol",
        league: "laliga",
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
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 869699,
        name: "Marseille 25/26 Visitante",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/203701585/1.webp",
        images: [
            "/assets/productos/Yupoo/203701585/2.webp",
            "/assets/productos/Yupoo/203701585/3.webp",
            "/assets/productos/Yupoo/203701585/4.webp",
            "/assets/productos/Yupoo/203701585/5.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 747923,
        name: "Marseille 25/26 Local",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/203701618/1.webp",
        images: [
            "/assets/productos/Yupoo/203701618/2.webp",
            "/assets/productos/Yupoo/203701618/3.webp",
            "/assets/productos/Yupoo/203701618/4.webp",
            "/assets/productos/Yupoo/203701618/5.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 464510,
        name: "Internacional 25/26 Visitante",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/203701302/1.webp",
        images: [
            "/assets/productos/Yupoo/203701302/2.webp",
            "/assets/productos/Yupoo/203701302/3.webp",
            "/assets/productos/Yupoo/203701302/4.webp",
            "/assets/productos/Yupoo/203701302/5.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 881988,
        name: "Sporting Lisboa 25/26 Local",
        category: "futbol",
        league: "Primeira Liga",
        image: "/assets/productos/Yupoo/202779885/1.webp",
        images: [
            "/assets/productos/Yupoo/202779885/2.webp",
            "/assets/productos/Yupoo/202779885/3.webp",
            "/assets/productos/Yupoo/202779885/4.webp",
            "/assets/productos/Yupoo/202779885/5.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 959227,
        name: "Athletic Bilbao 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/203698766/1.webp",
        images: [
            "/assets/productos/Yupoo/203698766/2.webp",
            "/assets/productos/Yupoo/203698766/3.webp",
            "/assets/productos/Yupoo/203698766/4.webp",
            "/assets/productos/Yupoo/203698766/5.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 883948,
        name: "Inter Milan 25/26 Visitante",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/202779358/1.webp",
        images: [
            "/assets/productos/Yupoo/202779358/2.webp",
            "/assets/productos/Yupoo/202779358/3.webp",
            "/assets/productos/Yupoo/202779358/4.webp",
            "/assets/productos/Yupoo/202779358/5.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 511048,
        name: "Dortmund 25/26 Local",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/202779313/1.webp",
        images: [
            "/assets/productos/Yupoo/202779313/2.webp",
            "/assets/productos/Yupoo/202779313/3.webp",
            "/assets/productos/Yupoo/202779313/4.webp",
            "/assets/productos/Yupoo/202779313/5.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 218012,
        name: "Benfica 25/26 Entrenamiento Negra",
        category: "futbol",
        league: "Primeira Liga",
        image: "/assets/productos/Yupoo/202779248/1.webp",
        images: [
            "/assets/productos/Yupoo/202779248/2.webp",
            "/assets/productos/Yupoo/202779248/3.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 240084,
        name: "Aston Villa 25/26 Local",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/202778698/1.webp",
        images: [
            "/assets/productos/Yupoo/202778698/2.webp",
            "/assets/productos/Yupoo/202778698/3.webp",
            "/assets/productos/Yupoo/202778698/4.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 899447,
        name: "Ajax 25/26 Local",
        category: "futbol",
        league: "Eredivise",
        image: "/assets/productos/Yupoo/202778041/1.webp",
        images: [
            "/assets/productos/Yupoo/202778041/2.webp",
            "/assets/productos/Yupoo/202778041/3.webp",
            "/assets/productos/Yupoo/202778041/4.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 385548,
        name: "AC Milan 25/26 Tercera",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/202777830/1.webp",
        images: [
            "/assets/productos/Yupoo/202777830/2.webp",
            "/assets/productos/Yupoo/202777830/3.webp",
            "/assets/productos/Yupoo/202777830/4.webp"
        ],
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 850115,
        name: "Bayern Munich 17/18 Local Retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/202776893/1.webp",
        images: [
            "/assets/productos/Yupoo/202776893/2.webp",
            "/assets/productos/Yupoo/202776893/3.webp"
        ],
        temporada: "17/18",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 608983,
        name: "Manchester City 19/20 Local Retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/202656896/1.webp",
        images: [
            "/assets/productos/Yupoo/202656896/2.webp",
            "/assets/productos/Yupoo/202656896/3.webp",
            "/assets/productos/Yupoo/202656896/4.webp"
        ],
        temporada: "19/20",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 529738,
        name: "Manchester United 2019/20 Visitante Retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/529738/1.webp",
        images: [
            "/assets/productos/Yupoo/529738/2.webp"
        ],
        temporada: "2019/20",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30,
        slug: "manchester-united-201920-visitante-retro"
    },
    {
        id: 457426,
        name: "Porto 25/26 Local",
        category: "futbol",
        league: "Primeira Liga",
        image: "/assets/productos/Yupoo/201350547/1.webp",
        images: [
            "/assets/productos/Yupoo/201350547/2.webp",
            "/assets/productos/Yupoo/201350547/3.webp",
            "/assets/productos/Yupoo/201350547/4.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 903135,
        name: "Porto 25/26 Visitante",
        category: "futbol",
        league: "Primeira Liga",
        image: "/assets/productos/Yupoo/201350489/1.webp",
        images: [
            "/assets/productos/Yupoo/201350489/2.webp",
            "/assets/productos/Yupoo/201350489/3.webp",
            "/assets/productos/Yupoo/201350489/4.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 705945,
        name: "Benfica 25/26 Especial",
        category: "futbol",
        league: "Primeira Liga",
        image: "/assets/productos/Yupoo/201349762/1.webp",
        images: [
            "/assets/productos/Yupoo/201349762/2.webp",
            "/assets/productos/Yupoo/201349762/3.webp",
            "/assets/productos/Yupoo/201349762/4.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 102616,
        name: "Benfica 25/26 Visitante",
        category: "futbol",
        league: "Primeira Liga",
        image: "/assets/productos/Yupoo/201349635/1.webp",
        images: [
            "/assets/productos/Yupoo/201349635/2.webp",
            "/assets/productos/Yupoo/201349635/3.webp",
            "/assets/productos/Yupoo/201349635/4.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 479020,
        name: "Benfica 25/26 Tercera",
        category: "futbol",
        league: "Primeira Liga",
        image: "/assets/productos/Yupoo/200370613/1.webp",
        images: [
            "/assets/productos/Yupoo/200370613/2.webp",
            "/assets/productos/Yupoo/200370613/3.webp",
            "/assets/productos/Yupoo/200370613/4.webp"
        ],
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 255538,
        name: "Porto 99/00 Local Retro",
        category: "futbol",
        league: "Primeira Liga",
        image: "/assets/productos/Yupoo/200365393/1.webp",
        images: [
            "/assets/productos/Yupoo/200365393/2.webp",
            "/assets/productos/Yupoo/200365393/3.webp",
            "/assets/productos/Yupoo/200365393/4.webp"
        ],
        temporada: "99/00",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 592754,
        name: "Manchester United 25/26 Tercera",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/199227576/1.webp",
        images: [
            "/assets/productos/Yupoo/199227576/2.webp",
            "/assets/productos/Yupoo/199227576/3.webp",
            "/assets/productos/Yupoo/199227576/4.webp"
        ],
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 489628,
        name: "Boca Juniors 25/26 Local",
        category: "futbol",
        league: "saf",
        image: "/assets/productos/Yupoo/197577020/1.webp",
        images: [
            "/assets/productos/Yupoo/197577020/2.webp",
            "/assets/productos/Yupoo/197577020/3.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 100332,
        name: "Real Madrid 14/15 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/197575196/1.webp",
        images: [
            "/assets/productos/Yupoo/197575196/2.webp",
            "/assets/productos/Yupoo/197575196/3.webp",
            "/assets/productos/Yupoo/197575196/4.webp"
        ],
        temporada: "14/15",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 302194,
        name: "São Paulo 25/26 Visitante",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/197477146/1.webp",
        images: [
            "/assets/productos/Yupoo/197477146/2.webp",
            "/assets/productos/Yupoo/197477146/3.webp",
            "/assets/productos/Yupoo/197477146/4.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 875632,
        name: "Miami 25/26 Visitante",
        category: "futbol",
        league: "MLS",
        image: "/assets/productos/Yupoo/193931028/1.webp",
        images: [
            "/assets/productos/Yupoo/193931028/2.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 286288,
        name: "Boca Juniors 25/26",
        category: "futbol",
        league: "saf",
        image: "/assets/productos/Yupoo/193927751/1.webp",
        images: [
            "/assets/productos/Yupoo/193927751/2.webp",
            "/assets/productos/Yupoo/193927751/3.webp",
            "/assets/productos/Yupoo/193927751/4.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 279168,
        name: "Manchester City 13/14 Local Retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/193883573/1.webp",
        images: [
            "/assets/productos/Yupoo/193883573/2.webp",
            "/assets/productos/Yupoo/193883573/3.webp",
            "/assets/productos/Yupoo/193883573/4.webp"
        ],
        temporada: "13/14",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 625429,
        name: "Brazil Juese 2025",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/193882594/1.webp",
        images: [
            "/assets/productos/Yupoo/193882594/2.webp",
            "/assets/productos/Yupoo/193882594/3.webp",
            "/assets/productos/Yupoo/193882594/4.webp"
        ],
        temporada: "2025"
    },
    {
        id: 115407,
        name: "Mexico Dorada 2025",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/192260006/1.webp",
        images: [
            "/assets/productos/Yupoo/192260006/2.webp",
            "/assets/productos/Yupoo/192260006/3.webp",
            "/assets/productos/Yupoo/192260006/4.webp"
        ],
        temporada: "2025"
    },
    {
        id: 655802,
        name: "Brasil 2025",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/192260092/1.webp",
        images: [
            "/assets/productos/Yupoo/192260092/2.webp",
            "/assets/productos/Yupoo/192260092/3.webp",
            "/assets/productos/Yupoo/192260092/4.webp"
        ],
        temporada: "2025"
    },
    {
        id: 435415,
        name: "Internacional 25/26 Local",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/192259967/1.webp",
        images: [
            "/assets/productos/Yupoo/192259967/2.webp",
            "/assets/productos/Yupoo/192259967/3.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 224087,
        name: "AS Roma 00/01 Local Retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/192257942/1.webp",
        images: [
            "/assets/productos/Yupoo/192257942/2.webp",
            "/assets/productos/Yupoo/192257942/3.webp",
            "/assets/productos/Yupoo/192257942/4.webp"
        ],
        temporada: "00/01",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 833095,
        name: "AS Roma 92/94 Local Retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/192257870/1.webp",
        images: [
            "/assets/productos/Yupoo/192257870/2.webp",
            "/assets/productos/Yupoo/192257870/3.webp",
            "/assets/productos/Yupoo/192257870/4.webp"
        ],
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 635969,
        name: "AS Roma 95/96 Local Retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/192257826/1.webp",
        images: [
            "/assets/productos/Yupoo/192257826/2.webp",
            "/assets/productos/Yupoo/192257826/3.webp",
            "/assets/productos/Yupoo/192257826/4.webp"
        ],
        temporada: "95/96",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 945452,
        name: "River Plate 13/14 Local Retro",
        category: "futbol",
        league: "saf",
        image: "/assets/productos/Yupoo/192252827/1.webp",
        images: [
            "/assets/productos/Yupoo/192252827/2.webp",
            "/assets/productos/Yupoo/192252827/3.webp",
            "/assets/productos/Yupoo/192252827/4.webp"
        ],
        temporada: "13/14",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 588525,
        name: "Real Madrid 86/88 Visitante Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/189209051/1.webp",
        images: [
            "/assets/productos/Yupoo/189209051/2.webp",
            "/assets/productos/Yupoo/189209051/3.webp"
        ],
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 766126,
        name: "Real Madrid 98/00 Tercera Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/167010565/1.webp",
        images: [
            "/assets/productos/Yupoo/167010565/2.webp",
            "/assets/productos/Yupoo/167010565/3.webp",
            "/assets/productos/Yupoo/167010565/4.webp"
        ],
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 523343,
        name: "Real Madrid 17/18 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/117031712/1.webp",
        images: [
            "/assets/productos/Yupoo/117031712/2.webp",
            "/assets/productos/Yupoo/117031712/3.webp",
            "/assets/productos/Yupoo/117031712/4.webp"
        ],
        temporada: "17/18",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 348972,
        name: "Real Madrid 2000 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/114619503/1.webp",
        images: [
            "/assets/productos/Yupoo/114619503/2.webp",
            "/assets/productos/Yupoo/114619503/3.webp",
            "/assets/productos/Yupoo/114619503/4.webp"
        ],
        temporada: "2000",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 167625,
        name: "Real Madrid 88/89 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/169073222/1.webp",
        images: [
            "/assets/productos/Yupoo/169073222/2.webp",
            "/assets/productos/Yupoo/169073222/3.webp"
        ],
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 419589,
        name: "FC Barcelona 2007 Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/69556791/1.webp",
        images: [
            "/assets/productos/Yupoo/69556791/2.webp",
            "/assets/productos/Yupoo/69556791/3.webp"
        ],
        temporada: "2007",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 938026,
        name: "FC Barcelona 16/17 Visitante Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/138944331/1.webp",
        images: [
            "/assets/productos/Yupoo/138944331/2.webp",
            "/assets/productos/Yupoo/138944331/3.webp",
            "/assets/productos/Yupoo/138944331/4.webp"
        ],
        temporada: "16/17",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 769552,
        name: "FC Barcelona 17/18 Tercera Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/192251388/1.webp",
        images: [
            "/assets/productos/Yupoo/192251388/2.webp",
            "/assets/productos/Yupoo/192251388/3.webp",
            "/assets/productos/Yupoo/192251388/4.webp"
        ],
        temporada: "17/18",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 820529,
        name: "FC Barcelona 09/10 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/138944262/1.webp",
        images: [
            "/assets/productos/Yupoo/138944262/2.webp",
            "/assets/productos/Yupoo/138944262/3.webp"
        ],
        temporada: "09/10",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 736040,
        name: "FC Barcelona 13/14 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/146962779/1.webp",
        images: [
            "/assets/productos/Yupoo/146962779/2.webp",
            "/assets/productos/Yupoo/146962779/3.webp"
        ],
        temporada: "13/14",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 497972,
        name: "FC Barcelona 08/09 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/134230348/1.webp",
        images: [
            "/assets/productos/Yupoo/134230348/2.webp",
            "/assets/productos/Yupoo/134230348/3.webp"
        ],
        temporada: "08/09",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 421151,
        name: "Málaga CF 12/13 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/215727648/1.webp",
        images: [
            "/assets/productos/Yupoo/215727648/2.webp"
        ],
        temporada: "12/13",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 351350,
        name: "Burgos 25/26 Tercera",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/213790918/1.webp",
        images: [
            "/assets/productos/Yupoo/213790918/2.webp"
        ],
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 567203,
        name: "Burgos 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/213790880/1.webp",
        images: [
            "/assets/productos/Yupoo/213790880/2.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 921620,
        name: "Real Betis 88/89 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/213865644/1.webp",
        images: [
            "/assets/productos/Yupoo/213865644/2.webp"
        ],
        temporada: "88/89",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 379818,
        name: "Athletic Bilbao 86/87 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/214131342/1.webp",
        images: [
            "/assets/productos/Yupoo/214131342/2.webp"
        ],
        temporada: "86/87",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 506078,
        name: "Athletic Bilbao 96/97 Visitante Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/214136150/1.webp",
        images: [
            "/assets/productos/Yupoo/214136150/2.webp"
        ],
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 570007,
        name: "Real Madrid 12/13 Visitante Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/212822016/1.webp",
        images: [
            "/assets/productos/Yupoo/212822016/2.webp"
        ],
        temporada: "12/13",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 835385,
        name: "Atletico Madrid 16/17 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/214403910/1.webp",
        images: [
            "/assets/productos/Yupoo/214403910/2.webp"
        ],
        temporada: "16/17",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 228891,
        name: "Atletico Madrid 82/83 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/214401832/1.webp",
        images: [
            "/assets/productos/Yupoo/214401832/2.webp"
        ],
        temporada: "82/83",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 483007,
        name: "FC Barcelona 25/26 Cuarta",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/213273196/1.webp",
        images: [
            "/assets/productos/Yupoo/213273196/2.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 887491,
        name: "FC Barcelona 14/15 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/212822675/1.webp",
        images: [
            "/assets/productos/Yupoo/212822675/2.webp"
        ],
        temporada: "14/15",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 552798,
        name: "Real Madrid 14/15 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/212822679/1.webp",
        images: [
            "/assets/productos/Yupoo/212822679/2.webp"
        ],
        temporada: "14/15",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 900814,
        name: "Real Madrid 17/18 Visitante Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/212821987/1.webp",
        images: [
            "/assets/productos/Yupoo/212821987/2.webp"
        ],
        temporada: "17/18",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 992598,
        name: "Real Madrid 13/14 Visitante Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/212822009/1.webp",
        images: [
            "/assets/productos/Yupoo/212822009/2.webp"
        ],
        temporada: "13/14",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 422613,
        name: "Real Madrid 11/12 Visitante Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/212821912/1.webp",
        images: [
            "/assets/productos/Yupoo/212821912/2.webp"
        ],
        temporada: "11/12",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 487998,
        name: "Zaragoza 95/96 Visitante Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/212487006/1.webp",
        images: [
            "/assets/productos/Yupoo/212487006/2.webp"
        ],
        temporada: "95/96",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 798155,
        name: "FC Barcelona 17/18 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/212389897/1.webp",
        images: [
            "/assets/productos/Yupoo/212389897/2.webp"
        ],
        temporada: "17/18",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 804311,
        name: "FC Barcelona 12/13 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/212390713/1.webp",
        images: [
            "/assets/productos/Yupoo/212390713/2.webp"
        ],
        temporada: "12/13",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 501778,
        name: "Rayo Vallecano 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/209571129/1.webp",
        images: [
            "/assets/productos/Yupoo/209571129/2.webp",
            "/assets/productos/Yupoo/209571129/3.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 553431,
        name: "Rayo Vallecano 25/26 Tercera",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/209571144/1.webp",
        images: [
            "/assets/productos/Yupoo/209571144/2.webp",
            "/assets/productos/Yupoo/209571144/3.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 593027,
        name: "Zaragoza 25/26 Visitante",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/209571071/1.webp",
        images: [
            "/assets/productos/Yupoo/209571071/2.webp",
            "/assets/productos/Yupoo/209571071/3.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 386584,
        name: "Zaragoza 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/210323914/1.webp",
        images: [
            "/assets/productos/Yupoo/210323914/2.webp",
            "/assets/productos/Yupoo/210323914/3.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 716949,
        name: "Napoli 25/26",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/216807171/1.webp",
        images: [
            "/assets/productos/Yupoo/216807171/2.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 276794,
        name: "Feyenoord 25/26 Local",
        category: "futbol",
        league: "Eredivise",
        image: "/assets/productos/Yupoo/201349993/1.webp",
        images: [
            "/assets/productos/Yupoo/201349993/2.webp",
            "/assets/productos/Yupoo/201349993/3.webp",
            "/assets/productos/Yupoo/201349993/4.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 728985,
        name: "Croacia 2026 Local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/219700516/1.webp",
        images: [
            "/assets/productos/Yupoo/219700516/2.webp"
        ],
        temporada: "2026",
        tipo: "local"
    },
    {
        id: 384796,
        name: "Tottenham Hotspur 87/89 Local Retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/215724075/1.webp",
        images: [
            "/assets/productos/Yupoo/215724075/2.webp"
        ],
        tipo: "local",
        retro: true,
        temporada: "87/89",
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 154366,
        name: "Como 25/26 Local",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/211234031/1.webp",
        images: [
            "/assets/productos/Yupoo/211234031/2.webp",
            "/assets/productos/Yupoo/211234031/3.webp",
            "/assets/productos/Yupoo/211234031/4.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 894216,
        name: "Miami 25/26 Tercera",
        category: "futbol",
        league: "MLS",
        image: "/assets/productos/Yupoo/192250021/1.webp",
        images: [
            "/assets/productos/Yupoo/192250021/2.webp",
            "/assets/productos/Yupoo/192250021/3.webp"
        ],
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 308311,
        name: "Miami 25/26 Local",
        category: "futbol",
        league: "MLS",
        image: "/assets/productos/Yupoo/187746737/1.webp",
        images: [
            "/assets/productos/Yupoo/187746737/2.webp",
            "/assets/productos/Yupoo/187746737/3.webp",
            "/assets/productos/Yupoo/187746737/4.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 570882,
        name: "Marseille 25/26 Tercera",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/211234336/1.webp",
        images: [
            "/assets/productos/Yupoo/211234336/2.webp",
            "/assets/productos/Yupoo/211234336/3.webp"
        ],
        temporada: "25/26",
        tipo: "tercera"
    },
    {
        id: 229242,
        name: "Palmeiras 25/26 Local",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/187764069/1.webp",
        images: [
            "/assets/productos/Yupoo/187764069/2.webp",
            "/assets/productos/Yupoo/187764069/3.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 128909,
        name: "Flamengo 25/26 Local",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/187670662/1.webp",
        images: [
            "/assets/productos/Yupoo/187670662/2.webp",
            "/assets/productos/Yupoo/187670662/3.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 703398,
        name: "FC Barcelona 25/26 Especial",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/193879799/1.webp",
        images: [
            "/assets/productos/Yupoo/193879799/2.webp",
            "/assets/productos/Yupoo/193879799/3.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 203152,
        name: "Miami 25/26 Local (Niño)",
        category: "futbol",
        league: "MLS",
        image: "/assets/productos/Yupoo/189206799/1.webp",
        images: [
            "/assets/productos/Yupoo/189206799/2.webp",
            "/assets/productos/Yupoo/189206799/3.webp"
        ],
        temporada: "25/26",
        tipo: "local",
        kids: true
    },
    {
        id: 866849,
        name: "Miami 25/26 Visitante (Niño)",
        category: "futbol",
        league: "MLS",
        image: "/assets/productos/Yupoo/187758478/1.webp",
        images: [
            "/assets/productos/Yupoo/187758478/2.webp",
            "/assets/productos/Yupoo/187758478/3.webp"
        ],
        temporada: "25/26",
        tipo: "visitante",
        kids: true
    },
    {
        id: 974000,
        name: "Miami 24/25 Especial",
        category: "futbol",
        league: "MLS",
        image: "/assets/productos/Yupoo/178962329/1.webp",
        images: [
            "/assets/productos/Yupoo/178962329/2.webp"
        ],
        temporada: "24/25"
    },
    {
        id: 896413,
        name: "Benfica 25/26 Entrenamiento",
        category: "futbol",
        league: "Primeira Liga",
        image: "/assets/productos/Yupoo/188021703/1.webp",
        images: [
            "/assets/productos/Yupoo/188021703/2.webp",
            "/assets/productos/Yupoo/188021703/3.webp",
            "/assets/productos/Yupoo/188021703/4.webp"
        ],
        temporada: "25/26",
        tipo: "entrenamiento"
    },
    {
        id: 378241,
        name: "Elche 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/214401561/1.webp",
        images: [
            "/assets/productos/Yupoo/214401561/2.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 821734,
        name: "Rayo Vallecano 25/26 Local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/821734/1.webp",
        images: [
            "/assets/productos/Yupoo/821734/2.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 884672,
        name: "Rayo Vallecano 94/95 Local Retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/884672/1.webp",
        images: [
            "/assets/productos/Yupoo/884672/2.webp"
        ],
        temporada: "94/95",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 333660,
        name: "AS Roma 98/99 Visitante Retro",
        slug: "as-roma-9899-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/333660/1.webp",
        images: [
            "/assets/productos/Yupoo/333660/2.webp"
        ],
        temporada: "98/99",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 771897,
        name: "Tenerife 95/96 Visitante Retro",
        slug: "tenerife-9596-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/771897/1.webp",
        images: [
            "/assets/productos/Yupoo/771897/2.webp"
        ],
        temporada: "95/96",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 253296,
        name: "Los Angeles 25/26 Visitante",
        slug: "los-angeles-2526-visitante",
        category: "futbol",
        league: "MLS",
        image: "/assets/productos/Yupoo/253296/1.webp",
        images: [
            "/assets/productos/Yupoo/253296/2.webp",
            "/assets/productos/Yupoo/253296/3.webp",
            "/assets/productos/Yupoo/253296/4.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 449990,
        name: "Monterrey 25/26 Local",
        slug: "monterrey-2526-local",
        category: "futbol",
        league: "Liga MX",
        image: "/assets/productos/Yupoo/449990/1.webp",
        images: [
            "/assets/productos/Yupoo/449990/2.webp",
            "/assets/productos/Yupoo/449990/3.webp",
            "/assets/productos/Yupoo/449990/4.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 510415,
        name: "Chivas 25/26 Local",
        slug: "chivas-2526-local",
        category: "futbol",
        league: "Liga MX",
        image: "/assets/productos/Yupoo/510415/1.webp",
        images: [
            "/assets/productos/Yupoo/510415/2.webp",
            "/assets/productos/Yupoo/510415/3.webp",
            "/assets/productos/Yupoo/510415/4.webp"
        ],
        temporada: "25/26",
        tipo: "local"
    },
    {
        id: 329742,
        name: "Schalke 04 25/26 Visitante",
        slug: "schalke-04-2526-visitante",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/329742/1.webp",
        images: [
            "/assets/productos/Yupoo/329742/2.webp",
            "/assets/productos/Yupoo/329742/3.webp",
            "/assets/productos/Yupoo/329742/4.webp"
        ],
        temporada: "25/26",
        tipo: "visitante"
    },
    {
        id: 927903,
        name: "Bayern Munich 25/26 125 Aniversario",
        slug: "bayern-munich-2526-125-aniversario",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/927903/1.webp",
        images: [
            "/assets/productos/Yupoo/927903/2.webp",
            "/assets/productos/Yupoo/927903/3.webp",
            "/assets/productos/Yupoo/927903/4.webp"
        ],
        temporada: "25/26"
    },
    {
        id: 309182,
        name: "Brasil 2004/06 Local Retro",
        slug: "brasil-200406-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/309182/1.webp",
        images: [
            "/assets/productos/Yupoo/309182/2.webp"
        ],
        temporada: "2004/06",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 261613,
        name: "Brasil 2002 Visitante Retro",
        slug: "brasil-2002-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/261613/1.webp",
        images: [
            "/assets/productos/Yupoo/261613/2.webp"
        ],
        temporada: "2002",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 646982,
        name: "Crystal Palace 96/98 Local Retro",
        slug: "crystal-palace-9698-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/646982/1.webp",
        images: [
            "/assets/productos/Yupoo/646982/2.webp"
        ],
        temporada: "96/98",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 198265,
        name: "PSG 25/26 Cuarta",
        slug: "psg-2526-cuarta",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/198265/1.webp",
        images: [
            "/assets/productos/Yupoo/198265/2.webp"
        ],
        temporada: "25/26",
        tipo: "cuarta"
    },
    {
        id: 316527,
        name: "Brasil 2026 Especial",
        slug: "brasil-2026-especial",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/316527/1.webp",
        images: [
            "/assets/productos/Yupoo/316527/2.webp"
        ],
        temporada: "2026",
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 816004,
        name: "PSG 25/26 Entrenamiento",
        slug: "psg-2526-entrenamiento",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/816004/1.webp",
        images: [
            "/assets/productos/Yupoo/816004/2.webp"
        ],
        temporada: "25/26",
        tipo: "entrenamiento"
    },
    {
        id: 377846,
        name: "PSG 25/26 Entrenamiento",
        slug: "psg-2526-entrenamiento",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/377846/1.webp",
        images: [
            "/assets/productos/Yupoo/377846/2.webp"
        ],
        temporada: "25/26",
        tipo: "entrenamiento"
    },
    {
        id: 793487,
        name: "Córdoba estilo Retro 25/26",
        slug: "cordoba-estilo-retro-2526",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/793487/1.webp",
        images: [
            "/assets/productos/Yupoo/793487/2.webp"
        ],
        temporada: "25/26",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 297890,
        name: "Deportivo La Coruña estilo Retro 25/26",
        slug: "deportivo-la-coruna-estilo-retro-2526",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/297890/1.webp",
        images: [
            "/assets/productos/Yupoo/297890/2.webp"
        ],
        temporada: "25/26",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 268041,
        name: "Vasco da Gama 26/27",
        slug: "vasco-da-gama-2627",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/268041/1.webp",
        images: [
            "/assets/productos/Yupoo/268041/2.webp"
        ],
        temporada: "26/27",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 396060,
        name: "Deportivo La Coruña 99/00 Visitante Retro",
        slug: "deportivo-la-coruna-9900-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/396060/1.webp",
        images: [
            "/assets/productos/Yupoo/396060/2.webp"
        ],
        temporada: "99/00",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 533758,
        name: "Granada estilo Retro 25/26",
        slug: "granada-estilo-retro-2526",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/533758/1.webp",
        images: [
            "/assets/productos/Yupoo/533758/2.webp"
        ],
        temporada: "25/26",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 180045,
        name: "Brasil 26/27 Especial (Niño)",
        slug: "brasil-2627-especial-nino",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/180045/1.webp",
        images: [
            "/assets/productos/Yupoo/180045/2.webp"
        ],
        temporada: "26/27",
        tipo: "especial",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 847286,
        name: "Chile 2026 Visitante",
        slug: "chile-2026-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/847286/1.webp",
        images: [
            "/assets/productos/Yupoo/847286/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 625093,
        name: "Estados Unidos 2026 Local",
        slug: "estados-unidos-2026-local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/625093/1.webp",
        images: [
            "/assets/productos/Yupoo/625093/2.webp"
        ],
        temporada: "2026",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 496971,
        name: "Argentina 2026 Visitante",
        slug: "argentina-2026-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/496971/1.webp",
        images: [
            "/assets/productos/Yupoo/496971/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 323995,
        name: "Porto 25/26 Especial",
        slug: "porto-2526-especial",
        category: "futbol",
        league: "ligaportugal",
        image: "/assets/productos/Yupoo/323995/1.webp",
        images: [
            "/assets/productos/Yupoo/323995/2.webp"
        ],
        temporada: "25/26",
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 561018,
        name: "Corea del Sur 2026 Visitante",
        slug: "corea-del-sur-2026-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/561018/1.webp",
        images: [
            "/assets/productos/Yupoo/561018/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 723725,
        name: "Jamaica 2026 Visitante (Niño)",
        slug: "jamaica-2026-visitante-nino",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/723725/1.webp",
        images: [
            "/assets/productos/Yupoo/723725/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 317637,
        name: "Francia 2026 Local",
        slug: "francia-2026-local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/317637/1.webp",
        images: [
            "/assets/productos/Yupoo/317637/2.webp"
        ],
        temporada: "2026",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 283825,
        name: "Ecuador 2026 Visitante",
        slug: "ecuador-2026-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/283825/1.webp",
        images: [
            "/assets/productos/Yupoo/283825/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 548956,
        name: "Ecuador 2026 Local",
        slug: "ecuador-2026-local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/548956/1.webp",
        images: [
            "/assets/productos/Yupoo/548956/2.webp"
        ],
        temporada: "2026",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 791467,
        name: "Brasil 2026 Portero",
        slug: "brasil-2026-portero",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/791467/1.webp",
        images: [
            "/assets/productos/Yupoo/791467/2.webp"
        ],
        temporada: "2026",
        tipo: "portero",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 640573,
        name: "España 2026 Visitante",
        slug: "espana-2026-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/640573/1.webp",
        images: [
            "/assets/productos/Yupoo/640573/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 971378,
        name: "Estados Unidos 2026 Visitante",
        slug: "estados-unidos-2026-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/971378/1.webp",
        images: [
            "/assets/productos/Yupoo/971378/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 569825,
        name: "Uruguay 26/27 Especial",
        slug: "uruguay-2627-especial",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/569825/1.webp",
        images: [
            "/assets/productos/Yupoo/569825/2.webp"
        ],
        temporada: "26/27",
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 394410,
        name: "Holanda 2026 Local",
        slug: "holanda-2026-local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/394410/1.webp",
        images: [
            "/assets/productos/Yupoo/394410/2.webp"
        ],
        temporada: "2026",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 953993,
        name: "Holanda 2026 Visitante",
        slug: "holanda-2026-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/953993/1.webp",
        images: [
            "/assets/productos/Yupoo/953993/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 864159,
        name: "México 2026 Tercera",
        slug: "mexico-2026-tercera",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/864159/1.webp",
        images: [
            "/assets/productos/Yupoo/864159/2.webp"
        ],
        temporada: "2026",
        tipo: "tercera",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 588206,
        name: "Francia 2026 Visitante",
        slug: "francia-2026-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/588206/1.webp",
        images: [
            "/assets/productos/Yupoo/588206/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 469039,
        name: "Inglaterra 2026 Visitante",
        slug: "inglaterra-2026-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/469039/1.webp",
        images: [
            "/assets/productos/Yupoo/469039/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 984407,
        name: "Brasil 2026 Local",
        slug: "brasil-2026-local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/984407/1.webp",
        images: [
            "/assets/productos/Yupoo/984407/2.webp"
        ],
        temporada: "2026",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 194611,
        name: "Brasil 2026 Visitante",
        slug: "brasil-2026-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/194611/1.webp",
        images: [
            "/assets/productos/Yupoo/194611/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 355131,
        name: "Fluminense 26/27 Visitante",
        slug: "fluminense-2627-visitante",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/355131/1.webp",
        images: [
            "/assets/productos/Yupoo/355131/2.webp"
        ],
        temporada: "26/27",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 973390,
        name: "Flamengo 26/27 Polo",
        slug: "flamengo-2627-polo",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/973390/1.webp",
        images: [
            "/assets/productos/Yupoo/973390/2.webp"
        ],
        temporada: "26/27",
        tipo: "polo",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 151471,
        name: "Flamengo 26/27 Local",
        slug: "flamengo-2627-local",
        category: "futbol",
        league: "brasileirao",
        image: "/assets/productos/Yupoo/151471/1.webp",
        images: [
            "/assets/productos/Yupoo/151471/2.webp"
        ],
        temporada: "26/27",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 334789,
        name: "Atlético Mineiro 26/27 Local",
        slug: "atletico-mineiro-2627-local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/334789/1.webp",
        images: [
            "/assets/productos/Yupoo/334789/2.webp"
        ],
        temporada: "26/27",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 188349,
        name: "Real Madrid 26/27 Especial",
        slug: "real-madrid-2627-especial",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/188349/1.webp",
        images: [
            "/assets/productos/Yupoo/188349/2.webp"
        ],
        temporada: "26/27",
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 684221,
        name: "Uruguay 2026 Visitante",
        slug: "uruguay-2026-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/684221/1.webp",
        images: [
            "/assets/productos/Yupoo/684221/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 642494,
        name: "Suiza 2026 Visitante",
        slug: "suiza-2026-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/642494/1.webp",
        images: [
            "/assets/productos/Yupoo/642494/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 636705,
        name: "Marruecos 2026 Local",
        slug: "marruecos-2026-local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/636705/1.webp",
        images: [
            "/assets/productos/Yupoo/636705/2.webp"
        ],
        temporada: "2026",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 889014,
        name: "México 2026 Portero",
        slug: "mexico-2026-portero",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/889014/1.webp",
        images: [
            "/assets/productos/Yupoo/889014/2.webp"
        ],
        temporada: "2026",
        tipo: "portero",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 341528,
        name: "Alemania 2026 Portero",
        slug: "alemania-2026-portero",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/341528/1.webp",
        images: [
            "/assets/productos/Yupoo/341528/2.webp"
        ],
        temporada: "2026",
        tipo: "portero",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 701294,
        name: "Argelia 2026",
        slug: "argelia-2026",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/701294/1.webp",
        images: [
            "/assets/productos/Yupoo/701294/2.webp"
        ],
        temporada: "2026",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 347591,
        name: "Bélgica 2026 Visitante",
        slug: "belgica-2026-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/347591/1.webp",
        images: [
            "/assets/productos/Yupoo/347591/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 232684,
        name: "Zaragoza 25/26 Cuarta",
        slug: "zaragoza-2526-cuarta",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/232684/1.webp",
        images: [
            "/assets/productos/Yupoo/232684/2.webp"
        ],
        temporada: "25/26",
        tipo: "cuarta",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 894978,
        name: "Torino 25/26 Tercera",
        slug: "torino-2526-tercera",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/894978/1.webp",
        images: [
            "/assets/productos/Yupoo/894978/2.webp"
        ],
        temporada: "25/26",
        tipo: "tercera",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 169125,
        name: "Sevilla 25/26 Entrenamiento",
        slug: "sevilla-2526-entrenamiento",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/169125/1.webp",
        images: [
            "/assets/productos/Yupoo/169125/2.webp"
        ],
        temporada: "25/26",
        tipo: "entrenamiento",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 101590,
        name: "Sevilla 25/26",
        slug: "sevilla-2526",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/101590/1.webp",
        images: [
            "/assets/productos/Yupoo/101590/2.webp"
        ],
        temporada: "25/26",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 869540,
        name: "Valladolid 25/26 Especial",
        slug: "valladolid-2526-especial",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/869540/1.webp",
        images: [
            "/assets/productos/Yupoo/869540/2.webp"
        ],
        temporada: "25/26",
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 852761,
        name: "Brasil 2026 Local (Niño)",
        slug: "brasil-2026-local-nino",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/852761/1.webp",
        images: [
            "/assets/productos/Yupoo/852761/2.webp"
        ],
        temporada: "2026",
        tipo: "local",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 563901,
        name: "Crystal Palace 25/26 Local (Niño)",
        slug: "crystal-palace-2526-local-nino",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/563901/1.webp",
        images: [
            "/assets/productos/Yupoo/563901/2.webp"
        ],
        temporada: "25/26",
        tipo: "local",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 523499,
        name: "Brasil 2026 Visitante (Niño)",
        slug: "brasil-2026-visitante-nino",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/523499/1.webp",
        images: [
            "/assets/productos/Yupoo/523499/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 990675,
        name: "Ajax 25/26 Tercera (Niño)",
        slug: "ajax-2526-tercera-nino",
        category: "futbol",
        league: "eredivisie",
        image: "/assets/productos/Yupoo/990675/1.webp",
        images: [
            "/assets/productos/Yupoo/990675/2.webp"
        ],
        temporada: "25/26",
        tipo: "tercera",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 814013,
        name: "Norway 2026 Local",
        slug: "norway-2026-local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/814013/1.webp",
        images: [
            "/assets/productos/Yupoo/814013/2.webp"
        ],
        temporada: "2026",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 862583,
        name: "Bayern Munich 25/26 Tercera (Niño)",
        slug: "bayern-munich-2526-tercera-nino",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/862583/1.webp",
        images: [
            "/assets/productos/Yupoo/862583/2.webp"
        ],
        temporada: "25/26",
        tipo: "tercera",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 252503,
        name: "Celta de Vigo 25/26 Tercera (Niño)",
        slug: "celta-de-vigo-2526-tercera-nino",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/252503/1.webp",
        images: [
            "/assets/productos/Yupoo/252503/2.webp"
        ],
        temporada: "25/26",
        tipo: "tercera",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 377650,
        name: "FC Barcelona 25/26 Especial (Niño)",
        slug: "fc-barcelona-2526-especial-nino",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/377650/1.webp",
        images: [
            "/assets/productos/Yupoo/377650/2.webp"
        ],
        temporada: "25/26",
        tipo: "especial",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 706760,
        name: "FC Barcelona 25/26 Especial",
        slug: "fc-barcelona-2526-especial",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/706760/1.webp",
        images: [
            "/assets/productos/Yupoo/706760/2.webp"
        ],
        temporada: "25/26",
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 302686,
        name: "FC Barcelona 05/06 Local Retro",
        slug: "fc-barcelona-0506-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/302686/1.webp",
        images: [
            "/assets/productos/Yupoo/302686/2.webp"
        ],
        temporada: "05/06",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 147598,
        name: "FC Barcelona 91/92 Local Retro",
        slug: "fc-barcelona-9192-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/147598/1.webp",
        images: [
            "/assets/productos/Yupoo/147598/2.webp"
        ],
        temporada: "91/92",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 969981,
        name: "FC Barcelona 13/14 Visitante Retro",
        slug: "fc-barcelona-1314-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/969981/1.webp",
        images: [
            "/assets/productos/Yupoo/969981/2.webp"
        ],
        temporada: "13/14",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 759888,
        name: "FC Barcelona 16/17 Tercera Retro",
        slug: "fc-barcelona-1617-tercera-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/759888/1.webp",
        images: [
            "/assets/productos/Yupoo/759888/2.webp"
        ],
        temporada: "16/17",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 158326,
        name: "FC Barcelona 15/16 Local Retro",
        slug: "fc-barcelona-1516-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/158326/1.webp",
        images: [
            "/assets/productos/Yupoo/158326/2.webp"
        ],
        temporada: "15/16",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 549819,
        name: "FC Barcelona 88/89 Visitante Retro",
        slug: "fc-barcelona-8889-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/549819/1.webp",
        images: [
            "/assets/productos/Yupoo/549819/2.webp"
        ],
        temporada: "88/89",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 641466,
        name: "FC Barcelona 100 Años",
        slug: "fc-barcelona-100-anos",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/641466/1.webp",
        images: [
            "/assets/productos/Yupoo/641466/2.webp"
        ],
        temporada: "100 Años",
        tipo: "especial",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 236719,
        name: "Real Madrid 2012",
        slug: "real-madrid-2012",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/236719/1.webp",
        images: [
            "/assets/productos/Yupoo/236719/2.webp"
        ],
        temporada: "2012",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 439096,
        name: "Real Madrid 2006",
        slug: "real-madrid-2006",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/439096/1.webp",
        images: [
            "/assets/productos/Yupoo/439096/2.webp"
        ],
        temporada: "2006",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 681430,
        name: "Real Madrid 03/04 Visitante Retro",
        slug: "real-madrid-0304-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/681430/1.webp",
        images: [
            "/assets/productos/Yupoo/681430/2.webp"
        ],
        temporada: "03/04",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 801872,
        name: "Real Madrid 02/03 Local Retro",
        slug: "real-madrid-0203-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/801872/1.webp",
        images: [
            "/assets/productos/Yupoo/801872/2.webp"
        ],
        temporada: "02/03",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 230310,
        name: "Real Madrid 08/09 Local Retro",
        slug: "real-madrid-0809-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/230310/1.webp",
        images: [
            "/assets/productos/Yupoo/230310/2.webp"
        ],
        temporada: "08/09",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 625043,
        name: "Real Madrid 17/18 Tercera Retro",
        slug: "real-madrid-1718-tercera-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/625043/1.webp",
        images: [
            "/assets/productos/Yupoo/625043/2.webp"
        ],
        temporada: "17/18",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 107803,
        name: "Real Madrid Especial Retro",
        slug: "real-madrid-especial-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/107803/1.webp",
        images: [
            "/assets/productos/Yupoo/107803/2.webp"
        ],
        tipo: "especial",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 433942,
        name: "Real Madrid 25/26",
        slug: "real-madrid-2526",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/433942/1.webp",
        images: [
            "/assets/productos/Yupoo/433942/2.webp"
        ],
        temporada: "25/26",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 810848,
        name: "Real Madrid 13/14 Local Retro",
        slug: "real-madrid-1314-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/810848/1.webp",
        images: [
            "/assets/productos/Yupoo/810848/2.webp"
        ],
        temporada: "13/14",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 324452,
        name: "Real Madrid 16/17 Local Retro",
        slug: "real-madrid-1617-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/324452/1.webp",
        images: [
            "/assets/productos/Yupoo/324452/2.webp"
        ],
        temporada: "16/17",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 248925,
        name: "Real Madrid 25/26",
        slug: "real-madrid-2526",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/248925/1.webp",
        images: [
            "/assets/productos/Yupoo/248925/2.webp"
        ],
        temporada: "25/26",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 267899,
        name: "Real Madrid 25/26",
        slug: "real-madrid-2526",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/267899/1.webp",
        images: [
            "/assets/productos/Yupoo/267899/2.webp"
        ],
        temporada: "25/26",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 375619,
        name: "Real Madrid 01/02 Visitante Retro",
        slug: "real-madrid-0102-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/375619/1.webp",
        images: [
            "/assets/productos/Yupoo/375619/2.webp"
        ],
        temporada: "01/02",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 335092,
        name: "Athletic Club 25/26 Visitante (Niño)",
        slug: "athletic-club-2526-visitante-nino",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/335092/1.webp",
        images: [
            "/assets/productos/Yupoo/335092/2.webp"
        ],
        temporada: "25/26",
        tipo: "visitante",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 464890,
        name: "Sevilla 25/26 Local (Niño)",
        slug: "sevilla-2526-local-nino",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/464890/1.webp",
        images: [
            "/assets/productos/Yupoo/464890/2.webp"
        ],
        temporada: "25/26",
        tipo: "local",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 916354,
        name: "Athletic Club 25/26 Local (Niño)",
        slug: "athletic-club-2526-local-nino",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/916354/1.webp",
        images: [
            "/assets/productos/Yupoo/916354/2.webp"
        ],
        temporada: "25/26",
        tipo: "local",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 166157,
        name: "Real Madrid 03/04 Local Retro",
        slug: "real-madrid-0304-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/166157/1.webp",
        images: [
            "/assets/productos/Yupoo/166157/2.webp"
        ],
        temporada: "03/04",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 913969,
        name: "Real Betis 25/26 Especial",
        slug: "real-betis-2526-especial",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/913969/1.webp",
        images: [
            "/assets/productos/Yupoo/913969/2.webp"
        ],
        temporada: "25/26",
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 139811,
        name: "Real Murcia 99/01 Retro",
        slug: "real-murcia-9901-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/139811/1.webp",
        images: [
            "/assets/productos/Yupoo/139811/2.webp"
        ],
        temporada: "99/01",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 104722,
        name: "Sporting Gijon 94/95 Local Retro",
        slug: "sporting-gijon-9495-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/104722/1.webp",
        images: [
            "/assets/productos/Yupoo/104722/2.webp"
        ],
        temporada: "94/95",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 867636,
        name: "Sporting Gijon 08/09 Local Retro",
        slug: "sporting-gijon-0809-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/867636/1.webp",
        images: [
            "/assets/productos/Yupoo/867636/2.webp"
        ],
        temporada: "08/09",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 287248,
        name: "Real Betis Especial Retro",
        slug: "real-betis-especial-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/287248/1.webp",
        images: [
            "/assets/productos/Yupoo/287248/2.webp"
        ],
        tipo: "especial",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 607126,
        name: "Mallorca 01/02 Retro",
        slug: "mallorca-0102-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/607126/1.webp",
        images: [
            "/assets/productos/Yupoo/607126/2.webp"
        ],
        temporada: "01/02",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 852968,
        name: "Atlético Madrid 13/14 Visitante Retro",
        slug: "atletico-madrid-1314-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/852968/1.webp",
        images: [
            "/assets/productos/Yupoo/852968/2.webp"
        ],
        temporada: "13/14",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 394589,
        name: "Mallorca 96/97 Retro",
        slug: "mallorca-9697-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/394589/1.webp",
        images: [
            "/assets/productos/Yupoo/394589/2.webp"
        ],
        temporada: "96/97",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 876734,
        name: "Real Sociedad 00/02 Visitante Retro",
        slug: "real-sociedad-0002-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/876734/1.webp",
        images: [
            "/assets/productos/Yupoo/876734/2.webp"
        ],
        temporada: "00/02",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 452233,
        name: "Real Betis 99/00 Visitante Retro",
        slug: "real-betis-9900-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/452233/1.webp",
        images: [
            "/assets/productos/Yupoo/452233/2.webp"
        ],
        temporada: "99/00",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 287367,
        name: "FC Barcelona 15/16 Tercera Retro",
        slug: "fc-barcelona-1516-tercera-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/287367/1.webp",
        images: [
            "/assets/productos/Yupoo/287367/2.webp"
        ],
        temporada: "15/16",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 611733,
        name: "FC Barcelona 13/14 Visitante Retro",
        slug: "fc-barcelona-1314-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/611733/1.webp",
        images: [
            "/assets/productos/Yupoo/611733/2.webp"
        ],
        temporada: "13/14",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 141113,
        name: "FC Barcelona 04/05 Local Retro",
        slug: "fc-barcelona-0405-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/141113/1.webp",
        images: [
            "/assets/productos/Yupoo/141113/2.webp"
        ],
        temporada: "04/05",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 776162,
        name: "Valencia 95/96 Visitante Retro",
        slug: "valencia-9596-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/776162/1.webp",
        images: [
            "/assets/productos/Yupoo/776162/2.webp"
        ],
        temporada: "95/96",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 425592,
        name: "Espanyol 96/97 Tercera Retro",
        slug: "espanyol-9697-tercera-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/425592/1.webp",
        images: [
            "/assets/productos/Yupoo/425592/2.webp"
        ],
        temporada: "96/97",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 179185,
        name: "Racing Club 99/00 Visitante Retro",
        slug: "racing-club-9900-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/179185/1.webp",
        images: [
            "/assets/productos/Yupoo/179185/2.webp"
        ],
        temporada: "99/00",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 599986,
        name: "Sevilla 91/92 Visitante Retro",
        slug: "sevilla-9192-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/599986/1.webp",
        images: [
            "/assets/productos/Yupoo/599986/2.webp"
        ],
        temporada: "91/92",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 191376,
        name: "Valencia 99/00 Visitante Retro",
        slug: "valencia-9900-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/191376/1.webp",
        images: [
            "/assets/productos/Yupoo/191376/2.webp"
        ],
        temporada: "99/00",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 766701,
        name: "Valencia 99/00 Local Retro",
        slug: "valencia-9900-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/766701/1.webp",
        images: [
            "/assets/productos/Yupoo/766701/2.webp"
        ],
        temporada: "99/00",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 161669,
        name: "Sevilla 91/92 Local Retro",
        slug: "sevilla-9192-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/161669/1.webp",
        images: [
            "/assets/productos/Yupoo/161669/2.webp"
        ],
        temporada: "91/92",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 169673,
        name: "Deportivo La Coruña 03/04 Local Retro",
        slug: "deportivo-la-coruna-0304-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/169673/1.webp",
        images: [
            "/assets/productos/Yupoo/169673/2.webp"
        ],
        temporada: "03/04",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 746921,
        name: "Valencia 99/00 Visitante Retro",
        slug: "valencia-9900-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/746921/1.webp",
        images: [
            "/assets/productos/Yupoo/746921/2.webp"
        ],
        temporada: "99/00",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 726662,
        name: "Real Madrid 06/07 Tercera Retro",
        slug: "real-madrid-0607-tercera-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/726662/1.webp",
        images: [
            "/assets/productos/Yupoo/726662/2.webp"
        ],
        temporada: "06/07",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 859362,
        name: "FC Barcelona 01/02 Local Retro",
        slug: "fc-barcelona-0102-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/859362/1.webp",
        images: [
            "/assets/productos/Yupoo/859362/2.webp"
        ],
        temporada: "01/02",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 489145,
        name: "Málaga CF 05/06 Local Retro",
        slug: "malaga-cf-0506-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/489145/1.webp",
        images: [
            "/assets/productos/Yupoo/489145/2.webp"
        ],
        temporada: "05/06",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 440521,
        name: "FC Barcelona 06/07 Visitante Retro",
        slug: "fc-barcelona-0607-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/440521/1.webp",
        images: [
            "/assets/productos/Yupoo/440521/2.webp"
        ],
        temporada: "06/07",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 943783,
        name: "Real Madrid 04/05 Local Retro",
        slug: "real-madrid-0405-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/943783/1.webp",
        images: [
            "/assets/productos/Yupoo/943783/2.webp"
        ],
        temporada: "04/05",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 304790,
        name: "Real Madrid 84/85 Local Retro",
        slug: "real-madrid-8485-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/304790/1.webp",
        images: [
            "/assets/productos/Yupoo/304790/2.webp"
        ],
        temporada: "84/85",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 370729,
        name: "Athletic Club 99/00 Visitante Retro",
        slug: "athletic-club-9900-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/370729/1.webp",
        images: [
            "/assets/productos/Yupoo/370729/2.webp"
        ],
        temporada: "99/00",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 879366,
        name: "Valencia 80/82 Local Retro",
        slug: "valencia-8082-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/879366/1.webp",
        images: [
            "/assets/productos/Yupoo/879366/2.webp"
        ],
        temporada: "80/82",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 817935,
        name: "Sevilla 87/90 Local Retro",
        slug: "sevilla-8790-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/817935/1.webp",
        images: [
            "/assets/productos/Yupoo/817935/2.webp"
        ],
        temporada: "87/90",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 766100,
        name: "Sevilla 15/16 Local Retro",
        slug: "sevilla-1516-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/766100/1.webp",
        images: [
            "/assets/productos/Yupoo/766100/2.webp"
        ],
        temporada: "15/16",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 961239,
        name: "Sevilla 03/04 Visitante Retro",
        slug: "sevilla-0304-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/961239/1.webp",
        images: [
            "/assets/productos/Yupoo/961239/2.webp"
        ],
        temporada: "03/04",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 541195,
        name: "FC Barcelona 98/99 Tercera Retro",
        slug: "fc-barcelona-9899-tercera-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/541195/1.webp",
        images: [
            "/assets/productos/Yupoo/541195/2.webp"
        ],
        temporada: "98/99",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 589281,
        name: "FC Barcelona 82/84 Visitante Retro",
        slug: "fc-barcelona-8284-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/589281/1.webp",
        images: [
            "/assets/productos/Yupoo/589281/2.webp"
        ],
        temporada: "82/84",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 227422,
        name: "Atlético Madrid 01/02 Visitante Retro",
        slug: "atletico-madrid-0102-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/227422/1.webp",
        images: [
            "/assets/productos/Yupoo/227422/2.webp"
        ],
        temporada: "01/02",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 630514,
        name: "Cadiz 83/84 Local Retro",
        slug: "cadiz-cf-8384-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/630514/1.webp",
        images: [
            "/assets/productos/Yupoo/630514/2.webp"
        ],
        temporada: "83/84",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 560588,
        name: "Valencia 99/00 Retro",
        slug: "valencia-9900-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/560588/1.webp",
        images: [
            "/assets/productos/Yupoo/560588/2.webp"
        ],
        temporada: "99/00",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 433590,
        name: "Valencia 06/07 Retro",
        slug: "valencia-0607-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/433590/1.webp",
        images: [
            "/assets/productos/Yupoo/433590/2.webp"
        ],
        temporada: "06/07",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 497234,
        name: "Rayo Vallecano 01/02 Local Retro",
        slug: "rayo-vallecano-0102-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/497234/1.webp",
        images: [
            "/assets/productos/Yupoo/497234/2.webp"
        ],
        temporada: "01/02",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 604843,
        name: "Valladolid 1984 Local",
        slug: "valladolid-1984-local",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/604843/1.webp",
        images: [
            "/assets/productos/Yupoo/604843/2.webp"
        ],
        temporada: "1984",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 689431,
        name: "Zaragoza 95/96 Visitante Retro",
        slug: "zaragoza-9596-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/689431/1.webp",
        images: [
            "/assets/productos/Yupoo/689431/2.webp"
        ],
        temporada: "95/96",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 620756,
        name: "Real Sociedad 02/03 Local Retro",
        slug: "real-sociedad-0203-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/620756/1.webp",
        images: [
            "/assets/productos/Yupoo/620756/2.webp"
        ],
        temporada: "02/03",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 577751,
        name: "Sevilla 93/94 Local Retro",
        slug: "sevilla-9394-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/577751/1.webp",
        images: [
            "/assets/productos/Yupoo/577751/2.webp"
        ],
        temporada: "93/94",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 989871,
        name: "Celta de Vigo 99/00 Local Retro",
        slug: "celta-de-vigo-9900-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/989871/1.webp",
        images: [
            "/assets/productos/Yupoo/989871/2.webp"
        ],
        temporada: "99/00",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 177863,
        name: "Atlético Madrid 96/97 Visitante Retro",
        slug: "atletico-madrid-9697-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/177863/1.webp",
        images: [
            "/assets/productos/Yupoo/177863/2.webp"
        ],
        temporada: "96/97",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 807936,
        name: "Real Oviedo 90/91 Local Retro",
        slug: "real-oviedo-9091-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/807936/1.webp",
        images: [
            "/assets/productos/Yupoo/807936/2.webp"
        ],
        temporada: "90/91",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 263214,
        name: "Real Betis 95/96 Local Retro",
        slug: "real-betis-9596-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/263214/1.webp",
        images: [
            "/assets/productos/Yupoo/263214/2.webp"
        ],
        temporada: "95/96",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 197130,
        name: "Athletic Club Local Retro",
        slug: "athletic-club-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/197130/1.webp",
        images: [
            "/assets/productos/Yupoo/197130/2.webp"
        ],
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 637180,
        name: "Athletic Club Local Retro",
        slug: "athletic-club-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/637180/1.webp",
        images: [
            "/assets/productos/Yupoo/637180/2.webp"
        ],
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 317176,
        name: "Zaragoza 92/93 Local Retro",
        slug: "zaragoza-9293-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/317176/1.webp",
        images: [
            "/assets/productos/Yupoo/317176/2.webp"
        ],
        temporada: "92/93",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 725231,
        name: "Zaragoza 92/93 Local Retro",
        slug: "zaragoza-9293-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/725231/1.webp",
        images: [
            "/assets/productos/Yupoo/725231/2.webp"
        ],
        temporada: "92/93",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 197135,
        name: "FC Barcelona 07/08 Visitante Retro",
        slug: "fc-barcelona-0708-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/197135/1.webp",
        images: [
            "/assets/productos/Yupoo/197135/2.webp"
        ],
        temporada: "07/08",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 868957,
        name: "FC Barcelona 03/04 Visitante Retro",
        slug: "fc-barcelona-0304-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/868957/1.webp",
        images: [
            "/assets/productos/Yupoo/868957/2.webp"
        ],
        temporada: "03/04",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 570309,
        name: "Real Betis 1993 Local Retro",
        slug: "real-betis-1993-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/570309/1.webp",
        images: [
            "/assets/productos/Yupoo/570309/2.webp"
        ],
        temporada: "1993",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 188307,
        name: "Real Betis 93/94 Local Retro",
        slug: "real-betis-9394-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/188307/1.webp",
        images: [
            "/assets/productos/Yupoo/188307/2.webp"
        ],
        temporada: "93/94",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 317006,
        name: "Espanyol 84/89 Local Retro",
        slug: "espanyol-8489-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/317006/1.webp",
        images: [
            "/assets/productos/Yupoo/317006/2.webp"
        ],
        temporada: "84/89",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 616348,
        name: "Real Betis 00/01 Local Retro",
        slug: "real-betis-0001-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/616348/1.webp",
        images: [
            "/assets/productos/Yupoo/616348/2.webp"
        ],
        temporada: "00/01",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 287045,
        name: "Real Betis 98/99 Local Retro",
        slug: "real-betis-9899-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/287045/1.webp",
        images: [
            "/assets/productos/Yupoo/287045/2.webp"
        ],
        temporada: "98/99",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 731682,
        name: "Atlético Madrid 94/95 Local Retro",
        slug: "atletico-madrid-9495-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/731682/1.webp",
        images: [
            "/assets/productos/Yupoo/731682/2.webp"
        ],
        temporada: "94/95",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 347048,
        name: "Real Betis 1982 Local Retro",
        slug: "real-betis-1982-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/347048/1.webp",
        images: [
            "/assets/productos/Yupoo/347048/2.webp"
        ],
        temporada: "1982",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 555954,
        name: "Real Madrid 2011 Portero Retro",
        slug: "real-madrid-2011-portero-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/555954/1.webp",
        images: [
            "/assets/productos/Yupoo/555954/2.webp"
        ],
        temporada: "2011",
        tipo: "portero",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 880454,
        name: "Real Madrid 2011 Portero Retro",
        slug: "real-madrid-2011-portero-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/880454/1.webp",
        images: [
            "/assets/productos/Yupoo/880454/2.webp"
        ],
        temporada: "2011",
        tipo: "portero",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 925722,
        name: "Real Betis 2001 Local Retro",
        slug: "real-betis-2001-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/925722/1.webp",
        images: [
            "/assets/productos/Yupoo/925722/2.webp"
        ],
        temporada: "2001",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 836996,
        name: "Real Betis 94/95 Local Retro",
        slug: "real-betis-9495-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/836996/1.webp",
        images: [
            "/assets/productos/Yupoo/836996/2.webp"
        ],
        temporada: "94/95",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 874744,
        name: "Real Betis 95/97 Visitante Retro",
        slug: "real-betis-9597-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/874744/1.webp",
        images: [
            "/assets/productos/Yupoo/874744/2.webp"
        ],
        temporada: "95/97",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 618215,
        name: "Celta de Vigo 2002 Local Retro",
        slug: "celta-de-vigo-2002-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/618215/1.webp",
        images: [
            "/assets/productos/Yupoo/618215/2.webp"
        ],
        temporada: "2002",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 559147,
        name: "FC Barcelona 98/99 Local Retro",
        slug: "fc-barcelona-9899-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/559147/1.webp",
        images: [
            "/assets/productos/Yupoo/559147/2.webp"
        ],
        temporada: "1998",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 422685,
        name: "FC Barcelona 93/94 Retro",
        slug: "fc-barcelona-9394-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/422685/1.webp",
        images: [
            "/assets/productos/Yupoo/422685/2.webp"
        ],
        temporada: "93/94",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 514408,
        name: "Real Madrid 2009 Visitante Retro",
        slug: "real-madrid-2009-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/514408/1.webp",
        images: [
            "/assets/productos/Yupoo/514408/2.webp"
        ],
        temporada: "2009",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 563822,
        name: "Athletic Club 97/98 Visitante Retro",
        slug: "athletic-club-9798-visitante-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/563822/1.webp",
        images: [
            "/assets/productos/Yupoo/563822/2.webp"
        ],
        temporada: "97/98",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 992702,
        name: "España 2026 Portero",
        slug: "espana-2026-portero",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/992702/1.webp",
        images: [
            "/assets/productos/Yupoo/992702/2.webp"
        ],
        temporada: "2026",
        tipo: "portero",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 235473,
        name: "España 2026 Local (Niño)",
        slug: "espana-2026-local-nino",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/235473/1.webp",
        images: [
            "/assets/productos/Yupoo/235473/2.webp"
        ],
        temporada: "2026",
        tipo: "local",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 294234,
        name: "Italia 2026 Visitante (Niño)",
        slug: "italia-2026-visitante-nino",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/294234/1.webp",
        images: [
            "/assets/productos/Yupoo/294234/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 925637,
        name: "Finlandia 2026 Local",
        slug: "finlandia-2026-local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/925637/1.webp",
        images: [
            "/assets/productos/Yupoo/925637/2.webp"
        ],
        temporada: "2026",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 822262,
        name: "Finlandia 2026 Visitante",
        slug: "finlandia-2026-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/822262/1.webp",
        images: [
            "/assets/productos/Yupoo/822262/2.webp"
        ],
        temporada: "2026",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 210914,
        name: "Croacia 2010 Visitante Retro",
        slug: "croacia-2010-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/210914/1.webp",
        images: [
            "/assets/productos/Yupoo/210914/2.webp"
        ],
        temporada: "2010",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 411202,
        name: "Brasil 1998 Portero Retro",
        slug: "brasil-1998-portero-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/411202/1.webp",
        images: [
            "/assets/productos/Yupoo/411202/2.webp"
        ],
        temporada: "1998",
        tipo: "portero",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 373336,
        name: "Granada 05/06 Local Retro",
        slug: "granada-0506-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/373336/1.webp",
        images: [
            "/assets/productos/Yupoo/373336/2.webp"
        ],
        temporada: "05/06",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 590091,
        name: "Rumania 2000 Local Retro",
        slug: "rumania-2000-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/590091/1.webp",
        images: [
            "/assets/productos/Yupoo/590091/2.webp"
        ],
        temporada: "2000",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 242200,
        name: "Nigeria 1994 Local Retro",
        slug: "nigeria-1994-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/242200/1.webp",
        images: [
            "/assets/productos/Yupoo/242200/2.webp"
        ],
        temporada: "1994",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 225756,
        name: "Portugal 2006 Visitante Retro",
        slug: "portugal-2006-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/225756/1.webp",
        images: [
            "/assets/productos/Yupoo/225756/2.webp"
        ],
        temporada: "2006",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 709296,
        name: "Inglaterra 1998 Visitante Retro",
        slug: "inglaterra-1998-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/709296/1.webp",
        images: [
            "/assets/productos/Yupoo/709296/2.webp"
        ],
        temporada: "1998",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 633640,
        name: "Francia 2014 Local Retro",
        slug: "francia-2014-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/633640/1.webp",
        images: [
            "/assets/productos/Yupoo/633640/2.webp"
        ],
        temporada: "2014",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 322496,
        name: "Nigeria 1998 Visitante Retro",
        slug: "nigeria-1998-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/322496/1.webp",
        images: [
            "/assets/productos/Yupoo/322496/2.webp"
        ],
        temporada: "1998",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 719782,
        name: "Holanda 2014 Local Retro",
        slug: "holanda-2014-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/719782/1.webp",
        images: [
            "/assets/productos/Yupoo/719782/2.webp"
        ],
        temporada: "2014",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 207729,
        name: "Holanda 2000 Local Retro",
        slug: "holanda-2000-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/207729/1.webp",
        images: [
            "/assets/productos/Yupoo/207729/2.webp"
        ],
        temporada: "2000",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 631464,
        name: "Estados Unidos 2004 Visitante Retro",
        slug: "estados-unidos-2004-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/631464/1.webp",
        images: [
            "/assets/productos/Yupoo/631464/2.webp"
        ],
        temporada: "2004",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 415446,
        name: "España 2000 Local Retro",
        slug: "espana-2000-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/415446/1.webp",
        images: [
            "/assets/productos/Yupoo/415446/2.webp"
        ],
        temporada: "2000",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 871038,
        name: "España 2000 Visitante Retro",
        slug: "espana-2000-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/871038/1.webp",
        images: [
            "/assets/productos/Yupoo/871038/2.webp"
        ],
        temporada: "2000",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 983832,
        name: "Francia 2006 Visitante Retro",
        slug: "francia-2006-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/983832/1.webp",
        images: [
            "/assets/productos/Yupoo/983832/2.webp"
        ],
        temporada: "2006",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 412045,
        name: "Suecia 1994 Local Retro",
        slug: "suecia-1994-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/412045/1.webp",
        images: [
            "/assets/productos/Yupoo/412045/2.webp"
        ],
        temporada: "1994",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 299474,
        name: "Suecia 1994 Visitante Retro",
        slug: "suecia-1994-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/299474/1.webp",
        images: [
            "/assets/productos/Yupoo/299474/2.webp"
        ],
        temporada: "1994",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 624473,
        name: "Sevilla 12/13 Local Retro",
        slug: "sevilla-1213-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/624473/1.webp",
        images: [
            "/assets/productos/Yupoo/624473/2.webp"
        ],
        temporada: "12/13",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 211338,
        name: "Rumania 1994 Local Retro",
        slug: "rumania-1994-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/211338/1.webp",
        images: [
            "/assets/productos/Yupoo/211338/2.webp"
        ],
        temporada: "1994",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 221335,
        name: "Nigeria 94/95 Local Retro",
        slug: "nigeria-9495-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/221335/1.webp",
        images: [
            "/assets/productos/Yupoo/221335/2.webp"
        ],
        temporada: "94/95",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 124272,
        name: "Sevilla 87/90 Local Retro",
        slug: "sevilla-8790-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/124272/1.webp",
        images: [
            "/assets/productos/Yupoo/124272/2.webp"
        ],
        temporada: "87/90",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 552224,
        name: "Argentina 2014 Local Retro",
        slug: "argentina-2014-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/552224/1.webp",
        images: [
            "/assets/productos/Yupoo/552224/2.webp"
        ],
        temporada: "2014",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 889010,
        name: "México 2010 Local Retro",
        slug: "mexico-2010-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/889010/1.webp",
        images: [
            "/assets/productos/Yupoo/889010/2.webp"
        ],
        temporada: "2010",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 121449,
        name: "Real Madrid 1986 Local Retro",
        slug: "real-madrid-1986-local-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/121449/1.webp",
        images: [
            "/assets/productos/Yupoo/121449/2.webp"
        ],
        temporada: "1986",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 891639,
        name: "Alemania 02/03 Local Retro",
        slug: "alemania-0203-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/891639/1.webp",
        images: [
            "/assets/productos/Yupoo/891639/2.webp"
        ],
        temporada: "02/03",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 614133,
        name: "Colombia 2014 Local",
        slug: "colombia-2014-local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/614133/1.webp",
        images: [
            "/assets/productos/Yupoo/614133/2.webp"
        ],
        temporada: "2014",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 973754,
        name: "España 1996 Visitante Retro",
        slug: "espana-1996-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/973754/1.webp",
        images: [
            "/assets/productos/Yupoo/973754/2.webp"
        ],
        temporada: "1996",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 455063,
        name: "Alemania 2006 Local Retro",
        slug: "alemania-2006-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/455063/1.webp",
        images: [
            "/assets/productos/Yupoo/455063/2.webp"
        ],
        temporada: "2006",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 171234,
        name: "Turquía 1996 Local Retro",
        slug: "turquia-1996-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/171234/1.webp",
        images: [
            "/assets/productos/Yupoo/171234/2.webp"
        ],
        temporada: "1996",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 403136,
        name: "Turquía 1996 Visitante Retro",
        slug: "turquia-1996-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/403136/1.webp",
        images: [
            "/assets/productos/Yupoo/403136/2.webp"
        ],
        temporada: "1996",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 624089,
        name: "Escocia 91/93 Visitante Retro",
        slug: "escocia-9193-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/624089/1.webp",
        images: [
            "/assets/productos/Yupoo/624089/2.webp"
        ],
        temporada: "91/93",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 578790,
        name: "Escocia 12/14 Local Retro",
        slug: "escocia-1214-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/578790/1.webp",
        images: [
            "/assets/productos/Yupoo/578790/2.webp"
        ],
        temporada: "12/14",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 629676,
        name: "Polonia 2012 Local Retro",
        slug: "polonia-2012-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/629676/1.webp",
        images: [
            "/assets/productos/Yupoo/629676/2.webp"
        ],
        temporada: "2012",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 722433,
        name: "Japón 1998 Local Retro",
        slug: "japon-1998-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/722433/1.webp",
        images: [
            "/assets/productos/Yupoo/722433/2.webp"
        ],
        temporada: "1998",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 419969,
        name: "Japón 1998 Visitante Retro",
        slug: "japon-1998-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/419969/1.webp",
        images: [
            "/assets/productos/Yupoo/419969/2.webp"
        ],
        temporada: "1998",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 570745,
        name: "Alemania 2010 Visitante Retro",
        slug: "alemania-2010-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/570745/1.webp",
        images: [
            "/assets/productos/Yupoo/570745/2.webp"
        ],
        temporada: "2010",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 724691,
        name: "Francia 1996 Local Retro",
        slug: "francia-1996-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/724691/1.webp",
        images: [
            "/assets/productos/Yupoo/724691/2.webp"
        ],
        temporada: "1996",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 504827,
        name: "Inglaterra 1992 Visitante Retro",
        slug: "inglaterra-1992-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/504827/1.webp",
        images: [
            "/assets/productos/Yupoo/504827/2.webp"
        ],
        temporada: "1992",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 274175,
        name: "Inglaterra 1982 Visitante Retro",
        slug: "inglaterra-1982-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/274175/1.webp",
        images: [
            "/assets/productos/Yupoo/274175/2.webp"
        ],
        temporada: "1982",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 652877,
        name: "Dinamarca 1988 Local Retro",
        slug: "dinamarca-1988-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/652877/1.webp",
        images: [
            "/assets/productos/Yupoo/652877/2.webp"
        ],
        temporada: "1988",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 907207,
        name: "Escocia 2002 Visitante Retro",
        slug: "escocia-2002-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/907207/1.webp",
        images: [
            "/assets/productos/Yupoo/907207/2.webp"
        ],
        temporada: "2002",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 143604,
        name: "Portugal 1998 Local Retro",
        slug: "portugal-1998-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/143604/1.webp",
        images: [
            "/assets/productos/Yupoo/143604/2.webp"
        ],
        temporada: "1998",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 175661,
        name: "Inglaterra 1992 Tercera Retro",
        slug: "inglaterra-1992-tercera-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/175661/1.webp",
        images: [
            "/assets/productos/Yupoo/175661/2.webp"
        ],
        temporada: "1992",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 243056,
        name: "Inglaterra 1992 Local Retro",
        slug: "inglaterra-1992-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/243056/1.webp",
        images: [
            "/assets/productos/Yupoo/243056/2.webp"
        ],
        temporada: "1992",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 238016,
        name: "Portugal 97/98 Local Retro",
        slug: "portugal-9798-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/238016/1.webp",
        images: [
            "/assets/productos/Yupoo/238016/2.webp"
        ],
        temporada: "97/98",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 793524,
        name: "Portugal 2012 Local Retro",
        slug: "portugal-2012-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/793524/1.webp",
        images: [
            "/assets/productos/Yupoo/793524/2.webp"
        ],
        temporada: "2012",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 525598,
        name: "Chile 15/16 Local Retro",
        slug: "chile-1516-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/525598/1.webp",
        images: [
            "/assets/productos/Yupoo/525598/2.webp"
        ],
        temporada: "15/16",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 816728,
        name: "Portugal 1992 Local Retro",
        slug: "portugal-1992-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/816728/1.webp",
        images: [
            "/assets/productos/Yupoo/816728/2.webp"
        ],
        temporada: "1992",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 847420,
        name: "Portugal 1992 Visitante Retro",
        slug: "portugal-1992-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/847420/1.webp",
        images: [
            "/assets/productos/Yupoo/847420/2.webp"
        ],
        temporada: "1992",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 458786,
        name: "México Especial Retro",
        slug: "mexico-especial-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/458786/1.webp",
        images: [
            "/assets/productos/Yupoo/458786/2.webp"
        ],
        tipo: "especial",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 945961,
        name: "España 2010 Portero Retro",
        slug: "espana-2010-portero-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/945961/1.webp",
        images: [
            "/assets/productos/Yupoo/945961/2.webp"
        ],
        temporada: "2010",
        tipo: "portero",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 237158,
        name: "España 2010 Local Retro",
        slug: "espana-2010-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/237158/1.webp",
        images: [
            "/assets/productos/Yupoo/237158/2.webp"
        ],
        temporada: "2010",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 508708,
        name: "Portugal 1972 Local Retro",
        slug: "portugal-1972-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/508708/1.webp",
        images: [
            "/assets/productos/Yupoo/508708/2.webp"
        ],
        temporada: "1972",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 205573,
        name: "Colombia 1990 Visitante Retro",
        slug: "colombia-1990-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/205573/1.webp",
        images: [
            "/assets/productos/Yupoo/205573/2.webp"
        ],
        temporada: "1990",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 909022,
        name: "Irlanda 1998 Local Retro",
        slug: "irlanda-1998-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/909022/1.webp",
        images: [
            "/assets/productos/Yupoo/909022/2.webp"
        ],
        temporada: "1998",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 938172,
        name: "Portugal 96/97 Visitante Retro",
        slug: "portugal-9697-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/938172/1.webp",
        images: [
            "/assets/productos/Yupoo/938172/2.webp"
        ],
        temporada: "96/97",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 900073,
        name: "España 92/94 Local Retro",
        slug: "espana-9294-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/900073/1.webp",
        images: [
            "/assets/productos/Yupoo/900073/2.webp"
        ],
        temporada: "92/94",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 846528,
        name: "Finland 1982 Local Retro",
        slug: "finland-1982-local-retro",
        category: "futbol",
        league: "otros",
        image: "/assets/productos/Yupoo/846528/1.webp",
        images: [
            "/assets/productos/Yupoo/846528/2.webp"
        ],
        temporada: "1982",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 247102,
        name: "Escocia 1998 Local Retro",
        slug: "escocia-1998-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/247102/1.webp",
        images: [
            "/assets/productos/Yupoo/247102/2.webp"
        ],
        temporada: "1998",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 140041,
        name: "España 88/91 Local Retro",
        slug: "espana-8891-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/140041/1.webp",
        images: [
            "/assets/productos/Yupoo/140041/2.webp"
        ],
        temporada: "88/91",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 431932,
        name: "Inglaterra 2002 Local Retro",
        slug: "inglaterra-2002-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/431932/1.webp",
        images: [
            "/assets/productos/Yupoo/431932/2.webp"
        ],
        temporada: "2002",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 784592,
        name: "Holanda 1988 Local Retro",
        slug: "holanda-1988-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/784592/1.webp",
        images: [
            "/assets/productos/Yupoo/784592/2.webp"
        ],
        temporada: "1988",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 885507,
        name: "Brasil 1984 Local Retro",
        slug: "brasil-1984-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/885507/1.webp",
        images: [
            "/assets/productos/Yupoo/885507/2.webp"
        ],
        temporada: "1984",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 454795,
        name: "Francia 92/94 Local Retro",
        slug: "francia-9294-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/454795/1.webp",
        images: [
            "/assets/productos/Yupoo/454795/2.webp"
        ],
        temporada: "92/94",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 512773,
        name: "Argentina 2014 Visitante Retro",
        slug: "argentina-2014-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/512773/1.webp",
        images: [
            "/assets/productos/Yupoo/512773/2.webp"
        ],
        temporada: "2014",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 394340,
        name: "Brasil 13/14 Retro",
        slug: "brasil-1314-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/394340/1.webp",
        images: [
            "/assets/productos/Yupoo/394340/2.webp"
        ],
        temporada: "13/14",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 792752,
        name: "Argentina 2004 Local Retro",
        slug: "argentina-2004-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/792752/1.webp",
        images: [
            "/assets/productos/Yupoo/792752/2.webp"
        ],
        temporada: "2004",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 443170,
        name: "Brasil 1997 Visitante Retro",
        slug: "brasil-1997-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/443170/1.webp",
        images: [
            "/assets/productos/Yupoo/443170/2.webp"
        ],
        temporada: "1997",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 594929,
        name: "Brasil 2010 Visitante Retro",
        slug: "brasil-2010-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/594929/1.webp",
        images: [
            "/assets/productos/Yupoo/594929/2.webp"
        ],
        temporada: "2010",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 599601,
        name: "Brasil 2006 Visitante Retro",
        slug: "brasil-2006-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/599601/1.webp",
        images: [
            "/assets/productos/Yupoo/599601/2.webp"
        ],
        temporada: "2006",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 598668,
        name: "Brasil 1988 Local Retro",
        slug: "brasil-1988-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/598668/1.webp",
        images: [
            "/assets/productos/Yupoo/598668/2.webp"
        ],
        temporada: "1988",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 498910,
        name: "Portugal 2006 Local Retro",
        slug: "portugal-2006-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/498910/1.webp",
        images: [
            "/assets/productos/Yupoo/498910/2.webp"
        ],
        temporada: "2006",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 119268,
        name: "Brasil 1998 Portero Retro",
        slug: "brasil-1998-portero-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/119268/1.webp",
        images: [
            "/assets/productos/Yupoo/119268/2.webp"
        ],
        temporada: "1998",
        tipo: "portero",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 508413,
        name: "Alemania 2014 Local Retro",
        slug: "alemania-2014-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/508413/1.webp",
        images: [
            "/assets/productos/Yupoo/508413/2.webp"
        ],
        temporada: "2014",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 426072,
        name: "Norway 1998 Local Retro",
        slug: "norway-1998-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/426072/1.webp",
        images: [
            "/assets/productos/Yupoo/426072/2.webp"
        ],
        temporada: "1998",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 255475,
        name: "Argentina 1993 Local Retro",
        slug: "argentina-1993-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/255475/1.webp",
        images: [
            "/assets/productos/Yupoo/255475/2.webp"
        ],
        temporada: "1993",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 573019,
        name: "Brasil 1970 Local Retro",
        slug: "brasil-1970-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/573019/1.webp",
        images: [
            "/assets/productos/Yupoo/573019/2.webp"
        ],
        temporada: "1970",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 447311,
        name: "Portugal 2012 Visitante Retro",
        slug: "portugal-2012-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/447311/1.webp",
        images: [
            "/assets/productos/Yupoo/447311/2.webp"
        ],
        temporada: "2012",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 872891,
        name: "Argentina 2020 Local",
        slug: "argentina-2020-local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/872891/1.webp",
        images: [
            "/assets/productos/Yupoo/872891/2.webp"
        ],
        temporada: "2020",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 145975,
        name: "Inglaterra 1982 Local Retro",
        slug: "inglaterra-1982-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/145975/1.webp",
        images: [
            "/assets/productos/Yupoo/145975/2.webp"
        ],
        temporada: "1982",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 747146,
        name: "Inglaterra 1984 Local Retro",
        slug: "inglaterra-1984-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/747146/1.webp",
        images: [
            "/assets/productos/Yupoo/747146/2.webp"
        ],
        temporada: "1984",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 771245,
        name: "Inglaterra 1996 Retro",
        slug: "inglaterra-1996-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/771245/1.webp",
        images: [
            "/assets/productos/Yupoo/771245/2.webp"
        ],
        temporada: "1996",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 603168,
        name: "Inglaterra 1996 Local Retro",
        slug: "inglaterra-1996-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/603168/1.webp",
        images: [
            "/assets/productos/Yupoo/603168/2.webp"
        ],
        temporada: "1996",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 313032,
        name: "Brasil 2020 Visitante",
        slug: "brasil-2020-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/313032/1.webp",
        images: [
            "/assets/productos/Yupoo/313032/2.webp"
        ],
        temporada: "2020",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 355150,
        name: "Brasil 2020 Local",
        slug: "brasil-2020-local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/355150/1.webp",
        images: [
            "/assets/productos/Yupoo/355150/2.webp"
        ],
        temporada: "2020",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 238609,
        name: "Holanda 1991 Local Retro",
        slug: "holanda-1991-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/238609/1.webp",
        images: [
            "/assets/productos/Yupoo/238609/2.webp"
        ],
        temporada: "1991",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 851563,
        name: "España 1994 Local Retro",
        slug: "espana-1994-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/851563/1.webp",
        images: [
            "/assets/productos/Yupoo/851563/2.webp"
        ],
        temporada: "1994",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 694647,
        name: "Alemania 1996 Local Retro",
        slug: "alemania-1996-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/694647/1.webp",
        images: [
            "/assets/productos/Yupoo/694647/2.webp"
        ],
        temporada: "1996",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 620494,
        name: "Holanda 2020 Local",
        slug: "holanda-2020-local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/620494/1.webp",
        images: [
            "/assets/productos/Yupoo/620494/2.webp"
        ],
        temporada: "2020",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 675793,
        name: "Portugal Local",
        slug: "portugal-local",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/675793/1.webp",
        images: [
            "/assets/productos/Yupoo/675793/2.webp"
        ],
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 362657,
        name: "España 19/98 Visitante Retro",
        slug: "espana-1998-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/362657/1.webp",
        images: [
            "/assets/productos/Yupoo/362657/2.webp"
        ],
        temporada: "19/98",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 254067,
        name: "España 19/94 Visitante Retro",
        slug: "espana-1994-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/254067/1.webp",
        images: [
            "/assets/productos/Yupoo/254067/2.webp"
        ],
        temporada: "19/94",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 241359,
        name: "España 2012 Visitante Retro",
        slug: "espana-2012-visitante-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/241359/1.webp",
        images: [
            "/assets/productos/Yupoo/241359/2.webp"
        ],
        temporada: "2012",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 820850,
        name: "España 2012 Local Retro",
        slug: "espana-2012-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/820850/1.webp",
        images: [
            "/assets/productos/Yupoo/820850/2.webp"
        ],
        temporada: "2012",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 106101,
        name: "Leeds United 25/26 Local",
        slug: "leeds-united-2526-local",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/106101/1.webp",
        images: [
            "/assets/productos/Yupoo/106101/2.webp"
        ],
        temporada: "25/26",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 149953,
        name: "Tottenham Hotspur 95/97 Visitante Retro",
        slug: "tottenham-hotspur-9597-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/149953/1.webp",
        images: [
            "/assets/productos/Yupoo/149953/2.webp"
        ],
        temporada: "95/97",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 771224,
        name: "Tottenham Hotspur 09/10 Local Retro",
        slug: "tottenham-hotspur-0910-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/771224/1.webp",
        images: [
            "/assets/productos/Yupoo/771224/2.webp"
        ],
        temporada: "09/10",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 506582,
        name: "Manchester United 1992/94 Local Retro",
        slug: "manchester-united-199294-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/506582/1.webp",
        images: [
            "/assets/productos/Yupoo/506582/2.webp"
        ],
        temporada: "1992/94",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 577477,
        name: "Manchester United 2013/14 Local Retro",
        slug: "manchester-united-201314-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/577477/1.webp",
        images: [
            "/assets/productos/Yupoo/577477/2.webp"
        ],
        temporada: "2013/14",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 130927,
        name: "Arsenal 2011/12 Visitante Retro",
        slug: "arsenal-201112-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/130927/1.webp",
        images: [
            "/assets/productos/Yupoo/130927/2.webp"
        ],
        temporada: "2011/12",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 634309,
        name: "Arsenal 2014/15 Local Retro",
        slug: "arsenal-201415-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/634309/1.webp",
        images: [
            "/assets/productos/Yupoo/634309/2.webp"
        ],
        temporada: "2014/15",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 448421,
        name: "Manchester United 2025/26 Visitante",
        slug: "manchester-united-202526-visitante",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/448421/1.webp",
        images: [
            "/assets/productos/Yupoo/448421/2.webp"
        ],
        temporada: "2025/26",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 329778,
        name: "Manchester United 1991 Visitante Retro",
        slug: "manchester-united-1991-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/329778/1.webp",
        images: [
            "/assets/productos/Yupoo/329778/2.webp"
        ],
        temporada: "1991",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 714190,
        name: "Tottenham Hotspur 2025/26 Visitante",
        slug: "tottenham-hotspur-202526-visitante",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/714190/1.webp",
        images: [
            "/assets/productos/Yupoo/714190/2.webp"
        ],
        temporada: "2025/26",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 460942,
        name: "Manchester City 2013/14 Tercera Retro",
        slug: "manchester-city-201314-tercera-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/460942/1.webp",
        images: [
            "/assets/productos/Yupoo/460942/2.webp"
        ],
        temporada: "2013/14",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 979898,
        name: "Manchester United 2008/09 Visitante Retro",
        slug: "manchester-united-200809-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/979898/1.webp",
        images: [
            "/assets/productos/Yupoo/979898/2.webp"
        ],
        temporada: "2008/09",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 169102,
        name: "Tottenham Hotspur 1997/99 Local Retro",
        slug: "tottenham-hotspur-199799-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/169102/1.webp",
        images: [
            "/assets/productos/Yupoo/169102/2.webp"
        ],
        temporada: "1997/99",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 506403,
        name: "Manchester City 2025/26 Visitante",
        slug: "manchester-city-202526-visitante",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/506403/1.webp",
        images: [
            "/assets/productos/Yupoo/506403/2.webp"
        ],
        temporada: "2025/26",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 637682,
        name: "Manchester City 2025/26 Local",
        slug: "manchester-city-202526-local",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/637682/1.webp",
        images: [
            "/assets/productos/Yupoo/637682/2.webp"
        ],
        temporada: "2025/26",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 191075,
        name: "Tottenham Hotspur 2025/26 Pre-partido",
        slug: "tottenham-hotspur-202526-pre-partido",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/191075/1.webp",
        images: [
            "/assets/productos/Yupoo/191075/2.webp"
        ],
        temporada: "2025/26",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 848481,
        name: "Manchester United 2000/01 Visitante Retro",
        slug: "manchester-united-200001-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/848481/1.webp",
        images: [
            "/assets/productos/Yupoo/848481/2.webp"
        ],
        temporada: "2000/01",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 525604,
        name: "Manchester United 2025/26 Especial",
        slug: "manchester-united-202526-especial",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/525604/1.webp",
        images: [
            "/assets/productos/Yupoo/525604/2.webp"
        ],
        temporada: "2025/26",
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 383658,
        name: "Chelsea 2025/26 Tercera",
        slug: "chelsea-202526-tercera",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/383658/1.webp",
        images: [
            "/assets/productos/Yupoo/383658/2.webp"
        ],
        temporada: "2025/26",
        tipo: "tercera",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 224170,
        name: "Manchester United 1998/99 Retro",
        slug: "manchester-united-199899-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/224170/1.webp",
        images: [
            "/assets/productos/Yupoo/224170/2.webp"
        ],
        temporada: "1998/99",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 232764,
        name: "Tottenham Hotspur 2025/26 Local",
        slug: "tottenham-hotspur-202526-local",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/232764/1.webp",
        images: [
            "/assets/productos/Yupoo/232764/2.webp"
        ],
        temporada: "2025/26",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 951781,
        name: "Arsenal 1994/95 Visitante Retro",
        slug: "arsenal-199495-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/951781/1.webp",
        images: [
            "/assets/productos/Yupoo/951781/2.webp"
        ],
        temporada: "1994/95",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 951692,
        name: "Arsenal 2025/26 Especial",
        slug: "arsenal-202526-especial",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/951692/1.webp",
        images: [
            "/assets/productos/Yupoo/951692/2.webp"
        ],
        temporada: "2025/26",
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 163247,
        name: "Manchester City 2013/14 Visitante Retro",
        slug: "manchester-city-201314-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/163247/1.webp",
        images: [
            "/assets/productos/Yupoo/163247/2.webp"
        ],
        temporada: "2013/14",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 888468,
        name: "Manchester City 2012/13 Visitante Retro",
        slug: "manchester-city-201213-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/888468/1.webp",
        images: [
            "/assets/productos/Yupoo/888468/2.webp"
        ],
        temporada: "2012/13",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 966059,
        name: "Manchester United 2003/05 Visitante Retro",
        slug: "manchester-united-200305-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/966059/1.webp",
        images: [
            "/assets/productos/Yupoo/966059/2.webp"
        ],
        temporada: "2003/05",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 365910,
        name: "Manchester United 2011/12 Local Retro",
        slug: "manchester-united-201112-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/365910/1.webp",
        images: [
            "/assets/productos/Yupoo/365910/2.webp"
        ],
        temporada: "2011/12",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 332673,
        name: "Arsenal 2019/20 Local Retro",
        slug: "arsenal-201920-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/332673/1.webp",
        images: [
            "/assets/productos/Yupoo/332673/2.webp"
        ],
        temporada: "2019/20",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 984286,
        name: "Arsenal 2013/14 Visitante Retro",
        slug: "arsenal-201314-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/984286/1.webp",
        images: [
            "/assets/productos/Yupoo/984286/2.webp"
        ],
        temporada: "2013/14",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 496970,
        name: "Manchester United 1998/99 Retro",
        slug: "manchester-united-199899-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/496970/1.webp",
        images: [
            "/assets/productos/Yupoo/496970/2.webp"
        ],
        temporada: "1998/99",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 643977,
        name: "Manchester United 2007/08 Retro",
        slug: "manchester-united-200708-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/643977/1.webp",
        images: [
            "/assets/productos/Yupoo/643977/2.webp"
        ],
        temporada: "2007/08",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 808409,
        name: "Arsenal 1993/94 Visitante Retro",
        slug: "arsenal-199394-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/808409/1.webp",
        images: [
            "/assets/productos/Yupoo/808409/2.webp"
        ],
        temporada: "1993/94",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 667330,
        name: "Arsenal 1986/88 Visitante Retro",
        slug: "arsenal-198688-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/667330/1.webp",
        images: [
            "/assets/productos/Yupoo/667330/2.webp"
        ],
        temporada: "1986/88",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 104529,
        name: "Arsenal 1997/99 Visitante Retro",
        slug: "arsenal-199799-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/104529/1.webp",
        images: [
            "/assets/productos/Yupoo/104529/2.webp"
        ],
        temporada: "1997/99",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 111918,
        name: "Arsenal 1996/97 Visitante Retro",
        slug: "arsenal-199697-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/111918/1.webp",
        images: [
            "/assets/productos/Yupoo/111918/2.webp"
        ],
        temporada: "1996/97",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 593024,
        name: "West Ham United 1999/01 Tercera Retro",
        slug: "west-ham-united-199901-tercera-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/593024/1.webp",
        images: [
            "/assets/productos/Yupoo/593024/2.webp"
        ],
        temporada: "1999/01",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 695788,
        name: "Newcastle 1998/99 Visitante Retro",
        slug: "newcastle-199899-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/695788/1.webp",
        images: [
            "/assets/productos/Yupoo/695788/2.webp"
        ],
        temporada: "1998/99",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 887286,
        name: "Manchester City 2015/16 Visitante Retro",
        slug: "manchester-city-201516-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/887286/1.webp",
        images: [
            "/assets/productos/Yupoo/887286/2.webp"
        ],
        temporada: "2015/16",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 299162,
        name: "Chelsea 2005/06 Local Retro",
        slug: "chelsea-200506-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/299162/1.webp",
        images: [
            "/assets/productos/Yupoo/299162/2.webp"
        ],
        temporada: "2005/06",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 147842,
        name: "Arsenal 1995/96 Visitante Retro",
        slug: "arsenal-199596-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/147842/1.webp",
        images: [
            "/assets/productos/Yupoo/147842/2.webp"
        ],
        temporada: "1995/96",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 564599,
        name: "Arsenal 2002/04 Local Retro",
        slug: "arsenal-200204-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/564599/1.webp",
        images: [
            "/assets/productos/Yupoo/564599/2.webp"
        ],
        temporada: "2002/04",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 682260,
        name: "Arsenal 2001/02 Local Retro",
        slug: "arsenal-200102-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/682260/1.webp",
        images: [
            "/assets/productos/Yupoo/682260/2.webp"
        ],
        temporada: "2001/02",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 655408,
        name: "Manchester United 2007/08 Local Retro",
        slug: "manchester-united-200708-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/655408/1.webp",
        images: [
            "/assets/productos/Yupoo/655408/2.webp"
        ],
        temporada: "2007/08",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 689929,
        name: "Manchester United 1992/94 Tercera Retro",
        slug: "manchester-united-199294-tercera-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/689929/1.webp",
        images: [
            "/assets/productos/Yupoo/689929/2.webp"
        ],
        temporada: "1992/94",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 432269,
        name: "Manchester United 1986/88 Local Retro",
        slug: "manchester-united-198688-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/432269/1.webp",
        images: [
            "/assets/productos/Yupoo/432269/2.webp"
        ],
        temporada: "1986/88",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 945315,
        name: "Arsenal 1991/93 Visitante Retro",
        slug: "arsenal-199193-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/945315/1.webp",
        images: [
            "/assets/productos/Yupoo/945315/2.webp"
        ],
        temporada: "1991/93",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 313759,
        name: "Manchester United 1993/95 Visitante Retro",
        slug: "manchester-united-199395-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/313759/1.webp",
        images: [
            "/assets/productos/Yupoo/313759/2.webp"
        ],
        temporada: "1993/95",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 520481,
        name: "Chelsea 2012/13 Local Retro",
        slug: "chelsea-201213-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/520481/1.webp",
        images: [
            "/assets/productos/Yupoo/520481/2.webp"
        ],
        temporada: "2012/13",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 538089,
        name: "Manchester United 2003/04 Visitante Retro",
        slug: "manchester-united-200304-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/538089/1.webp",
        images: [
            "/assets/productos/Yupoo/538089/2.webp"
        ],
        temporada: "2003/04",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 662165,
        name: "Manchester United 2003/04 Local Retro",
        slug: "manchester-united-200304-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/662165/1.webp",
        images: [
            "/assets/productos/Yupoo/662165/2.webp"
        ],
        temporada: "2003/04",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 488442,
        name: "Arsenal 2006/08 Local Retro",
        slug: "arsenal-200608-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/488442/1.webp",
        images: [
            "/assets/productos/Yupoo/488442/2.webp"
        ],
        temporada: "2006/08",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 200593,
        name: "Manchester United 2002/03 Visitante Retro",
        slug: "manchester-united-200203-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/200593/1.webp",
        images: [
            "/assets/productos/Yupoo/200593/2.webp"
        ],
        temporada: "2002/03",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 960920,
        name: "Arsenal 2011/12 Local Retro",
        slug: "arsenal-201112-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/960920/1.webp",
        images: [
            "/assets/productos/Yupoo/960920/2.webp"
        ],
        temporada: "2011/12",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 508529,
        name: "Manchester City 2002/03 Local Retro",
        slug: "manchester-city-200203-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/508529/1.webp",
        images: [
            "/assets/productos/Yupoo/508529/2.webp"
        ],
        temporada: "2002/03",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 897301,
        name: "Leicester City 1984 Visitante Retro",
        slug: "leicester-city-1984-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/897301/1.webp",
        images: [
            "/assets/productos/Yupoo/897301/2.webp"
        ],
        temporada: "1984",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 694324,
        name: "Leicester City 1992/94 Local Retro",
        slug: "leicester-city-199294-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/694324/1.webp",
        images: [
            "/assets/productos/Yupoo/694324/2.webp"
        ],
        temporada: "1992/94",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 792182,
        name: "Everton 1988/90 Visitante Retro",
        slug: "everton-198890-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/792182/1.webp",
        images: [
            "/assets/productos/Yupoo/792182/2.webp"
        ],
        temporada: "1988/90",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 783279,
        name: "Manchester City 2015/16 Local Retro",
        slug: "manchester-city-201516-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/783279/1.webp",
        images: [
            "/assets/productos/Yupoo/783279/2.webp"
        ],
        temporada: "2015/16",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 105046,
        name: "Manchester City 1997/98 Visitante Retro",
        slug: "manchester-city-199798-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/105046/1.webp",
        images: [
            "/assets/productos/Yupoo/105046/2.webp"
        ],
        temporada: "1997/98",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 274981,
        name: "Chelsea 1990 Retro",
        slug: "chelsea-1990-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/274981/1.webp",
        images: [
            "/assets/productos/Yupoo/274981/2.webp"
        ],
        temporada: "1990",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 322859,
        name: "Chelsea 1990 Retro",
        slug: "chelsea-1990-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/322859/1.webp",
        images: [
            "/assets/productos/Yupoo/322859/2.webp"
        ],
        temporada: "1990",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 648236,
        name: "Manchester United 2001/02 Especial Retro",
        slug: "manchester-united-200102-especial-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/648236/1.webp",
        images: [
            "/assets/productos/Yupoo/648236/2.webp"
        ],
        temporada: "2001/02",
        tipo: "especial",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 194556,
        name: "Manchester City 2001/02 Local Retro",
        slug: "manchester-city-200102-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/194556/1.webp",
        images: [
            "/assets/productos/Yupoo/194556/2.webp"
        ],
        temporada: "2001/02",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 717509,
        name: "Arsenal 2006/08 Local Retro",
        slug: "arsenal-200608-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/717509/1.webp",
        images: [
            "/assets/productos/Yupoo/717509/2.webp"
        ],
        temporada: "2006/08",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 466233,
        name: "Arsenal 2004/05 Local Retro",
        slug: "arsenal-200405-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/466233/1.webp",
        images: [
            "/assets/productos/Yupoo/466233/2.webp"
        ],
        temporada: "2004/05",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 634816,
        name: "Newcastle 2000 Local Retro",
        slug: "newcastle-2000-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/634816/1.webp",
        images: [
            "/assets/productos/Yupoo/634816/2.webp"
        ],
        temporada: "2000",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 996052,
        name: "Chelsea 2008/09 Local Retro",
        slug: "chelsea-200809-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/996052/1.webp",
        images: [
            "/assets/productos/Yupoo/996052/2.webp"
        ],
        temporada: "2008/09",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 907180,
        name: "Leicester City 2015/16 Visitante Retro",
        slug: "leicester-city-201516-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/907180/1.webp",
        images: [
            "/assets/productos/Yupoo/907180/2.webp"
        ],
        temporada: "2015/16",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 190955,
        name: "Real Madrid 1997 Tercera Retro",
        slug: "real-madrid-1997-tercera-retro",
        category: "futbol",
        league: "laliga",
        image: "/assets/productos/Yupoo/190955/1.webp",
        images: [
            "/assets/productos/Yupoo/190955/2.webp"
        ],
        temporada: "1997",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 966282,
        name: "Tottenham Hotspur 2006/07 Local Retro",
        slug: "tottenham-hotspur-200607-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/966282/1.webp",
        images: [
            "/assets/productos/Yupoo/966282/2.webp"
        ],
        temporada: "2006/07",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 613671,
        name: "Arsenal 2005/06 Local Retro",
        slug: "arsenal-200506-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/613671/1.webp",
        images: [
            "/assets/productos/Yupoo/613671/2.webp"
        ],
        temporada: "2005/06",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 825149,
        name: "Manchester United 2006 Visitante Retro",
        slug: "manchester-united-2006-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/825149/1.webp",
        images: [
            "/assets/productos/Yupoo/825149/2.webp"
        ],
        temporada: "2006",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 982262,
        name: "Manchester City 2008/09 Local Retro",
        slug: "manchester-city-200809-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/982262/1.webp",
        images: [
            "/assets/productos/Yupoo/982262/2.webp"
        ],
        temporada: "2008/09",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 770598,
        name: "Arsenal 2002 Visitante Retro",
        slug: "arsenal-2002-visitante-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/770598/1.webp",
        images: [
            "/assets/productos/Yupoo/770598/2.webp"
        ],
        temporada: "2002",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 852225,
        name: "Manchester City 1981 Local Retro",
        slug: "manchester-city-1981-local-retro",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/852225/1.webp",
        images: [
            "/assets/productos/Yupoo/852225/2.webp"
        ],
        temporada: "1981",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 988344,
        name: "Manchester United Local",
        slug: "manchester-united-local",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/988344/1.webp",
        images: [
            "/assets/productos/Yupoo/988344/2.webp"
        ],
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 818879,
        name: "Arsenal 1998",
        slug: "arsenal-1998",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/818879/1.webp",
        images: [
            "/assets/productos/Yupoo/818879/2.webp"
        ],
        temporada: "1998",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 985690,
        name: "Arsenal 2000",
        slug: "arsenal-2000",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/985690/1.webp",
        images: [
            "/assets/productos/Yupoo/985690/2.webp"
        ],
        temporada: "2000",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 765291,
        name: "Bayern Munich 2025/26 Portero",
        slug: "bayern-munich-202526-portero",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/765291/1.webp",
        images: [
            "/assets/productos/Yupoo/765291/2.webp"
        ],
        temporada: "2025/26",
        tipo: "portero",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 296568,
        name: "Bayern Munich 2025/26 Portero",
        slug: "bayern-munich-202526-portero",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/296568/1.webp",
        images: [
            "/assets/productos/Yupoo/296568/2.webp"
        ],
        temporada: "2025/26",
        tipo: "portero",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 527161,
        name: "Bayern Munich 2025/26 Tercera",
        slug: "bayern-munich-202526-tercera",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/527161/1.webp",
        images: [
            "/assets/productos/Yupoo/527161/2.webp"
        ],
        temporada: "2025/26",
        tipo: "tercera",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 224973,
        name: "Bayern Munich 2001/02 Local Retro",
        slug: "bayern-munich-200102-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/224973/1.webp",
        images: [
            "/assets/productos/Yupoo/224973/2.webp"
        ],
        temporada: "2001/02",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 246623,
        name: "Dortmund 2019/20 Local Retro",
        slug: "dortmund-201920-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/246623/1.webp",
        images: [
            "/assets/productos/Yupoo/246623/2.webp"
        ],
        temporada: "2019/20",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 288583,
        name: "Bayern Munich 2000/01 Local Retro",
        slug: "bayern-munich-200001-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/288583/1.webp",
        images: [
            "/assets/productos/Yupoo/288583/2.webp"
        ],
        temporada: "2000/01",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 444908,
        name: "Werder Bremen 2025/26 Local",
        slug: "werder-bremen-202526-local",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/444908/1.webp",
        images: [
            "/assets/productos/Yupoo/444908/2.webp"
        ],
        temporada: "2025/26",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 226621,
        name: "Bayern Munich 2025/26 Local (Niño)",
        slug: "bayern-munich-202526-local-nino",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/226621/1.webp",
        images: [
            "/assets/productos/Yupoo/226621/2.webp"
        ],
        temporada: "2025/26",
        tipo: "local",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 915628,
        name: "Bayern Munich 2000/02 Visitante Retro",
        slug: "bayern-munich-200002-visitante-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/915628/1.webp",
        images: [
            "/assets/productos/Yupoo/915628/2.webp"
        ],
        temporada: "2000/02",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 393514,
        name: "Schalke 04 2001/02 Local Retro",
        slug: "schalke-04-200102-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/393514/1.webp",
        images: [
            "/assets/productos/Yupoo/393514/2.webp"
        ],
        temporada: "2001/02",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 468167,
        name: "Dortmund 2025/26",
        slug: "dortmund-202526",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/468167/1.webp",
        images: [
            "/assets/productos/Yupoo/468167/2.webp"
        ],
        temporada: "2025/26",
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 324827,
        name: "Bayern Munich 2025/26 Especial",
        slug: "bayern-munich-202526-especial",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/324827/1.webp",
        images: [
            "/assets/productos/Yupoo/324827/2.webp"
        ],
        temporada: "2025/26",
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 470010,
        name: "FC Salzburg 2025/26",
        slug: "fc-salzburg-202526",
        category: "futbol",
        league: "otros",
        image: "/assets/productos/Yupoo/470010/1.webp",
        images: [
            "/assets/productos/Yupoo/470010/2.webp"
        ],
        temporada: "2025/26",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 278688,
        name: "Dortmund 1994/95 Local Retro",
        slug: "dortmund-199495-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/278688/1.webp",
        images: [
            "/assets/productos/Yupoo/278688/2.webp"
        ],
        temporada: "1994/95",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 679609,
        name: "Dortmund 1996/97 Local Retro",
        slug: "dortmund-199697-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/679609/1.webp",
        images: [
            "/assets/productos/Yupoo/679609/2.webp"
        ],
        temporada: "1996/97",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 383710,
        name: "Dortmund 1995/96 Local Retro",
        slug: "dortmund-199596-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/383710/1.webp",
        images: [
            "/assets/productos/Yupoo/383710/2.webp"
        ],
        temporada: "1995/96",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 480272,
        name: "Dortmund 1995/96 Visitante Retro",
        slug: "dortmund-199596-visitante-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/480272/1.webp",
        images: [
            "/assets/productos/Yupoo/480272/2.webp"
        ],
        temporada: "1995/96",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 554262,
        name: "Dortmund 2011/12 Local Retro",
        slug: "dortmund-201112-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/554262/1.webp",
        images: [
            "/assets/productos/Yupoo/554262/2.webp"
        ],
        temporada: "2011/12",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 237555,
        name: "RB Leipzig 2025/26 Local",
        slug: "rb-leipzig-202526-local",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/237555/1.webp",
        images: [
            "/assets/productos/Yupoo/237555/2.webp"
        ],
        temporada: "2025/26",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 309412,
        name: "Bayern Munich 2025/26",
        slug: "bayern-munich-202526",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/309412/1.webp",
        images: [
            "/assets/productos/Yupoo/309412/2.webp"
        ],
        temporada: "2025/26",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 877272,
        name: "Bayer Leverkusen 2001/02 Local Retro",
        slug: "bayer-leverkusen-200102-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/877272/1.webp",
        images: [
            "/assets/productos/Yupoo/877272/2.webp"
        ],
        temporada: "2001/02",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 598032,
        name: "Bayern Munich 2007/08 Local Retro",
        slug: "bayern-munich-200708-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/598032/1.webp",
        images: [
            "/assets/productos/Yupoo/598032/2.webp"
        ],
        temporada: "2007/08",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 856518,
        name: "Bayern Munich 2005/06 Local Retro",
        slug: "bayern-munich-200506-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/856518/1.webp",
        images: [
            "/assets/productos/Yupoo/856518/2.webp"
        ],
        temporada: "2005/06",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 397064,
        name: "Bayern Munich 2025/26",
        slug: "bayern-munich-202526",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/397064/1.webp",
        images: [
            "/assets/productos/Yupoo/397064/2.webp"
        ],
        temporada: "2025/26",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 872188,
        name: "Bayern Munich 2014/15 Local Retro",
        slug: "bayern-munich-201415-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/872188/1.webp",
        images: [
            "/assets/productos/Yupoo/872188/2.webp"
        ],
        temporada: "2014/15",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 180360,
        name: "Bayern Munich 2013/14 Local Retro",
        slug: "bayern-munich-201314-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/180360/1.webp",
        images: [
            "/assets/productos/Yupoo/180360/2.webp"
        ],
        temporada: "2013/14",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 361792,
        name: "Bayern Munich 2003/04 Local Retro",
        slug: "bayern-munich-200304-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/361792/1.webp",
        images: [
            "/assets/productos/Yupoo/361792/2.webp"
        ],
        temporada: "2003/04",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 665319,
        name: "Bayern Munich 1993/95 Visitante Retro",
        slug: "bayern-munich-199395-visitante-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/665319/1.webp",
        images: [
            "/assets/productos/Yupoo/665319/2.webp"
        ],
        temporada: "1993/95",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 680946,
        name: "Dortmund 1996/97 Visitante Retro",
        slug: "dortmund-199697-visitante-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/680946/1.webp",
        images: [
            "/assets/productos/Yupoo/680946/2.webp"
        ],
        temporada: "1996/97",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 533979,
        name: "Bayern Munich 1996/98 Visitante Retro",
        slug: "bayern-munich-199698-visitante-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/533979/1.webp",
        images: [
            "/assets/productos/Yupoo/533979/2.webp"
        ],
        temporada: "1996/98",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 887430,
        name: "Bayern Munich 1993/95 Local Retro",
        slug: "bayern-munich-199395-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/887430/1.webp",
        images: [
            "/assets/productos/Yupoo/887430/2.webp"
        ],
        temporada: "1993/95",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 926710,
        name: "Eintracht Frankfurt 1998/00 Local Retro",
        slug: "eintracht-frankfurt-199800-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/926710/1.webp",
        images: [
            "/assets/productos/Yupoo/926710/2.webp"
        ],
        temporada: "1998/00",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 499986,
        name: "Dortmund 1989 Local Retro",
        slug: "dortmund-1989-local-retro",
        category: "futbol",
        league: "bundesliga",
        image: "/assets/productos/Yupoo/499986/1.webp",
        images: [
            "/assets/productos/Yupoo/499986/2.webp"
        ],
        temporada: "1989",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 379123,
        name: "Paris FC 2025/26 Local",
        slug: "paris-fc-202526-local",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/379123/1.webp",
        images: [
            "/assets/productos/Yupoo/379123/2.webp"
        ],
        temporada: "2025/26",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 869302,
        name: "PSG 1974 Local Retro",
        slug: "psg-1974-local-retro",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/869302/1.webp",
        images: [
            "/assets/productos/Yupoo/869302/2.webp"
        ],
        temporada: "1974",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 782056,
        name: "RC Lens 2025/26 Local",
        slug: "rc-lens-202526-local",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/782056/1.webp",
        images: [
            "/assets/productos/Yupoo/782056/2.webp"
        ],
        temporada: "2025/26",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 224898,
        name: "RC Lens 2025/26 Visitante",
        slug: "rc-lens-202526-visitante",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/224898/1.webp",
        images: [
            "/assets/productos/Yupoo/224898/2.webp"
        ],
        temporada: "2025/26",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 995223,
        name: "Paris FC 2025/26 Especial (Niño)",
        slug: "paris-fc-202526-especial-nino",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/995223/1.webp",
        images: [
            "/assets/productos/Yupoo/995223/2.webp"
        ],
        temporada: "2025/26",
        tipo: "especial",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 504985,
        name: "Lille OSC 2025/26",
        slug: "lille-osc-202526",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/504985/1.webp",
        images: [
            "/assets/productos/Yupoo/504985/2.webp"
        ],
        temporada: "2025/26",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 816317,
        name: "Lille OSC 2025/26 Local",
        slug: "lille-osc-202526-local",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/816317/1.webp",
        images: [
            "/assets/productos/Yupoo/816317/2.webp"
        ],
        temporada: "2025/26",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 941039,
        name: "PSG 2025/26 Especial",
        slug: "psg-202526-especial",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/941039/1.webp",
        images: [
            "/assets/productos/Yupoo/941039/2.webp"
        ],
        temporada: "2025/26",
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 401321,
        name: "Paris FC 2025/26 Especial",
        slug: "paris-fc-202526-especial",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/401321/1.webp",
        images: [
            "/assets/productos/Yupoo/401321/2.webp"
        ],
        temporada: "2025/26",
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 957446,
        name: "Japón 2025/26",
        slug: "japon-202526",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/957446/1.webp",
        images: [
            "/assets/productos/Yupoo/957446/2.webp"
        ],
        temporada: "2025/26",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 818274,
        name: "Marseille 2011/12 Tercera Retro",
        slug: "marseille-201112-tercera-retro",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/818274/1.webp",
        images: [
            "/assets/productos/Yupoo/818274/2.webp"
        ],
        temporada: "2011/12",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 980644,
        name: "Olympique Lyon 2010/11 Local Retro",
        slug: "olympique-lyon-201011-local-retro",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/980644/1.webp",
        images: [
            "/assets/productos/Yupoo/980644/2.webp"
        ],
        temporada: "2010/11",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 805946,
        name: "PSG 1999/00 Visitante Retro",
        slug: "psg-199900-visitante-retro",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/805946/1.webp",
        images: [
            "/assets/productos/Yupoo/805946/2.webp"
        ],
        temporada: "1999/00",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 444381,
        name: "PSG 2017/18 Local Retro",
        slug: "psg-201718-local-retro",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/444381/1.webp",
        images: [
            "/assets/productos/Yupoo/444381/2.webp"
        ],
        temporada: "2017/18",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 915572,
        name: "PSG 2018/19 Retro",
        slug: "psg-201819-retro",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/915572/1.webp",
        images: [
            "/assets/productos/Yupoo/915572/2.webp"
        ],
        temporada: "2018/19",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 708029,
        name: "PSG 2019/20 Local Retro",
        slug: "psg-201920-local-retro",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/708029/1.webp",
        images: [
            "/assets/productos/Yupoo/708029/2.webp"
        ],
        temporada: "2019/20",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 706695,
        name: "PSG 2018/19 Retro",
        slug: "psg-201819-retro",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/706695/1.webp",
        images: [
            "/assets/productos/Yupoo/706695/2.webp"
        ],
        temporada: "2018/19",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 588199,
        name: "AC Milan 2011/12 Local Retro",
        slug: "ac-milan-201112-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/588199/1.webp",
        images: [
            "/assets/productos/Yupoo/588199/2.webp"
        ],
        temporada: "2011/12",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 733133,
        name: "OGC Nice 2025/26 Local",
        slug: "ogc-nice-202526-local",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/733133/1.webp",
        images: [
            "/assets/productos/Yupoo/733133/2.webp"
        ],
        temporada: "2025/26",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 231946,
        name: "OGC Nice 2025/26 Visitante",
        slug: "ogc-nice-202526-visitante",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/231946/1.webp",
        images: [
            "/assets/productos/Yupoo/231946/2.webp"
        ],
        temporada: "2025/26",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 519837,
        name: "Napoli 2025/26 Entrenamiento",
        slug: "napoli-202526-entrenamiento",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/519837/1.webp",
        images: [
            "/assets/productos/Yupoo/519837/2.webp"
        ],
        temporada: "2025/26",
        tipo: "entrenamiento",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 743064,
        name: "Fiorentina 1999/00 Visitante Retro",
        slug: "fiorentina-199900-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/743064/1.webp",
        images: [
            "/assets/productos/Yupoo/743064/2.webp"
        ],
        temporada: "1999/00",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 757098,
        name: "AS Roma 2025/26 Tercera",
        slug: "as-roma-202526-tercera",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/757098/1.webp",
        images: [
            "/assets/productos/Yupoo/757098/2.webp"
        ],
        temporada: "2025/26",
        tipo: "tercera",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 124024,
        name: "Lazio 2025/26 Visitante",
        slug: "lazio-202526-visitante",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/124024/1.webp",
        images: [
            "/assets/productos/Yupoo/124024/2.webp"
        ],
        temporada: "2025/26",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 112113,
        name: "Inter Milan 2025/26 Visitante (Niño)",
        slug: "inter-de-milan-202526-visitante-nino",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/112113/1.webp",
        images: [
            "/assets/productos/Yupoo/112113/2.webp"
        ],
        temporada: "2025/26",
        tipo: "visitante",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 547123,
        name: "Napoli 2025/26 Visitante",
        slug: "napoli-202526-visitante",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/547123/1.webp",
        images: [
            "/assets/productos/Yupoo/547123/2.webp"
        ],
        temporada: "2025/26",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 150591,
        name: "Atlanta United 2025/26 Local",
        slug: "atlanta-united-202526-local",
        category: "futbol",
        league: "premier",
        image: "/assets/productos/Yupoo/150591/1.webp",
        images: [
            "/assets/productos/Yupoo/150591/2.webp"
        ],
        temporada: "2025/26",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 552681,
        name: "AS Roma 2017/18 Local Retro",
        slug: "as-roma-201718-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/552681/1.webp",
        images: [
            "/assets/productos/Yupoo/552681/2.webp"
        ],
        temporada: "2017/18",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 614010,
        name: "Napoli 1987/88 Local Retro",
        slug: "napoli-198788-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/614010/1.webp",
        images: [
            "/assets/productos/Yupoo/614010/2.webp"
        ],
        temporada: "1987/88",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 153190,
        name: "Inter Milan 2004/05 Local Retro",
        slug: "inter-de-milan-200405-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/153190/1.webp",
        images: [
            "/assets/productos/Yupoo/153190/2.webp"
        ],
        temporada: "2004/05",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 710307,
        name: "AC Milan 1999/00 Visitante Retro",
        slug: "ac-milan-199900-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/710307/1.webp",
        images: [
            "/assets/productos/Yupoo/710307/2.webp"
        ],
        temporada: "1999/00",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 632663,
        name: "AC Milan 1997/98 Local Retro",
        slug: "ac-milan-199798-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/632663/1.webp",
        images: [
            "/assets/productos/Yupoo/632663/2.webp"
        ],
        temporada: "1997/98",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 829257,
        name: "AC Milan 2015/16 Local Retro",
        slug: "ac-milan-201516-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/829257/1.webp",
        images: [
            "/assets/productos/Yupoo/829257/2.webp"
        ],
        temporada: "2015/16",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 480878,
        name: "Inter Milan 2025/26 Local (Niño)",
        slug: "inter-de-milan-202526-local-nino",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/480878/1.webp",
        images: [
            "/assets/productos/Yupoo/480878/2.webp"
        ],
        temporada: "2025/26",
        tipo: "local",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 756955,
        name: "Fiorentina 2025/26 Local",
        slug: "fiorentina-202526-local",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/756955/1.webp",
        images: [
            "/assets/productos/Yupoo/756955/2.webp"
        ],
        temporada: "2025/26",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 165984,
        name: "AC Milan 1998/99 Visitante Retro",
        slug: "ac-milan-199899-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/165984/1.webp",
        images: [
            "/assets/productos/Yupoo/165984/2.webp"
        ],
        temporada: "1998/99",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 281244,
        name: "Inter Milan 2025/26",
        slug: "inter-de-milan-202526",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/281244/1.webp",
        images: [
            "/assets/productos/Yupoo/281244/2.webp"
        ],
        temporada: "2025/26",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 744295,
        name: "AC Milan 2025/26 Portero",
        slug: "ac-milan-202526-portero",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/744295/1.webp",
        images: [
            "/assets/productos/Yupoo/744295/2.webp"
        ],
        temporada: "2025/26",
        tipo: "portero",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 437711,
        name: "Inter Milan 2009/10 Local Retro",
        slug: "inter-de-milan-200910-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/437711/1.webp",
        images: [
            "/assets/productos/Yupoo/437711/2.webp"
        ],
        temporada: "2009/10",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 455822,
        name: "Lazio 1991/92 Local Retro",
        slug: "lazio-199192-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/455822/1.webp",
        images: [
            "/assets/productos/Yupoo/455822/2.webp"
        ],
        temporada: "1991/92",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 836993,
        name: "AS Roma 1999/00 Visitante Retro",
        slug: "as-roma-199900-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/836993/1.webp",
        images: [
            "/assets/productos/Yupoo/836993/2.webp"
        ],
        temporada: "1999/00",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 830971,
        name: "AS Roma 1997/98 Local Retro",
        slug: "as-roma-199798-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/830971/1.webp",
        images: [
            "/assets/productos/Yupoo/830971/2.webp"
        ],
        temporada: "1997/98",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 631299,
        name: "AS Roma 1991/92 Local Retro",
        slug: "as-roma-199192-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/631299/1.webp",
        images: [
            "/assets/productos/Yupoo/631299/2.webp"
        ],
        temporada: "1991/92",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 284274,
        name: "AS Roma 1991/92 Visitante Retro",
        slug: "as-roma-199192-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/284274/1.webp",
        images: [
            "/assets/productos/Yupoo/284274/2.webp"
        ],
        temporada: "1991/92",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 858937,
        name: "AS Roma 1989/90 Local Retro",
        slug: "as-roma-198990-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/858937/1.webp",
        images: [
            "/assets/productos/Yupoo/858937/2.webp"
        ],
        temporada: "1989/90",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 720071,
        name: "AC Milan 2025/26 (Niño)",
        slug: "ac-milan-202526-nino",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/720071/1.webp",
        images: [
            "/assets/productos/Yupoo/720071/2.webp"
        ],
        temporada: "2025/26",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 475910,
        name: "AC Milan 2025/26 (Niño)",
        slug: "ac-milan-202526-nino",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/475910/1.webp",
        images: [
            "/assets/productos/Yupoo/475910/2.webp"
        ],
        temporada: "2025/26",
        kids: true,
        price: 21.9,
        oldPrice: 27
    },
    {
        id: 836058,
        name: "AS Roma 1998/99 Visitante Retro",
        slug: "as-roma-199899-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/836058/1.webp",
        images: [
            "/assets/productos/Yupoo/836058/2.webp"
        ],
        temporada: "1998/99",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 941070,
        name: "Inter Milan 1992/94 Tercera Retro",
        slug: "inter-de-milan-199294-tercera-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/941070/1.webp",
        images: [
            "/assets/productos/Yupoo/941070/2.webp"
        ],
        temporada: "1992/94",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 801758,
        name: "Lazio 1998/99 Retro",
        slug: "lazio-199899-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/801758/1.webp",
        images: [
            "/assets/productos/Yupoo/801758/2.webp"
        ],
        temporada: "1998/99",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 694601,
        name: "AS Roma 1992/94 Retro",
        slug: "as-roma-199294-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/694601/1.webp",
        images: [
            "/assets/productos/Yupoo/694601/2.webp"
        ],
        temporada: "1992/94",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 869204,
        name: "AS Roma 1992/94 Visitante Retro",
        slug: "as-roma-199294-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/869204/1.webp",
        images: [
            "/assets/productos/Yupoo/869204/2.webp"
        ],
        temporada: "1992/94",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 851145,
        name: "AS Roma 1991/92 Retro",
        slug: "as-roma-199192-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/851145/1.webp",
        images: [
            "/assets/productos/Yupoo/851145/2.webp"
        ],
        temporada: "1991/92",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 818851,
        name: "AC Milan 2025/26 Especial",
        slug: "ac-milan-202526-especial",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/818851/1.webp",
        images: [
            "/assets/productos/Yupoo/818851/2.webp"
        ],
        temporada: "2025/26",
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 430768,
        name: "AC Milan 2025/26 Especial",
        slug: "ac-milan-202526-especial",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/430768/1.webp",
        images: [
            "/assets/productos/Yupoo/430768/2.webp"
        ],
        temporada: "2025/26",
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 377114,
        name: "AS Roma 1999/00 Local Retro",
        slug: "as-roma-199900-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/377114/1.webp",
        images: [
            "/assets/productos/Yupoo/377114/2.webp"
        ],
        temporada: "1999/00",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 658480,
        name: "Inter Milan 1994/95 Visitante Retro",
        slug: "inter-de-milan-199495-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/658480/1.webp",
        images: [
            "/assets/productos/Yupoo/658480/2.webp"
        ],
        temporada: "1994/95",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 797208,
        name: "Inter Milan 2002/03 Local Retro",
        slug: "inter-de-milan-200203-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/797208/1.webp",
        images: [
            "/assets/productos/Yupoo/797208/2.webp"
        ],
        temporada: "2002/03",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 271778,
        name: "AC Milan 2012/13 Retro",
        slug: "ac-milan-201213-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/271778/1.webp",
        images: [
            "/assets/productos/Yupoo/271778/2.webp"
        ],
        temporada: "2012/13",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 521748,
        name: "AC Milan 2003/04 Local Retro",
        slug: "ac-milan-200304-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/521748/1.webp",
        images: [
            "/assets/productos/Yupoo/521748/2.webp"
        ],
        temporada: "2003/04",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 194004,
        name: "AC Milan Especial",
        slug: "ac-milan-especial",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/194004/1.webp",
        images: [
            "/assets/productos/Yupoo/194004/2.webp"
        ],
        tipo: "especial",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 473925,
        name: "AS Roma 2004/05 Local Retro",
        slug: "as-roma-200405-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/473925/1.webp",
        images: [
            "/assets/productos/Yupoo/473925/2.webp"
        ],
        temporada: "2004/05",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 722607,
        name: "Lazio 1999/00 Local Retro",
        slug: "lazio-199900-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/722607/1.webp",
        images: [
            "/assets/productos/Yupoo/722607/2.webp"
        ],
        temporada: "1999/00",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 851723,
        name: "Inter Milan 1990/91 Local Retro",
        slug: "inter-de-milan-199091-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/851723/1.webp",
        images: [
            "/assets/productos/Yupoo/851723/2.webp"
        ],
        temporada: "1990/91",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 374894,
        name: "AC Milan 2001/02 Local Retro",
        slug: "ac-milan-200102-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/374894/1.webp",
        images: [
            "/assets/productos/Yupoo/374894/2.webp"
        ],
        temporada: "2001/02",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 100075,
        name: "AC Milan 2000/01 Tercera Retro",
        slug: "ac-milan-200001-tercera-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/100075/1.webp",
        images: [
            "/assets/productos/Yupoo/100075/2.webp"
        ],
        temporada: "2000/01",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 957207,
        name: "AS Roma 1998/99 Local Retro",
        slug: "as-roma-199899-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/957207/1.webp",
        images: [
            "/assets/productos/Yupoo/957207/2.webp"
        ],
        temporada: "1998/99",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 590985,
        name: "Inter Milan 2004/05 Visitante Retro",
        slug: "inter-de-milan-200405-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/590985/1.webp",
        images: [
            "/assets/productos/Yupoo/590985/2.webp"
        ],
        temporada: "2004/05",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 183881,
        name: "AC Milan 2000/02 Local Retro",
        slug: "ac-milan-200002-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/183881/1.webp",
        images: [
            "/assets/productos/Yupoo/183881/2.webp"
        ],
        temporada: "2000/02",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 354193,
        name: "AC Milan 2000/01 Local Retro",
        slug: "ac-milan-200001-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/354193/1.webp",
        images: [
            "/assets/productos/Yupoo/354193/2.webp"
        ],
        temporada: "2000/01",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 666398,
        name: "AC Milan 1998 Tercera Retro",
        slug: "ac-milan-1998-tercera-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/666398/1.webp",
        images: [
            "/assets/productos/Yupoo/666398/2.webp"
        ],
        temporada: "1998",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 651234,
        name: "AS Roma 2000/01 Tercera Retro",
        slug: "as-roma-200001-tercera-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/651234/1.webp",
        images: [
            "/assets/productos/Yupoo/651234/2.webp"
        ],
        temporada: "2000/01",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 438813,
        name: "Inter Milan 1998/99 Tercera Retro",
        slug: "inter-de-milan-199899-tercera-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/438813/1.webp",
        images: [
            "/assets/productos/Yupoo/438813/2.webp"
        ],
        temporada: "1998/99",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 575163,
        name: "AC Milan 1990/91 Local Retro",
        slug: "ac-milan-199091-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/575163/1.webp",
        images: [
            "/assets/productos/Yupoo/575163/2.webp"
        ],
        temporada: "1990/91",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 275252,
        name: "Inter Milan 2000 Local Retro",
        slug: "inter-de-milan-2000-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/275252/1.webp",
        images: [
            "/assets/productos/Yupoo/275252/2.webp"
        ],
        temporada: "2000",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 141219,
        name: "AC Milan Local Retro",
        slug: "ac-milan-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/141219/1.webp",
        images: [
            "/assets/productos/Yupoo/141219/2.webp"
        ],
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 875492,
        name: "Inter Milan 2009/10 Local Retro",
        slug: "inter-de-milan-200910-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/875492/1.webp",
        images: [
            "/assets/productos/Yupoo/875492/2.webp"
        ],
        temporada: "2009/10",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 540489,
        name: "Inter Milan 2007/08 Visitante Retro",
        slug: "inter-de-milan-200708-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/540489/1.webp",
        images: [
            "/assets/productos/Yupoo/540489/2.webp"
        ],
        temporada: "2007/08",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 310665,
        name: "Inter Milan 2009/10 Visitante Retro",
        slug: "inter-de-milan-200910-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/310665/1.webp",
        images: [
            "/assets/productos/Yupoo/310665/2.webp"
        ],
        temporada: "2009/10",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 167471,
        name: "Inter Milan 1995/96 Local Retro",
        slug: "inter-de-milan-199596-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/167471/1.webp",
        images: [
            "/assets/productos/Yupoo/167471/2.webp"
        ],
        temporada: "1995/96",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 983088,
        name: "AC Milan 1988/89 Local Retro",
        slug: "ac-milan-198889-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/983088/1.webp",
        images: [
            "/assets/productos/Yupoo/983088/2.webp"
        ],
        temporada: "1988/89",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 396805,
        name: "AC Milan 2012/13 Local Retro",
        slug: "ac-milan-201213-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/396805/1.webp",
        images: [
            "/assets/productos/Yupoo/396805/2.webp"
        ],
        temporada: "2012/13",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 932106,
        name: "AC Milan 2017/18 Local Retro",
        slug: "ac-milan-201718-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/932106/1.webp",
        images: [
            "/assets/productos/Yupoo/932106/2.webp"
        ],
        temporada: "2017/18",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 185753,
        name: "AC Milan 2019/20 Local Retro",
        slug: "ac-milan-201920-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/185753/1.webp",
        images: [
            "/assets/productos/Yupoo/185753/2.webp"
        ],
        temporada: "2019/20",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 631281,
        name: "AS Roma 1990/91 Visitante Retro",
        slug: "as-roma-199091-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/631281/1.webp",
        images: [
            "/assets/productos/Yupoo/631281/2.webp"
        ],
        temporada: "1990/91",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 491576,
        name: "Napoli 1990/91 Visitante Retro",
        slug: "napoli-199091-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/491576/1.webp",
        images: [
            "/assets/productos/Yupoo/491576/2.webp"
        ],
        temporada: "1990/91",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 785743,
        name: "AC Milan 2008/09 Local Retro",
        slug: "ac-milan-200809-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/785743/1.webp",
        images: [
            "/assets/productos/Yupoo/785743/2.webp"
        ],
        temporada: "2008/09",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 912839,
        name: "AC Milan 2009/10 Local Retro",
        slug: "ac-milan-200910-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/912839/1.webp",
        images: [
            "/assets/productos/Yupoo/912839/2.webp"
        ],
        temporada: "2009/10",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 459658,
        name: "AC Milan 2008/09 Local Retro",
        slug: "ac-milan-200809-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/459658/1.webp",
        images: [
            "/assets/productos/Yupoo/459658/2.webp"
        ],
        temporada: "2008/09",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 947402,
        name: "AS Roma 2001/02 Visitante Retro",
        slug: "as-roma-200102-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/947402/1.webp",
        images: [
            "/assets/productos/Yupoo/947402/2.webp"
        ],
        temporada: "2001/02",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 614067,
        name: "Napoli 1993/94 Local Retro",
        slug: "napoli-199394-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/614067/1.webp",
        images: [
            "/assets/productos/Yupoo/614067/2.webp"
        ],
        temporada: "1993/94",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 304772,
        name: "AC Milan 1989/90 Local Retro",
        slug: "ac-milan-198990-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/304772/1.webp",
        images: [
            "/assets/productos/Yupoo/304772/2.webp"
        ],
        temporada: "1989/90",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 653948,
        name: "AS Roma 2005/06 Local Retro",
        slug: "as-roma-200506-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/653948/1.webp",
        images: [
            "/assets/productos/Yupoo/653948/2.webp"
        ],
        temporada: "2005/06",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 714853,
        name: "AC Milan 2009/10 Visitante Retro",
        slug: "ac-milan-200910-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/714853/1.webp",
        images: [
            "/assets/productos/Yupoo/714853/2.webp"
        ],
        temporada: "2009/10",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 620785,
        name: "AC Milan 2007/08 Local Retro",
        slug: "ac-milan-200708-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/620785/1.webp",
        images: [
            "/assets/productos/Yupoo/620785/2.webp"
        ],
        temporada: "2007/08",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 460209,
        name: "AC Milan 2007/08 Visitante Retro",
        slug: "ac-milan-200708-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/460209/1.webp",
        images: [
            "/assets/productos/Yupoo/460209/2.webp"
        ],
        temporada: "2007/08",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 464751,
        name: "AC Milan 1998/99 Local Retro",
        slug: "ac-milan-199899-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/464751/1.webp",
        images: [
            "/assets/productos/Yupoo/464751/2.webp"
        ],
        temporada: "1998/99",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 309814,
        name: "Inter Milan 2002/03 Tercera Retro",
        slug: "inter-de-milan-200203-tercera-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/309814/1.webp",
        images: [
            "/assets/productos/Yupoo/309814/2.webp"
        ],
        temporada: "2002/03",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 949822,
        name: "Marseille 2005/06 Local Retro",
        slug: "marseille-200506-local-retro",
        category: "futbol",
        league: "ligue1",
        image: "/assets/productos/Yupoo/949822/1.webp",
        images: [
            "/assets/productos/Yupoo/949822/2.webp"
        ],
        temporada: "2005/06",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 874472,
        name: "Lazio 2000 Local",
        slug: "lazio-2000-local",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/874472/1.webp",
        images: [
            "/assets/productos/Yupoo/874472/2.webp"
        ],
        temporada: "2000",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 172570,
        name: "Lazio 1999/00 Local Retro",
        slug: "lazio-199900-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/172570/1.webp",
        images: [
            "/assets/productos/Yupoo/172570/2.webp"
        ],
        temporada: "1999/00",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 604961,
        name: "AC Milan 2000 Local Retro",
        slug: "ac-milan-2000-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/604961/1.webp",
        images: [
            "/assets/productos/Yupoo/604961/2.webp"
        ],
        temporada: "2000",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 781835,
        name: "AC Milan 2011 Tercera Retro",
        slug: "ac-milan-2011-tercera-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/781835/1.webp",
        images: [
            "/assets/productos/Yupoo/781835/2.webp"
        ],
        temporada: "2011",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 454700,
        name: "Lazio 2018/19 Local Retro",
        slug: "lazio-201819-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/454700/1.webp",
        images: [
            "/assets/productos/Yupoo/454700/2.webp"
        ],
        temporada: "2018/19",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 172864,
        name: "Lazio 2015/16 Visitante Retro",
        slug: "lazio-201516-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/172864/1.webp",
        images: [
            "/assets/productos/Yupoo/172864/2.webp"
        ],
        temporada: "2015/16",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 252261,
        name: "AC Milan 2011 Visitante Retro",
        slug: "ac-milan-2011-visitante-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/252261/1.webp",
        images: [
            "/assets/productos/Yupoo/252261/2.webp"
        ],
        temporada: "2011",
        tipo: "visitante",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 860526,
        name: "AC Milan 2013 Tercera Retro",
        slug: "ac-milan-2013-tercera-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/860526/1.webp",
        images: [
            "/assets/productos/Yupoo/860526/2.webp"
        ],
        temporada: "2013",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 711016,
        name: "Inter Milan 1994 Entrenamiento Retro",
        slug: "inter-de-milan-1994-entrenamiento-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/711016/1.webp",
        images: [
            "/assets/productos/Yupoo/711016/2.webp"
        ],
        temporada: "1994",
        tipo: "entrenamiento",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 806868,
        name: "Inter Milan 2004 Tercera Retro",
        slug: "inter-de-milan-2004-tercera-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/806868/1.webp",
        images: [
            "/assets/productos/Yupoo/806868/2.webp"
        ],
        temporada: "2004",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 757165,
        name: "Lazio 2000 Tercera Retro",
        slug: "lazio-2000-tercera-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/757165/1.webp",
        images: [
            "/assets/productos/Yupoo/757165/2.webp"
        ],
        temporada: "2000",
        tipo: "tercera",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 714874,
        name: "Italia 1990 Local Retro",
        slug: "italia-1990-local-retro",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/714874/1.webp",
        images: [
            "/assets/productos/Yupoo/714874/2.webp"
        ],
        temporada: "1990",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 318846,
        name: "Italia 2020 Visitante",
        slug: "italia-2020-visitante",
        category: "futbol",
        league: "selecciones",
        image: "/assets/productos/Yupoo/318846/1.webp",
        images: [
            "/assets/productos/Yupoo/318846/2.webp"
        ],
        temporada: "2020",
        tipo: "visitante",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 164973,
        name: "AS Roma 2001 Local Retro",
        slug: "as-roma-2001-local-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/164973/1.webp",
        images: [
            "/assets/productos/Yupoo/164973/2.webp"
        ],
        temporada: "2001",
        tipo: "local",
        retro: true,
        price: 24.9,
        oldPrice: 30
    },
    {
        id: 151623,
        name: "Fiorentina 1998 Local",
        slug: "fiorentina-1998-local",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/151623/1.webp",
        images: [
            "/assets/productos/Yupoo/151623/2.webp"
        ],
        temporada: "1998",
        tipo: "local",
        price: 19.9,
        oldPrice: 25
    },
    {
        id: 979519,
        name: "AC Milan 2008 Retro",
        slug: "ac-milan-2008-retro",
        category: "futbol",
        league: "seriea",
        image: "/assets/productos/Yupoo/979519/1.webp",
        images: [
            "/assets/productos/Yupoo/979519/2.webp"
        ],
        temporada: "2008",
        retro: true,
        price: 24.9,
        oldPrice: 30
    }
];

export default products;

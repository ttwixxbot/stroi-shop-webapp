// ===============================================
// ВСТРОЕННЫЙ КАТАЛОГ ТОВАРОВ
// ===============================================

const EMBEDDED_CATALOG = [
  {
    "id": 1,
    "sku": "SHR-3545-001",
    "name": "Шурупы универсальные 3,5x45",
    "description": "Шурупы высокого качества для крепления различных материалов. Подходят для дерева, гипсокартона.",
    "price": 34.30,
    "photo": "https://images.unsplash.com/photo-1609205292622-0d43b9e24f11?w=300&h=300&fit=crop",
    "category": "Крепеж",
    "inStock": true,
    "popular": true
  },
  {
    "id": 2,
    "sku": "SAM-4216-002",
    "name": "Саморезы по металлу 4,2x16",
    "description": "Саморезы для крепления листового металла, профилей. Острый наконечник, надежная фиксация.",
    "price": 32.99,
    "photo": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=300&fit=crop",
    "category": "Крепеж",
    "inStock": true,
    "popular": false
  },
  {
    "id": 3,
    "sku": "KRA-10L-003",
    "name": "Краска водоэмульсионная белая 10л",
    "description": "Высококачественная водоэмульсионная краска для внутренних работ. Хорошая укрывистость.",
    "price": 478.60,
    "photo": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=300&fit=crop",
    "category": "Лакокрасочные",
    "inStock": true,
    "popular": true
  },
  {
    "id": 4,
    "sku": "GRU-5L-004",
    "name": "Грунтовка глубокого проникновения 5л",
    "description": "Акриловая грунтовка для укрепления основания перед покраской или поклейкой обоев.",
    "price": 346.00,
    "photo": "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=300&h=300&fit=crop",
    "category": "Лакокрасочные",
    "inStock": true,
    "popular": false
  },
  {
    "id": 5,
    "sku": "KLE-PVA-005",
    "name": "Клей ПВА строительный 1кг",
    "description": "Универсальный клей для строительных и ремонтных работ. Экологически чистый.",
    "price": 123.00,
    "photo": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop",
    "category": "Лакокрасочные",
    "inStock": true,
    "popular": false
  },
  {
    "id": 6,
    "sku": "DRL-850W-006",
    "name": "Дрель ударная 850Вт",
    "description": "Профессиональная ударная дрель с регулировкой оборотов. В комплекте набор сверл.",
    "price": 1650.00,
    "photo": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=300&fit=crop",
    "category": "Инструменты",
    "inStock": true,
    "popular": true
  },
  {
    "id": 7,
    "sku": "BOL-125-007",
    "name": "Болгарка 125мм 900Вт",
    "description": "Углошлифовальная машина для резки и шлифовки металла, камня. Защитный кожух в комплекте.",
    "price": 404.90,
    "photo": "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop",
    "category": "Инструменты",
    "inStock": true,
    "popular": true
  },
  {
    "id": 8,
    "sku": "PER-SDS-008",
    "name": "Перфоратор SDS-Plus 800Вт",
    "description": "Мощный перфоратор для сверления отверстий в бетоне и кирпиче. 3 режима работы.",
    "price": 1332.00,
    "photo": "https://images.unsplash.com/photo-1609205292622-0d43b9e24f11?w=300&h=300&fit=crop",
    "category": "Инструменты",
    "inStock": true,
    "popular": false
  },
  {
    "id": 9,
    "sku": "CEM-M500-009",
    "name": "Цемент М500 50кг",
    "description": "Портландцемент марки 500 для приготовления бетона, растворов. Высокое качество.",
    "price": 160.10,
    "photo": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    "category": "Стройматериалы",
    "inStock": true,
    "popular": true
  },
  {
    "id": 10,
    "sku": "PLI-KER-010",
    "name": "Плитка керамическая 20x30см",
    "description": "Качественная керамическая плитка для ванной и кухни. Влагостойкая, легко моется.",
    "price": 360.90,
    "photo": "https://images.unsplash.com/photo-1584622615551-44b7b1b3b9ad?w=300&h=300&fit=crop",
    "category": "Стройматериалы",
    "inStock": true,
    "popular": false
  },
  {
    "id": 11,
    "sku": "KAB-VVG-011",
    "name": "Кабель ВВГ 3x2,5 мм²",
    "description": "Медный кабель для внутренней проводки. Надежная изоляция, соответствует ГОСТ.",
    "price": 175.20,
    "photo": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
    "category": "Электрика",
    "inStock": true,
    "popular": false
  },
  {
    "id": 12,
    "sku": "ROZ-ZEM-012",
    "name": "Розетка с заземлением белая",
    "description": "Электрическая розетка с заземляющим контактом. Современный дизайн, надежная конструкция.",
    "price": 163.20,
    "photo": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
    "category": "Электрика",
    "inStock": true,
    "popular": false
  },
  {
    "id": 13,
    "sku": "DVR-80CM-013",
    "name": "Дверь межкомнатная 80см",
    "description": "Межкомнатная дверь из массива сосны. Экологически чистая, красивая текстура.",
    "price": 2450.00,
    "photo": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
    "category": "Двери и окна",
    "inStock": true,
    "popular": true
  },
  {
    "id": 14,
    "sku": "ZAM-VRZ-014",
    "name": "Замок врезной с ключами",
    "description": "Надежный врезной замок для межкомнатных дверей. В комплекте 3 ключа.",
    "price": 256.10,
    "photo": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
    "category": "Двери и окна",
    "inStock": true,
    "popular": false
  },
  {
    "id": 15,
    "sku": "GIP-125-015",
    "name": "Гипсокартон 12,5мм 1200x2500",
    "description": "Гипсокартонный лист для внутренней отделки. Идеально ровная поверхность.",
    "price": 447.30,
    "photo": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
    "category": "Стройматериалы",
    "inStock": true,
    "popular": true
  },
  {
    "id": 16,
    "sku": "GVZ-100-016",
    "name": "Гвозди строительные 100мм",
    "description": "Качественные гвозди для строительных работ. Прочная сталь.",
    "price": 45.70,
    "photo": "https://images.unsplash.com/photo-1609205292622-0d43b9e24f11?w=300&h=300&fit=crop",
    "category": "Крепеж",
    "inStock": true,
    "popular": false
  },
  {
    "id": 17,
    "sku": "MOL-500G-017",
    "name": "Молоток слесарный 500г",
    "description": "Профессиональный слесарный молоток с фиберглассовой ручкой.",
    "price": 234.50,
    "photo": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=300&fit=crop",
    "category": "Инструменты",
    "inStock": true,
    "popular": false
  },
  {
    "id": 18,
    "sku": "URV-60CM-018",
    "name": "Уровень строительный 60см",
    "description": "Точный строительный уровень с тремя глазками. Алюминиевый профиль.",
    "price": 297.00,
    "photo": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=300&fit=crop",
    "category": "Инструменты",
    "inStock": true,
    "popular": true
  }
];
# 🏗️ Модульный магазин строительных материалов для Telegram

Современный и легко настраиваемый магазин для Telegram Mini App с красивым дизайном и анимациями.

## 📁 Структура проекта

```
your-shop/
│
├── index.html                 # Главная страница
├── README.md                  # Эта инструкция
│
├── css/
│   └── style.css             # Все стили магазина
│
├── js/
│   └── app.js                # Основная логика приложения
│
├── config/
│   ├── shop-config.js        # 🔧 НАСТРОЙКИ МАГАЗИНА
│   └── categories.js         # 📂 НАСТРОЙКИ КАТЕГОРИЙ
│
└── data/
    └── catalog.json          # 📦 КАТАЛОГ ТОВАРОВ
```

## 🚀 Быстрый старт

### 1. Скачайте все файлы и разместите на сервере:
- Загрузите все файлы в папку на вашем веб-сервере
- Убедитесь, что структура папок сохранена

### 2. Настройте магазин:
Откройте файл `config/shop-config.js` и измените:

```javascript
const SHOP_CONFIG = {
    shopTitle: "Ваш магазин",           // Название магазина
    logoPath: "путь/к/вашему/лого.jpg", // Путь к логотипу
    
    colors: {
        primary: "#your-color",          // Основной цвет
        secondary: "#your-color",        // Дополнительный цвет
        accent: "#your-color",           // Акцентный цвет
    },
    
    contact: {
        phone: "+7 (xxx) xxx-xx-xx",     // Ваш телефон
        email: "your@email.com",         // Ваш email
        address: "Ваш адрес"             // Ваш адрес
    }
    // ... остальные настройки
};
```

### 3. Настройте категории:
Откройте файл `config/categories.js`:

```javascript
const CATEGORIES = [
    {
        name: 'Название категории',
        icon: '🔥',                      // Любой эмодзи
        description: 'Описание',
        keywords: ['слово1', 'слово2'],  // Ключевые слова для поиска
        enabled: true                    // true = показывать, false = скрыть
    }
    // Добавьте свои категории...
];
```

### 4. Добавьте товары:
Откройте файл `data/catalog.json` и добавьте свои товары:

```json
[
  {
    "id": 1,
    "name": "Название товара",
    "description": "Описание товара",
    "price": 100.50,
    "photo": "https://example.com/photo.jpg",
    "category": "Категория",
    "inStock": true,
    "popular": false
  }
]
```

## 🛠️ Подробная настройка

### Настройка магазина (`config/shop-config.js`)

#### Основные параметры:
- `shopTitle` - название магазина (отображается в шапке)
- `shopDescription` - описание магазина
- `logoPath` - путь к логотипу (можно использовать URL или локальный файл)

#### Цвета:
- `primary` - основной цвет (кнопки, акценты)
- `secondary` - дополнительный цвет (градиенты)
- `accent` - акцентный цвет (цены, важные элементы)
- `success` - цвет успеха (кнопки "добавить в корзину")

#### Валюта:
- `code` - код валюты (RUB, USD, EUR)
- `symbol` - символ валюты (₽, $, €)

#### Способы оплаты:
```javascript
paymentMethods: [
    { value: "cash", label: "💵 Наличными", enabled: true },
    { value: "card", label: "💳 Картой", enabled: true },
    { value: "transfer", label: "🏦 Переводом", enabled: false }
]
```

#### Сообщения:
Можно изменить все тексты в интерфейсе:
```javascript
messages: {
    emptyCart: "Ваша корзина пуста",
    orderSuccess: "Заказ оформлен!",
    // ... и другие
}
```

### Настройка категорий (`config/categories.js`)

#### Добавление новой категории:
```javascript
{
    name: 'Сантехника',              // Название
    icon: '🚿',                      // Эмодзи-иконка
    description: 'Трубы, краны',     // Краткое описание
    keywords: ['труба', 'кран'],     // Слова для поиска товаров
    enabled: true                    // Показывать категорию
}
```

#### Ключевые слова:
- Товары фильтруются по вхождению ключевых слов в название или описание
- Можно использовать части слов: 'дрель' найдет "Дрель ударная"
- Регистр не важен

#### Отключение категории:
Поставьте `enabled: false` и категория не будет отображаться

### Добавление товаров (`data/catalog.json`)

#### Структура товара:
```json
{
  "id": 1,                          // Уникальный ID (число)
  "sku": "SHR-3545-001",           // Артикул товара (ТОЛЬКО ДЛЯ АДМИНА!)
  "name": "Название",               // Название товара
  "description": "Описание",        // Подробное описание
  "price": 100.50,                  // Цена (число с копейками)
  "photo": "URL_изображения",       // Ссылка на фото
  "category": "Категория",          // Категория (необязательно)
  "inStock": true,                  // В наличии (необязательно)
  "popular": false                  // Популярный товар (необязательно)
}
```

#### ⚠️ ВАЖНО: Артикулы (SKU)
- **Поле `sku`** - это артикул товара для внутреннего учета
- **Клиенты НЕ ВИДЯТ артикулы** в интерфейсе магазина
- **Администратор получает артикулы** в уведомлениях о заказах
- Используйте удобную систему артикулов:
  - `SHR-3545-001` - Шурупы 3,5x45, номер 001
  - `KRA-10L-003` - Краска 10л, номер 003
  - `DRL-850W-006` - Дрель 850Вт, номер 006

#### Фотографии товаров:
- Используйте качественные изображения 300x300px или больше
- Можно использовать URLs из интернета или загрузить на ваш сервер
- Поддерживаются форматы: JPG, PNG, WebP

## 🎨 Кастомизация дизайна

### Изменение цветов:
В файле `config/shop-config.js` измените цвета:
```javascript
colors: {
    primary: "#2563eb",      // Синий
    secondary: "#7c3aed",    // Фиолетовый  
    accent: "#f59e0b",       // Оранжевый
    success: "#10b981"       // Зеленый
}
```

### Отключение анимаций:
```javascript
animation: {
    enabled: false,          // Отключить анимации
    duration: 300,          // Длительность (мс)
    staggerDelay: 100       // Задержка между элементами
}
```

### Изменение стилей:
Если нужны глубокие изменения дизайна, редактируйте файл `css/style.css`

## 📱 Интеграция с Telegram

### 1. Создайте бота:
- Напишите @BotFather в Telegram
- Создайте нового бота командой `/newbot`
- Получите токен бота

### 2. Настройте Web App:
- Отправьте команду `/newapp` боту @BotFather
- Выберите вашего бота
- Введите URL вашего магазина
- Добавьте описание и фото

### 3. Обработка заказов:
Заказы будут приходить в формате JSON:
```javascript
{
  "items": [...],           // Товары в корзине
  "totalPrice": 1500,       // Общая сумма
  "customer": {
    "name": "Имя",
    "organization": "Организация",
    "phone": "+7...",
    "address": "Адрес",
    "paymentMethod": "Способ оплаты"
  },
  "orderDate": "2024-01-01T12:00:00.000Z"
}
```

## 🔧 Часто задаваемые вопросы

### ❓ Как добавить новую категорию?
1. Откройте `config/categories.js`
2. Скопируйте блок существующей категории
3. Измените `name`, `icon`, `description`, `keywords`
4. Убедитесь, что `enabled: true`

### ❓ Как изменить цвета магазина?
1. Откройте `config/shop-config.js`
2. Найдите секцию `colors`
3. Измените нужные цвета (используйте HEX-коды)

### ❓ Товары не отображаются в категории
1. Проверьте ключевые слова в `config/categories.js`
2. Убедитесь, что слова есть в названии или описании товаров
3. Проверьте правильность написания

### ❓ Как добавить много товаров сразу?
1. Подготовьте список товаров в Excel
2. Конвертируйте в JSON формат
3. Замените содержимое файла `data/catalog.json`

### ❓ Как изменить логотип?
1. Загрузите изображение на сервер или используйте URL
2. В `config/shop-config.js` измените `logoPath`
3. Рекомендуемый размер: 100x100px

## 📞 Поддержка

Если у вас возникли вопросы:
1. Проверьте консоль браузера на наличие ошибок (F12)
2. Убедитесь, что все файлы загружены правильно
3. Проверьте структуру папок
4. Убедитесь, что JSON файлы корректны (используйте валидатор JSON)

---

**Удачи с вашим магазином! 🚀**
// script.js

// Конфигурация - легко адаптируется под разные магазины
const CONFIG = {
    shopName: "Мини Магазин",
    shopDescription: "Лучшие товары для вас",
    currency: "₽",
    // Обновленные категории, включая новые для строительных товаров
    categories: {
        all: { name: "✨ Все товары", description: "Показать все доступные товары" },
        fasteners: { name: "🔩 Крепеж", description: "Шурупы, саморезы, гвозди" },
        paints: { name: "🎨 Лакокрасочные", description: "Краски, грунтовки, клеи" },
        tools: { name: "🛠️ Инструменты", description: "Дрели, молотки, отвертки" },
        buildingMaterials: { name: "🧱 Стройматериалы", description: "Цемент, плитка, гипсокартон" },
        electrical: { name: "💡 Электрика", description: "Кабели, розетки, выключатели" },
        hardware: { name: "🚪 Фурнитура", description: "Замки, петли" },
        // Старые категории, если они все еще нужны, иначе их можно удалить
        electronics: { name: "📱 Электроника", description: "Смартфоны, планшеты" },
        clothing: { name: "👕 Одежда", description: "Модная одежда" },
        books: { name: "📚 Книги", description: "Интересные книги" },
        home: { name: "🏠 Дом", description: "Товары для дома" }
    },
    // Ваши товары из catalog.json, распределенные по категориям
    products: [
        // Товары из catalog.json
        { id: 1, name: "Шурупы", description: "Шурупы высокого качества для строительных и ремонтных работ.", price: 3430, category: "fasteners", images: ["https://placehold.co/300x200/cccccc/333333?text=Шурупы"] },
        { id: 2, name: "Саморезы", description: "Саморезы высокого качества для строительных и ремонтных работ.", price: 3299, category: "fasteners", images: ["https://placehold.co/300x200/cccccc/333333?text=Саморезы"] },
        { id: 3, name: "Краска", description: "Краска высокого качества для строительных и ремонтных работ.", price: 4786, category: "paints", images: ["https://placehold.co/300x200/cccccc/333333?text=Краска"] },
        { id: 4, name: "Грунтовка", description: "Грунтовка высокого качества для строительных и ремонтных работ.", price: 3460, category: "paints", images: ["https://placehold.co/300x200/cccccc/333333?text=Грунтовка"] },
        { id: 5, name: "Клей", description: "Клей высокого качества для строительных и ремонтных работ.", price: 1230, category: "paints", images: ["https://placehold.co/300x200/cccccc/333333?text=Клей"] },
        { id: 6, name: "Герметик", description: "Герметик высокого качества для строительных и ремонтных работ.", price: 2357, category: "paints", images: ["https://placehold.co/300x200/cccccc/333333?text=Герметик"] },
        { id: 7, name: "Эмаль", description: "Эмаль высокого качества для строительных и ремонтных работ.", price: 831, category: "paints", images: ["https://placehold.co/300x200/cccccc/333333?text=Эмаль"] },
        { id: 8, name: "Электроды", description: "Электроды высокого качества для строительных и ремонтных работ.", price: 4925, category: "tools", images: ["https://placehold.co/300x200/cccccc/333333?text=Электроды"] },
        { id: 9, name: "Цемент", description: "Цемент высокого качества для строительных и ремонтных работ.", price: 1601, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Цемент"] },
        { id: 10, name: "Шпатлёвка", description: "Шпатлёвка высокого качества для строительных и ремонтных работ.", price: 525, category: "paints", images: ["https://placehold.co/300x200/cccccc/333333?text=Шпатлёвка"] },
        { id: 11, name: "Пена монтажная", description: "Пена монтажная высокого качества для строительных и ремонтных работ.", price: 1553, category: "paints", images: ["https://placehold.co/300x200/cccccc/333333?text=Пена+монтажная"] },
        { id: 12, name: "Дрель", description: "Дрель высокого качества для строительных и ремонтных работ.", price: 1650, category: "tools", images: ["https://placehold.co/300x200/cccccc/333333?text=Дрель"] },
        { id: 13, name: "Болгарка", description: "Болгарка высокого качества для строительных и ремонтных работ.", price: 4049, category: "tools", images: ["https://placehold.co/300x200/cccccc/333333?text=Болгарка"] },
        { id: 14, name: "Перфоратор", description: "Перфоратор высокого качества для строительных и ремонтных работ.", price: 1332, category: "tools", images: ["https://placehold.co/300x200/cccccc/333333?text=Перфоратор"] },
        { id: 15, name: "Отвёртка", description: "Отвёртка высокого качества для строительных и ремонтных работ.", price: 4691, category: "tools", images: ["https://placehold.co/300x200/cccccc/333333?text=Отвёртка"] },
        { id: 16, name: "Молоток", description: "Молоток высокого качества для строительных и ремонтных работ.", price: 1234, category: "tools", images: ["https://placehold.co/300x200/cccccc/333333?text=Молоток"] },
        { id: 17, name: "Уровень", description: "Уровень высокого качества для строительных и ремонтных работ.", price: 2970, category: "tools", images: ["https://placehold.co/300x200/cccccc/333333?text=Уровень"] },
        { id: 18, name: "Плитка", description: "Плитка высокого качества для строительных и ремонтных работ.", price: 3609, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Плитка"] },
        { id: 19, name: "Керамогранит", description: "Керамогранит высокого качества для строительных и ремонтных работ.", price: 328, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Керамогранит"] },
        { id: 20, name: "Ламинат", description: "Ламинат высокого качества для строительных и ремонтных работ.", price: 1450, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Ламинат"] },
        { id: 21, name: "Гвозди", description: "Гвозди высокого качества для строительных и ремонтных работ.", price: 4577, category: "fasteners", images: ["https://placehold.co/300x200/cccccc/333333?text=Гвозди"] },
        { id: 22, name: "Скотч", description: "Скотч высокого качества для строительных и ремонтных работ.", price: 4598, category: "paints", images: ["https://placehold.co/300x200/cccccc/333333?text=Скотч"] },
        { id: 23, name: "Стяжка", description: "Стяжка высокого качества для строительных и ремонтных работ.", price: 4058, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Стяжка"] },
        { id: 24, name: "Трубы ПВХ", description: "Трубы ПВХ высокого качества для строительных и ремонтных работ.", price: 4085, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Трубы+ПВХ"] },
        { id: 25, name: "Фанера", description: "Фанера высокого качества для строительных и ремонтных работ.", price: 2936, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Фанера"] },
        { id: 26, name: "Гипсокартон", description: "Гипсокартон высокого качества для строительных и ремонтных работ.", price: 4473, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Гипсокартон"] },
        { id: 27, name: "Профиль", description: "Профиль высокого качества для строительных и ремонтных работ.", price: 1717, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Профиль"] },
        { id: 28, name: "Кабель", description: "Кабель высокого качества для строительных и ремонтных работ.", price: 1752, category: "electrical", images: ["https://placehold.co/300x200/cccccc/333333?text=Кабель"] },
        { id: 29, name: "Розетка", description: "Розетка высокого качества для строительных и ремонтных работ.", price: 3632, category: "electrical", images: ["https://placehold.co/300x200/cccccc/333333?text=Розетка"] },
        { id: 30, name: "Выключатель", description: "Выключатель высокого качества для строительных и ремонтных работ.", price: 1326, category: "electrical", images: ["https://placehold.co/300x200/cccccc/333333?text=Выключатель"] },
        { id: 31, name: "Удлинитель", description: "Удлинитель высокого качества для строительных и ремонтных работ.", price: 939, category: "electrical", images: ["https://placehold.co/300x200/cccccc/333333?text=Удлинитель"] },
        { id: 32, name: "Лобзик", description: "Лобзик высокого качества для строительных и ремонтных работ.", price: 3333, category: "tools", images: ["https://placehold.co/300x200/cccccc/333333?text=Лобзик"] },
        { id: 33, name: "Наждачная бумага", description: "Наждачная бумага высокого качества для строительных и ремонтных работ.", price: 1529, category: "tools", images: ["https://placehold.co/300x200/cccccc/333333?text=Наждачная+бумага"] },
        { id: 34, name: "Шуруповерт", description: "Шуруповерт высокого качества для строительных и ремонтных работ.", price: 4640, category: "tools", images: ["https://placehold.co/300x200/cccccc/333333?text=Шуруповерт"] },
        { id: 35, name: "Лестница", description: "Лестница высокого качества для строительных и ремонтных работ.", price: 2173, category: "tools", images: ["https://placehold.co/300x200/cccccc/333333?text=Лестница"] },
        { id: 36, name: "Кисть малярная", description: "Кисть малярная высокого качества для строительных и ремонтных работ.", price: 1298, category: "tools", images: ["https://placehold.co/300x200/cccccc/333333?text=Кисть+малярная"] },
        { id: 37, name: "Валик", description: "Валик высокого качества для строительных и ремонтных работ.", price: 2269, category: "tools", images: ["https://placehold.co/300x200/cccccc/333333?text=Валик"] },
        { id: 38, name: "Штукатурка", description: "Штукатурка высокого качества для строительных и ремонтных работ.", price: 376, category: "paints", images: ["https://placehold.co/300x200/cccccc/333333?text=Штукатурка"] },
        { id: 39, name: "Сетка армирующая", description: "Сетка армирующая высокого качества для строительных и ремонтных работ.", price: 168, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Сетка+армирующая"] },
        { id: 40, name: "Плиточный клей", description: "Плиточный клей высокого качества для строительных и ремонтных работ.", price: 428, category: "paints", images: ["https://placehold.co/300x200/cccccc/333333?text=Плиточный+клей"] },
        { id: 41, name: "Плинтус", description: "Плинтус высокого качества для строительных и ремонтных работ.", price: 3638, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Плинтус"] },
        { id: 42, name: "Двери", description: "Двери высокого качества для строительных и ремонтных работ.", price: 249, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Двери"] },
        { id: 43, name: "Окна", description: "Окна высокого качества для строительных и ремонтных работ.", price: 4345, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Окна"] },
        { id: 44, name: "Замок", description: "Замок высокого качества для строительных и ремонтных работ.", price: 2561, category: "hardware", images: ["https://placehold.co/300x200/cccccc/333333?text=Замок"] },
        { id: 45, name: "Петли", description: "Петли высокого качества для строительных и ремонтных работ.", price: 4600, category: "hardware", images: ["https://placehold.co/300x200/cccccc/333333?text=Петли"] },
        { id: 46, name: "Анкер", description: "Анкер высокого качества для строительных и ремонтных работ.", price: 1163, category: "fasteners", images: ["https://placehold.co/300x200/cccccc/333333?text=Анкер"] },
        { id: 47, name: "Уголок", description: "Уголок высокого качества для строительных и ремонтных работ.", price: 2421, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Уголок"] },
        { id: 48, name: "Шурупы мебельные", description: "Шурупы мебельные высокого качества для строительных и ремонтных работ.", price: 992, category: "fasteners", images: ["https://placehold.co/300x200/cccccc/333333?text=Шурупы+мебельные"] },
        { id: 49, name: "Сверло", description: "Сверло высокого качества для строительных и ремонтных работ.", price: 3766, category: "tools", images: ["https://placehold.co/300x200/cccccc/333333?text=Сверло"] },
        { id: 50, name: "Мешок строительный", description: "Мешок строительный высокого качества для строительных и ремонтных работ.", price: 513, category: "buildingMaterials", images: ["https://placehold.co/300x200/cccccc/333333?text=Мешок+строительный"] },
        // Старые демонстрационные товары (можно удалить, если не нужны)
        { id: 101, name: "iPhone 14", description: "Последняя модель iPhone с отличной камерой", price: 89999, category: "electronics", images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop", "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=300&h=200&fit=crop"] },
        { id: 102, name: "MacBook Pro", description: "Мощный ноутбук для работы и творчества", price: 159999, category: "electronics", images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop"] },
        { id: 103, name: "Футболка Premium", description: "Качественная хлопковая футболка", price: 1999, category: "clothing", images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop"] },
        { id: 104, name: "Джинсы Slim", description: "Стильные джинсы современного кроя", price: 4999, category: "clothing", images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=200&fit=crop"] },
        { id: 105, name: "Программирование", description: "Книга для изучения программирования", price: 2999, category: "books", images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop"] },
        { id: 106, name: "Психология", description: "Интересная книга о психологии", price: 1999, category: "books", images: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop"] },
        { id: 107, name: "Кофеварка", description: "Автоматическая кофеварка для дома", price: 12999, category: "home", images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop"] },
        { id: 108, name: "Подушка Memory", description: "Ортопедическая подушка с эффектом памяти", price: 3999, category: "home", images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop"] }
    ]
};

let cart = [];
let currentCategory = 'all'; // По умолчанию показываем все товары
let productQuantities = {};
let currentImageIndex = {};

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log("Приложение инициализируется..."); // Отладочное сообщение
    // Инициализация количества товаров и индексов изображений
    CONFIG.products.forEach(product => {
        productQuantities[product.id] = 1;
        currentImageIndex[product.id] = 0;
    });

    displayCategories(); // Отображаем категории
    displayProducts();   // Отображаем товары
    updateCartCount();   // Обновляем счетчик корзины
    console.log("Инициализация завершена."); // Отладочное сообщение
}

/**
 * Динамически отображает карточки категорий.
 */
function displayCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    categoriesContainer.innerHTML = ''; // Очищаем существующие категории

    // Создаем карточку для каждой категории из CONFIG
    for (const key in CONFIG.categories) {
        const category = CONFIG.categories[key];
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('category-card');
        categoryCard.setAttribute('onclick', `showCategory('${key}')`);
        categoryCard.innerHTML = `
            <h3>${category.name}</h3>
            <p>${category.description}</p>
        `;
        categoriesContainer.appendChild(categoryCard);
    }
}

/**
 * Отображает товары на странице в зависимости от выбранной категории.
 */
function displayProducts() {
    console.log("Отображение товаров для категории:", currentCategory); // Отладочное сообщение
    const productsContainer = document.getElementById('products');
    const productsToDisplay = currentCategory === 'all'
        ? CONFIG.products
        : CONFIG.products.filter(p => p.category === currentCategory);
            
    productsContainer.innerHTML = productsToDisplay.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.images && product.images.length > 1 ? `
                    <button class="image-nav prev" onclick="changeImage(${product.id}, -1)">‹</button>
                    <button class="image-nav next" onclick="changeImage(${product.id}, 1)">›</button>
                ` : ''}
                <img src="${product.images && product.images.length > 0 ? product.images[currentImageIndex[product.id] || 0] : 'https://placehold.co/300x200/cccccc/333333?text=No+Image'}" 
                     alt="${product.name}" 
                     onerror="this.onerror=null;this.src='https://placehold.co/300x200/cccccc/333333?text=No+Image';">
                ${product.images && product.images.length > 1 ? `
                    <div class="image-dots">
                        ${product.images.map((_, index) => `
                            <div class="dot ${index === (currentImageIndex[product.id] || 0) ? 'active' : ''}"
                                 onclick="setImage(${product.id}, ${index})"></div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price.toLocaleString()} ${CONFIG.currency}</div>
                <div class="product-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
                        <span class="quantity" id="quantity-${product.id}">${productQuantities[product.id] || 1}</span>
                        <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">В корзину</button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Фильтрует и отображает товары по выбранной категории.
 * @param {string} category - Идентификатор категории.
 */
function showCategory(category) {
    console.log("Выбрана категория:", category); // Отладочное сообщение
    currentCategory = category;
    displayProducts();
}

/**
 * Изменяет текущее изображение для продукта в карусели.
 * @param {number} productId - ID продукта.
 * @param {number} direction - Направление изменения (-1 для назад, 1 для вперед).
 */
function changeImage(productId, direction) {
    const product = CONFIG.products.find(p => p.id === productId);
    if (!product || !product.images || product.images.length <= 1) return;
    
    currentImageIndex[productId] = (currentImageIndex[productId] + direction + product.images.length) % product.images.length;
    displayProducts(); // Перерисовываем товары, чтобы обновить изображение
}

/**
 * Устанавливает конкретное изображение для продукта по индексу.
 * @param {number} productId - ID продукта.
 * @param {number} index - Индекс изображения для установки.
 */
function setImage(productId, index) {
    const product = CONFIG.products.find(p => p.id === productId);
    if (!product || !product.images || index < 0 || index >= product.images.length) return;

    currentImageIndex[productId] = index;
    displayProducts(); // Перерисовываем товары
}

/**
 * Изменяет количество товара перед добавлением в корзину.
 * @param {number} productId - ID продукта.
 * @param {number} change - Изменение количества (-1 или 1).
 */
function changeQuantity(productId, change) {
    const newQuantity = (productQuantities[productId] || 1) + change;
    if (newQuantity >= 1) {
        productQuantities[productId] = newQuantity;
        const quantityElement = document.getElementById(`quantity-${productId}`);
        if (quantityElement) {
            quantityElement.textContent = newQuantity;
        }
    }
}

/**
 * Добавляет товар в корзину.
 * @param {number} productId - ID продукта для добавления.
 */
function addToCart(productId) {
    console.log("Добавление в корзину:", productId); // Отладочное сообщение
    const product = CONFIG.products.find(p => p.id === productId);
    const quantity = productQuantities[productId] || 1;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    updateCartCount();
    showSuccessMessage("Товар добавлен в корзину!");
    productQuantities[productId] = 1; // Сбрасываем количество на карточке товара до 1
    displayProducts(); // Перерисовываем, чтобы обновить количество на карточке
}

/**
 * Обновляет отображаемое количество товаров в кнопке корзины.
 */
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

/**
 * Открывает модальное окно корзины и отображает ее содержимое.
 */
function openCart() {
    console.log("Открытие корзины."); // Отладочное сообщение
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');
    const orderForm = document.getElementById('order-form');

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Ваша корзина пуста 😔</h3>
                <p>Добавьте что-нибудь, чтобы оформить заказ!</p>
            </div>
        `;
        cartTotalContainer.style.display = 'none';
        orderForm.style.display = 'none';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.images && item.images.length > 0 ? item.images[0] : 'https://placehold.co/60x60/cccccc/333333?text=No+Image'}" 
                         alt="${item.name}" 
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;" 
                         onerror="this.onerror=null;this.src='https://placehold.co/60x60/cccccc/333333?text=No+Image';">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} ${CONFIG.currency} x ${item.quantity} = ${(item.price * item.quantity).toLocaleString()} ${CONFIG.currency}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="changeCartItemQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeCartItemQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">&times;</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        updateCartTotal();
        cartTotalContainer.style.display = 'block';
        orderForm.style.display = 'block';
    }

    cartModal.classList.add('active');
}

/**
 * Изменяет количество товара непосредственно в корзине.
 * @param {number} productId - ID продукта.
 * @param {number} change - Изменение количества (-1 или 1).
 */
function changeCartItemQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const item = cart[itemIndex];
        const newQuantity = item.quantity + change;
        if (newQuantity >= 1) {
            item.quantity = newQuantity;
        } else {
            cart.splice(itemIndex, 1);
        }
        openCart(); // Перерисовываем корзину
        updateCartCount(); // Обновляем счетчик на кнопке корзины
    }
}

/**
 * Удаляет товар из корзины.
 * @param {number} productId - ID продукта для удаления.
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    openCart(); // Перерисовываем корзину
    updateCartCount(); // Обновляем счетчик на кнопке корзины
    showSuccessMessage("Товар удален из корзины.");
}

/**
 * Обновляет общую сумму в корзине.
 */
function updateCartTotal() {
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('total-price').textContent = `${totalPrice.toLocaleString()} ${CONFIG.currency}`;
}

/**
 * Закрывает модальное окно корзины.
 */
function closeCart() {
    document.getElementById('cart-modal').classList.remove('active');
}

/**
 * Показывает временное сообщение об успехе.
 * @param {string} message - Текст сообщения.
 */
function showSuccessMessage(message) {
    const successMessageElement = document.getElementById('success-message');
    successMessageElement.textContent = `✅ ${message}`;
    successMessageElement.classList.add('show');
    setTimeout(() => {
        successMessageElement.classList.remove('show');
    }, 2000); // Сообщение исчезнет через 2 секунды
}

/**
 * Обрабатывает оформление заказа.
 */
function placeOrder() {
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const deliveryAddress = document.getElementById('delivery-address').value;

    if (!customerName || !customerPhone || !deliveryAddress) {
        showSuccessMessage("Пожалуйста, заполните все обязательные поля!");
        return;
    }

    if (cart.length === 0) {
        showSuccessMessage("Ваша корзина пуста. Добавьте товары перед оформлением заказа.");
        return;
    }

    // В реальном приложении здесь будет отправка данных на сервер
    console.log("Заказ оформлен:", {
        customerName,
        customerPhone,
        customerCompany: document.getElementById('customer-company').value,
        deliveryAddress,
        items: cart,
        totalPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });

    cart = [];
    updateCartCount();
    closeCart();
    showSuccessMessage("Заказ успешно оформлен!");
}

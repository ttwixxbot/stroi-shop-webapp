document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    // --- DOM Элементы ---
    const categoryCatalog = document.getElementById('category-catalog');
    const productCatalog = document.getElementById('product-catalog');
    const backToCategoriesButton = document.getElementById('back-to-categories');
    const loader = document.getElementById('loader');
    const cartButton = document.getElementById('cart-button');
    const cartCounter = document.getElementById('cart-counter');
    const cartModal = document.getElementById('cart-modal');
    const closeCartButton = document.getElementById('close-cart-button');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const submitOrderButton = document.getElementById('submit-order-button');
    const nameInput = document.getElementById('name-input'); // Новое поле
    const phoneInput = document.getElementById('phone-input');
    const addressInput = document.getElementById('address-input');
    const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]'); // Новое поле

    // --- Состояние приложения ---
    let allProducts = []; // Все товары из catalog.json
    let allCategories = []; // Все категории из catalog.json
    let cart = []; // Теперь будет хранить объекты { ...product, quantity: N }

    // --- 1. Применение конфигурации ---
    function applyConfig() {
        document.title = config.shopTitle;
        document.getElementById('shop-title').textContent = config.shopTitle;
        const logoImg = document.getElementById('logo-img');
        logoImg.src = config.logoPath;
        logoImg.onerror = () => { logoImg.style.display = 'none'; };
        document.documentElement.style.setProperty('--primary-color', config.primaryColor);
        tg.setHeaderColor(config.primaryColor);
        if (tg.colorScheme === 'dark') {
            document.body.classList.add('telegram-dark-theme');
        }
    }

    // --- 2. Загрузка данных (категорий и товаров) ---
    async function loadData() {
        try {
            loader.style.display = 'block';
            categoryCatalog.style.display = 'none';
            productCatalog.style.display = 'none';
            backToCategoriesButton.style.display = 'none';

            const response = await fetch('catalog.json');
            if (!response.ok) throw new Error(`Ошибка загрузки каталога: ${response.statusText}`);
            const data = await response.json();
            allProducts = data.products;
            allCategories = data.categories;

            renderCategories(); // Показываем категории по умолчанию
        } catch (error) {
            console.error(error);
            loader.textContent = 'Не удалось загрузить данные.';
        } finally {
            loader.style.display = 'none';
        }
    }

    // --- 3. Отображение категорий ---
    function renderCategories() {
        categoryCatalog.innerHTML = '';
        categoryCatalog.style.display = 'grid';
        productCatalog.style.display = 'none';
        backToCategoriesButton.style.display = 'none';

        allCategories.forEach(category => {
            const card = createCategoryCard(category);
            categoryCatalog.appendChild(card);
        });
    }

    // --- 4. Создание карточки категории ---
    function createCategoryCard(category) {
        const card = document.createElement('div');
        card.className = 'category-card';
        // Иконки можно добавить сюда, например, с помощью Font Awesome или SVG
        // Для простоты, пока без иконок, или можно использовать эмодзи:
        const icon = getCategoryIcon(category.id);
        card.innerHTML = `
            <div class="category-icon">${icon}</div>
            <h3 class="category-name">${category.name}</h3>
        `;
        card.addEventListener('click', () => {
            showProductsByCategory(category.id);
        });
        return card;
    }

    // Вспомогательная функция для получения иконок категорий
    function getCategoryIcon(categoryId) {
        switch (categoryId) {
            case 'fasteners': return '🔩'; // Крепёж
            case 'paints': return '🎨'; // Лакокрасочные материалы
            case 'tools': return '🛠️'; // Инструменты
            case 'flooring': return '🏠'; // Напольные покрытия
            case 'dry_mixes': return '🧱'; // Сухие смеси
            case 'electrical': return '⚡'; // Электрика
            case 'plumbing': return '🚿'; // Сантехника
            case 'wood_sheet': return '🪵'; // Дерево и листовые материалы
            case 'doors_windows': return '🚪'; // Двери и Окна
            default: return '📦'; // Прочее
        }
    }

    // --- 5. Отображение товаров по категории ---
    function showProductsByCategory(categoryId) {
        const productsToShow = allProducts.filter(p => p.category === categoryId);
        productCatalog.innerHTML = ''; // Очищаем предыдущие товары
        
        categoryCatalog.style.display = 'none'; // Скрываем категории
        productCatalog.style.display = 'grid'; // Показываем товары
        backToCategoriesButton.style.display = 'block'; // Показываем кнопку "Назад"

        if (productsToShow.length === 0) {
            productCatalog.innerHTML = '<p style="text-align: center; opacity: 0.7; grid-column: 1 / -1;">В этой категории пока нет товаров.</p>';
            return;
        }

        productsToShow.forEach(product => {
            const card = createProductCard(product);
            productCatalog.appendChild(card);
        });
    }

    // --- 6. Создание карточки товара ---
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        const formattedPrice = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(product.price);
        
        // Добавляем элементы для контроля количества на карточке товара
        card.innerHTML = `
            <div class="product-photo">
                <img src="${product.photo}" alt="${product.name}" onerror="this.src='https://placehold.co/600x600?text=Фото';">
            </div>
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">${formattedPrice}</div>
                    <div class="quantity-controls-card">
                        <button class="quantity-btn-card minus" data-product-id="${product.id}">-</button>
                        <span class="item-quantity-card" id="quantity-card-${product.id}">0</span>
                        <button class="quantity-btn-card plus" data-product-id="${product.id}">+</button>
                    </div>
                    <button class="add-to-cart-button" data-product-id="${product.id}">В корзину</button>
                </div>
            </div>
        `;
        
        const addToCartButton = card.querySelector('.add-to-cart-button');
        const quantitySpan = card.querySelector(`#quantity-card-${product.id}`);
        const minusButton = card.querySelector('.quantity-btn-card.minus');
        const plusButton = card.querySelector('.quantity-btn-card.plus');

        let currentQuantity = 0; // Количество для текущей карточки товара

        // Инициализация количества, если товар уже в корзине
        const existingProductInCart = cart.find(p => p.id === product.id);
        if (existingProductInCart) {
            currentQuantity = existingProductInCart.quantity;
            quantitySpan.textContent = currentQuantity;
        }

        plusButton.addEventListener('click', () => {
            currentQuantity++;
            quantitySpan.textContent = currentQuantity;
        });

        minusButton.addEventListener('click', () => {
            if (currentQuantity > 0) {
                currentQuantity--;
                quantitySpan.textContent = currentQuantity;
            }
        });

        addToCartButton.addEventListener('click', () => {
            if (currentQuantity > 0) {
                addToCart(product, currentQuantity);
                currentQuantity = 0; // Сбрасываем счетчик после добавления в корзину
                quantitySpan.textContent = currentQuantity;
            } else {
                tg.showAlert('Выберите количество товара для добавления в корзину!');
            }
        });
        return card;
    }
    
    // --- 7. Логика корзины ---
    function addToCart(product, quantity) {
        const existingProduct = cart.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ ...product, quantity: quantity });
        }
        updateCart();
        tg.HapticFeedback.impactOccurred('light');
        tg.showNotification('success', `Добавлено ${quantity} шт. ${product.name} в корзину!`);
    }

    function changeQuantity(productId, delta) {
        const product = cart.find(p => p.id === productId);
        if (!product) return;

        product.quantity += delta;

        if (product.quantity <= 0) {
            cart = cart.filter(p => p.id !== productId);
        }
        updateCart();
    }

    function removeItemFromCart(productId) {
        cart = cart.filter(p => p.id !== productId);
        updateCart();
        tg.HapticFeedback.impactOccurred('light');
    }

    function updateCart() {
        const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
        cartCounter.textContent = totalItems;
        renderCartItems();
        calculateTotalPrice();
        // Обновляем состояние главной кнопки Telegram
        if (totalItems > 0) {
            tg.MainButton.setText(`Оформить заказ (${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(calculateTotalPriceRaw())})`);
            tg.MainButton.show();
        } else {
            tg.MainButton.hide();
        }
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        const orderForm = document.getElementById('order-form');
        const cartSummary = document.querySelector('.cart-summary');

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; opacity: 0.7;">Ваша корзина пуста.</p>';
            orderForm.style.display = 'none';
            cartSummary.style.display = 'none';
            return;
        }
        
        orderForm.style.display = 'block';
        cartSummary.style.display = 'block';

        cart.forEach(product => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            const formattedPrice = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(product.price);
            itemEl.innerHTML = `
                <img src="${product.photo}" class="cart-item-img" alt="${product.name}" onerror="this.src='https://placehold.co/600x600?text=Фото';">
                <div class="cart-item-details">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">${formattedPrice}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" data-product-id="${product.id}" data-delta="-1">-</button>
                    <span class="item-quantity">${product.quantity}</span>
                    <button class="quantity-btn" data-product-id="${product.id}" data-delta="1">+</button>
                </div>
                <button class="remove-item-btn" data-product-id="${product.id}">🗑️</button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        // Добавляем слушатели событий для кнопок количества и удаления
        cartItemsContainer.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId, 10);
                const delta = parseInt(e.target.dataset.delta, 10);
                changeQuantity(productId, delta);
            });
        });

        cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId, 10);
                removeItemFromCart(productId);
            });
        });
    }

    function calculateTotalPriceRaw() {
        return cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    }

    function calculateTotalPrice() {
        const total = calculateTotalPriceRaw();
        const formattedTotal = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(total);
        cartTotalPriceEl.textContent = formattedTotal;
    }

    // --- 8. Управление модальным окном ---
    cartButton.addEventListener('click', () => {
        cartModal.style.display = 'flex';
        renderCartItems();
    });

    closeCartButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // --- 9. Отправка заказа ---
    submitOrderButton.addEventListener('click', () => {
        sendOrder();
    });

    // Привязываем основную кнопку Telegram к отправке заказа
    tg.MainButton.onClick(sendOrder);

    function sendOrder() {
        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();
        let paymentMethod = '';
        paymentMethodRadios.forEach(radio => {
            if (radio.checked) {
                paymentMethod = radio.value;
            }
        });

        if (cart.length === 0) {
            tg.showAlert('Ваша корзина пуста!');
            return;
        }
        if (!name || !phone || !address) {
            tg.showAlert('Пожалуйста, заполните все поля: Ваше имя, номер телефона и адрес доставки.');
            return;
        }

        const orderData = {
            items: cart.map(p => ({ id: p.id, name: p.name, price: p.price, quantity: p.quantity })),
            totalPrice: calculateTotalPriceRaw(),
            customer: {
                name: name,
                phone: phone,
                address: address,
                paymentMethod: paymentMethod
            },
            orderDate: new Date().toISOString()
        };

        tg.sendData(JSON.stringify(orderData));
        tg.showAlert('Данные заказа отправлены в Telegram! Мы свяжемся с вами в ближайшее время.');
        tg.close();
    }

    // --- Инициализация и запуск приложения ---
    applyConfig();
    loadData();

    // Обработчик для кнопки "Назад к категориям"
    backToCategoriesButton.addEventListener('click', () => {
        renderCategories();
    });
});

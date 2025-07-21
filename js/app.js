// ===============================================
// ОСНОВНАЯ ЛОГИКА МАГАЗИНА
// ===============================================

class ShopApp {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.cart = [];
        this.allProducts = [];
        this.currentCategory = 'Все товары';
        
        this.initTelegram();
        this.initDOM();
        this.initEventListeners();
        this.init();
    }

    // Инициализация Telegram Web App
    initTelegram() {
        if (this.tg) {
            this.tg.ready();
            this.tg.expand();
            if (this.tg.colorScheme === 'dark') {
                document.body.classList.add('telegram-dark-theme');
            }
        }
    }

    // Инициализация DOM элементов
    initDOM() {
        this.elements = {
            catalogContainer: document.getElementById('product-catalog'),
            loader: document.getElementById('loader'),
            cartButton: document.getElementById('cart-button'),
            cartCounter: document.getElementById('cart-counter'),
            cartModal: document.getElementById('cart-modal'),
            closeCartButton: document.getElementById('close-cart-button'),
            cartItemsContainer: document.getElementById('cart-items-container'),
            cartTotalPriceEl: document.getElementById('cart-total-price'),
            submitOrderButton: document.getElementById('submit-order-button'),
            customerNameInput: document.getElementById('customer-name-input'),
            organizationInput: document.getElementById('organization-input'),
            phoneInput: document.getElementById('phone-input'),
            addressInput: document.getElementById('address-input'),
            categoriesContainer: document.getElementById('categories-container'),
            orderForm: document.getElementById('order-form'),
            cartSummary: document.querySelector('.cart-summary')
        };
    }

    // Инициализация обработчиков событий
    initEventListeners() {
        // Корзина
        this.elements.cartButton.addEventListener('click', () => this.openCart());
        this.elements.closeCartButton.addEventListener('click', () => this.closeCart());
        this.elements.cartModal.addEventListener('click', (e) => {
            if (e.target === this.elements.cartModal) this.closeCart();
        });

        // Форма заказа
        this.elements.submitOrderButton.addEventListener('click', () => this.submitOrder());

        // Клавиатура
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.cartModal.style.display === 'flex') {
                this.closeCart();
            }
        });
    }

    // Инициализация приложения
    async init() {
        this.applyConfig();
        this.loadCustomerData(); // Загружаем сохраненные данные клиента
        this.renderCategories();
        await this.loadProducts();
        this.filterProductsByCategory(this.currentCategory);
    }

    // Применение конфигурации
    applyConfig() {
        document.title = SHOP_CONFIG.shopTitle;
        document.getElementById('shop-title').textContent = SHOP_CONFIG.shopTitle;
        
        const logoImg = document.getElementById('logo-img');
        logoImg.src = SHOP_CONFIG.logoPath;
        logoImg.onerror = () => { logoImg.style.display = 'none'; };
        
        // Применение цветов
        const root = document.documentElement;
        root.style.setProperty('--primary-color', SHOP_CONFIG.colors.primary);
        root.style.setProperty('--secondary-color', SHOP_CONFIG.colors.secondary);
        root.style.setProperty('--accent-color', SHOP_CONFIG.colors.accent);
        root.style.setProperty('--success-color', SHOP_CONFIG.colors.success);

        // Обновление заголовков секций
        document.querySelector('.categories-section .section-title').textContent = SHOP_CONFIG.sectionTitles.categories;
        document.querySelector('.products-section .section-title').textContent = SHOP_CONFIG.sectionTitles.products;
    }

    // Встроенный каталог товаров (для надежности)
    getEmbeddedCatalog() {
        return [
            {
                "id": 1,
                "sku": "SHR-3545-001",
                "name": "Шурупы универсальные 3,5x45",
                "description": "Шурупы высокого качества для крепления различных материалов. Подходят для дерева, гипсокартона.",
                "price": 34.30,
                "photo": "https://images.unsplash.com/photo-1609205292622-0d43b9e24f11?w=300&h=300&fit=crop",
                "category": "Крепеж"
            },
            {
                "id": 2,
                "sku": "SAM-4216-002",
                "name": "Саморезы по металлу 4,2x16",
                "description": "Саморезы для крепления листового металла, профилей. Острый наконечник, надежная фиксация.",
                "price": 32.99,
                "photo": "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=300&fit=crop",
                "category": "Крепеж"
            },
            {
                "id": 3,
                "sku": "KRA-10L-003",
                "name": "Краска водоэмульсионная белая 10л",
                "description": "Высококачественная водоэмульсионная краска для внутренних работ. Хорошая укрывистость.",
                "price": 478.60,
                "photo": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=300&fit=crop",
                "category": "Лакокрасочные"
            },
            {
                "id": 4,
                "sku": "GRU-5L-004",
                "name": "Грунтовка глубокого проникновения 5л",
                "description": "Акриловая грунтовка для укрепления основания перед покраской или поклейкой обоев.",
                "price": 346.00,
                "photo": "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=300&h=300&fit=crop",
                "category": "Лакокрасочные"
            },
            {
                "id": 5,
                "sku": "KLE-PVA-005",
                "name": "Клей ПВА строительный 1кг",
                "description": "Универсальный клей для строительных и ремонтных работ. Экологически чистый.",
                "price": 123.00,
                "photo": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop",
                "category": "Лакокрасочные"
            },
            {
                "id": 6,
                "sku": "DRL-850W-006",
                "name": "Дрель ударная 850Вт",
                "description": "Профессиональная ударная дрель с регулировкой оборотов. В комплекте набор сверл.",
                "price": 1650.00,
                "photo": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=300&fit=crop",
                "category": "Инструменты"
            },
            {
                "id": 7,
                "sku": "BOL-125-007",
                "name": "Болгарка 125мм 900Вт",
                "description": "Углошлифовальная машина для резки и шлифовки металла, камня. Защитный кожух в комплекте.",
                "price": 404.90,
                "photo": "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop",
                "category": "Инструменты"
            },
            {
                "id": 8,
                "sku": "PER-SDS-008",
                "name": "Перфоратор SDS-Plus 800Вт",
                "description": "Мощный перфоратор для сверления отверстий в бетоне и кирпиче. 3 режима работы.",
                "price": 1332.00,
                "photo": "https://images.unsplash.com/photo-1609205292622-0d43b9e24f11?w=300&h=300&fit=crop",
                "category": "Инструменты"
            },
            {
                "id": 9,
                "sku": "CEM-M500-009",
                "name": "Цемент М500 50кг",
                "description": "Портландцемент марки 500 для приготовления бетона, растворов. Высокое качество.",
                "price": 160.10,
                "photo": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
                "category": "Стройматериалы"
            },
            {
                "id": 10,
                "sku": "PLI-KER-010",
                "name": "Плитка керамическая 20x30см",
                "description": "Качественная керамическая плитка для ванной и кухни. Влагостойкая, легко моется.",
                "price": 360.90,
                "photo": "https://images.unsplash.com/photo-1584622615551-44b7b1b3b9ad?w=300&h=300&fit=crop",
                "category": "Стройматериалы"
            },
            {
                "id": 11,
                "sku": "KAB-VVG-011",
                "name": "Кабель ВВГ 3x2,5 мм²",
                "description": "Медный кабель для внутренней проводки. Надежная изоляция, соответствует ГОСТ.",
                "price": 175.20,
                "photo": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
                "category": "Электрика"
            },
            {
                "id": 12,
                "sku": "ROZ-ZEM-012",
                "name": "Розетка с заземлением белая",
                "description": "Электрическая розетка с заземляющим контактом. Современный дизайн, надежная конструкция.",
                "price": 163.20,
                "photo": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
                "category": "Электрика"
            },
            {
                "id": 13,
                "sku": "DVR-80CM-013",
                "name": "Дверь межкомнатная 80см",
                "description": "Межкомнатная дверь из массива сосны. Экологически чистая, красивая текстура.",
                "price": 2450.00,
                "photo": "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=300&fit=crop",
                "category": "Двери и окна"
            },
            {
                "id": 14,
                "sku": "ZAM-VRZ-014",
                "name": "Замок врезной с ключами",
                "description": "Надежный врезной замок для межкомнатных дверей. В комплекте 3 ключа.",
                "price": 256.10,
                "photo": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop",
                "category": "Двери и окна"
            },
            {
                "id": 15,
                "sku": "GIP-125-015",
                "name": "Гипсокартон 12,5мм 1200x2500",
                "description": "Гипсокартонный лист для внутренней отделки. Идеально ровная поверхность.",
                "price": 447.30,
                "photo": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
                "category": "Стройматериалы"
            }
        ];
    }

    // Загрузка товаров
    async loadProducts() {
        try {
            this.showLoader();
            console.log('Начинаем загрузку товаров...');
            
            // Используем встроенный каталог
            console.log('Используем встроенный каталог товаров...');
            this.allProducts = this.getEmbeddedCatalog();
            console.log('Загружено товаров:', this.allProducts.length);
            
            if (this.allProducts.length === 0) {
                console.log('Встроенный каталог пуст, используем тестовые данные...');
                this.allProducts = this.getTestProducts();
                console.log('Загружено тестовых товаров:', this.allProducts.length);
            }
            
            // Небольшая задержка для демонстрации загрузки
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.renderProducts(this.allProducts);
            console.log('Товары успешно отрендерены');
            
        } catch (error) {
            console.error('Критическая ошибка загрузки товаров:', error);
            this.showError('Не удалось загрузить товары: ' + error.message);
        } finally {
            this.hideLoader();
        }
    }

    // Тестовые данные (fallback)
    getTestProducts() {
        return [
            { id: 1, sku: "SHR-3545-001", name: "Шурупы универсальные 3,5x45", description: "Шурупы высокого качества для крепления различных материалов", price: 34.30, photo: "https://images.unsplash.com/photo-1609205292622-0d43b9e24f11?w=300&h=300&fit=crop", category: "Крепеж" },
            { id: 2, sku: "SAM-4216-002", name: "Саморезы по металлу 4,2x16", description: "Саморезы для крепления листового металла, профилей", price: 32.99, photo: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=300&fit=crop", category: "Крепеж" },
            { id: 3, sku: "KRA-10L-003", name: "Краска водоэмульсионная белая 10л", description: "Высококачественная водоэмульсионная краска для внутренних работ", price: 478.60, photo: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=300&fit=crop", category: "Лакокрасочные" },
            { id: 4, sku: "GRU-5L-004", name: "Грунтовка глубокого проникновения 5л", description: "Акриловая грунтовка для укрепления основания", price: 346.00, photo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=300&h=300&fit=crop", category: "Лакокрасочные" },
            { id: 5, sku: "KLE-PVA-005", name: "Клей ПВА строительный 1кг", description: "Универсальный клей для строительных работ", price: 123.00, photo: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop", category: "Лакокрасочные" },
            { id: 6, sku: "DRL-850W-006", name: "Дрель ударная 850Вт", description: "Профессиональная ударная дрель с регулировкой оборотов", price: 1650.00, photo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=300&fit=crop", category: "Инструменты" },
            { id: 7, sku: "BOL-125-007", name: "Болгарка 125мм 900Вт", description: "Углошлифовальная машина для резки и шлифовки", price: 404.90, photo: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop", category: "Инструменты" },
            { id: 8, sku: "PER-SDS-008", name: "Перфоратор SDS-Plus 800Вт", description: "Мощный перфоратор для сверления отверстий в бетоне", price: 1332.00, photo: "https://images.unsplash.com/photo-1609205292622-0d43b9e24f11?w=300&h=300&fit=crop", category: "Инструменты" },
            { id: 9, sku: "CEM-M500-009", name: "Цемент М500 50кг", description: "Портландцемент марки 500 для приготовления бетона", price: 160.10, photo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop", category: "Стройматериалы" },
            { id: 10, sku: "PLI-KER-010", name: "Плитка керамическая 20x30см", description: "Качественная керамическая плитка для ванной и кухни", price: 360.90, photo: "https://images.unsplash.com/photo-1584622615551-44b7b1b3b9ad?w=300&h=300&fit=crop", category: "Стройматериалы" },
            { id: 11, sku: "KAB-VVG-011", name: "Кабель ВВГ 3x2,5 мм²", description: "Медный кабель для внутренней проводки", price: 175.20, photo: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop", category: "Электрика" },
            { id: 12, sku: "ROZ-ZEM-012", name: "Розетка с заземлением белая", description: "Электрическая розетка с заземляющим контактом", price: 163.20, photo: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=300&fit=crop", category: "Электрика" }
        ];
    }

    // Показать загрузчик
    showLoader() {
        this.elements.loader.style.display = 'block';
        this.elements.catalogContainer.style.display = 'none';
    }

    // Скрыть загрузчик
    // Загрузка сохраненных данных клиента
    loadCustomerData() {
        try {
            // Получаем данные пользователя Telegram
            const tgUser = this.tg?.initDataUnsafe?.user;
            const userId = tgUser?.id;
            
            if (userId) {
                // Создаем ключ для хранения данных конкретного пользователя
                const storageKey = `customer_data_${userId}`;
                const savedData = this.getFromStorage(storageKey);
                
                if (savedData) {
                    // Автоматически заполняем поля формы
                    if (this.elements.customerNameInput) {
                        this.elements.customerNameInput.value = savedData.name || '';
                    }
                    if (this.elements.organizationInput) {
                        this.elements.organizationInput.value = savedData.organization || '';
                    }
                    if (this.elements.phoneInput) {
                        this.elements.phoneInput.value = savedData.phone || '';
                    }
                    if (this.elements.addressInput) {
                        this.elements.addressInput.value = savedData.address || '';
                    }
                    
                    // Восстанавливаем способ оплаты
                    if (savedData.paymentMethod) {
                        const paymentRadio = document.querySelector(`input[name="payment-method"][value="${savedData.paymentMethod}"]`);
                        if (paymentRadio) {
                            paymentRadio.checked = true;
                        }
                    }
                    
                    // Показываем индикатор сохраненных данных
                    const indicator = document.getElementById('saved-data-indicator');
                    if (indicator) {
                        indicator.style.display = 'block';
                        // Скрываем индикатор через 5 секунд
                        setTimeout(() => {
                            indicator.style.display = 'none';
                        }, 5000);
                    }
                    
                    console.log('Данные клиента загружены:', savedData);
                }
            }
        } catch (error) {
            console.log('Ошибка при загрузке данных клиента:', error);
        }
    }

    // Сохранение данных клиента
    saveCustomerData(customerData) {
        try {
            const tgUser = this.tg?.initDataUnsafe?.user;
            const userId = tgUser?.id;
            
            if (userId) {
                const storageKey = `customer_data_${userId}`;
                this.saveToStorage(storageKey, customerData);
                console.log('Данные клиента сохранены:', customerData);
            }
        } catch (error) {
            console.log('Ошибка при сохранении данных клиента:', error);
        }
    }

    // Универсальные методы для работы с хранилищем
    saveToStorage(key, data) {
        try {
            // Используем переменную в памяти для хранения данных
            if (!window.shopStorage) {
                window.shopStorage = {};
            }
            window.shopStorage[key] = data;
            
            // Дополнительно пытаемся сохранить в Telegram Cloud Storage
            if (this.tg && this.tg.CloudStorage) {
                this.tg.CloudStorage.setItem(key, JSON.stringify(data));
            }
        } catch (error) {
            console.log('Ошибка сохранения в хранилище:', error);
        }
    }

    getFromStorage(key) {
        try {
            // Сначала проверяем переменную в памяти
            if (window.shopStorage && window.shopStorage[key]) {
                return window.shopStorage[key];
            }
            
            // Затем пытаемся получить из Telegram Cloud Storage
            if (this.tg && this.tg.CloudStorage) {
                this.tg.CloudStorage.getItem(key, (error, result) => {
                    if (!error && result) {
                        try {
                            const data = JSON.parse(result);
                            if (!window.shopStorage) {
                                window.shopStorage = {};
                            }
                            window.shopStorage[key] = data;
                            this.loadCustomerData(); // Перезагружаем данные
                        } catch (e) {
                            console.log('Ошибка парсинга данных из CloudStorage:', e);
                        }
                    }
                });
            }
            
            return null;
        } catch (error) {
            console.log('Ошибка получения из хранилища:', error);
            return null;
        }
    }

    // Скрыть загрузчик
    hideLoader() {
        this.elements.loader.style.display = 'none';
        this.elements.catalogContainer.style.display = 'grid';
    }

    // Показать ошибку
    showError(message) {
        this.elements.loader.innerHTML = `
            <div style="text-align: center; color: white;">
                <div style="font-size: 48px; margin-bottom: 16px;">😞</div>
                <p>${message}</p>
            </div>
        `;
    }

    // Отображение товаров
    renderProducts(productsToRender) {
        console.log('Рендеринг товаров:', productsToRender.length);
        this.elements.catalogContainer.innerHTML = '';
        
        if (!productsToRender || productsToRender.length === 0) {
            console.log('Нет товаров для отображения');
            this.elements.catalogContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: white;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🤷‍♂️</div>
                    <p style="font-size: 18px; opacity: 0.8;">${SHOP_CONFIG.messages.noProducts}</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: rgba(255,255,255,0.2); border: none; border-radius: 8px; color: white; cursor: pointer;">🔄 Перезагрузить</button>
                </div>
            `;
            return;
        }
        
        console.log('Создаем карточки товаров...');
        productsToRender.forEach((product, index) => {
            console.log(`Создаем карточку для товара ${index + 1}:`, product.name);
            const card = this.createProductCard(product);
            if (SHOP_CONFIG.animation.enabled) {
                card.style.animationDelay = `${index * SHOP_CONFIG.animation.staggerDelay}ms`;
            }
            this.elements.catalogContainer.appendChild(card);
        });
        console.log('Все карточки товаров созданы');
    }

    // Создание карточки товара
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const formattedPrice = this.formatPrice(product.price);
        
        card.innerHTML = `
            <div class="product-photo">
                <img src="${product.photo}" alt="${product.name}" 
                     onerror="this.src='https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=300&fit=crop';">
            </div>
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">${formattedPrice}</div>
                    <button class="add-to-cart-button">В корзину</button>
                </div>
            </div>
        `;
        
        const addToCartButton = card.querySelector('.add-to-cart-button');
        addToCartButton.addEventListener('click', () => {
            this.addToCart(product);
            this.animateAddToCart(addToCartButton);
        });
        
        return card;
    }

    // Анимация добавления в корзину
    animateAddToCart(button) {
        const originalText = button.textContent;
        button.style.transform = 'scale(0.9)';
        button.textContent = SHOP_CONFIG.messages.addedToCart;
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.textContent = originalText;
        }, 500);
    }

    // Форматирование цены
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: SHOP_CONFIG.currency.code,
            minimumFractionDigits: 0
        }).format(price);
    }

    // Логика корзины
    addToCart(product) {
        const existingProduct = this.cart.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.updateCart();
        
        // Тактильная обратная связь
        if (this.tg && this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('light');
        }
    }

    changeQuantity(productId, delta) {
        const product = this.cart.find(p => p.id === productId);
        if (!product) return;

        product.quantity += delta;

        if (product.quantity <= 0) {
            this.cart = this.cart.filter(p => p.id !== productId);
        }
        this.updateCart();
    }

    updateCart() {
        const totalItems = this.cart.reduce((sum, product) => sum + product.quantity, 0);
        this.elements.cartCounter.textContent = totalItems;
        this.elements.cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
        this.renderCartItems();
        this.calculateTotalPrice();
    }

    renderCartItems() {
        this.elements.cartItemsContainer.innerHTML = '';

        if (this.cart.length === 0) {
            this.elements.cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: white;">
                    <div style="font-size: 64px; margin-bottom: 16px;">🛒</div>
                    <p style="font-size: 18px; opacity: 0.8;">${SHOP_CONFIG.messages.emptyCart}</p>
                    <p style="font-size: 14px; opacity: 0.6; margin-top: 8px;">${SHOP_CONFIG.messages.emptyCartDescription}</p>
                </div>
            `;
            this.elements.orderForm.style.display = 'none';
            this.elements.cartSummary.style.display = 'none';
            return;
        }
        
        this.elements.orderForm.style.display = 'block';
        this.elements.cartSummary.style.display = 'block';

        this.cart.forEach(product => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            const formattedPrice = this.formatPrice(product.price);
            
            itemEl.innerHTML = `
                <img src="${product.photo}" class="cart-item-img" alt="${product.name}" 
                     onerror="this.src='https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=100&h=100&fit=crop';">
                <div class="cart-item-details">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">${formattedPrice}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" data-product-id="${product.id}" data-delta="-1">−</button>
                    <span class="item-quantity">${product.quantity}</span>
                    <button class="quantity-btn" data-product-id="${product.id}" data-delta="1">+</button>
                </div>
            `;
            this.elements.cartItemsContainer.appendChild(itemEl);
        });

        // Добавляем обработчики для кнопок количества
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId, 10);
                const delta = parseInt(e.target.dataset.delta, 10);
                this.changeQuantity(productId, delta);
            });
        });
    }

    calculateTotalPrice() {
        const total = this.cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        const formattedTotal = this.formatPrice(total);
        this.elements.cartTotalPriceEl.textContent = formattedTotal;
    }

    // Управление модальным окном корзины
    openCart() {
        this.elements.cartModal.style.display = 'flex';
        this.renderCartItems();
        
        // Проверяем, что у нас есть доступ к элементу формы
        setTimeout(() => {
            this.loadCustomerData();
        }, 100);
    }

    closeCart() {
        this.elements.cartModal.style.display = 'none';
    }

    // Отправка заказа
    submitOrder() {
        const customerName = this.elements.customerNameInput.value.trim();
        const organization = this.elements.organizationInput.value.trim();
        const phone = this.elements.phoneInput.value.trim();
        const address = this.elements.addressInput.value.trim();
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        if (this.cart.length === 0) {
            this.showAlert(SHOP_CONFIG.messages.emptyCart);
            return;
        }
        
        if (!customerName || !phone || !address) {
            this.showAlert(SHOP_CONFIG.messages.fillRequiredFields);
            return;
        }

        // Сохраняем данные клиента для будущих заказов
        const customerData = {
            name: customerName,
            organization: organization,
            phone: phone,
            address: address,
            paymentMethod: paymentMethod
        };
        this.saveCustomerData(customerData);

        // Получаем данные пользователя Telegram
        const tgUser = this.tg?.initDataUnsafe?.user || {};
        
        const orderData = {
            items: this.cart.map(p => ({ 
                id: p.id, 
                sku: p.sku, // Добавляем артикул для админа
                name: p.name, 
                price: p.price, 
                quantity: p.quantity 
            })),
            totalPrice: this.cart.reduce((sum, p) => sum + (p.price * p.quantity), 0),
            customer: {
                name: customerName,
                organization: organization || 'Не указана',
                phone: phone,
                address: address,
                paymentMethod: this.getPaymentMethodLabel(paymentMethod),
                telegramId: tgUser.id || null,
                telegramUsername: tgUser.username || null,
                telegramFirstName: tgUser.first_name || null,
                telegramLastName: tgUser.last_name || null
            },
            orderDate: new Date().toISOString(),
            shopInfo: {
                name: SHOP_CONFIG.shopTitle,
                contact: SHOP_CONFIG.contact
            }
        };

        this.processOrder(orderData);
    }

    getPaymentMethodLabel(value) {
        const method = SHOP_CONFIG.paymentMethods.find(m => m.value === value);
        return method ? method.label : 'Наличными';
    }

    processOrder(orderData) {
        // Анимация отправки
        this.elements.submitOrderButton.innerHTML = SHOP_CONFIG.messages.sending;
        this.elements.submitOrderButton.disabled = true;

        setTimeout(() => {
            if (this.tg && this.tg.sendData) {
                this.tg.sendData(JSON.stringify(orderData));
            } else {
                console.log('Данные заказа:', orderData);
            }
            
            this.showAlert(SHOP_CONFIG.messages.orderSuccess);

            // Очищаем корзину и форму
            this.cart = [];
            this.updateCart();
            this.clearOrderForm();
            this.closeCart();
            
            this.elements.submitOrderButton.innerHTML = '✅ Оформить заказ';
            this.elements.submitOrderButton.disabled = false;

            if (this.tg && this.tg.close) {
                setTimeout(() => this.tg.close(), 1000);
            }
        }, 1500);
    }

    clearOrderForm() {
        this.elements.customerNameInput.value = '';
        this.elements.organizationInput.value = '';
        this.elements.phoneInput.value = '';
        this.elements.addressInput.value = '';
    }

    showAlert(message) {
        if (this.tg && this.tg.showAlert) {
            this.tg.showAlert(message);
        } else {
            alert(message);
        }
    }

    // Логика категорий
    renderCategories() {
        this.elements.categoriesContainer.innerHTML = '';
        
        // Фильтруем только включенные категории
        const enabledCategories = CATEGORIES.filter(cat => cat.enabled);
        
        enabledCategories.forEach((category, index) => {
            const button = document.createElement('div');
            button.className = 'category-button';
            
            if (SHOP_CONFIG.animation.enabled) {
                button.style.animationDelay = `${index * SHOP_CONFIG.animation.staggerDelay}ms`;
            }
            
            if (category.name === this.currentCategory) {
                button.classList.add('active');
            }
            
            button.innerHTML = `
                <span class="category-icon">${category.icon}</span>
                <span class="category-name">${category.name}</span>
                <span class="category-description">${category.description}</span>
            `;
            
            button.addEventListener('click', () => {
                this.filterProductsByCategory(category.name);
                document.querySelectorAll('.category-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
            });
            
            this.elements.categoriesContainer.appendChild(button);
        });
    }

    filterProductsByCategory(categoryName) {
        this.currentCategory = categoryName;
        let filtered = [];

        if (categoryName === 'Все товары') {
            filtered = this.allProducts;
        } else {
            const selectedCategory = CATEGORIES.find(cat => cat.name === categoryName);
            if (selectedCategory && selectedCategory.keywords.length > 0) {
                filtered = this.allProducts.filter(product => {
                    const productNameLower = product.name.toLowerCase();
                    const productDescriptionLower = product.description.toLowerCase();
                    return selectedCategory.keywords.some(keyword => 
                        productNameLower.includes(keyword.toLowerCase()) || 
                        productDescriptionLower.includes(keyword.toLowerCase())
                    );
                });
            } else {
                filtered = [];
            }
        }
        this.renderProducts(filtered);
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new ShopApp();
});

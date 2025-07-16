document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    // --- DOM Элементы ---
    const catalogContainer = document.getElementById('product-catalog');
    const loader = document.getElementById('loader');
    const cartButton = document.getElementById('cart-button');
    const cartCounter = document.getElementById('cart-counter');
    const cartModal = document.getElementById('cart-modal');
    const closeCartButton = document.getElementById('close-cart-button');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const submitOrderButton = document.getElementById('submit-order-button');
    const customerNameInput = document.getElementById('customer-name-input'); // Новое поле для имени
    const phoneInput = document.getElementById('phone-input');
    const addressInput = document.getElementById('address-input');
    const categoriesContainer = document.getElementById('categories-container'); // Новый контейнер для категорий

    // --- Состояние приложения ---
    let cart = []; // Теперь будет хранить объекты { ...product, quantity: N }
    let allProducts = []; // Для хранения всех загруженных товаров
    let currentCategory = 'Все товары'; // Текущая активная категория

    // --- Определение категорий и их ключевых слов ---
    // Используем ключевые слова для фильтрации товаров из catalog.json
    const categories = [
        { name: 'Все товары', icon: '✨', description: 'Показать все доступные товары', keywords: [] },
        { name: 'Крепеж', icon: '🔨', description: 'Шурупы, саморезы, гвозди', keywords: ['шурупы', 'саморезы', 'гвозди', 'анкер', 'петли', 'замок'] },
        { name: 'Лакокрасочные', icon: '🎨', description: 'Краски, грунтовки, клеи', keywords: ['краска', 'грунтовка', 'клей', 'герметик', 'эмаль', 'пена монтажная'] },
        { name: 'Инструменты', icon: '🛠️', description: 'Дрели, молотки, отвертки', keywords: ['дрель', 'болгарка', 'перфоратор', 'отвёртка', 'молоток', 'уровень', 'лобзик', 'наждачная бумага', 'шуруповерт', 'сверло', 'кисть малярная', 'валик'] },
        { name: 'Стройматериалы', icon: '🧱', description: 'Цемент, плитка, гипсокартон', keywords: ['цемент', 'шпатлёвка', 'плитка', 'керамогранит', 'ламинат', 'скотч', 'стяжка', 'трубы пвх', 'фанера', 'гипсокартон', 'профиль', 'штукатурка', 'сетка армирующая', 'плиточный клей', 'плинтус', 'мешок строительный'] },
        { name: 'Электрика', icon: '⚡', description: 'Кабели, выключатели', keywords: ['кабель', 'розетка', 'выключатель', 'удлинитель'] },
        { name: 'Фурнитура', icon: '🚪', description: 'Замки, петли', keywords: ['замок', 'петли'] },
        // Добавлены категории из изображений, но без соответствующих товаров в catalog.json
        { name: 'Электроника', icon: '📱', description: 'Смартфоны, планшеты', keywords: [] },
        { name: 'Одежда', icon: '👕', description: 'Модная одежда', keywords: [] },
        { name: 'Книги', icon: '📚', description: 'Интересные книги', keywords: [] },
        { name: 'Дом', icon: '🏡', description: 'Товары для дома', keywords: [] },
    ];

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

    // --- 2. Загрузка и отображение товаров ---
    async function loadProducts() {
        try {
            loader.style.display = 'block';
            catalogContainer.style.display = 'none';
            const response = await fetch('catalog.json');
            if (!response.ok) throw new Error(`Ошибка загрузки каталога: ${response.statusText}`);
            allProducts = await response.json(); // Сохраняем все товары
            renderProducts(allProducts); // Изначально отображаем все товары
        } catch (error) {
            console.error(error);
            loader.textContent = 'Не удалось загрузить товары.';
        } finally {
            loader.style.display = 'none';
            catalogContainer.style.display = 'grid';
        }
    }

    // --- 3. Создание и отображение карточек товаров ---
    function renderProducts(productsToRender) {
        catalogContainer.innerHTML = ''; // Очищаем каталог перед рендерингом
        if (productsToRender.length === 0) {
            catalogContainer.innerHTML = '<p style="text-align: center; width: 100%; opacity: 0.7;">В этой категории пока нет товаров.</p>';
            return;
        }
        productsToRender.forEach(product => {
            const card = createProductCard(product);
            catalogContainer.appendChild(card);
        });
    }

    // --- 4. Создание карточки товара ---
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        const formattedPrice = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(product.price);
        card.innerHTML = `
            <div class="product-photo">
                <img src="${product.photo}" alt="${product.name}" onerror="this.src='https://placehold.co/600x600?text=Фото';">
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
            addToCart(product);
        });
        return card;
    }
    
    // --- 5. Логика корзины ---
    function addToCart(product) {
        const existingProduct = cart.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
        tg.HapticFeedback.impactOccurred('light');
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

    function updateCart() {
        const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
        cartCounter.textContent = totalItems;
        renderCartItems();
        calculateTotalPrice();
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
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId, 10); // Парсим в число
                const delta = parseInt(e.target.dataset.delta, 10);
                changeQuantity(productId, delta);
            });
        });
    }

    function calculateTotalPrice() {
        const total = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        const formattedTotal = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(total);
        cartTotalPriceEl.textContent = formattedTotal;
    }

    // --- 6. Управление модальным окном ---
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

    // --- 7. Отправка заказа ---
    submitOrderButton.addEventListener('click', () => {
        const customerName = customerNameInput.value.trim(); // Получаем имя клиента
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value; // Получаем выбранный способ оплаты

        if (cart.length === 0) {
            tg.showAlert('Ваша корзина пуста!');
            return;
        }
        if (!customerName || !phone || !address) { // Проверяем все поля
            tg.showAlert('Пожалуйста, заполните все поля: Ваше имя, номер телефона и адрес доставки.');
            return;
        }

        const orderData = {
            items: cart.map(p => ({ id: p.id, name: p.name, price: p.price, quantity: p.quantity })),
            totalPrice: cart.reduce((sum, p) => sum + (p.price * p.quantity), 0),
            customer: {
                name: customerName, // Добавляем имя клиента
                phone: phone,
                address: address,
                paymentMethod: paymentMethod === 'cash' ? 'Наличными' : 'Банковской картой' // Добавляем способ оплаты
            },
            orderDate: new Date().toISOString()
        };

        tg.sendData(JSON.stringify(orderData));
        tg.showAlert('Данные заказа отправлены в Telegram!'); // Использование tg.showAlert
        // Очищаем корзину и поля формы после отправки
        cart = [];
        updateCart();
        customerNameInput.value = '';
        phoneInput.value = '';
        addressInput.value = '';
        cartModal.style.display = 'none'; // Закрываем модальное окно
        tg.close(); // Закрываем Web App
    });

    // --- 8. Логика категорий ---
    function renderCategories() {
        categoriesContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('div');
            button.className = 'category-button';
            // Добавляем класс 'active' для текущей выбранной категории
            if (category.name === currentCategory) {
                button.classList.add('active');
            }
            button.innerHTML = `
                <span class="category-icon">${category.icon}</span>
                <span class="category-name">${category.name}</span>
                <span class="category-description">${category.description}</span>
            `;
            button.addEventListener('click', () => {
                filterProductsByCategory(category.name);
                // Обновляем активный класс для кнопок
                document.querySelectorAll('.category-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
            });
            categoriesContainer.appendChild(button);
        });
    }

    function filterProductsByCategory(categoryName) {
        currentCategory = categoryName; // Обновляем текущую категорию
        let filtered = [];

        if (categoryName === 'Все товары') {
            filtered = allProducts;
        } else {
            const selectedCategory = categories.find(cat => cat.name === categoryName);
            if (selectedCategory && selectedCategory.keywords.length > 0) {
                // Фильтруем товары, если их название или описание содержит ключевые слова категории
                filtered = allProducts.filter(product => {
                    const productNameLower = product.name.toLowerCase();
                    const productDescriptionLower = product.description.toLowerCase();
                    return selectedCategory.keywords.some(keyword => 
                        productNameLower.includes(keyword.toLowerCase()) || 
                        productDescriptionLower.includes(keyword.toLowerCase())
                    );
                });
            } else {
                // Если категория не имеет ключевых слов или не найдена, показываем пустой список
                filtered = [];
            }
        }
        renderProducts(filtered); // Отображаем отфильтрованные товары
    }


    // --- Запуск приложения ---
    applyConfig();
    loadProducts().then(() => {
        renderCategories(); // Рендерим категории после загрузки товаров
        filterProductsByCategory(currentCategory); // Применяем фильтр по умолчанию (Все товары)
    });
});

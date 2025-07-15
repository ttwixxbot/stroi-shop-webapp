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
    const phoneInput = document.getElementById('phone-input');
    const addressInput = document.getElementById('address-input');

    // --- Состояние приложения ---
    let cart = []; // Теперь будет хранить объекты { ...product, quantity: N }

    // --- 1. Применение конфигурации ---
    function applyConfig() {
        document.title = config.shopTitle;
        document.getElementById('shop-title').textContent = config.shopTitle;
        const logoImg = document.getElementById('logo-img');
        logoImg.src = config.logoPath;
        logoImg.onerror = () => { logoImg.style.display = 'none'; }; // Скрыть логотип, если не загрузился
        
        // Установка основного цвета и его RGB версии для CSS переменных
        document.documentElement.style.setProperty('--primary-color', config.primaryColor);
        // Преобразуем HEX в RGB для использования в rgba()
        const hexToRgb = (hex) => {
            const bigint = parseInt(hex.slice(1), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `${r}, ${g}, ${b}`;
        };
        document.documentElement.style.setProperty('--primary-color-rgb', hexToRgb(config.primaryColor));

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
            const products = await response.json();
            catalogContainer.innerHTML = '';
            products.forEach(product => {
                const card = createProductCard(product);
                catalogContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Ошибка при загрузке товаров:', error);
            loader.textContent = 'Не удалось загрузить товары. Пожалуйста, попробуйте позже.';
        } finally {
            loader.style.display = 'none';
            catalogContainer.style.display = 'grid';
        }
    }

    // --- 3. Создание карточки товара с каруселью ---
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        const formattedPrice = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(product.price);

        // Имитация нескольких изображений для карусели
        const productImages = [
            product.photo,
            `https://placehold.co/600x600/FF5733/FFFFFF?text=${encodeURIComponent(product.name)}%20(Вид%202)`,
            `https://placehold.co/600x600/33FF57/FFFFFF?text=${encodeURIComponent(product.name)}%20(Вид%203)`
        ];

        let currentImageIndex = 0; // Индекс текущего изображения для этой карточки

        card.innerHTML = `
            <div class="product-photo-carousel" data-product-id="${product.id}">
                ${productImages.map((imgSrc, index) => `
                    <img src="${imgSrc}" alt="${product.name} - ${index + 1}" class="${index === 0 ? 'active' : ''}" onerror="this.src='https://placehold.co/600x600?text=Фото';">
                `).join('')}
                ${productImages.length > 1 ? `
                    <button class="carousel-nav-btn prev" data-direction="-1">‹</button>
                    <button class="carousel-nav-btn next" data-direction="1">›</button>
                    <div class="carousel-dots">
                        ${productImages.map((_, index) => `
                            <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">${formattedPrice}</div>
                    <button class="add-to-cart-button" data-product-id="${product.id}">В корзину</button>
                </div>
            </div>
        `;

        // Логика карусели
        if (productImages.length > 1) {
            const carouselElement = card.querySelector('.product-photo-carousel');
            const images = Array.from(carouselElement.querySelectorAll('img'));
            const dotsContainer = carouselElement.querySelector('.carousel-dots');

            const showImage = (index) => {
                images.forEach((img, i) => {
                    img.classList.toggle('active', i === index);
                });
                if (dotsContainer) {
                    Array.from(dotsContainer.querySelectorAll('.dot')).forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                }
                currentImageIndex = index;
            };

            carouselElement.querySelector('.carousel-nav-btn.prev').addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем срабатывание других кликов на карточке
                currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
                showImage(currentImageIndex);
                tg.HapticFeedback.impactOccurred('light');
            });

            carouselElement.querySelector('.carousel-nav-btn.next').addEventListener('click', (e) => {
                e.stopPropagation(); // Предотвращаем срабатывание других кликов на карточке
                currentImageIndex = (currentImageIndex + 1) % productImages.length;
                showImage(currentImageIndex);
                tg.HapticFeedback.impactOccurred('light');
            });

            if (dotsContainer) {
                dotsContainer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('dot')) {
                        e.stopPropagation();
                        const index = parseInt(e.target.dataset.index, 10);
                        showImage(index);
                        tg.HapticFeedback.impactOccurred('light');
                    }
                });
            }
        }

        const addToCartButton = card.querySelector('.add-to-cart-button');
        addToCartButton.addEventListener('click', () => {
            addToCart(product);
        });

        return card;
    }
    
    // --- 4. Логика корзины ---
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
        tg.HapticFeedback.impactOccurred('light');
    }

    function updateCart() {
        const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
        
        // Анимация счетчика корзины
        cartCounter.textContent = totalItems;
        cartCounter.classList.remove('animate'); // Сброс анимации
        void cartCounter.offsetWidth; // Принудительный рефлоу для перезапуска анимации
        cartCounter.classList.add('animate'); // Запуск анимации

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
                <img src="${product.photo}" class="cart-item-img" alt="${product.name}" onerror="this.src='https://placehold.co/60x60?text=Фото';">
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

        // Добавляем слушателей событий после рендеринга
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId, 10);
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

    // --- 5. Управление модальным окном ---
    cartButton.addEventListener('click', () => {
        cartModal.classList.add('active'); // Активируем модальное окно
        renderCartItems();
        tg.HapticFeedback.impactOccurred('light');
    });

    closeCartButton.addEventListener('click', () => {
        cartModal.classList.remove('active'); // Деактивируем модальное окно
        tg.HapticFeedback.impactOccurred('light');
    });
    
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active'); // Деактивируем модальное окно при клике вне контента
            tg.HapticFeedback.impactOccurred('light');
        }
    });

    // --- 6. Отправка заказа ---
    submitOrderButton.addEventListener('click', () => {
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();

        if (cart.length === 0) {
            tg.showAlert('Ваша корзина пуста!');
            return;
        }
        if (!phone || !address) {
            tg.showAlert('Пожалуйста, заполните номер телефона и адрес доставки.');
            return;
        }

        const orderData = {
            items: cart.map(p => ({ id: p.id, name: p.name, price: p.price, quantity: p.quantity })),
            totalPrice: cart.reduce((sum, p) => sum + (p.price * p.quantity), 0),
            customer: {
                phone: phone,
                address: address,
            },
            orderDate: new Date().toISOString()
        };

        tg.sendData(JSON.stringify(orderData));
        tg.showAlert('Данные заказа отправлены в Telegram! Спасибо за покупку!');
        // Очищаем корзину и закрываем модальное окно после отправки
        cart = [];
        updateCart();
        cartModal.classList.remove('active');
        tg.close(); // Закрываем WebApp после отправки
    });

    // --- Запуск приложения ---
    applyConfig();
    loadProducts();
});

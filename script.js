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
    const orderForm = document.getElementById('order-form');
    const cartSummary = document.querySelector('.cart-summary');

    // Проверка наличия элементов
    if (!catalogContainer || !loader || !cartButton || !cartCounter || !cartModal || !closeCartButton ||
        !cartItemsContainer || !cartTotalPriceEl || !submitOrderButton || !phoneInput || !addressInput) {
        console.error('Ошибка: Один или несколько основных DOM-элементов не найдены. Проверьте index.html.');
        if (loader) {
            loader.textContent = 'Ошибка загрузки: Необходимые элементы страницы отсутствуют.';
            loader.style.display = 'block';
        }
        return;
    }

    // --- Состояние приложения ---
    let cart = [];

    // --- Конфиг ---
    function applyConfig() {
        try {
            document.title = config.shopTitle;
            document.getElementById('shop-title').textContent = config.shopTitle;
            const logoImg = document.getElementById('logo-img');
            if (logoImg) {
                logoImg.src = config.logoPath;
                logoImg.onerror = () => { logoImg.style.display = 'none'; };
            }
            if (config.primaryColor) {
                document.documentElement.style.setProperty('--primary-color', config.primaryColor);
                const hexToRgb = (hex) => {
                    const bigint = parseInt(hex.slice(1), 16);
                    const r = (bigint >> 16) & 255;
                    const g = (bigint >> 8) & 255;
                    const b = bigint & 255;
                    return `${r}, ${g}, ${b}`;
                };
                document.documentElement.style.setProperty('--primary-color-rgb', hexToRgb(config.primaryColor));
            }
            if (tg && typeof tg.setHeaderColor === 'function' && config.primaryColor) {
                tg.setHeaderColor(config.primaryColor);
            }
            if (tg && tg.colorScheme === 'dark') {
                document.body.classList.add('telegram-dark-theme');
            }
        } catch (error) {
            console.error('Ошибка при применении конфигурации:', error);
        }
    }

    // --- Загрузка товаров ---
    async function loadProducts() {
        loader.style.display = 'block';
        catalogContainer.style.display = 'none';
        try {
            const response = await fetch('catalog.json');
            if (!response.ok) throw new Error(`Ошибка загрузки каталога: ${response.statusText}`);
            const products = await response.json();
            catalogContainer.innerHTML = '';
            if (products.length === 0) {
                loader.textContent = 'Каталог товаров пуст.';
            } else {
                products.forEach(product => {
                    const card = createProductCard(product);
                    if (card) catalogContainer.appendChild(card);
                });
            }
        } catch (error) {
            loader.textContent = `Не удалось загрузить товары. Ошибка: ${error.message}`;
        } finally {
            loader.style.display = 'none';
            catalogContainer.style.display = 'grid';
        }
    }

    // --- Карточка товара ---
    function createProductCard(product) {
        if (!product || !product.id || !product.name || typeof product.price === 'undefined') return null;
        const card = document.createElement('div');
        card.className = 'product-card';

        // Карусель изображений
        const productImages = [
            product.photo,
            `https://placehold.co/600x600/FF5733/FFFFFF?text=${encodeURIComponent(product.name)}%20(2)`,
            `https://placehold.co/600x600/33FF57/FFFFFF?text=${encodeURIComponent(product.name)}%20(3)`
        ].filter(url => url && typeof url === 'string' && (url.startsWith('http') || url.startsWith('data:')));
        if (productImages.length === 0) productImages.push(`https://placehold.co/600x600/CCCCCC/000000?text=${encodeURIComponent(product.name)}`);

        let currentImageIndex = 0;
        const formattedPrice = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(product.price);

        card.innerHTML = `
            <div class="product-photo-carousel">
                ${productImages.map((imgSrc, idx) => `
                    <img src="${imgSrc}" alt="${product.name}" class="${idx === 0 ? 'active' : ''}" onerror="this.src='https://placehold.co/600x600/CCCCCC/000000?text=Фото';">
                `).join('')}
                ${productImages.length > 1 ? `
                    <button class="carousel-nav-btn prev" data-direction="-1">‹</button>
                    <button class="carousel-nav-btn next" data-direction="1">›</button>
                    <div class="carousel-dots">
                        ${productImages.map((_, idx) => `<span class="dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>`).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description || 'Описание отсутствует.'}</p>
                <div class="product-footer">
                    <div class="product-price">${formattedPrice}</div>
                    <button class="add-to-cart-button" data-product-id="${product.id}">В корзину</button>
                </div>
            </div>
        `;

        // Карусель
        if (productImages.length > 1) {
            const carouselElement = card.querySelector('.product-photo-carousel');
            const images = Array.from(carouselElement.querySelectorAll('img'));
            const dotsContainer = carouselElement.querySelector('.carousel-dots');

            const showImage = (idx) => {
                images.forEach((img, i) => img.classList.toggle('active', i === idx));
                if (dotsContainer) {
                    Array.from(dotsContainer.querySelectorAll('.dot')).forEach((dot, i) => dot.classList.toggle('active', i === idx));
                }
                currentImageIndex = idx;
            };

            carouselElement.querySelector('.prev')?.addEventListener('click', (e) => {
                e.stopPropagation();
                currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
                showImage(currentImageIndex);
                tg?.HapticFeedback?.impactOccurred('light');
            });
            carouselElement.querySelector('.next')?.addEventListener('click', (e) => {
                e.stopPropagation();
                currentImageIndex = (currentImageIndex + 1) % productImages.length;
                showImage(currentImageIndex);
                tg?.HapticFeedback?.impactOccurred('light');
            });
            dotsContainer?.addEventListener('click', (e) => {
                if (e.target.classList.contains('dot')) {
                    const idx = parseInt(e.target.dataset.index, 10);
                    showImage(idx);
                    tg?.HapticFeedback?.impactOccurred('light');
                }
            });
        }

        // Кнопка В корзину
        card.querySelector('.add-to-cart-button').addEventListener('click', () => addToCart(product));
        return card;
    }

    // --- Корзина ---
    function addToCart(product) {
        const existing = cart.find(p => p.id === product.id);
        if (existing) existing.quantity += 1;
        else cart.push({ ...product, quantity: 1 });
        updateCart();
        tg?.HapticFeedback?.impactOccurred('light');
    }

    function changeQuantity(productId, delta) {
        const product = cart.find(p => p.id === productId);
        if (!product) return;
        product.quantity += delta;
        if (product.quantity <= 0) cart = cart.filter(p => p.id !== productId);
        updateCart();
        tg?.HapticFeedback?.impactOccurred('light');
    }

    function updateCart() {
        const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0);
        cartCounter.textContent = totalItems;
        cartCounter.classList.remove('animate');
        requestAnimationFrame(() => requestAnimationFrame(() => cartCounter.classList.add('animate')));
        renderCartItems();
        calculateTotalPrice();
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
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
                <img src="${product.photo || 'https://placehold.co/60x60?text=Фото'}" class="cart-item-img" alt="${product.name}" onerror="this.src='https://placehold.co/60x60?text=Фото';">
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
        cartItemsContainer.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId, 10);
                const delta = parseInt(e.target.dataset.delta, 10);
                changeQuantity(productId, delta);
            });
        });
    }

    function calculateTotalPrice() {
        const total = cart.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        cartTotalPriceEl.textContent = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(total);
    }

    // --- Модальное окно корзины ---
    function showCartModal() {
        cartModal.classList.add('active');
        cartModal.style.display = 'flex';
        renderCartItems();
        tg?.HapticFeedback?.impactOccurred('light');
    }
    function hideCartModal() {
        cartModal.classList.remove('active');
        cartModal.style.display = 'none';
        tg?.HapticFeedback?.impactOccurred('light');
    }

    cartButton.addEventListener('click', showCartModal);
    closeCartButton.addEventListener('click', hideCartModal);
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) hideCartModal();
    });

    // --- Отправка заказа ---
    submitOrderButton.addEventListener('click', () => {
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();

        if (cart.length === 0) {
            tg?.showAlert?.('Ваша корзина пуста!');
            return;
        }
        if (!phone || !address) {
            tg?.showAlert?.('Пожалуйста, заполните номер телефона и адрес доставки.');
            return;
        }

        const orderData = {
            items: cart.map(p => ({ id: p.id, name: p.name, price: p.price, quantity: p.quantity })),
            totalPrice: cart.reduce((sum, p) => sum + (p.price * p.quantity), 0),
            customer: { phone, address },
            orderDate: new Date().toISOString()
        };

        tg?.sendData?.(JSON.stringify(orderData));
        tg?.showAlert?.('Данные заказа отправлены! Спасибо за покупку!');
        cart = [];
        updateCart();
        hideCartModal();
        tg?.close?.();
    });

    // --- Запуск приложения ---
    applyConfig();
    loadProducts();
});

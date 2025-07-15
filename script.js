document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    // --- DOM Элементы ---
    // Получаем ссылки на элементы и проверяем их наличие
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

    // Проверка, что все основные элементы существуют
    if (!catalogContainer || !loader || !cartButton || !cartCounter || !cartModal || !closeCartButton ||
        !cartItemsContainer || !cartTotalPriceEl || !submitOrderButton || !phoneInput || !addressInput) {
        console.error('Ошибка: Один или несколько основных DOM-элементов не найдены. Проверьте index.html.');
        // Можно отобразить сообщение пользователю, если это критично
        if (loader) {
            loader.textContent = 'Ошибка загрузки: Необходимые элементы страницы отсутствуют.';
            loader.style.display = 'block';
        }
        return; // Прерываем выполнение скрипта, если элементы не найдены
    }

    // --- Состояние приложения ---
    let cart = []; // Теперь будет хранить объекты { ...product, quantity: N }

    // --- 1. Применение конфигурации ---
    function applyConfig() {
        try {
            document.title = config.shopTitle;
            document.getElementById('shop-title').textContent = config.shopTitle;
            const logoImg = document.getElementById('logo-img');
            if (logoImg) {
                logoImg.src = config.logoPath;
                logoImg.onerror = () => { logoImg.style.display = 'none'; console.warn('Логотип не загружен или не найден.'); };
            } else {
                console.warn('Элемент логотипа (logo-img) не найден.');
            }
            
            // Установка основного цвета и его RGB версии для CSS переменных
            if (config.primaryColor) {
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
            } else {
                console.warn('Основной цвет (primaryColor) не определен в config.js.');
            }

            // Установка цвета заголовка Telegram WebApp
            if (tg && typeof tg.setHeaderColor === 'function' && config.primaryColor) {
                tg.setHeaderColor(config.primaryColor);
            } else {
                console.warn('Telegram WebApp API или setHeaderColor недоступен, или primaryColor не определен.');
            }
            
            // Применение темной темы Telegram
            if (tg && tg.colorScheme === 'dark') {
                document.body.classList.add('telegram-dark-theme');
            }
            console.log('Конфигурация применена успешно.');
        } catch (error) {
            console.error('Ошибка при применении конфигурации:', error);
        }
    }

    // --- 2. Загрузка и отображение товаров ---
    async function loadProducts() {
        console.log('Начало загрузки товаров...');
        try {
            loader.style.display = 'block';
            catalogContainer.style.display = 'none';
            const response = await fetch('catalog.json');
            console.log('Ответ от catalog.json:', response.ok, response.status);
            if (!response.ok) {
                throw new Error(`Ошибка загрузки каталога: ${response.statusText} (Статус: ${response.status})`);
            }
            const products = await response.json();
            console.log('Загружено товаров:', products.length);
            catalogContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых карточек
            
            if (products.length === 0) {
                loader.textContent = 'Каталог товаров пуст.';
                loader.style.display = 'block'; // Убедимся, что сообщение видно
            } else {
                products.forEach(product => {
                    const card = createProductCard(product);
                    if (card) {
                        catalogContainer.appendChild(card);
                    } else {
                        console.warn('Не удалось создать карточку для продукта:', product.name, product.id);
                    }
                });
            }
        } catch (error) {
            console.error('Ошибка при загрузке или отображении товаров:', error);
            loader.textContent = `Не удалось загрузить товары. Ошибка: ${error.message}. Пожалуйста, попробуйте позже.`;
            loader.style.display = 'block'; // Убедимся, что сообщение об ошибке видно
        } finally {
            loader.style.display = 'none'; // Скрываем загрузчик, если не было ошибки
            catalogContainer.style.display = 'grid'; // Показываем контейнер каталога
            console.log('Загрузка товаров завершена.');
        }
    }

    // --- 3. Создание карточки товара с каруселью ---
    function createProductCard(product) {
        if (!product || !product.id || !product.name || typeof product.price === 'undefined') {
            console.error('Некорректные данные продукта:', product);
            return null; // Возвращаем null, если данные продукта неполные
        }

        const card = document.createElement('div');
        card.className = 'product-card';
        const formattedPrice = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(product.price);

        // Имитация нескольких изображений для карусели
        const productImages = [
            product.photo,
            `https://placehold.co/600x600/FF5733/FFFFFF?text=${encodeURIComponent(product.name)}%20(Вид%202)`,
            `https://placehold.co/600x600/33FF57/FFFFFF?text=${encodeURIComponent(product.name)}%20(Вид%203)`
        ];

        // Фильтруем пустые или некорректные URL, если product.photo был null/undefined
        const validProductImages = productImages.filter(url => url && typeof url === 'string' && (url.startsWith('http') || url.startsWith('data:')));
        if (validProductImages.length === 0) {
            validProductImages.push(`https://placehold.co/600x600/CCCCCC/000000?text=${encodeURIComponent(product.name)}`); // Гарантируем хотя бы одно изображение-заглушку
        }

        let currentImageIndex = 0; // Индекс текущего изображения для этой карточки

        card.innerHTML = `
            <div class="product-photo-carousel" data-product-id="${product.id}">
                ${validProductImages.map((imgSrc, index) => `
                    <img src="${imgSrc}" alt="${product.name} - ${index + 1}" class="${index === 0 ? 'active' : ''}" onerror="this.src='https://placehold.co/600x600/CCCCCC/000000?text=Фото%20недоступно';">
                `).join('')}
                ${validProductImages.length > 1 ? `
                    <button class="carousel-nav-btn prev" data-direction="-1">‹</button>
                    <button class="carousel-nav-btn next" data-direction="1">›</button>
                    <div class="carousel-dots">
                        ${validProductImages.map((_, index) => `
                            <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
                        `).join('')}
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

        // Логика карусели
        if (validProductImages.length > 1) {
            const carouselElement = card.querySelector('.product-photo-carousel');
            if (carouselElement) {
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

                const prevButton = carouselElement.querySelector('.carousel-nav-btn.prev');
                const nextButton = carouselElement.querySelector('.carousel-nav-btn.next');

                if (prevButton) {
                    prevButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        currentImageIndex = (currentImageIndex - 1 + validProductImages.length) % validProductImages.length;
                        showImage(currentImageIndex);
                        if (tg && typeof tg.HapticFeedback !== 'undefined') tg.HapticFeedback.impactOccurred('light');
                    });
                } else {
                    console.warn('Кнопка "prev" для карусели не найдена для продукта:', product.name);
                }

                if (nextButton) {
                    nextButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        currentImageIndex = (currentImageIndex + 1) % validProductImages.length;
                        showImage(currentImageIndex);
                        if (tg && typeof tg.HapticFeedback !== 'undefined') tg.HapticFeedback.impactOccurred('light');
                    });
                } else {
                    console.warn('Кнопка "next" для карусели не найдена для продукта:', product.name);
                }

                if (dotsContainer) {
                    dotsContainer.addEventListener('click', (e) => {
                        if (e.target.classList.contains('dot')) {
                            e.stopPropagation();
                            const index = parseInt(e.target.dataset.index, 10);
                            showImage(index);
                            if (tg && typeof tg.HapticFeedback !== 'undefined') tg.HapticFeedback.impactOccurred('light');
                        }
                    });
                } else {
                    console.warn('Контейнер точек для карусели не найден для продукта:', product.name);
                }
            } else {
                console.warn('Элемент карусели (product-photo-carousel) не найден для продукта:', product.name);
            }
        }

        const addToCartButton = card.querySelector('.add-to-cart-button');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', () => {
                addToCart(product);
            });
        } else {
            console.warn('Кнопка "В корзину" не найдена для продукта:', product.name);
        }

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
        if (tg && typeof tg.HapticFeedback !== 'undefined') tg.HapticFeedback.impactOccurred('light');
    }

    function changeQuantity(productId, delta) {
        const product = cart.find(p => p.id === productId);
        if (!product) return;

        product.quantity += delta;

        if (product.quantity <= 0) {
            cart = cart.filter(p => p.id !== productId);
        }
        updateCart();
        if (tg && typeof tg.HapticFeedback !== 'undefined') tg.HapticFeedback.impactOccurred('light');
    }

    function updateCart() {
        const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
        
        // Анимация счетчика корзины
        cartCounter.textContent = totalItems;
        cartCounter.classList.remove('animate'); // Сброс анимации
        // Принудительный рефлоу для перезапуска анимации
        // Использование requestAnimationFrame для более надежного перезапуска
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                cartCounter.classList.add('animate'); // Запуск анимации
            });
        });

        renderCartItems();
        calculateTotalPrice();
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        const orderForm = document.getElementById('order-form');
        const cartSummary = document.querySelector('.cart-summary');

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; opacity: 0.7;">Ваша корзина пуста.</p>';
            if (orderForm) orderForm.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
            return;
        }
        
        if (orderForm) orderForm.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'block';

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

        // Добавляем слушателей событий после рендеринга
        // Используем делегирование событий для кнопок количества
        cartItemsContainer.querySelectorAll('.quantity-btn').forEach(button => {
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
        if (tg && typeof tg.HapticFeedback !== 'undefined') tg.HapticFeedback.impactOccurred('light');
    });

    closeCartButton.addEventListener('click', () => {
        cartModal.classList.remove('active'); // Деактивируем модальное окно
        if (tg && typeof tg.HapticFeedback !== 'undefined') tg.HapticFeedback.impactOccurred('light');
    });
    
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active'); // Деактивируем модальное окно при клике вне контента
            if (tg && typeof tg.HapticFeedback !== 'undefined') tg.HapticFeedback.impactOccurred('light');
        }
    });

    // --- 6. Отправка заказа ---
    submitOrderButton.addEventListener('click', () => {
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();

        if (cart.length === 0) {
            if (tg && typeof tg.showAlert === 'function') tg.showAlert('Ваша корзина пуста!');
            return;
        }
        if (!phone || !address) {
            if (tg && typeof tg.showAlert === 'function') tg.showAlert('Пожалуйста, заполните номер телефона и адрес доставки.');
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

        if (tg && typeof tg.sendData === 'function') {
            tg.sendData(JSON.stringify(orderData));
            if (tg && typeof tg.showAlert === 'function') tg.showAlert('Данные заказа отправлены в Telegram! Спасибо за покупку!');
            // Очищаем корзину и закрываем модальное окно после отправки
            cart = [];
            updateCart();
            cartModal.classList.remove('active');
            if (tg && typeof tg.close === 'function') tg.close(); // Закрываем WebApp после отправки
        } else {
            console.error('Telegram WebApp API (sendData) недоступен. Заказ не отправлен.');
            // Можно показать альтернативное сообщение пользователю
            alert('Заказ не отправлен: Telegram WebApp API недоступен.');
        }
    });

    // --- Запуск приложения ---
    applyConfig();
    loadProducts();
});

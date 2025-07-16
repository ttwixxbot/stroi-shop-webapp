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
    const customerNameInput = document.getElementById('customer-name-input');
    const phoneInput = document.getElementById('phone-input');
    const addressInput = document.getElementById('address-input');
    const categoriesContainer = document.getElementById('categories-container');

    // --- Состояние приложения ---
    let cart = []; // Теперь будет хранить объекты { ...product, quantity: N }
    let allProducts = []; // Для хранения всех загруженных товаров
    let currentCategory = 'Все товары'; // Текущая активная категория

    // --- Определение категорий и их ключевых слов ---
    // Используем ключевые слова для фильтрации товаров из catalog.json
    const categories = [
        { name: 'Все товары', icon: '✨', description: 'Показать все доступные товары', keywords: [] },
        {
            name: 'Строительные материалы',
            icon: '🧱',
            description: 'Цемент, шпатлёвка, стяжка, гипсокартон, профиль, фанера, трубы ПВХ',
            keywords: ['цемент', 'шпатлёвка', 'стяжка', 'гипсокартон', 'профиль', 'фанера', 'трубы пвх', 'штукатурка', 'сетка армирующая', 'мешок строительный', 'плинтус']
        },
        {
            name: 'Крепёж и метизы',
            icon: '🔩',
            description: 'Шурупы, саморезы, гвозди, анкера, скотч',
            keywords: ['шурупы', 'саморезы', 'гвозди', 'анкер', 'скотч']
        },
        {
            name: 'Инструменты и техника',
            icon: '🛠️',
            description: 'Дрели, перфораторы, болгарки, молотки, отвёртки, уровни, лобзики, наждачка и т.п.',
            keywords: ['дрель', 'перфоратор', 'болгарка', 'молоток', 'отвёртка', 'уровень', 'лобзик', 'наждачная бумага', 'шуруповерт', 'сверло', 'кисть малярная', 'валик']
        },
        {
            name: 'Электрика',
            icon: '⚡',
            description: 'Кабель, розетки, выключатели, удлинители',
            keywords: ['кабель', 'розетка', 'выключатель', 'удлинитель']
        },
        {
            name: 'Отделочные материалы',
            icon: '🎨',
            description: 'Ламинат, плитка, керамогранит, краска, эмаль, грунтовка, герметик, клей, пена монтажная',
            keywords: ['ламинат', 'плитка', 'керамогранит', 'краска', 'эмаль', 'грунтовка', 'герметик', 'клей', 'пена монтажная', 'плиточный клей']
        },
        {
            name: 'Садово-хозяйственный инвентарь',
            icon: '🌳',
            description: 'Лопаты, грабли, мотыжки, рыхлители, ведра, тазы, стремянки, метлы, опрыскиватели, сетки, лейки',
            keywords: ['лопата', 'грабли', 'мотыжка', 'рыхлитель', 'ведро', 'таз', 'стремянка', 'метла', 'опрыскиватель', 'сетка', 'лейка', 'лестница'] // Добавлены общие слова
        },
        {
            name: 'Посуда, вёдра, тазы',
            icon: '🍽️',
            description: 'Посуда, вёдра, тазы',
            keywords: ['посуда', 'ведро', 'таз'] // Добавлены общие слова
        },
        {
            name: 'Фурнитура и замки',
            icon: '🔑',
            description: 'Замки, задвижки, завертки, шпингалеты, крючки, ручки',
            keywords: ['замок', 'петли', 'задвижка', 'завертка', 'шпингалет', 'крючок', 'ручка'] // Добавлены общие слова
        },
        {
            name: 'Колёса и опоры',
            icon: '⚙️',
            description: 'Колёса для тележек, опоры кухонные и мебельные',
            keywords: ['колесо', 'опора'] // Добавлены общие слова
        },
        {
            name: 'Средства индивидуальной защиты',
            icon: '👷',
            description: 'Очки, перчатки, наушники, краги, дождевики',
            keywords: ['очки', 'перчатки', 'наушники', 'краги', 'дождевик'] // Добавлены общие слова
        },
        {
            name: 'Аэрозольные краски',
            icon: '🖌️',
            description: 'Отдельная подкатегория, если ассортимент большой',
            keywords: ['аэрозоль', 'краска аэрозольная'] // Добавлены общие слова
        },
        {
            name: 'Декоративные покрытия / лазури',
            icon: '✨',
            description: 'Лазури, декоративные эмали, колера',
            keywords: ['лазурь', 'декоративная эмаль', 'колер'] // Добавлены общие слова
        }
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
        const customerName = customerNameInput.value.trim();
        const phone = phoneInput.value.trim();
        const address = addressInput.value.trim();
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        if (cart.length === 0) {
            tg.showAlert('Ваша корзина пуста!');
            return;
        }
        if (!customerName || !phone || !address) {
            tg.showAlert('Пожалуйста, заполните все поля: Ваше имя, номер телефона и адрес доставки.');
            return;
        }

        const orderData = {
            items: cart.map(p => ({ id: p.id, name: p.name, price: p.price, quantity: p.quantity })),
            totalPrice: cart.reduce((sum, p) => sum + (p.price * p.quantity), 0),
            customer: {
                name: customerName,
                phone: phone,
                address: address,
                paymentMethod: paymentMethod === 'cash' ? 'Наличными' : 'Банковской картой'
            },
            orderDate: new Date().toISOString()
        };

        tg.sendData(JSON.stringify(orderData));
        tg.showAlert('Данные заказа отправлены в Telegram!');
        // Очищаем корзину и поля формы после отправки
        cart = [];
        updateCart();
        customerNameInput.value = '';
        phoneInput.value = '';
        addressInput.value = '';
        cartModal.style.display = 'none';
        tg.close();
    });

    // --- 8. Логика категорий ---
    function renderCategories() {
        categoriesContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('div');
            button.className = 'category-button';
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
                document.querySelectorAll('.category-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
            });
            categoriesContainer.appendChild(button);
        });
    }

    function filterProductsByCategory(categoryName) {
        currentCategory = categoryName;
        let filtered = [];

        if (categoryName === 'Все товары') {
            filtered = allProducts;
        } else {
            const selectedCategory = categories.find(cat => cat.name === categoryName);
            if (selectedCategory && selectedCategory.keywords.length > 0) {
                filtered = allProducts.filter(product => {
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
        renderProducts(filtered);

        // --- Прокрутка к разделу товаров ---
        const productCatalogSection = document.getElementById('product-catalog');
        if (productCatalogSection) {
            productCatalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }


    // --- Запуск приложения ---
    applyConfig();
    loadProducts().then(() => {
        renderCategories();
        filterProductsByCategory(currentCategory);
    });
});

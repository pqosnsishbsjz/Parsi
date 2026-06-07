// ========== اطلاعات کاربر تلگرام ==========
let tg = window.Telegram.WebApp;
let user = tg.initDataUnsafe?.user || {};

// نمایش اطلاعات کاربر
function initUser() {
    if (user.id) {
        document.getElementById('userName').innerText = user.first_name || 'کاربر';
        document.getElementById('userId').innerText = `@${user.username || 'user'}`;
        document.getElementById('profileName').innerText = user.first_name || '-';
        document.getElementById('profileUsername').innerText = `@${user.username || '-'}`;
    }
}

// ========== سایدبار ==========
const menuBtn = document.querySelector('.menu-btn');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');

function toggleSidebar() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

menuBtn?.addEventListener('click', toggleSidebar);
overlay?.addEventListener('click', toggleSidebar);

// ========== ناوبری بین صفحات ==========
function navigateTo(page) {
    // مخفی کردن همه صفحات
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // نمایش صفحه انتخاب شده
    document.getElementById(`${page}-page`).classList.add('active');
    
    // به‌روزرسانی لینک فعال در سایدبار
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
    
    // بستن سایدبار در موبایل
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
    
    // لود کردن محصولات اگر صفحه فروشگاه است
    if (page === 'shop') {
        loadProducts();
    }
    
    // لود کردن سفارشات اخیر
    if (page === 'orders') {
        loadRecentOrders();
    }
}

// اضافه کردن event listener به لینک‌های سایدبار
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        navigateTo(page);
    });
});

// ========== محصولات ==========
const productsData = {
    1: { name: "پریمیوم تلگرام", icon: "⭐️", desc: "روش گیفت با آیدی تلگرام", price: "استعلامی" },
    2: { name: "استارز تلگرام", icon: "🌟", desc: "قیمت هر استارز 2,700 تومان", price: "2,700 ت / عدد" },
    3: { name: "گیفت تلگرام", icon: "🎁", desc: "ارسال به اکانت و کانال", price: "از 45,000 تومان" },
    4: { name: "NFT گیفت آپگرید", icon: "🎁", desc: "گیفت‌های NFT با نماد تون", price: "استعلامی" },
    5: { name: "واریز تون", icon: "💎", desc: "واریز تون به اکانت تلگرام", price: "استعلامی" },
    6: { name: "VPN ویتوری", icon: "📶", desc: "VPN پرسرعت و پایدار", price: "از 40,000 تومان" },
    7: { name: "ممبر با کیفیت", icon: "👥", desc: "بدون ریزش، تحویل سریع", price: "از 35,000 تومان" },
    8: { name: "شماره مجازی", icon: "📞", desc: "فعالسازی فوری", price: "استعلامی" },
    9: { name: "خدمات اینستاگرام", icon: "📱", desc: "افزایش فالوور، لایک، بازدید", price: "استعلامی" },
    10: { name: "خدمات یوتیوب", icon: "📱", desc: "افزایش سابسکرایب و بازدید", price: "استعلامی" },
    11: { name: "خدمات تیک تاک", icon: "📱", desc: "افزایش فالوور و بازدید", price: "استعلامی" },
    12: { name: "خدمات توییتر", icon: "📱", desc: "افزایش فالوور", price: "استعلامی" },
    13: { name: "کالاف دیوتی", icon: "🎮", desc: "سفارش سلاح - پلاتینم، دایموند، گلد", price: "از 50,000 تومان" },
    14: { name: "سلف تلگرام", icon: "🖥", desc: "ربات‌های سلف تلگرام", price: "استعلامی" }
};

let activeCategory = null;

function loadProducts(categoryId = null) {
    activeCategory = categoryId;
    const container = document.getElementById('products-container');
    let productsHtml = '<div class="products-grid">';
    
    let filteredProducts = [];
    if (categoryId) {
        filteredProducts = [{ id: categoryId, ...productsData[categoryId] }];
    } else {
        filteredProducts = Object.entries(productsData).map(([id, data]) => ({ id: parseInt(id), ...data }));
    }
    
    filteredProducts.forEach(product => {
        productsHtml += `
            <div class="product-card">
                <div class="product-icon">${product.icon}</div>
                <div class="product-title">${product.name}</div>
                <div class="product-desc">${product.desc}</div>
                <div class="product-price">💰 ${product.price}</div>
                <button class="btn-order" onclick="orderProduct(${product.id})">
                    🛒 ثبت سفارش
                </button>
            </div>
        `;
    });
    
    productsHtml += '</div>';
    container.innerHTML = productsHtml;
    
    // بروزرسانی کلاس active در دسته‌بندی‌ها
    document.querySelectorAll('.category-item').forEach(item => {
        if (item.getAttribute('data-cat') == categoryId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// اضافه کردن event listener به دسته‌بندی‌ها
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
        const catId = item.getAttribute('data-cat');
        loadProducts(catId);
    });
});

// ========== ثبت سفارش ==========
function orderProduct(productId) {
    const product = productsData[productId];
    if (!product) return;
    
    // باز کردن تلگرام برای ثبت سفارش
    const botUsername = 'ParsiMarktbot'; // یوزرنیم ربات خودت رو بذار
    const message = `🛒 ثبت سفارش جدید\n\n📦 محصول: ${product.name}\n🆔 کاربر: @${user.username || 'user'}\n\nلطفا سفارش را بررسی کنید.`;
    
    tg.openTelegramLink(`https://t.me/${botUsername}?start=order_${productId}`);
    
    // پیام موفقیت
    tg.showPopup({
        title: 'ثبت سفارش',
        message: `سفارش ${product.name} با موفقیت ثبت شد!\nپشتیبانی با شما تماس می‌گیرد.`,
        buttons: [{ type: 'ok' }]
    });
}

// ========== پیگیری سفارش ==========
function trackOrder() {
    const code = document.getElementById('trackingCode').value.trim();
    const resultDiv = document.getElementById('trackResult');
    
    if (!code) {
        resultDiv.innerHTML = '<div class="error">لطفا کد پیگیری را وارد کنید!</div>';
        resultDiv.classList.add('show');
        return;
    }
    
    // درخواست به API ربات (در نسخه واقعی باید API بزنی)
    // فعلاً نمایش وضعیت نمونه
    resultDiv.innerHTML = `
        <div class="track-result-card">
            <i class="fas fa-spinner fa-spin"></i>
            <p>در حال بررسی کد پیگیری...</p>
        </div>
    `;
    resultDiv.classList.add('show');
    
    // شبیه‌سازی درخواست
    setTimeout(() => {
        resultDiv.innerHTML = `
            <div class="track-result-card">
                <i class="fas fa-clock"></i>
                <h4>سفارش در انتظار پرداخت</h4>
                <p>کد پیگیری: ${code}</p>
                <p>برای پیگیری با پشتیبانی تماس بگیرید: @YeParse</p>
            </div>
        `;
    }, 1500);
}

// ========== سفارشات اخیر ==========
function loadRecentOrders() {
    const container = document.getElementById('recentOrdersList');
    // در نسخه واقعی از API ربات میگیری
    container.innerHTML = `
        <div class="recent-orders-list">
            <p>برای مشاهده سفارشات خود، به ربات مراجعه کنید.</p>
            <button class="btn-outline" onclick="openTelegramBot()">
                <i class="fab fa-telegram"></i> باز کردن ربات
            </button>
        </div>
    `;
}

// ========== ارتباط با پشتیبانی ==========
function openTelegram(username) {
    tg.openTelegramLink(`https://t.me/${username}`);
}

function openInstagram(username) {
    tg.openTelegramLink(`https://instagram.com/${username}`);
}

function openTelegramBot() {
    const botUsername = 'ParsiMarktbot'; // یوزرنیم ربات خودت رو بذار
    tg.openTelegramLink(`https://t.me/${botUsername}`);
}

// ========== FAQ ==========
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.closest('.faq-item');
        item.classList.toggle('open');
    });
});

// ========== آمار ==========
// بارگذاری آمار (در نسخه واقعی از API ربات میگیری)
function loadStats() {
    document.getElementById('userCount').innerText = '0';
    document.getElementById('orderCount').innerText = '0';
}

// ========== تنظیم Theme ==========
tg.ready();
tg.expand(); // بزرگ کردن صفحه
tg.setHeaderColor('bg_color');
tg.setBackgroundColor('#1a1a2e');

// ========== مقداردهی اولیه ==========
initUser();
loadStats();

// نمایش صفحه خانه به صورت پیش‌فرض
navigateTo('home');

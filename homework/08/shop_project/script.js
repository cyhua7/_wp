// ===== 購物車資料 =====
let cart = JSON.parse(localStorage.getItem("myCart")) || [];

// ===== 所有商品（從 server 取得）=====
let allProducts = [];

// ===== 加入購物車 =====
function addToCart(productName) {
    const product = allProducts.find(p => p.name === productName);

    if (product) {
        cart.push(product);
        localStorage.setItem("myCart", JSON.stringify(cart));
        alert(`✅ ${productName} 已加入購物車！`);
    }
}

// ===== 取得商品 =====
const list = document.getElementById("product-list");

fetch("http://localhost:3000/products")
    .then(res => res.json())
    .then(data => {
        allProducts = data;
        renderProducts(allProducts);
    })
    .catch(err => {
        console.error("抓取失敗:", err);
        list.innerHTML = "<p>連線失敗，請啟動 Server</p>";
    });

// ===== 渲染商品 =====
function renderProducts(listData) {
    list.innerHTML = "";

    listData.forEach(product => {
        const div = document.createElement("div");
        div.className = "product";

        div.innerHTML = `
            <div style="height:200px; overflow:hidden; border-radius:10px; margin-bottom:15px;">
                <img 
                    src="${product.img}" 
                    style="width:100%; height:100%; object-fit:cover; cursor:pointer;"
                    onclick="openImage(this.src)"
>
            </div>
            <h3>${product.name}</h3>
            <p>NT$ ${product.price}</p>
            <button onclick="addToCart('${product.name}')">加入購物車</button>
        `;

        list.appendChild(div);
    });
}

// ===== 分類 =====
function filterCategory(type) {
    const filtered = allProducts.filter(p => p.category === type);
    renderProducts(filtered);
    toggleMenu(); // 選完自動收起
}

// ===== 顯示全部 =====
function showAll() {
    renderProducts(allProducts);
    toggleMenu();
}

// ===== 側邊選單 =====
function toggleMenu() {
    const menu = document.getElementById("side-menu");
    menu.classList.toggle("open");
}

// ===== 前往購物車 =====
function goToCart() {
    window.location.href = "cart.html";
}

// ===== 點外面關側邊選單 =====
document.addEventListener("click", function(e) {
    const menu = document.getElementById("side-menu");
    const icon = document.querySelector(".menu-icon");

    if (menu && icon && !menu.contains(e.target) && !icon.contains(e.target)) {
        menu.classList.remove("open");
    }
});

// ===== 分類展開 =====
function toggleCategory() {
    const list = document.getElementById("category-list");
    list.classList.toggle("open");
}

// ===== 帳號選單 =====
function toggleAccountMenu() {
    const menu = document.getElementById("account-menu");
    menu.classList.toggle("show");
}

// ===== 模擬登入/註冊 =====
let currentType = "";

// 打開 Modal
function openModal(type) {

    currentType = type;

    const modal = document.getElementById("login-modal");

    modal.classList.add("show");

    if (type === "login") {
        document.getElementById("modal-title").innerText = "登入";
    }

    else {
        document.getElementById("modal-title").innerText = "註冊";
    }

    document.getElementById("account-menu").classList.remove("show");
}

// 送出
function submitAuth() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("請輸入完整資訊");
        return;
    }

    // =====================
    // 註冊
    // =====================
    if (currentType === "register") {

        if (localStorage.getItem(username)) {
            alert("帳號已存在");
            return;
        }

        localStorage.setItem(username, password);

        alert("註冊成功！");
    }

    // =====================
    // 登入
    // =====================
    else {

        const savedPassword = localStorage.getItem(username);

        if (!savedPassword) {
            alert("帳號不存在");
            return;
        }
     
        if (savedPassword !== password) {
            alert("密碼錯誤");
            return;
        }
        
        localStorage.setItem("currentUser", username);
        updateUserUI();

        alert("登入成功！");
    }

    closeModal();
}

// 關閉
function closeModal() {

    document.getElementById("login-modal").classList.remove("show");

    document.getElementById("username").value = "";

    document.getElementById("password").value = "";
}

// ===== 登出 =====
function handleLogout() {

    const confirmLogout = confirm("確定要登出嗎？");

    if (!confirmLogout) return;

    localStorage.removeItem("currentUser");

    updateUserUI();

    document.getElementById("account-menu").classList.remove("show");

    alert("已成功登出！");
}

// ===== 點外面關帳號選單 =====
document.addEventListener("click", function(e) {
    const accountMenu = document.getElementById("account-menu");
    const accountIcon = document.querySelector(".account-icon");

    if (accountMenu && accountIcon && !accountMenu.contains(e.target) && !accountIcon.contains(e.target)) {
        accountMenu.classList.remove("show");
    }
});

function updateUserUI() {

    const user = localStorage.getItem("currentUser");

    const userArea = document.getElementById("user-area");

    if (!userArea) return;

    if (user) {

        userArea.innerHTML = `
            <span style="color:white; margin-right:10px;">
                 ${user}
            </span>

            <button onclick="handleLogout()" style="padding:5px 10px;">
                登出
            </button>
        `;
    }

    else {
        userArea.innerHTML = "";
    }
}


window.onload = function () {
    updateUserUI();
};

function openImage(src) {
    const modal = document.getElementById("img-modal");
    const img = document.getElementById("img-modal-content");

    img.src = src;
    modal.classList.add("show");
}

function closeImage() {
    document.getElementById("img-modal").classList.remove("show");
}
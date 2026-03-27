# Threads 風格社群平台 - 程式碼詳細解說

## 目錄
1. [專案架構](#專案架構)
2. [資料庫設計](#資料庫設計)
3. [認證系統原理](#認證系統原理)
4. [路由設計](#路由設計)
5. [視圖模板引擎](#視圖模板引擎)
6. [前端樣式設計](#前端樣式設計)

---

## 專案架構

```
blog/
├── app.js              # 主程式入口
├── package.json        # 專案配置與依賴
├── blog.db             # SQLite 資料庫檔案
├── node_modules/       # npm 安裝的依賴套件
└── views/              # EJS 視圖模板
    ├── index.ejs       # 首頁（公共貼文區）
    ├── profile.ejs     # 個人頁面
    ├── login.ejs       # 登入頁面
    └── register.ejs    # 註冊頁面
```

### package.json 依賴說明

```json
{
  "express": "^4.18.2",      // Web 框架
  "sql.js": "^1.10.0",       // SQLite 的 JavaScript 實現
  "ejs": "^3.1.9",           // 視圖模板引擎
  "bcryptjs": "密碼雜湊加密",
  "express-session": "Session 管理"
}
```

---

## 資料庫設計

### SQL.js 簡介

本專案使用 `sql.js`，這是一個將 SQLite 編譯成 WebAssembly 的函式庫，適合 Node.js 和瀏覽器環境。

```javascript
const initSqlJs = require('sql.js');
const SQL = await initSqlJs();  // 初始化
const db = new SQL.Database();  // 建立資料庫
```

### 資料庫初始化流程

```javascript
async function initDB() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, 'blog.db');
  
  // 檢查資料庫檔案是否存在
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);  // 載入現有資料庫
  } else {
    db = new SQL.Database();         // 建立新資料庫
  }
  
  // 建立資料表（如果不存在）
  db.run(`CREATE TABLE IF NOT EXISTS users (...`);
  db.run(`CREATE TABLE IF NOT EXISTS posts (...`);
  
  saveDB();  // 寫入硬碟
}
```

### 資料庫持久化

```javascript
function saveDB() {
  const data = db.export();              // 匯出資料庫為 Uint8Array
  const buffer = Buffer.from(data);      // 轉換為 Node.js Buffer
  fs.writeFileSync(dbPath, buffer);      // 寫入檔案
}
```

### users 資料表

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 自動遞增主鍵
  username TEXT UNIQUE NOT NULL,          -- 使用者名稱（唯一）
  password TEXT NOT NULL,                  -- 加密後的密碼
  bio TEXT DEFAULT '',                     -- 個人簡介
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- 創建時間
)
```

### posts 資料表

```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,   -- 自動遞增主鍵
  user_id INTEGER NOT NULL,              -- 發文者 ID（外鍵）
  content TEXT NOT NULL,                  -- 貼文內容
  likes INTEGER DEFAULT 0,                -- 讚數（預留）
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)  -- 關聯 users 表
)
```

### 查詢函式設計

#### 1. getAllPosts() - 取得所有貼文

```javascript
function getAllPosts() {
  const stmt = db.prepare(`
    SELECT p.*, u.username as author_name 
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    ORDER BY p.created_at DESC
  `);
  // JOIN 語句將 posts 表與 users 表關聯
  // 取出 post 的所有欄位，以及 users 的 username 命名為 author_name
  // ORDER BY 讓最新的貼文排在前面
  
  const posts = [];
  while (stmt.step()) posts.push(stmt.getAsObject());
  // step() 逐筆讀取資料，getAsObject() 轉換為 JS 物件
  stmt.free();  // 釋放資源
  return posts;
}
```

#### 2. getPostsByUserId() - 取得特定用戶貼文

```javascript
function getPostsByUserId(userId) {
  const stmt = db.prepare(`
    SELECT p.*, u.username as author_name 
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.user_id = ?    -- ? 是參數佔位符
    ORDER BY p.created_at DESC
  `);
  stmt.bind([userId]);     -- 綁定參數，防止 SQL 注入
  // ... 其餘同上
}
```

---

## 認證系統原理

### bcrypt 密碼加密

bcrypt 是一種密碼雜湊函式，特點是運算時間長、無法反推、可用 salt 防止彩虹表攻擊。

#### 註冊時：密碼加密

```javascript
const bcrypt = require('bcryptjs');

function createUser(username, password) {
  const salt = bcrypt.genSaltSync(10);  // 生成 salt（cost factor = 10）
  const hashedPassword = bcrypt.hashSync(password, salt);  // 雜湊
  // 雜湊結果範例：$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n1.SgxV8B.I/7f5L0CqW
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', 
         [username, hashedPassword]);
}
```

#### 登入時：密碼驗證

```javascript
function verifyPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
  // compareSync() 會對輸入密碼進行相同鹽值的雜湊，再比較是否相等
}
```

### Session 管理

使用 `express-session` 中間件管理使用者登入狀態。

#### 中間件設定

```javascript
const session = require('express-session');

app.use(session({
  secret: 'threads-secret-key-2024',  // 用於簽署 Session ID 的密鑰
  resave: false,                       // 不強迫儲存未修改的 Session
  saveUninitialized: false,            // 不儲存未初始化的 Session
  cookie: { 
    maxAge: 7 * 24 * 60 * 60 * 1000  // 有效期：7 天
  }
}));
```

#### Session 資料結構

```javascript
// 登入成功後儲存
req.session.userId = user.id;
req.session.username = user.username;

// 檢查登入狀態
function isAuthenticated(req) {
  return req.session.userId !== undefined;
}
```

#### 跨請求共享使用者資料

```javascript
app.use((req, res, next) => {
  // 將 user 物件注入到所有視圖的 res.locals
  res.locals.user = req.session.userId 
    ? { id: req.session.userId, username: req.session.username } 
    : null;
  next();
});
```

---

## 路由設計

### 路由層級架構

```
GET  /                     首頁（公共貼文區）
GET  /my-profile          個人貼文區（需登入）
GET  /profile/:id          特定用戶頁面
GET  /register             註冊頁面
GET  /login                登入頁面
POST /register             處理註冊
POST /login                處理登入
GET  /logout               登出
POST /posts                發布貼文
POST /posts/:id/delete     刪除貼文
```

### 路由處理函式解析

#### 1. 首頁路由

```javascript
app.get('/', (req, res) => {
  const posts = getAllPosts();    // 取得所有貼文
  res.render('index', { posts }); // 傳遞資料給 index.ejs 模板
});
```

#### 2. 個人頁面路由

```javascript
app.get('/my-profile', (req, res) => {
  // 檢查登入狀態
  if (!isAuthenticated(req)) {
    return res.redirect('/login');  // 未登入導向登入頁
  }
  
  const userId = req.session.userId;  // 從 Session 取得用戶 ID
  const profileUser = getUserById(userId);
  const posts = getPostsByUserId(userId);
  const postCount = getPostCount(userId);
  
  res.render('profile', {
    profileUser,
    posts,
    postCount,
    isOwnProfile: true  // 標記為自己的頁面
  });
});
```

#### 3. 特定用戶頁面路由

```javascript
app.get('/profile/:id', (req, res) => {
  const profileUser = getUserById(parseInt(req.params.id));
  // parseInt() 將 URL 參數轉為整數
  
  if (!profileUser) return res.redirect('/');  // 用戶不存在則回首頁
  
  const posts = getPostsByUserId(profileUser.id);
  const postCount = getPostCount(profileUser.id);
  const isOwnProfile = req.session.userId === profileUser.id;
  // 比較 Session 中的用戶 ID 與頁面用戶 ID
  
  res.render('profile', { profileUser, posts, postCount, isOwnProfile });
});
```

#### 4. 發布貼文路由

```javascript
app.post('/posts', (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect('/login');
  }
  
  const { content } = req.body;  // 從 POST 請求體取得內容
  if (content) {
    insertPost(req.session.userId, content);  // 存入資料庫
  }
  res.redirect('/');  // 發布後回到首頁
});
```

---

## 視圖模板引擎

### EJS 語法說明

EJS（Embedded JavaScript templates）允許在 HTML 中嵌入 JavaScript 程式碼。

#### 基本語法

| 語法 | 說明 |
|------|------|
| `<% %>` | 執行 JavaScript 程式碼 |
| `<%= %>` | 輸出 HTML 轉義後的內容 |
| `<%- %>` | 輸出原始 HTML 內容（危險） |
| `<%- include('file') %>` | 包含其他模板 |

#### 範例：迴圈輸出貼文

```ejs
<% posts.forEach(post => { %>
  <div class="post">
    <div class="avatar"><%= post.author_name.charAt(0).toUpperCase() %></div>
    <div class="post-text"><%= post.content %></div>
  </div>
<% }) %>
```

#### 範例：條件判斷

```ejs
<% if (user) { %>
  <p>Welcome, <%= user.username %>!</p>
<% } else { %>
  <a href="/login">Log in</a>
<% } %>
```

### index.ejs 模板結構

```html
<!-- 1. HTML 結構 -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Threads</title>
  <!-- 2. 內嵌樣式 -->
  <style>...</style>
</head>
<body>
  <!-- 3. 應用程式容器 -->
  <div class="app">
    <!-- 4. 側邊欄 -->
    <aside class="sidebar">
      <div class="logo">Threads</div>
      <a href="/" class="nav-item">Home</a>
      <a href="/my-profile" class="nav-item">Profile</a>
    </aside>
    
    <!-- 5. 主內容區 -->
    <main class="main">
      <!-- 6. 發文框（登入後顯示） -->
      <% if (user) { %>
        <div class="create-post">...</div>
      <% } %>
      
      <!-- 7. 動態貼文列表 -->
      <% posts.forEach(post => { %>
        <div class="post">...</div>
      <% }) %>
    </main>
  </div>
</body>
</html>
```

### profile.ejs 模板結構

```html
<!-- 個人頁面與首頁的主要差異 -->

<!-- 1. 頁面標題 -->
<title><%= profileUser.username %> - Threads</title>

<!-- 2. 個人資料區 -->
<div class="profile-header">
  <div class="profile-avatar">
    <%= profileUser.username.charAt(0).toUpperCase() %>
  </div>
  <div class="profile-name"><%= profileUser.username %></div>
  <div class="profile-handle">@<%= profileUser.username.toLowerCase() %></div>
  <div class="profile-stats">
    <span><%= postCount %> Posts</span>
  </div>
</div>

<!-- 3. 條件性渲染 -->
<% if (isOwnProfile && user) { %>
  <!-- 自己的頁面：顯示發文框 -->
  <div class="create-post">...</div>
<% } %>
```

---

## 前端樣式設計

### Threads 風格特色

#### 1. 深色主題

```css
body {
  background: #000;   /* 純黑背景 */
  color: #fff;        /* 白色文字 */
}
```

#### 2. 漸層 Logo

```css
.logo {
  background: linear-gradient(
    135deg, 
    #833ab4,   /* 紫色 */
    #fd1d1d,   /* 紅色 */
    #fcb045    /* 黃色 */
  );
  -webkit-background-clip: text;      /* 漸層套用到文字 */
  -webkit-text-fill-color: transparent; /* 文字填充為透明 */
}
```

#### 3. 圓形頭像

```css
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;  /* 正圓形 */
  background: linear-gradient(
    135deg, 
    #667eea 0%, 
    #764ba2 100%
  );
  display: flex;
  align-items: center;    /* 垂直置中 */
  justify-content: center; /* 水平置中 */
  font-weight: 600;
}
```

#### 4. 響應式設計

```css
/* 平板尺寸 */
@media (max-width: 900px) {
  .sidebar { width: 80px; }      /* 側邊欄縮窄 */
  .nav-item span { display: none; } /* 隱藏文字 */
  .main { margin-left: 80px; }
}

/* 手機尺寸 */
@media (max-width: 600px) {
  .sidebar { display: none; }     /* 隱藏側邊欄 */
  .main { margin-left: 0; }
}
```

### Flexbox 佈局

```css
.app {
  display: flex;              /* 彈性盒模型 */
  max-width: 1200px;
  margin: 0 auto;
}

.sidebar {
  width: 280px;              /* 固定寬度 */
  position: fixed;           /* 固定定位 */
  height: 100vh;             /* 視窗高度 */
}

.main {
  flex: 1;                   /* 剩餘空間自適應 */
  margin-left: 280px;        /* 避免被側邊欄覆蓋 */
}
```

### SVG 圖示

```html
<!-- 愛心（Like） -->
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
</svg>
```

---

## 安全考量

### 1. SQL 注入防護

```javascript
// 使用參數化查詢，而非字串拼接
stmt.bind([userId]);  // 參數佔位符 ? 的值
```

### 2. 密碼安全

- 使用 bcrypt 雜湊（無法反推）
- salt 防止彩虹表攻擊
- 不儲存明文密碼

### 3. Session 安全

```javascript
cookie: { 
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,    // 防止 XSS 讀取 Cookie
  secure: false       // 生產環境應設為 true（HTTPS）
}
```

### 4. 權限控制

```javascript
// 每個需要登入的路由都檢查認證狀態
if (!isAuthenticated(req)) {
  return res.redirect('/login');
}
```

---

## 總結

本專案展示了：

1. **Express.js 基礎** - 中間件、路由、靜態檔案
2. **SQL.js 資料庫操作** - 建立表格、CRUD 操作、JOIN 查詢
3. **EJS 模板引擎** - 動態生成 HTML
4. **使用者認證** - Session + bcrypt
5. **響應式設計** - Flexbox + Media Queries
6. **Threads 風格 UI** - 深色主題、漸層、SVG 圖示

此架構可擴展至加入：
- 讚/轉發/回覆功能
- 粉絲/關注系統
- 即時通知（WebSocket）
- 圖片上傳與儲存

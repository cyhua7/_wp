# Opencode 記憶檔案

## 基本資訊

- **使用者名稱**：cyh
- **專案路徑**：C:\cyh\_wp\homework\05\blog
- **專案類型**：Threads 風格社群平台（Node.js + Express）
- **對話日期**：2026-03-27

---

## 專案概述

將原本的 Simple Blog 改造成類似 threads.com 風格的社群平台。

### 主要功能
1. 用戶系統（註冊、登入、登出）
2. 貼文系統（發布、刪除、瀏覽）
3. 公共貼文區（首頁 `/`）
4. 個人貼文區（`/my-profile`、 `/profile/:id`）
5. Threads 風格 UI（深色主題、漸層 Logo、響應式設計）

### 未實作功能
- 讚/轉發/回覆功能（UI 按鈕已存在）
- 粉絲/關注系統

---

## 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| Express.js | 4.18.2 | Web 框架 |
| sql.js | 1.10.0 | SQLite 資料庫 |
| EJS | 3.1.9 | 模板引擎 |
| bcryptjs | 最新 | 密碼加密 |
| express-session | 最新 | Session 管理 |

---

## 檔案結構

```
blog/
├── app.js              # 主程式（所有路由與商業邏輯）
├── package.json        # 依賴配置
├── blog.db             # SQLite 資料庫
├── node_modules/       # 依賴套件
└── views/
    ├── index.ejs       # 首頁（公共貼文區）
    ├── profile.ejs     # 個人頁面
    ├── login.ejs       # 登入頁面
    └── register.ejs    # 註冊頁面
```

---

## 資料庫結構

### users 表
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,      -- bcrypt 加密後的密碼
  bio TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### posts 表
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,    -- 外鍵關聯 users 表
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

---

## 路由清單

| 路由 | 方法 | 說明 | 需登入 |
|------|------|------|--------|
| `/` | GET | 首頁（公共貼文區） | 否 |
| `/my-profile` | GET | 個人貼文區 | 是 |
| `/profile/:id` | GET | 特定用戶頁面 | 否 |
| `/register` | GET/POST | 註冊 | 否 |
| `/login` | GET/POST | 登入 | 否 |
| `/logout` | GET | 登出 | 否 |
| `/posts` | POST | 發布貼文 | 是 |
| `/posts/:id/delete` | POST | 刪除貼文 | 是 |

---

## 啟動方式

```bash
cd C:\cyh\_wp\homework\05\blog
npm install   # 首次需要安裝依賴
npm start     # 啟動 server
# 访问 http://localhost:3000
```

---

## 重要程式碼片段

### Session 中間件（app.js 第 12-17 行）
```javascript
app.use(session({
  secret: 'threads-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
```

### 全域 user 變數（app.js 第 131-134 行）
```javascript
app.use((req, res, next) => {
  res.locals.user = req.session.userId 
    ? { id: req.session.userId, username: req.session.username } 
    : null;
  next();
});
```

### SQL JOIN 查詢（app.js 第 52-62 行）
```javascript
function getAllPosts() {
  const stmt = db.prepare(`
    SELECT p.*, u.username as author_name 
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    ORDER BY p.created_at DESC
  `);
  // ...
}
```

---

## 修復過的問題

1. **資料庫每次重啟被刪除** → 改用 `CREATE TABLE IF NOT EXISTS`
2. **個人頁面無法訪問** → `/my-profile` 改用 `req.session.userId`
3. **舊資料導致 author_name undefined** → 刪除舊資料庫重新初始化

---

## .gitignore 配置

專案根目錄 `C:\cyh\_wp\.gitignore` 已包含：
- `node_modules/`
- `*.db`, `*.sqlite`
- `*.log`
- `.env*`
- 其他 Node.js 緩存目錄

---

## 文檔位置

- 對話記錄：`C:\cyh\_wp\homework\05\_doc\blog-ai-ccc-chat.md`
- 程式碼解說：`C:\cyh\_wp\homework\05\_doc\blog_code_detail.md`
- 專案摘要：`C:\cyh\_wp\homework\05\_doc\ccc_ai_chat_blog.md`

---

## 未來擴展方向

1. 讚、轉發、回覆功能
2. 粉絲/關注系統
3. 用戶大頭貼上傳
4. 用戶個人簡介 (bio)
5. 貼文圖片/媒體支援
6. 即時通知系統（WebSocket）
7. 搜尋功能
8. 訊息私訊功能

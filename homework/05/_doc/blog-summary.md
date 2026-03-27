# 專案開發記錄 - Threads 風格社群平台

## 開發時間
2026-03-27

## 專案概述
將原本的 Simple Blog 改造成類似 threads.com 風格的社群平台。

## 功能需求

### 1. 用戶系統
- [x] 用戶註冊功能 (`/register`)
- [x] 用戶登入功能 (`/login`)
- [x] 用戶登出功能 (`/logout`)
- [x] 密碼加密儲存 (bcryptjs)
- [x] Session 管理 (express-session)

### 2. 貼文系統
- [x] 發布貼文 (公開顯示)
- [x] 刪除自己的貼文
- [x] 所有用戶的貼文都顯示在公共貼文區
- [x] 貼文包含：內容、時間、發文者資訊

### 3. 個人專區
- [x] 個人貼文區 (`/my-profile`)
- [x] 查看他人個人頁面 (`/profile/:id`)
- [x] 點擊發文者名稱可進入該用戶的個人頁面
- [x] 顯示發文數量統計

### 4. UI/UX 設計 (Threads 風格)
- [x] 深色主題 (黑色背景)
- [x] 漸變色 Logo
- [x] 圓形頭像 (Gradient 背景)
- [x] 左側導航欄 (Home / Profile)
- [x] 響應式設計 (支援手機)
- [x] 公共區和個人區的側邊欄一致

## 資料庫結構

### users 表
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  bio TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### posts 表
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
```

## 技術棧
- **後端**：Express.js
- **資料庫**：SQLite (sql.js)
- **模板引擎**：EJS
- **認證**：bcryptjs + express-session
- **前端**：HTML/CSS (自定義 Threads 風格)

## 路由架構

| 路由 | 方法 | 說明 |
|------|------|------|
| `/` | GET | 首頁 (公共貼文區) |
| `/my-profile` | GET | 個人貼文區 |
| `/profile/:id` | GET | 查看特定用戶頁面 |
| `/register` | GET/POST | 註冊 |
| `/login` | GET/POST | 登入 |
| `/logout` | GET | 登出 |
| `/posts` | POST | 發布貼文 |
| `/posts/:id/delete` | POST | 刪除貼文 |

## 遇到過的問題與修復

### 問題 1：資料庫初始化錯誤
- **現象**：重啟服務器後數據丟失
- **原因**：`initDB()` 每次都刪除並重建資料庫
- **修復**：改用 `IF NOT EXISTS`，保留舊資料

### 問題 2：個人頁面無法訪問
- **現象**：點擊個人頁面連結顯示錯誤
- **原因**：`/my-profile` 路由中使用未定義的 `user` 變數
- **修復**：改用 `req.session.userId`

### 問題 3：舊資料與新結構不相容
- **現象**：`author_name` 為 undefined
- **原因**：舊資料庫的 posts 表沒有 `user_id` 欄位
- **修復**：刪除舊資料庫，重新初始化

## 已排除的功能
- [ ] 好友功能 (用戶要求暫時不做)
- [ ] 讚功能 (按鈕已顯示，但未實作後端邏輯)
- [ ] 轉發功能 (按鈕已顯示，但未實作後端邏輯)
- [ ] 回覆功能 (按鈕已顯示，但未實作後端邏輯)

## .gitignore 配置
已添加以下忽略規則：
- `node_modules/`
- `*.log`
- `*.db`, `*.sqlite`
- `.env*`
- 其他 Node.js 相關緩存目錄

## 啟動方式
```bash
cd blog
npm install  # 安裝依賴
npm start    # 啟動服務器 (http://localhost:3000)
```

## 檔案結構
```
blog/
├── app.js           # 主應用程式
├── package.json     # 依賴配置
├── blog.db          # SQLite 資料庫
├── node_modules/    # 依賴包
└── views/
    ├── index.ejs    # 首頁 (公共貼文區)
    ├── profile.ejs  # 個人頁面
    ├── login.ejs    # 登入頁面
    └── register.ejs # 註冊頁面
```

## 未來可擴展功能
1. 讚、轉發、回覆功能
2. 追蹤/粉絲功能
3. 用戶大頭貼上傳
4. 用戶個人簡介 (bio)
5. 貼文圖片/媒體支援
6. 即時通知系統
7. 搜尋功能

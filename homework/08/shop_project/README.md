# Project Report Content in Markdown
content = """# 專案報告

## 專案名稱
Node.js 基礎購物車網站與靜態伺服器實作

---

## 一、專案目標
專案目標為使用 Node.js 建立一個簡易靜態網站伺服器，並實作購物車功能頁面。透過手寫原生伺服器邏輯，確保網站能正確載入 HTML、CSS、JavaScript 與圖片資源，進而深入理解前後端請求處理、MIME 類型分配以及路由優先權的運作方式。

---

## 二、使用技術
- **Node.js**: 後端執行環境
- **HTTP 模組 (http)**: 建立伺服器與處理請求
- **File System 模組 (fs)**: 讀取伺服器端的實體檔案
- **Path 模組 (path)**: 處理檔案路徑，確保跨平台相容性
- **前端技術**: HTML5, CSS3, JavaScript (Vanilla JS)

---

## 三、專案架構
專案主要包含以下檔案：
- `server.js`：Node.js 伺服器主程式，負責解析 URL 並回傳對應檔案。
- `index.html`：商場首頁，展示商品列表。
- `cart.html`：購物車詳細頁面。
- `style.css`：定義導航欄、按鈕及網頁排版樣式。
- `script.js`：處理前端互動（如 LocalStorage 資料存取與 DOM 更新）。
- `images/`：存放商品圖檔。

---

## 四、開發過程與問題分析

### 1. 頁面渲染異常（畫面空白或黑屏）
在開發過程中，`cart.html` 曾出現無法正常顯示的問題。

**原因分析：**
- **HTML 結構嵌套錯誤**：在編輯過程中，錯誤地將 `index.html` 的完整程式碼包含了進去，導致 `cart.html` 中出現重複的 `<html>`、`<head>` 與 `<body>` 標籤。
- **影響**：瀏覽器解析 DOM 時發生衝突，導致 JavaScript 無法正確抓取 DOM 元素，畫面渲染失敗。

### 2. 靜態資源路由邏輯錯誤
在 `server.js` 中，路由判斷的條件過於寬鬆，導致資源載入異常。

**問題點：**
- **攔截錯誤**：原先使用 `req.url.startsWith("/")` 作為判斷條件且放置順序過於靠前。
- **分析**：由於幾乎所有請求路徑都以 `/` 開頭，這導致 `/cart.html` 等頁面請求被錯誤判定為圖片或其他靜態資源處理邏輯，進而回傳錯誤的 MIME 類型（Content-Type）。

---

## 五、問題修正方式

### 1. 修正 HTML 檔案結構
- 徹底清空 `cart.html` 中多餘或重複的 HTML 程式碼。
- 確保每個 HTML 檔案具有獨立且標準的結構（唯一的 `<!DOCTYPE html>`、`<html>` 等標籤）。

### 2. 優化 server.js 路由順序與精度
調整路由處理邏輯，遵循「**精確匹配優先、通用規則置後**」的原則：

1. **首頁與特定頁面**：精確判斷 `/` 或 `/cart.html`。
2. **靜態資源類型**：判斷 `.css` 與 `.js` 副檔名並給予正確的 MIME 類型。
3. **圖片資源**：改用更精確的條件（如 `req.url.startsWith("/images/")`）。
4. **錯誤處理**：最後加入 404 處理。

**修正後的邏輯範例：**
```javascript
if (req.url === '/' || req.url === '/index.html') {
    // 回傳 index.html
} else if (req.url === '/cart.html') {
    // 回傳 cart.html
} else if (req.url.startsWith('/images/')) {
    // 處理圖片資源
} else {
    // 處理 CSS, JS 或 404
}
```

---

## 六、學習成果

透過本專案學習到以下重點：

- Node.js 基礎伺服器建置流程
- HTTP request 與 route matching 概念
- 靜態資源（HTML / CSS / JS / 圖片）載入方式
- 路由順序對系統運作的影響
- HTML 結構正確性對渲染的重要性

---

## 七、結論
這個專案讓我理解網站運作不僅是撰寫前端畫面，更重要的是後端如何正確處理請求與資源分配。路由順序與檔案結構的正確性，會直接影響整體網站的運作。
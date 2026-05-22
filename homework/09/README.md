# 網頁設計課程作業統整
有使用Gemini協助製作:https://gemini.google.com/share/0098e13118b4

## 💾 總作業目錄索引表

| 作業編號 | 主題分類 | 核心技術點 | 專案簡介與成果概述 |
| :---: | :--- | :--- | :--- |
| **[作業一](#-作業一前端基礎網頁骨架)** | 前端網頁基礎 | `Semantic HTML`, `網頁結構` | 建立個人網站骨架（首頁、關於我、作品集）。 |
| **[作業二](#-作業二互動問卷表單與樣式)** | 網頁互動表單 | `HTML Form`, `CSS 基礎佈局` | 設計動態問卷表單，結合基礎 CSS 美化與使用者欄位對齊。 |
| **[作業三](#-作業三javascript-環境初探與-hellojs)** | 後端語法初探 | `Node.js 執行環境`, `Console` | 設定 JavaScript 執行環境，撰寫並運行 `hello.js` 程式。 |
| **[作業四](#-作業四javascript-十全大補基礎語法練習)** | 程式邏輯控制 | `if / for / while`, `JSON / Array` | 自擬 10 道結構化語法題目，掌握物件、迴圈與函數調用。 |
| **[作業五](#-作業五opencode-多版本網站專案管理)** | 專案版本控制 | `opencode`, `版本控制` | 透過 opencode 平台建置多版本的網站專案並完整進行版本提交。 |
| **[作業六](#-作業六js-進階邏輯與高階函數修煉)** | JS 進階核心邏輯 | `Callback`, `map / reduce`, `傳參考` | 在編輯器中寫出完整的程式碼完成JavaScript 進階函數與陣列操作的實作挑戰題。 |
| **[作業七](#-作業七後端資料庫對接與異步錯誤優先回呼)** | 基礎到後端邏輯 | `解構賦值`, `Error-First Callback` | 完成全方位 JavaScript 實作挑戰。 |
| **[作業八](#-作業八期中大專案原生-nodejs-電商購物車網站)** | **【期中專案】** | `原生 http/fs`, `LocalStorage` | **期中成果**：使用AI寫出後端靜態資源伺服器，結合前端分類、登入、購物車等。 |

---

## ⚡ 作業一：前端基礎網頁骨架
* **專案目標**：掌握 HTML5 語義化標籤（Semantic HTML）的運用，建立結構嚴謹的個人履歷網站。
* **核心技術**：
  * 使用 `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` 等結構標籤，取代無語義的 `<div>`，提升 SEO 與網頁可讀性。
  * 實作超連結（Anchor Tags）進行網頁內錨點跳轉與外部頁面串聯（首頁、關於我、作品集）。

---

## ⚡ 作業二：互動問卷表單與樣式
* **專案目標**：設計多樣化輸入元件的互動問卷，熟悉 HTML 表單屬性與基礎佈局。
* **核心技術**：
  * 整合 `<input type="text">`, `radio`, `checkbox`, `<select>` 與 `<textarea>`。
  * 運用 CSS 進行表單對齊、外邊距（Margin）與內邊距（Padding）的基本調校，提升操作體驗。

---

## ⚡ 作業三：JavaScript 環境初探與 hello.js
* **專案目標**：脫離瀏覽器環境，設定 Node.js 執行環境，掌握終端機（CLI）的基本指令操作。
* **題目要求**：編寫一個名為 `hello.js` 的基本 JavaScript 檔案，並在終端機成功執行輸出。
* **核心技術**：
  * 掌握 `console.log()` 的標準輸出（stdout）。
  * 學習在終端機使用 `node hello.js` 命令編譯並執行指令碼。

---

## ⚡ 作業四：JavaScript 十全大補基礎語法練習
* **專案目標**：利用 AI 協作工具設計並實作 10 道語法練習題，全面涵蓋 JavaScript 核心控制流程。
* **核心技術點**：
  * 必須包含 `if` 條件分支、`for` 與 `while` 迴圈控制、`function` 定義。
  * 熟練掌握 `Array`（陣列操作）、`Object`（物件屬性）與 `JSON` 資料格式轉換。
  * 成果以標準 Markdown 格式撰寫成獨立的練習日誌，確保「每行程式碼皆編譯通過並徹底理解」。

---

## ⚡ 作業五：opencode 多版本網站專案管理
* **專案目標**：引入軟體工程的版本控制概念，實作網站專案的生命週期管理。
* **核心技術**：
  * 使用 `opencode` 平台進行專案建置。
  * 實作專案的「分版本管理」，記錄每次功能更迭與局部重構，確保代碼具備可追溯性。

---

## ⚡ 作業六：JS 進階邏輯與高階函數修煉
* **專案目標**：深入 JavaScript 核心底層，修煉函數式程式設計（Functional Programming）與記憶體配置核心觀念。
* **核心題目與技術解析**：
  1. **Callback 基礎實作 (`mathTool`)**：理解將匿名函數作為參數（相加、相減）傳入 `mathTool(10, 5, callback)`，達成解除耦合（Decoupling）。
  2. **匿名函數與立即執行 (`IIFE`)**：實作 `(function(){ ... })()` 建立獨立區域範疇（Scope），鎖定 `count = 100` 變數防止全域污染。
  3. **箭頭函數與陣列轉換 (`map`)**：運用單行箭頭函數批量轉換商品價格打 8 折（`prices.map(p => p * 0.8)`），不污染原始陣列。
  4. **陣列參數的「破壞性修改」**：理解在函數內部調用 `arr.pop()` 與 `arr.unshift()` 會直接改動到外層傳入變數的記憶體實體。
  5. **函數回傳函數 (`Higher-Order Function`)**：實作 `multiplier(factor)` 閉包，鎖定外層引數（如 `factor = 2`）供內層函數重複調用。
  6. **Callback 篩選器 (`myFilter`)**：手寫類似 `Array.prototype.filter` 的邏輯，遍歷陣列並依據 `callback(item)` 的布林值決定是否留存。
  7. **箭頭函數處理物件**：運用 `users.filter(user => user.age >= 18)` 篩選複雜物件陣列。
  8. **參數傳址陷阱 (Pass by Reference)**：
     * 執行 `a.push(99)` 是操作原陣列記憶體指標，因此外層的 `listA` 會被修改。
     * 執行 `b = [100]` 則是將局部參考**重新導向**新記憶體位址，並未更動原始的 `listB`（經典面試題）。
  9. **延遲執行的 Callback**：配合 `setTimeout` 與箭頭函數，在 2 秒後異步串接並輸出陣列字串。
  10. **綜合應用：計算總價**：寫出 `calculateTotal(cart, discountFunc)`，先使用 `reduce` 或迴圈將購物車加總，再將總金額丟入折扣回呼函數中處理。

---

## ⚡ 作業七：完成全方位 JavaScript 實作挑戰。
* **專案目標**：為後端框架（Express）與真實資料庫（SQLite/MySQL）操作鋪路，理解「資料如何從資料庫流向網頁」。
* **核心題目與技術解析**：
  1. **物件屬性存取**：掌握點符號（`post.title`）與中括號動態存取（`post["title"]`）。
  2. **物件解構賦值 (`Destructuring`)**：`const { title, content } = req.body;` 實作後端接收 `POST` 請求體時快速抽取欄位的現代語法。
  3. **陣列遍歷與字串拼接**：使用 `posts.forEach` 配合反引號樣板字串（Template Literals）將文章陣列組裝成網頁 HTML 結構。
  4. **字典與動態參數 (`URL Params`)**：建立物件字典模擬 `req.params.id` 的來源，動態注入新屬性。
  5. **Error-First Callback 錯誤優先回呼機制**：
     * 實作 `fetchData(id, callback)`。依照 Node.js 慣例，異步查詢完成後，呼叫 `callback(err, data)`。若成功則第一個參數傳入 `null`，第二個傳入資料物件。此模式對應到後端 `getPost(id, (err, post) => { ... })`。
  6. **JSON 處理 (`Parsing JSON`)**：利用 `JSON.parse()` 將前端傳來的字串解析為 JavaScript 實體物件。
  7. **模擬資料庫查詢 (`Simulating DB Queries`)**：
     * 實作 `fakeGet(sql, params, callback)`，模擬資料庫套件（如 `sqlite3`）的 API 格式。理解外層呼叫時傳入的匿名函數 `(err, row) => { ... }` 是如何承接資料庫內部查詢完畢後丟出來的 row 物件。
  8. **樣板字串中的邏輯運算**：在 `${user ? user : "Stranger"}` 內嵌三元運算子，實作動態網頁渲染。
  9. **陣列物件的排序與切片**：利用 `str.slice(0, 10) + "..."` 實作字串局部截斷，模擬部落格的文章摘要（Substring）功能。
  10. **錯誤優先回呼攔截處理**：寫出 `checkAdmin(role, callback)`。若非管理者優先呼叫 `callback("Access Denied")` 並配合 `return` 中斷；成功則呼叫 `callback(null, "Welcome")`，理解後端不斷出現的 `if (err) return ...` 機制。

---

## ⚡ 作業八：【期中專案】原生 Node.js 電商購物車網站

* **專案目標**：捨棄 從底層完整實現前後端請求處理、靜態資源路由分流與 MIME 類型分配機制。
* **後端伺服器架構 (`server.js`)**：
  * 遵循**「精確匹配優先、通用規則置後」**的架構鏈。
  * 精準攔截 `/`、`/index.html` 與 `/cart.html`，使用 `fs.readFile` 異步讀取檔案，並正確附加 `text/html; charset=utf-8` 防止中文亂碼。
  * 運用 `path.extname()` 動態辨識 `.css` (`text/css`)、`.js` (`application/javascript`) 及圖片資源副檔名，確保瀏覽器正確解析，防範黑屏。
  * 開闢 `/products` 核心 API 節點回傳 JSON 資料，並手動寫入 `"Access-Control-Allow-Origin": "*"` 響應頭解鎖跨域（CORS）阻擋。
* **前端商務與持久化實戰 (`script.js` / `cart.html`)**：
  * **資料異步對接**：首頁載入即透過 `fetch` 抓取後端商品 JSON，並藉由 CSS Grid（`repeat(auto-fit, minmax(250px, 1fr))`）達成完美的自適應跨平台排版。
  * **LocalStorage 持久化購物車**：利用 `JSON.stringify` 序列化商品存入快取；結帳頁面再經 `JSON.parse` 解出，並使用 `splice(index, 1)` 實作流暢的購物車商品精確刪除與動態總計重新計算。
  * **模擬認證系統**：利用 LocalStorage 以鍵值對型態註冊帳密，利用 `currentUser` 狀態鎖定當前登入者，動態重繪導覽列（Navbar）會員狀態 UI、並實作側邊選單側滑、圖片燈箱放大（Modal）等特效。


---



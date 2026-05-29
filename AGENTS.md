# AGENTS.md — Repository Guide for AI Coding Agents

## Project Overview

This is a web design course repository (`114 學年下學期`) containing weekly homework assignments (`01`–`09`). The course covers HTML, CSS, JavaScript, Node.js/Express, EJS, SQLite, and frontend development.

## Build / Lint / Test Commands

**No build system, linter, or test framework is configured.** There is no `package.json` at the repo root. Each homework folder is standalone.

### Running JavaScript files (exercises)
```bash
node homework/04/01_if_function.js
node homework/06_new/01.js
node homework/07/01.js
```

### Starting Express blog servers (homework 05)
```bash
cd "homework/05/blog" && npm install && npm start
```
Substitute `blog` with `blog_login版`, `blog_個人、公共版`, or `blog - 可點入發文者版面版` for other versions. The server listens on `http://localhost:3000`.

### Starting the shop server (homework 08)
```bash
node homework/08/shop_project/server.js
```
The server listens on `http://localhost:3000`. Kill with `Ctrl+C`.

### Running a single test
**There are no test files.** All testing is manual: run `node <file>.js` and inspect console output, or open `http://localhost:3000` in a browser.

## Code Style Guidelines

### Languages & Frameworks
- **Backend:** Node.js with Express (05 blog), or native `http` module (08 shop)
- **Database:** sql.js (SQLite), accessed synchronously with `prepare/bind/step/getAsObject/free`
- **Templating:** EJS (05 blog)
- **Frontend:** Vanilla JavaScript (ES6), HTML5, CSS3
- **Auth:** bcryptjs + express-session (05 blog); LocalStorage mock (08 shop)

### Imports
- **Always use CommonJS** (`require`). No ES module `import/export`.
- Backend:
```javascript
const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const initSqlJs = require('sql.js');
```
- Frontend: Use `<script src="..."></script>` with global functions. No `type="module"`.

### Formatting
- **Indentation:** 2 spaces (preferred). Some files (06_new/, 08/shop_project/) use 4 spaces — match the surrounding file.
- **Semicolons:** Always required.
- **Quotes:** Use single quotes `'` for backend code; double quotes `"` for frontend/browser code and exercise files.
- **Line length:** No hard limit; keep reasonable (~80-100 chars).

### Naming Conventions
| Context | Convention | Examples |
|---------|-----------|---------|
| JS variables/functions | `camelCase` | `sumRange`, `checkScore`, `getAllPosts` |
| JS classes | None used | — |
| SQL columns / DB fields | `snake_case` | `user_id`, `author_name`, `created_at` |
| CSS classes | `kebab-case` | `side-menu`, `cart-icon`, `form-group` |
| HTML files | lowercase, hyphenated | `aboutme.html`, `index.html`, `cart.html` |
| JS files | numbered prefix + kebab, or plain number | `01_if_function.js`, `01.js`, `app.js` |
| Express route params | `camelCase` | `:id` in `/profile/:id` |

### HTML Patterns
- Use semantic HTML5 tags: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<aside>`.
- Inline `<style>` blocks are acceptable (dominant pattern in this repo).
- Use `onclick`/`onchange` inline event handlers (dominant pattern). Avoid adding JS event listeners in separate files unless the file already uses that pattern.
- Use `<script>` tags (no `type="module"`).

### CSS Patterns
- CSS Grid for product grids: `display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));`
- Flexbox for layout: `display: flex;`
- Responsive breakpoints: 900px (tablet), 600px (phone).
- Inline `<style>` is the norm (except 08/shop_project/ which uses `style.css`).

### Error Handling
- **Express routes:** Early return with redirect on failure:
```javascript
if (!profileUser) return res.redirect('/');
if (!isAuthenticated(req)) return res.redirect('/login');
```
- **Express form validation:** Return with error variable to EJS template:
```javascript
if (!username || !password) return res.render('register', { error: 'Please fill all fields' });
```
- **Node.js callbacks:** Use `(err, data)` callback signature:
```javascript
fetchData(101, (err, data) => {
  if (err) { console.log("發生錯誤：" + err); }
  else { console.log("成功取得資料：", data); }
});
```
- **Frontend:** Use `alert()` for user-facing errors:
```javascript
if (!username || !password) { alert("請輸入完整資訊"); return; }
```
- **File/HTTP errors:** Check `err` in fs callbacks, send 404/500 status codes:
```javascript
if (err) { res.writeHead(404); return res.end("Not found"); }
```
- **Fetch:** Chain `.catch()` with a user-friendly fallback:
```javascript
.catch(err => { console.error("抓取失敗:", err); list.innerHTML = "<p>連線失敗</p>"; });
```

### JavaScript Features & Patterns
- **Variable declarations:** Use `const` by default, `let` for reassignment. No `var`.
- **Functions:** Prefer arrow functions for callbacks and array methods:
```javascript
const adults = users.filter(user => user.age >= 18);
const total = cart.reduce((sum, price) => sum + price, 0);
```
- **Array methods:** `forEach`, `map`, `filter`, `reduce` are used. Classic `for` and `for...of` loops also used.
- **Template literals:** Use backticks for string interpolation:
```javascript
const html = `<h1>Welcome, ${user ? user : "Stranger"}</h1>`;
console.log(`找到數字 ${nums[index]} 在索引 ${index}`);
```
- **Object syntax:** Use object literals with method shorthand where applicable.
- **Destructuring:** Used in Express route handlers:
```javascript
const { title, content } = req.body;
```
- **JSON:** Use `JSON.parse()` and `JSON.stringify()`.

### Database Pattern (sql.js)
```javascript
const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
stmt.bind([id]);
let user = null;
if (stmt.step()) user = stmt.getAsObject();
stmt.free();
```

### Comments
- Use `//` single-line comments only. No `/* */` block comments in JS.
- Chinese comments mixed with English is the norm.

### File Organization
- Each homework is self-contained in its numbered folder.
- Blog project files: `app.js` (main server), `views/` (EJS templates), `package.json`.
- Shop project files: `server.js` (HTTP server), `index.html`, `cart.html`, `script.js`, `style.css`, `public/images/`.

## Important Notes

- **No TypeScript.** Write plain JavaScript.
- **No test framework.** Do not create test files or add test configs.
- **No linter/formatting config.** Match the style of neighboring files.
- **No `.cursorrules` or Copilot instructions exist.** This file is the single source of truth.
- **Chinese filenames exist** (e.g., `作業統整.md`). Preserve them if working with those files.

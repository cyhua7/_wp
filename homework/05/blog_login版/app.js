const express = require('express');
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

let db;

async function initDB() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, 'blog.db');
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  saveDB();
}

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(path.join(__dirname, 'blog.db'), buffer);
}

function getAllPosts() {
  const stmt = db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
  const posts = [];
  while (stmt.step()) posts.push(stmt.getAsObject());
  stmt.free();
  return posts;
}

function getPostById(id) {
  const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
  stmt.bind([id]);
  let post = null;
  if (stmt.step()) post = stmt.getAsObject();
  stmt.free();
  return post;
}

function insertPost(title, content) {
  db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);
  saveDB();
}

function updatePost(id, title, content) {
  db.run('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, id]);
  saveDB();
}

function deletePost(id) {
  db.run('DELETE FROM posts WHERE id = ?', [id]);
  saveDB();
}

function getUserByUsername(username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  stmt.bind([username]);
  let user = null;
  if (stmt.step()) user = stmt.getAsObject();
  stmt.free();
  return user;
}

function createUser(username, password) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
  saveDB();
}

function verifyPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

function isAuthenticated(req) {
  return req.session.userId !== undefined;
}

app.use((req, res, next) => {
  res.locals.user = req.session.userId ? { id: req.session.userId, username: req.session.username } : null;
  next();
});

app.get('/', (req, res) => {
  const posts = getAllPosts();
  res.render('index', { posts });
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;
  
  if (!username || !password) {
    return res.render('register', { error: 'Please fill in all fields' });
  }
  
  if (password !== confirmPassword) {
    return res.render('register', { error: 'Passwords do not match' });
  }
  
  if (getUserByUsername(username)) {
    return res.render('register', { error: 'Username already exists' });
  }
  
  createUser(username, password);
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.render('login', { error: 'Please fill in all fields' });
  }
  
  const user = getUserByUsername(username);
  
  if (!user || !verifyPassword(password, user.password)) {
    return res.render('login', { error: 'Invalid username or password' });
  }
  
  req.session.userId = user.id;
  req.session.username = user.username;
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.get('/new', (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect('/login');
  }
  res.render('new');
});

app.get('/post/:id', (req, res) => {
  const post = getPostById(parseInt(req.params.id));
  if (!post) return res.redirect('/');
  res.render('post', { post });
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  if (title && content) {
    insertPost(title, content);
  }
  res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect('/login');
  }
  const post = getPostById(parseInt(req.params.id));
  if (!post) return res.redirect('/');
  res.render('edit', { post });
});

app.post('/posts/:id', (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect('/login');
  }
  const { title, content } = req.body;
  updatePost(parseInt(req.params.id), title, content);
  res.redirect('/');
});

app.post('/posts/:id/delete', (req, res) => {
  if (!isAuthenticated(req)) {
    return res.redirect('/login');
  }
  deletePost(parseInt(req.params.id));
  res.redirect('/');
});

initDB().then(() => {
  app.listen(3000, () => {
    console.log('Blog running at http://localhost:3000');
  });
});

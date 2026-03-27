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
  secret: 'threads-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
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
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    bio TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  saveDB();
}

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(path.join(__dirname, 'blog.db'), buffer);
}

function getAllPosts() {
  const stmt = db.prepare(`
    SELECT p.*, u.username as author_name 
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    ORDER BY p.created_at DESC
  `);
  const posts = [];
  while (stmt.step()) posts.push(stmt.getAsObject());
  stmt.free();
  return posts;
}

function getPostsByUserId(userId) {
  const stmt = db.prepare(`
    SELECT p.*, u.username as author_name 
    FROM posts p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
  `);
  stmt.bind([userId]);
  const posts = [];
  while (stmt.step()) posts.push(stmt.getAsObject());
  stmt.free();
  return posts;
}

function getUserById(id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  stmt.bind([id]);
  let user = null;
  if (stmt.step()) user = stmt.getAsObject();
  stmt.free();
  return user;
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
  const hashed = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
  saveDB();
}

function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function insertPost(userId, content) {
  db.run('INSERT INTO posts (user_id, content) VALUES (?, ?)', [userId, content]);
  saveDB();
}

function deletePost(id) {
  db.run('DELETE FROM posts WHERE id = ?', [id]);
  saveDB();
}

function getPostCount(userId) {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM posts WHERE user_id = ?');
  stmt.bind([userId]);
  let count = 0;
  if (stmt.step()) count = stmt.getAsObject().count;
  stmt.free();
  return count;
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

app.get('/profile/:id', (req, res) => {
  const profileUser = getUserById(parseInt(req.params.id));
  if (!profileUser) return res.redirect('/');
  
  const posts = getPostsByUserId(profileUser.id);
  const postCount = getPostCount(profileUser.id);
  const isOwnProfile = req.session.userId === profileUser.id;
  
  res.render('profile', { profileUser, posts, postCount, isOwnProfile });
});

app.get('/my-profile', (req, res) => {
  if (!isAuthenticated(req)) return res.redirect('/login');
  
  const profileUser = getUserById(req.session.userId);
  const posts = getPostsByUserId(req.session.userId);
  const postCount = getPostCount(req.session.userId);
  
  res.render('profile', { profileUser, posts, postCount, isOwnProfile: true });
});

app.get('/register', (req, res) => res.render('register', { error: null }));
app.get('/login', (req, res) => res.render('login', { error: null }));

app.post('/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;
  
  if (!username || !password) return res.render('register', { error: 'Please fill all fields' });
  if (password !== confirmPassword) return res.render('register', { error: 'Passwords do not match' });
  if (getUserByUsername(username)) return res.render('register', { error: 'Username already taken' });
  
  createUser(username, password);
  res.redirect('/login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
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

app.post('/posts', (req, res) => {
  if (!isAuthenticated(req)) return res.redirect('/login');
  const { content } = req.body;
  if (content) insertPost(req.session.userId, content);
  res.redirect('/');
});

app.post('/posts/:id/delete', (req, res) => {
  if (!isAuthenticated(req)) return res.redirect('/login');
  deletePost(parseInt(req.params.id));
  res.redirect('back');
});

initDB().then(() => {
  app.listen(3000, () => console.log('Threads running at http://localhost:3000'));
});

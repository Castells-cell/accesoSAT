const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./usuarios.db");

// Crear tabla si no existe
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT, created_at INTEGER)");
});

module.exports = {
  addUser: (username, password) => {
    const createdAt = Date.now();
    db.run("INSERT INTO users (username, password, created_at) VALUES (?, ?, ?)", [username, password, createdAt]);
  },

  getUser: (username, password) => {
    return new Promise((resolve) => {
      db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        resolve(row);
      });
    });
  },

  getUsers: () => {
    return new Promise((resolve) => {
      db.all("SELECT username FROM users", [], (err, rows) => {
        resolve(rows);
      });
    });
  },

  deleteUser: (username) => {
    db.run("DELETE FROM users WHERE username = ?", [username]);
  },

  deleteExpiredUsers: () => {
    const nineHoursAgo = Date.now() - (9 * 60 * 60 * 1000);
    db.run("DELETE FROM users WHERE created_at < ?", [nineHoursAgo]);
  }
};

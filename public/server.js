const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./database");
require("./utils/cron");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username === "Jorge" && password === "Jorge123") {
    return res.json({ success: true, redirect: "/admin.html" });
  }

  const user = await db.getUser(username, password);
  if (!user) {
    return res.json({
      success: false,
      message: "Usuario no autorizado. Contacte al administrador.",
    });
  }

  return res.json({ success: true, redirect: "/satid.html" });
});

// Admin: listar usuarios
app.get("/users", async (req, res) => {
  const users = await db.getUsers();
  res.json(users);
});

// Admin: agregar usuario
app.post("/users", async (req, res) => {
  const { username, password } = req.body;
  await db.addUser(username, password);
  res.sendStatus(201);
});

// Admin: eliminar usuario
app.delete("/users/:username", async (req, res) => {
  await db.deleteUser(req.params.username);
  res.sendStatus(200);
});

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

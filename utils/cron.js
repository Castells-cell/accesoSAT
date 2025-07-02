const cron = require("node-cron");
const db = require("../database");

// Ejecutar cada 10 minutos para eliminar usuarios con acceso expirado
cron.schedule("*/10 * * * *", () => {
  console.log("Ejecutando limpieza de usuarios expirados...");
  db.deleteExpiredUsers();
});

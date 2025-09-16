// backend/database/config.js
const { Sequelize } = require('sequelize');
const path = require('path');

// Configuración de SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'fitness_ai.sqlite'),
  logging: console.log,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a SQLite establecida correctamente.');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    return false;
  }
}

module.exports = { sequelize, testConnection };

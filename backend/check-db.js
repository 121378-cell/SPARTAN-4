const { Sequelize } = require('sequelize');
const path = require('path');

// Configuración de SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database', 'fitness_ai.sqlite'),
  logging: false,
});

async function checkDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a SQLite establecida correctamente.');
    
    // Query users directly
    const [results] = await sequelize.query('SELECT * FROM users');
    console.log('Usuarios en la base de datos:');
    console.log(results);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase();
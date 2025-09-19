// backend/database/models.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('./config');

// Modelo de Usuario
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  level: {
    type: DataTypes.STRING,
    defaultValue: 'principiante'
  },
  goal: {
    type: DataTypes.STRING,
    defaultValue: 'fitness_general'
  }
}, {
  tableName: 'users'
});

// Modelo de Conversación
const Conversation = sequelize.define('Conversation', {
  assistant_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ai_response: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'conversations'
});

// Modelo de Progreso
const Progress = sequelize.define('Progress', {
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  workouts_completed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  measurements: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'progress_records'
});

// Relaciones
User.hasMany(Conversation, { foreignKey: 'user_id' });
Conversation.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Progress, { foreignKey: 'user_id' });
Progress.belongsTo(User, { foreignKey: 'user_id' });

// Sincronizar base de datos con estrategias basadas en el entorno
async function syncDatabase() {
  try {
    // Usar force: true solo en desarrollo y cuando se especifica explícitamente
    const isDevelopment = process.env.NODE_ENV === 'development';
    const forceSync = process.env.FORCE_DB_SYNC === 'true';
    
    // En producción, nunca forzar la sincronización
    const force = (isDevelopment && forceSync) || false;
    
    await sequelize.sync({ force });
    
    if (force) {
      console.log('✅ Base de datos sincronizada con force=true (desarrollo)');
    } else {
      console.log('✅ Base de datos sincronizada (sin forzar)');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error sincronizando base de datos:', error);
    return false;
  }
}

module.exports = {
  sequelize,
  User,
  Conversation,
  Progress,
  syncDatabase
};
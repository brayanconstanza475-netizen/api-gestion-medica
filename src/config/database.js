require('dotenv').config();
const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';

let sequelize;

if (env === 'test') {
  // Para las pruebas automatizadas usamos SQLite en memoria,
  // asi no se necesita una base de datos Postgres corriendo para correr "npm test".
  sequelize = new Sequelize('sqlite::memory:', { logging: false });
} else if (process.env.DATABASE_URL) {
  // Neon (y la mayoria de proveedores de Postgres en la nube) dan una sola
  // cadena de conexion en vez de host/usuario/password por separado, y
  // requieren SSL para conectarse.
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: env === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      underscored: true,
    },
  });
} else {
  // Postgres local (host/usuario/password por separado)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'gestion_medica',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: env === 'development' ? console.log : false,
      define: {
        underscored: true, // columnas en snake_case (fecha_nacimiento, etc.)
      },
    }
  );
}

module.exports = sequelize;

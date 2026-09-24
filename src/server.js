require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexion a la base de datos establecida correctamente.');

    // Sincroniza los modelos con la base de datos (crea las tablas si no existen).
    // En un entorno de produccion real se recomienda usar migraciones en vez de sync().
    await sequelize.sync();
    console.log('✅ Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentacion Swagger en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  }
}

iniciar();

const { sequelize } = require('../src/models');

// Antes de TODOS los tests: crea las tablas en la base sqlite en memoria
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// Despues de TODOS los tests: cierra la conexion
afterAll(async () => {
  await sequelize.close();
});

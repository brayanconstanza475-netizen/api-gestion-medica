const request = require('supertest');
const app = require('../src/app');

let contador = 0;

/**
 * Registra un usuario unico y devuelve su token JWT,
 * listo para usarse en el header Authorization de otras pruebas.
 */
async function obtenerTokenDePrueba() {
  contador += 1;
  const email = `usuario.test.${Date.now()}.${contador}@correo.com`;

  const res = await request(app).post('/api/register').send({
    nombre: 'Usuario de Prueba',
    email,
    password: '123456',
  });

  return res.body.token;
}

module.exports = { obtenerTokenDePrueba };

const request = require('supertest');
const app = require('../src/app');

require('./setup');

describe('Autenticacion (registro, login, logout)', () => {
  const usuario = {
    nombre: 'Ana Perez',
    email: 'ana@correo.com',
    password: '123456',
  };

  test('POST /api/register - registra un nuevo usuario y devuelve token', async () => {
    const res = await request(app).post('/api/register').send(usuario);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario.email).toBe(usuario.email);
  });

  test('POST /api/register - rechaza email duplicado', async () => {
    const res = await request(app).post('/api/register').send(usuario);
    expect(res.status).toBe(409);
  });

  test('POST /api/register - rechaza datos invalidos (password corta)', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ nombre: 'X', email: 'x@correo.com', password: '123' });

    expect(res.status).toBe(422);
  });

  test('POST /api/login - inicia sesion con credenciales correctas', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: usuario.email, password: usuario.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/login - rechaza credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: usuario.email, password: 'contrasena-incorrecta' });

    expect(res.status).toBe(401);
  });

  test('POST /api/logout - invalida el token y no deja usarlo despues', async () => {
    const login = await request(app)
      .post('/api/login')
      .send({ email: usuario.email, password: usuario.password });

    const token = login.body.token;

    const logout = await request(app)
      .post('/api/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(logout.status).toBe(200);

    // Intentar usar el mismo token despues del logout debe fallar
    const intentoPosterior = await request(app)
      .get('/api/pacientes')
      .set('Authorization', `Bearer ${token}`);

    expect(intentoPosterior.status).toBe(401);
  });
});

const request = require('supertest');
const app = require('../src/app');
const { obtenerTokenDePrueba } = require('./helpers');

require('./setup');

describe('CRUD de Doctores', () => {
  let token;
  let doctorId;

  beforeAll(async () => {
    token = await obtenerTokenDePrueba();
  });

  test('POST /api/doctores crea un doctor', async () => {
    const res = await request(app)
      .post('/api/doctores')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Dra. Maria Gomez',
        email: 'maria.gomez@correo.com',
        especialidad: 'Pediatria',
        telefono: '7222-2222',
      });

    expect(res.status).toBe(201);
    doctorId = res.body.id;
  });

  test('POST /api/doctores rechaza especialidad vacia', async () => {
    const res = await request(app)
      .post('/api/doctores')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Dr. Sin Especialidad', email: 'sin.especialidad@correo.com', especialidad: '' });

    expect(res.status).toBe(422);
  });

  test('GET /api/doctores devuelve la lista de doctores', async () => {
    const res = await request(app)
      .get('/api/doctores')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('PUT /api/doctores/:id actualiza el doctor', async () => {
    const res = await request(app)
      .put(`/api/doctores/${doctorId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ especialidad: 'Cardiologia' });

    expect(res.status).toBe(200);
    expect(res.body.especialidad).toBe('Cardiologia');
  });

  test('DELETE /api/doctores/:id elimina el doctor', async () => {
    const res = await request(app)
      .delete(`/api/doctores/${doctorId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});

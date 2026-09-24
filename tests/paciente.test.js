const request = require('supertest');
const app = require('../src/app');
const { obtenerTokenDePrueba } = require('./helpers');

require('./setup');

describe('CRUD de Pacientes', () => {
  let token;
  let pacienteId;

  beforeAll(async () => {
    token = await obtenerTokenDePrueba();
  });

  test('GET /api/pacientes sin token es rechazado (control de acceso)', async () => {
    const res = await request(app).get('/api/pacientes');
    expect(res.status).toBe(401);
  });

  test('POST /api/pacientes crea un paciente', async () => {
    const res = await request(app)
      .post('/api/pacientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Carlos Lopez',
        email: 'carlos.lopez@correo.com',
        telefono: '7000-0000',
        fecha_nacimiento: '1995-05-10',
        historial_medico: 'Sin antecedentes.',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    pacienteId = res.body.id;
  });

  test('POST /api/pacientes rechaza email invalido', async () => {
    const res = await request(app)
      .post('/api/pacientes')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Sin Email Valido', email: 'no-es-un-email' });

    expect(res.status).toBe(422);
  });

  test('GET /api/pacientes devuelve la lista de pacientes', async () => {
    const res = await request(app)
      .get('/api/pacientes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/pacientes/:id devuelve un paciente existente', async () => {
    const res = await request(app)
      .get(`/api/pacientes/${pacienteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(pacienteId);
  });

  test('GET /api/pacientes/:id devuelve 404 si no existe', async () => {
    const res = await request(app)
      .get('/api/pacientes/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  test('PUT /api/pacientes/:id actualiza el paciente', async () => {
    const res = await request(app)
      .put(`/api/pacientes/${pacienteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ telefono: '7111-1111' });

    expect(res.status).toBe(200);
    expect(res.body.telefono).toBe('7111-1111');
  });

  test('DELETE /api/pacientes/:id elimina el paciente', async () => {
    const res = await request(app)
      .delete(`/api/pacientes/${pacienteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    const verificacion = await request(app)
      .get(`/api/pacientes/${pacienteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(verificacion.status).toBe(404);
  });
});

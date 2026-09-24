const request = require('supertest');
const app = require('../src/app');
const { obtenerTokenDePrueba } = require('./helpers');

require('./setup');

describe('CRUD de Citas con validaciones de fecha', () => {
  let token;
  let pacienteId;
  let doctorId;
  let citaId;

  beforeAll(async () => {
    token = await obtenerTokenDePrueba();

    const paciente = await request(app)
      .post('/api/pacientes')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Paciente Cita', email: 'paciente.cita@correo.com' });
    pacienteId = paciente.body.id;

    const doctor = await request(app)
      .post('/api/doctores')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Doctor Cita', email: 'doctor.cita@correo.com', especialidad: 'Medicina General' });
    doctorId = doctor.body.id;
  });

  test('POST /api/citas rechaza fecha en el pasado', async () => {
    const fechaPasada = new Date('2020-01-01T10:00:00Z').toISOString();

    const res = await request(app)
      .post('/api/citas')
      .set('Authorization', `Bearer ${token}`)
      .send({ paciente_id: pacienteId, doctor_id: doctorId, fecha_cita: fechaPasada });

    expect(res.status).toBe(422);
  });

  test('POST /api/citas rechaza paciente_id inexistente', async () => {
    const fechaFutura = new Date(Date.now() + 86400000).toISOString();

    const res = await request(app)
      .post('/api/citas')
      .set('Authorization', `Bearer ${token}`)
      .send({ paciente_id: 999999, doctor_id: doctorId, fecha_cita: fechaFutura });

    expect(res.status).toBe(404);
  });

  test('POST /api/citas crea una cita valida', async () => {
    const fechaFutura = new Date(Date.now() + 86400000).toISOString();

    const res = await request(app)
      .post('/api/citas')
      .set('Authorization', `Bearer ${token}`)
      .send({ paciente_id: pacienteId, doctor_id: doctorId, fecha_cita: fechaFutura, notas: 'Consulta general' });

    expect(res.status).toBe(201);
    expect(res.body.estado).toBe('pendiente');
    citaId = res.body.id;
  });

  test('GET /api/citas devuelve la lista con relaciones de paciente y doctor', async () => {
    const res = await request(app)
      .get('/api/citas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('paciente');
    expect(res.body[0]).toHaveProperty('doctor');
  });

  test('PUT /api/citas/:id actualiza el estado de la cita', async () => {
    const res = await request(app)
      .put(`/api/citas/${citaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ estado: 'confirmada' });

    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('confirmada');
  });

  test('PUT /api/citas/:id rechaza un estado invalido', async () => {
    const res = await request(app)
      .put(`/api/citas/${citaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ estado: 'estado-que-no-existe' });

    expect(res.status).toBe(422);
  });

  test('GET /api/reportes/citas-por-estado genera el reporte', async () => {
    const res = await request(app)
      .get('/api/reportes/citas-por-estado')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/reportes/citas-por-doctor genera el reporte', async () => {
    const res = await request(app)
      .get('/api/reportes/citas-por-doctor')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('DELETE /api/citas/:id elimina la cita', async () => {
    const res = await request(app)
      .delete(`/api/citas/${citaId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});

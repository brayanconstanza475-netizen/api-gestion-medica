require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const pacienteRoutes = require('./routes/paciente.routes');
const doctorRoutes = require('./routes/doctor.routes');
const citaRoutes = require('./routes/cita.routes');
const reporteRoutes = require('./routes/reporte.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Documentacion interactiva (Swagger UI) -> http://localhost:3000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta de salud, util para verificar que el servidor esta arriba
app.get('/api/health', (req, res) => {
  res.status(200).json({ estado: 'ok', mensaje: 'API de Gestion Medica funcionando correctamente.' });
});

// Rutas publicas de autenticacion
app.use('/api', authRoutes); // /api/register, /api/login, /api/logout

// Rutas protegidas (CRUD)
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/doctores', doctorRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/reportes', reporteRoutes);

// 404 para rutas no definidas
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

// Manejo centralizado de errores
app.use(errorHandler);

module.exports = app;

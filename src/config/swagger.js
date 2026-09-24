const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API RESTful - Sistema de Gestion Medica',
      version: '1.0.0',
      description:
        'API RESTful en Express para gestionar pacientes, doctores y citas con autenticacion JWT. ' +
        'Proyecto: Universidad Luterana Salvadorena - Nuevas Tendencias de Programacion - Parcial II.',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

const { Router } = require('express');
const controlador = require('../controllers/cita.controller');
const autenticar = require('../middlewares/auth.middleware');

const router = Router();

router.use(autenticar);

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Reportes sobre las citas
 */

/**
 * @swagger
 * /api/reportes/citas-por-estado:
 *   get:
 *     summary: Cuenta cuantas citas hay por cada estado
 *     tags: [Reportes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Reporte generado correctamente }
 */
router.get('/citas-por-estado', controlador.reporteCitasPorEstado);

/**
 * @swagger
 * /api/reportes/citas-por-doctor:
 *   get:
 *     summary: Cuenta cuantas citas tiene cada doctor
 *     tags: [Reportes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Reporte generado correctamente }
 */
router.get('/citas-por-doctor', controlador.reporteCitasPorDoctor);

module.exports = router;

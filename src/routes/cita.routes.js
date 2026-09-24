const { Router } = require('express');
const controlador = require('../controllers/cita.controller');
const {
  crearCitaValidator,
  actualizarCitaValidator,
  idParamValidator,
} = require('../validators/cita.validator');
const validar = require('../middlewares/validate.middleware');
const autenticar = require('../middlewares/auth.middleware');

const router = Router();

router.use(autenticar);

/**
 * @swagger
 * tags:
 *   name: Citas
 *   description: CRUD de citas medicas
 */

/**
 * @swagger
 * /api/citas:
 *   get:
 *     summary: Lista todas las citas (incluye paciente y doctor)
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de citas }
 *   post:
 *     summary: Crea una nueva cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paciente_id, doctor_id, fecha_cita]
 *             properties:
 *               paciente_id: { type: integer, example: 1 }
 *               doctor_id: { type: integer, example: 1 }
 *               fecha_cita: { type: string, format: date-time, example: "2027-01-15T10:00:00Z" }
 *               estado: { type: string, enum: [pendiente, confirmada, cancelada, completada] }
 *               notas: { type: string }
 *     responses:
 *       201: { description: Cita creada }
 *       404: { description: Paciente o doctor no existe }
 *       422: { description: Error de validacion (ej. fecha en el pasado) }
 */
router.get('/', controlador.listar);
router.post('/', crearCitaValidator, validar, controlador.crear);

/**
 * @swagger
 * /api/citas/{id}:
 *   get:
 *     summary: Obtiene una cita por id
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Datos de la cita }
 *       404: { description: Cita no encontrada }
 *   put:
 *     summary: Actualiza una cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Cita actualizada }
 *       404: { description: Cita no encontrada }
 *   delete:
 *     summary: Elimina una cita
 *     tags: [Citas]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Cita eliminada }
 *       404: { description: Cita no encontrada }
 */
router.get('/:id', idParamValidator, validar, controlador.obtener);
router.put('/:id', actualizarCitaValidator, validar, controlador.actualizar);
router.delete('/:id', idParamValidator, validar, controlador.eliminar);

module.exports = router;

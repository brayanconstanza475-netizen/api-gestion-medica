const { Router } = require('express');
const { registrar, login, logout } = require('../controllers/auth.controller');
const { registrarValidator, loginValidator } = require('../validators/auth.validator');
const validar = require('../middlewares/validate.middleware');
const autenticar = require('../middlewares/auth.middleware');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticacion
 *   description: Registro, login y logout de usuarios
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registra un nuevo usuario y devuelve un token JWT
 *     tags: [Autenticacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, email, password]
 *             properties:
 *               nombre: { type: string, example: "Ana Perez" }
 *               email: { type: string, example: "ana@correo.com" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       201: { description: Usuario creado correctamente }
 *       409: { description: El email ya esta registrado }
 *       422: { description: Error de validacion }
 */
router.post('/register', registrarValidator, validar, registrar);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Inicia sesion y devuelve un token JWT
 *     tags: [Autenticacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "ana@correo.com" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200: { description: Login exitoso }
 *       401: { description: Credenciales invalidas }
 */
router.post('/login', loginValidator, validar, login);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Cierra la sesion invalidando el token actual
 *     tags: [Autenticacion]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Sesion cerrada correctamente }
 *       401: { description: No autorizado }
 */
router.post('/logout', autenticar, logout);

module.exports = router;

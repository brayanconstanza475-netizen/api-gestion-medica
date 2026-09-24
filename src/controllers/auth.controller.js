const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { agregarTokenALista } = require('../middlewares/tokenBlacklist');

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

/**
 * POST /api/register
 * Valida datos, crea usuario, genera token.
 */
async function registrar(req, res) {
  try {
    const { nombre, email, password } = req.body;

    const existente = await User.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ mensaje: 'Ya existe un usuario con ese email.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await User.create({ nombre, email, password: passwordHash });

    const token = generarToken(usuario);

    return res.status(201).json({
      mensaje: 'Usuario registrado correctamente.',
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
      token,
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al registrar el usuario.', error: error.message });
  }
}

/**
 * POST /api/login
 * Verifica credenciales, genera token.
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales invalidas.' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Credenciales invalidas.' });
    }

    const token = generarToken(usuario);

    return res.status(200).json({
      mensaje: 'Inicio de sesion exitoso.',
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
      token,
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al iniciar sesion.', error: error.message });
  }
}

/**
 * POST /api/logout
 * Invalida el token actual (requiere estar autenticado).
 */
async function logout(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    agregarTokenALista(token);

    return res.status(200).json({ mensaje: 'Sesion cerrada correctamente.' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al cerrar sesion.', error: error.message });
  }
}

module.exports = { registrar, login, logout };

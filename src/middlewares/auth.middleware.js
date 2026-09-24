const jwt = require('jsonwebtoken');
const { tokenEnLista } = require('./tokenBlacklist');

/**
 * Protege las rutas verificando el token JWT enviado en el header:
 * Authorization: Bearer <token>
 */
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      mensaje: 'No autorizado. Debes enviar un token en el header Authorization (Bearer <token>).',
    });
  }

  const token = authHeader.split(' ')[1];

  if (tokenEnLista(token)) {
    return res.status(401).json({ mensaje: 'El token fue invalidado (logout). Inicia sesion de nuevo.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, email }
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token invalido o expirado.' });
  }
}

module.exports = autenticar;

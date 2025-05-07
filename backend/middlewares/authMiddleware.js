const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // formato: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado. Por favor, inicia sesión.' });
  }

  jwt.verify(token, 'secreto_seguro', (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Tu sesión ha expirado. Inicia sesión nuevamente.' });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ error: 'Token inválido o malformado.' });
      } else {
        return res.status(403).json({ error: 'No autorizado.' });
      }
    }

    req.user = user; // Guarda los datos decodificados del token
    next();
  });
}

module.exports = verificarToken;

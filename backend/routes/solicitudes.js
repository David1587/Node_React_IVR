const express = require('express');
const router = express.Router();
const solicitudesController = require('../controllers/solicitudesController');
const verificarToken = require('../middlewares/authMiddleware'); // Importamos el middleware

// GET todas las solicitudes (con nombre del empleado)
router.get('/', verificarToken, solicitudesController.obtenerSolicitudes);

// POST nueva solicitud
router.post('/', verificarToken, solicitudesController.crearSolicitud);

// DELETE solicitud por ID
router.delete('/:id', verificarToken, solicitudesController.eliminarSolicitud);

module.exports = router;

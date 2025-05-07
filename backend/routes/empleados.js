const express = require('express');
const router = express.Router();
const empleadosController = require('../controllers/empleadoscontroller');
const verificarToken = require('../middlewares/authMiddleware');

// GET todos los empleados (protegido)
router.get('/', verificarToken, empleadosController.obtenerEmpleados);

// POST nuevo empleado (protegido)
router.post('/', verificarToken, empleadosController.crearEmpleado);

// PUT actualizar empleado por ID (protegido)
router.put('/:id', verificarToken, empleadosController.actualizarEmpleado);

// DELETE un empleado por ID (protegido)
router.delete('/:id', verificarToken, empleadosController.eliminarEmpleado);

router.get('/privado', verificarToken, (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).send({
    mensaje: `Hola ${req.user.username}, estás autenticado`
  });
});

module.exports = router;

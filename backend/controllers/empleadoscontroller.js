const db = require('../db');

// Obtener todos los empleados
exports.obtenerEmpleados = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM empleado ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo empleado
exports.crearEmpleado = async (req, res) => {
  const { nombre, fecha_ingreso, salario } = req.body;

  // Validación básica
  if (typeof nombre !== 'string' || typeof fecha_ingreso !== 'string' || typeof salario !== 'number') {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const result = await db.query(
      'INSERT INTO empleado (nombre, fecha_ingreso, salario) VALUES ($1, $2, $3) RETURNING *',
      [nombre.trim(), fecha_ingreso, salario]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un empleado
exports.actualizarEmpleado = async (req, res) => {
  const { id } = req.params;
  const { nombre, fecha_ingreso, salario } = req.body;

  if (typeof nombre !== 'string' || typeof fecha_ingreso !== 'string' || typeof salario !== 'number') {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const result = await db.query(
      'UPDATE empleado SET nombre = $1, fecha_ingreso = $2, salario = $3 WHERE id = $4 RETURNING *',
      [nombre.trim(), fecha_ingreso, salario, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar un empleado
exports.eliminarEmpleado = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM empleado WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

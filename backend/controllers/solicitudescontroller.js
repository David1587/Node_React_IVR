const db = require('../db');

// Obtener todas las solicitudes con el nombre del empleado
exports.obtenerSolicitudes = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT solicitud.*, empleado.nombre AS nombre_empleado
      FROM solicitud
      INNER JOIN empleado ON solicitud.id_empleado = empleado.id
      ORDER BY solicitud.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear una nueva solicitud con validación
exports.crearSolicitud = async (req, res) => {
  const { codigo, descripcion, resumen, id_empleado } = req.body;

  // Validaciones básicas
  if (
    typeof codigo !== 'string' ||
    typeof descripcion !== 'string' ||
    typeof resumen !== 'string' ||
    typeof id_empleado !== 'number' ||
    !codigo.trim() ||
    !descripcion.trim() ||
    resumen.length > 200
  ) {
    return res.status(400).json({ error: 'Datos inválidos en la solicitud.' });
  }

  try {
    const result = await db.query(
      `INSERT INTO solicitud (codigo, descripcion, resumen, id_empleado)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [codigo.trim(), descripcion.trim(), resumen.trim(), id_empleado]
    );

    const nuevaSolicitud = result.rows[0];

    // Buscar el nombre del empleado relacionado
    const empleadoResult = await db.query(
      'SELECT nombre FROM empleado WHERE id = $1',
      [nuevaSolicitud.id_empleado]
    );

    nuevaSolicitud.nombre_empleado = empleadoResult.rows[0]?.nombre || '';

    res.status(201).json(nuevaSolicitud);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar una solicitud por ID
exports.eliminarSolicitud = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM solicitud WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

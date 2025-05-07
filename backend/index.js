const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: 'application/json' }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

// Rutas API
app.use('/api/empleados', require('./routes/empleados'));
app.use('/api/solicitudes', require('./routes/solicitudes'));
app.use('/api', require('./routes/auth'));


// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

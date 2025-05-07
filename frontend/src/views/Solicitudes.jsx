import { useEffect, useState } from 'react';
import {
  obtenerSolicitudes,
  crearSolicitud,
  eliminarSolicitud
} from '../services/solicitudService';
import { obtenerEmpleados } from '../services/empleadoService';
import FormularioSolicitud from './FormularioSolicitud';
import ListaSolicitudes from './ListaSolicitudes';

function Solicitudes() {
  const [empleados, setEmpleados] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    obtenerEmpleados().then(setEmpleados);
    obtenerSolicitudes().then(setSolicitudes);
  }, []);

  const agregar = async (nueva) => {
    const creada = await crearSolicitud(nueva);
    const nombreEmpleado = empleados.find(e => e.id === creada.id_empleado)?.nombre || '';
    setSolicitudes([...solicitudes, { ...creada, nombre_empleado: nombreEmpleado }]);
  };

  const eliminar = async (id) => {
    await eliminarSolicitud(id);
    setSolicitudes(solicitudes.filter(s => s.id !== id));
  };

  return (
    <div>
      <h1>Gestión de Solicitudes</h1>
      <FormularioSolicitud empleados={empleados} onSolicitudCreada={agregar} />
      <ListaSolicitudes solicitudes={solicitudes} onEliminar={eliminar} />
    </div>
  );
}

export default Solicitudes;

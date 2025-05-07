import { useEffect, useState } from 'react';
import {
  obtenerEmpleados,
  crearEmpleado,
  eliminarEmpleado,
  actualizarEmpleado
} from '../services/empleadoService';
import FormularioEmpleado from './FormularioEmpleado';
import ListaEmpleados from './ListaEmpleados';

function Empleados({ token }) {
  const [empleados, setEmpleados] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(null);

  useEffect(() => {
    obtenerEmpleados(token).then(setEmpleados);
  }, [token]);

  const agregar = async (nuevo) => {
    const creado = await crearEmpleado(nuevo, token);
    setEmpleados([...empleados, creado]);
  };

  const guardar = async (actualizado) => {
    const actualizadoRes = await actualizarEmpleado(actualizado.id, actualizado, token);
    setEmpleados(empleados.map(e => e.id === actualizadoRes.id ? actualizadoRes : e));
    setModoEdicion(null);
  };

  const eliminar = async (id) => {
    await eliminarEmpleado(id, token);
    setEmpleados(empleados.filter(e => e.id !== id));
  };

  return (
    <div>
      <h1>Gestión de Empleados</h1>
      <FormularioEmpleado
        token={token}
        onEmpleadoAgregado={agregar}
        modoEdicion={modoEdicion}
        onGuardarEdicion={guardar}
        cancelarEdicion={() => setModoEdicion(null)}
      />
      <ListaEmpleados
        empleados={empleados}
        onEditar={setModoEdicion}
        onEliminar={eliminar}
      />
    </div>
  );
}

export default Empleados;

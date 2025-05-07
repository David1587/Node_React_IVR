import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './views/Login';
import {
  obtenerEmpleados,
  crearEmpleado,
  eliminarEmpleado,
  actualizarEmpleado
} from './services/empleadoService';
import {
  obtenerSolicitudes,
  crearSolicitud,
  eliminarSolicitud
} from './services/solicitudService';
import FormularioEmpleado from './components/FormularioEmpleado';
import ListaEmpleados from './components/ListaEmpleados';
import FormularioSolicitud from './components/FormularioSolicitud';
import ListaSolicitudes from './components/ListaSolicitudes';

function App() {
  const [empleados, setEmpleados] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [modoEdicion, setModoEdicion] = useState(null);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setToken(null);
    setAutenticado(false);
    window.location.href = '/'; // fuerza redirección inmediata

  };
  

  useEffect(() => {
    const verificarToken = async () => {
      if (!token) {
        setCargando(false);
        return;
      }

      try {
        const empleadosAPI = await obtenerEmpleados(token);
        const solicitudesAPI = await obtenerSolicitudes(token);
        if (empleadosAPI) {
          setEmpleados(empleadosAPI);
          setSolicitudes(solicitudesAPI);
          setAutenticado(true);
        } else {
          setToken(null);
          setAutenticado(false);
        }
      } catch (err) {
        setToken(null);
        setAutenticado(false);
      } finally {
        setCargando(false);
      }
    };

    verificarToken();
  }, [token]);

  const agregarEmpleado = async (nuevo) => {
    try {
      const creado = await crearEmpleado(nuevo, token);
      setEmpleados([...empleados, creado]);
      mostrarMensaje('Empleado agregado con éxito.');
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminar = async (id) => {
    try {
      await eliminarEmpleado(id, token);
      setEmpleados(empleados.filter(e => e.id !== id));
      mostrarMensaje('Empleado eliminado correctamente.');
    } catch (err) {
      setError(err.message);
    }
  };

  const guardarEdicion = async (actualizado) => {
    try {
      const result = await actualizarEmpleado(actualizado.id, actualizado, token);
      setEmpleados(empleados.map(e => e.id === result.id ? result : e));
      setModoEdicion(null);
      mostrarMensaje('Cambios guardados correctamente.');
    } catch (err) {
      setError(err.message);
    }
  };

  const agregarSolicitud = async (nueva) => {
    try {
      const creada = await crearSolicitud(nueva, token);
      const nombreEmpleado = empleados.find(e => e.id === creada.id_empleado)?.nombre || '';
      setSolicitudes([...solicitudes, { ...creada, nombre_empleado: nombreEmpleado }]);
      mostrarMensaje('Solicitud creada correctamente.');
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarSolicitudHandler = async (id) => {
    try {
      await eliminarSolicitud(id, token);
      setSolicitudes(solicitudes.filter(s => s.id !== id));
      mostrarMensaje('Solicitud eliminada.');
    } catch (err) {
      setError(err.message);
    }
  };

  if (cargando) return <p>Cargando...</p>;

  if (!autenticado) {
    return (
      <Login onLoginExitoso={(nuevoToken) => {
        localStorage.setItem('token', nuevoToken);
        setToken(nuevoToken);
        setAutenticado(true);
      }} />
    );
  }

  return (
    <>
<nav style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div>
    <Link to="/empleados" style={{ marginRight: '20px' }}>Empleados</Link>
    <Link to="/solicitudes">Solicitudes</Link>
  </div>
  <button
    onClick={cerrarSesion}
    style={{
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer'
    }}
  >
    Cerrar sesión
  </button>
</nav>


      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Routes>
        <Route path="/empleados" element={
          <div>
            <h1>Lista de Empleados</h1>
            <FormularioEmpleado
              token={token}
              onEmpleadoAgregado={agregarEmpleado}
              modoEdicion={modoEdicion}
              onGuardarEdicion={guardarEdicion}
              cancelarEdicion={() => setModoEdicion(null)}
            />
            <ListaEmpleados
              empleados={empleados}
              onEditar={setModoEdicion}
              onEliminar={eliminar}
            />
          </div>
        } />
        <Route path="/solicitudes" element={
          <div>
            <h1>Solicitudes</h1>
            <FormularioSolicitud
              empleados={empleados}
              onSolicitudCreada={agregarSolicitud}
            />
            <ListaSolicitudes
              solicitudes={solicitudes}
              onEliminar={eliminarSolicitudHandler}
            />
          </div>
        } />
        <Route path="/" element={<Navigate to="/empleados" />} />
        <Route path="*" element={<p>Selecciona una sección del menú.</p>} />
      </Routes>
    </>
  );
}

export default App;

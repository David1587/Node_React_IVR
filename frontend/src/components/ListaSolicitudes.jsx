function ListaSolicitudes({ solicitudes, onEliminar }) {
    const verResumen = (resumen) => {
      alert(`Resumen:\n\n${resumen}`);
    };
  
    return (
      <ul>
        {solicitudes.map((sol) => (
          <li key={sol.id}>
            <strong>{sol.codigo}</strong> - {sol.descripcion}{' '}
            <em>(Empleado: {sol.nombre_empleado})</em>
            <button onClick={() => verResumen(sol.resumen)} style={{ marginLeft: '10px' }}>
              Ver
            </button>
            <button onClick={() => onEliminar(sol.id)} style={{ marginLeft: '10px' }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    );
  }
  
  export default ListaSolicitudes;
  
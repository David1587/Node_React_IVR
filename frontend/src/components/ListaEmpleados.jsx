function ListaEmpleados({ empleados, onEditar, onEliminar }) {
    if (!empleados || empleados.length === 0) {
      return <p>No hay empleados registrados.</p>;
    }
  
    return (
      <ul>
        {empleados.map((emp) => (
          <li key={emp.id}>
            {emp.nombre} - {emp.salario}
            <button onClick={() => onEditar(emp)}>Editar</button>
            <button onClick={() => onEliminar(emp.id)} style={{ marginLeft: '10px' }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    );
  }
  
  export default ListaEmpleados;
  
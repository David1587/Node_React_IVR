import { useState, useEffect } from 'react';

function FormularioEmpleado({
  token,
  onEmpleadoAgregado,
  modoEdicion,
  onGuardarEdicion,
  cancelarEdicion
}) {
  const [nombre, setNombre] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [salario, setSalario] = useState('');
  const [salarioFormateado, setSalarioFormateado] = useState('');
  const [error, setError] = useState(null);

  const formatearCOP = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  useEffect(() => {
    if (modoEdicion) {
      setNombre(modoEdicion.nombre || '');
      setFechaIngreso(modoEdicion.fecha_ingreso?.substring(0, 10) || '');
      const valor = parseFloat(modoEdicion.salario || 0);
      setSalario(valor);
      setSalarioFormateado(formatearCOP(valor));
    } else {
      setNombre('');
      setFechaIngreso('');
      setSalario('');
      setSalarioFormateado('');
    }
  }, [modoEdicion]);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const datosEmpleado = {
      nombre,
      fecha_ingreso: fechaIngreso,
      salario: parseFloat(salario)
    };

    try {
      if (modoEdicion) {
        await onGuardarEdicion({ ...datosEmpleado, id: modoEdicion.id });
      } else {
        await onEmpleadoAgregado(datosEmpleado);
      }

      // Limpiar campos
      setNombre('');
      setFechaIngreso('');
      setSalario('');
      setSalarioFormateado('');
      cancelarEdicion?.();
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('403')) return;
      setError(error.message);
    }
  };

  return (
    <form onSubmit={manejarSubmit}>
      <input
        type="text"
        placeholder="Nombre del empleado"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="date"
        value={fechaIngreso}
        onChange={(e) => setFechaIngreso(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Salario"
        value={salarioFormateado}
        onChange={(e) => {
          const sinFormato = e.target.value.replace(/[^\d]/g, '');
          const valorNumerico = parseInt(sinFormato || '0', 10);
          setSalario(valorNumerico);
          setSalarioFormateado(formatearCOP(valorNumerico));
        }}
        required
      />
      <button type="submit">
        {modoEdicion ? 'Guardar cambios' : 'Agregar'}
      </button>
      {modoEdicion && (
        <button type="button" onClick={cancelarEdicion} style={{ marginLeft: '10px' }}>
          Cancelar
        </button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default FormularioEmpleado;

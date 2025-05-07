import { useState, useRef } from 'react';

function FormularioSolicitud({ empleados, onSolicitudCreada }) {
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [resumen, setResumen] = useState('');
  const [idEmpleado, setIdEmpleado] = useState('');
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!idEmpleado) {
      setError('Selecciona un empleado.');
      return;
    }

    if (resumen.length > 200) {
      setError('El resumen no puede superar los 200 caracteres.');
      return;
    }

    try {
      await onSolicitudCreada({
        codigo,
        descripcion,
        resumen,
        id_empleado: parseInt(idEmpleado)
      });
      
      // Limpiar campos
      setCodigo('');
      setDescripcion('');
      setResumen('');
      setIdEmpleado('');
      ajustarAltura();
    } catch (err) {
      setError(err.message);
    }
  };

  const ajustarAltura = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const nuevaAltura = Math.min(textarea.scrollHeight, 100);
      textarea.style.height = nuevaAltura + 'px';
    }
  };

  return (
    <form onSubmit={manejarSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="Código"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <textarea
          ref={textareaRef}
          placeholder="Resumen"
          value={resumen}
          onChange={(e) => {
            setResumen(e.target.value);
            ajustarAltura();
          }}
          rows={1}
          maxLength={200} // Limitamos la escritura a 200 caracteres en el campo de resumen
          style={{
            resize: 'none',
            overflowY: 'auto',
            maxHeight: '100px',
            minHeight: '30px',
            width: '200px',
          }}
        />
        <small style={{ alignSelf: 'flex-end' }}>{resumen.length}/200</small>
      </div>
      <select
        value={idEmpleado}
        onChange={(e) => setIdEmpleado(e.target.value)}
        required
      >
        <option value="">Seleccione un empleado</option>
        {empleados.map(e => (
          <option key={e.id} value={e.id}>{e.nombre}</option>
        ))}
      </select>
      <button type="submit">Crear solicitud</button>
      {error && <p style={{ color: 'red', width: '100%' }}>{error}</p>}
    </form>
  );
}

export default FormularioSolicitud;

import { useState } from 'react';

function Login({ onLoginExitoso }) {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState(null);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError(null); // limpia errores anteriores
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usuario,
          password: clave
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Usuario o contraseña incorrectos.');
        } else if (res.status === 500) {
          throw new Error('Error interno del servidor. Intenta más tarde.');
        } else {
          const msg = await res.text();
          throw new Error(`Error ${res.status}: ${msg}`);
        }
      }

      const { token } = await res.json();
      localStorage.setItem('token', token);
      onLoginExitoso(token);
    } catch (err) {
      setError(err.message || 'Error inesperado. Intenta más tarde.');
    }
  };

  return (
    <form onSubmit={manejarSubmit}>
      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
        required
      />
      <button type="submit">Iniciar sesión</button>

      {error && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </p>
      )}
    </form>
  );
}

export default Login;

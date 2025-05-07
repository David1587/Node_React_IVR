const API = import.meta.env.VITE_API_URL;

export const obtenerEmpleados = async (token) => {
  try {
    const res = await fetch(`${API}/empleados`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      alert('Tu sesión ha expirado. Inicia sesión nuevamente.');
      window.location.href = '/login';
      return;
    }

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Error ${res.status}: ${msg}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    throw error;
  }
};
export const crearEmpleado = async (empleado, token) => {
  const res = await fetch(`${API}/empleados`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(empleado),
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('token');
    alert('Tu sesión ha expirado. Inicia sesión nuevamente.');
    window.location.href = '/login';
    return;
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error ${res.status}: ${msg}`);
  }

  return await res.json();
};

export const eliminarEmpleado = async (id, token) => {
  const res = await fetch(`${API}/empleados/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('token');
    alert('Tu sesión ha expirado. Inicia sesión nuevamente.');
    window.location.href = '/login';
    return;
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error ${res.status}: ${msg}`);
  }
};

export const actualizarEmpleado = async (id, datos, token) => {
  const res = await fetch(`${API}/empleados/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datos),
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('token');
    alert('Tu sesión ha expirado. Inicia sesión nuevamente.');
    window.location.href = '/login';
    return;
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error ${res.status}: ${msg}`);
  }

  return await res.json();
};

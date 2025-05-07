const API = import.meta.env.VITE_API_URL;

export const obtenerSolicitudes = async (token) => {
  const res = await fetch(`${API}/solicitudes`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
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

export const crearSolicitud = async (solicitud, token) => {
  const res = await fetch(`${API}/solicitudes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(solicitud),
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

export const eliminarSolicitud = async (id, token) => {
  const res = await fetch(`${API}/solicitudes/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
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

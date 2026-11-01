const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || `Error HTTP: ${res.status}`);
    }
    return json.data;
  } catch (error) {
    console.error(`Fallo en llamada a ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Autenticación
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  // Informes Técnicos
  getInformes: () => request("/informes"),
  getInformeDetalle: (id) => request(`/informes/${id}`),
  crearInforme: (payload) =>
    request("/informes", { method: "POST", body: JSON.stringify(payload) }),

  // Solicitantes
  getSolicitantes: () => request("/solicitantes"),
  crearSolicitante: (payload) =>
    request("/solicitantes", { method: "POST", body: JSON.stringify(payload) }),

  // Inventario
  getEquipos: () => request("/inventario/equipos"),
  getHerramientas: () => request("/inventario/herramientas"),
  getRefacciones: () => request("/inventario/refacciones"),
};

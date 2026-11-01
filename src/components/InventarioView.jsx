import { useState, useEffect } from "react";
import { Laptop, Wrench, Package, AlertTriangle } from "lucide-react";
import { api } from "../services/api";

export default function InventarioView() {
  const [tab, setTab] = useState("refacciones"); // 'refacciones' | 'equipos' | 'herramientas'
  const [equipos, setEquipos] = useState([]);
  const [herramientas, setHerramientas] = useState([]);
  const [refacciones, setRefacciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getEquipos(), api.getHerramientas(), api.getRefacciones()])
      .then(([eq, herr, ref]) => {
        setEquipos(Array.isArray(eq) ? eq : []);
        setHerramientas(Array.isArray(herr) ? herr : []);
        setRefacciones(Array.isArray(ref) ? ref : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Selector de pestañas */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          onClick={() => setTab("refacciones")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition ${
            tab === "refacciones"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Package size={16} /> Refacciones / Repuestos ({refacciones.length})
        </button>
        <button
          onClick={() => setTab("equipos")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition ${
            tab === "equipos"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Laptop size={16} /> Equipos / Hardware ({equipos.length})
        </button>
        <button
          onClick={() => setTab("herramientas")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold border-b-2 transition ${
            tab === "herramientas"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Wrench size={16} /> Herramientas ({herramientas.length})
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-12 text-slate-400">
            Cargando catálogo de inventario...
          </div>
        ) : (
          <>
            {/* Pestaña: Refacciones */}
            {tab === "refacciones" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                    <tr>
                      <th className="p-3">Código</th>
                      <th className="p-3">Nombre</th>
                      <th className="p-3">Descripción</th>
                      <th className="p-3 text-center">Stock Actual</th>
                      <th className="p-3 text-center">Alerta Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {refacciones.map((r) => {
                      const bajoStock = r.stock_actual <= r.stock_minimo;
                      return (
                        <tr key={r.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-bold text-xs text-blue-600">
                            {r.codigo}
                          </td>
                          <td className="p-3 font-medium text-slate-800">
                            {r.nombre}
                          </td>
                          <td className="p-3 text-xs text-slate-500">
                            {r.descripcion || "Sin descripción"}
                          </td>
                          <td className="p-3 text-center font-bold text-slate-800">
                            {r.stock_actual}
                          </td>
                          <td className="p-3 text-center">
                            {bajoStock ? (
                              <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                <AlertTriangle size={12} /> Reabastecer
                              </span>
                            ) : (
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                                Óptimo
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pestaña: Equipos */}
            {tab === "equipos" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                    <tr>
                      <th className="p-3">Serial</th>
                      <th className="p-3">Equipo</th>
                      <th className="p-3">Código Bien</th>
                      <th className="p-3">Asignado a</th>
                      <th className="p-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {equipos.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono text-xs font-bold text-slate-700">
                          {e.serial}
                        </td>
                        <td className="p-3 font-medium text-slate-900">
                          {e.tipo} {e.marca} {e.modelo}
                        </td>
                        <td className="p-3 text-xs text-slate-500">
                          {e.codigo_patrimonial || "N/A"}
                        </td>
                        <td className="p-3 text-xs">
                          {e.asignado_a || "Sin asignar"}
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full font-medium uppercase">
                            {e.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pestaña: Herramientas */}
            {tab === "herramientas" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                    <tr>
                      <th className="p-3">Código</th>
                      <th className="p-3">Herramienta</th>
                      <th className="p-3">Categoría</th>
                      <th className="p-3 text-center">Disponibilidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {herramientas.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono text-xs font-bold text-blue-600">
                          {h.codigo}
                        </td>
                        <td className="p-3 font-medium text-slate-900">
                          {h.nombre}
                        </td>
                        <td className="p-3 text-xs">
                          {h.categoria || "General"}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                              h.estado === "disponible"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {h.estado?.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

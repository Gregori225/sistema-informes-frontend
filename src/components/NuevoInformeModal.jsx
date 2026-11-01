import { useState, useEffect } from "react";
import { X, Wrench, Package, Send } from "lucide-react";
import { api } from "../services/api";

export default function NuevoInformeModal({
  isOpen,
  onClose,
  onCreated,
  usuarioActualId,
}) {
  const [solicitantes, setSolicitantes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [herramientas, setHerramientas] = useState([]);
  const [refacciones, setRefacciones] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    codigo_informe: `INF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    solicitante_id: "",
    usuario_id: usuarioActualId || 2, // Vincula automáticamente al usuario que inició sesión
    equipo_id: "",
    descripcion_solicitud: "",
    diagnostico_problema: "",
    observaciones_recomendaciones: "",
    estado: "en_proceso",
  });

  const [selectedHerramientas, setSelectedHerramientas] = useState([]);
  const [selectedRefaccion, setSelectedRefaccion] = useState({
    refaccion_id: "",
    cantidad: 1,
  });

  // Si el usuario autenticado llega después (p. ej. carga asíncrona del contexto),
  // sincronizamos el usuario_id sin pisar el resto del formulario.
  useEffect(() => {
    if (usuarioActualId) {
      setFormData((prev) =>
        prev.usuario_id === usuarioActualId
          ? prev
          : { ...prev, usuario_id: usuarioActualId },
      );
    }
  }, [usuarioActualId]);

  useEffect(() => {
    if (isOpen) {
      // Cargar catálogos en paralelo
      Promise.all([
        api.getSolicitantes(),
        api.getEquipos(),
        api.getHerramientas(),
        api.getRefacciones(),
      ])
        .then(([sols, eqs, herrs, refs]) => {
          setSolicitantes(sols);
          setEquipos(eqs);
          setHerramientas(herrs.filter((h) => h.estado === "disponible"));
          setRefacciones(refs.filter((r) => r.stock_actual > 0));
        })
        .catch((err) => alert("Error cargando catálogos: " + err.message));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      solicitante_id: Number(formData.solicitante_id),
      equipo_id: Number(formData.equipo_id),
      herramientas: selectedHerramientas,
      refacciones: selectedRefaccion.refaccion_id
        ? [
            {
              refaccion_id: Number(selectedRefaccion.refaccion_id),
              cantidad: Number(selectedRefaccion.cantidad),
            },
          ]
        : [],
    };

    try {
      await api.crearInforme(payload);
      alert("¡Informe Técnico generado exitosamente!");
      onCreated();
      onClose();
    } catch (err) {
      alert(err.message || "Error al generar el informe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden my-8">
        <div className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white">
          <h2 className="text-lg font-bold">Generar Nuevo Informe Técnico</h2>
          <button onClick={onClose}>
            <X size={20} className="hover:text-red-400" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Fila 1: Código y Solicitante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Código de Informe
              </label>
              <input
                type="text"
                readOnly
                value={formData.codigo_informe}
                className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-2 text-sm text-slate-700 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Solicitante *
              </label>
              <select
                required
                value={formData.solicitante_id}
                onChange={(e) =>
                  setFormData({ ...formData, solicitante_id: e.target.value })
                }
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Seleccione Solicitante...</option>
                {solicitantes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.cedula} - {s.nombre_completo} ({s.departamento})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 2: Equipo a Intervenir */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Equipo / Hardware *
            </label>
            <select
              required
              value={formData.equipo_id}
              onChange={(e) =>
                setFormData({ ...formData, equipo_id: e.target.value })
              }
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Seleccione Equipo...</option>
              {equipos.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.tipo} {eq.marca} {eq.modelo} [Serial: {eq.serial}] -
                  Estado: {eq.estado}
                </option>
              ))}
            </select>
          </div>

          {/* Requerimientos Funcionales: Tres campos obligatorios */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              1. Descripción de la Solicitud *
            </label>
            <textarea
              rows="2"
              required
              placeholder="Indique lo manifestado por el solicitante..."
              value={formData.descripcion_solicitud}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  descripcion_solicitud: e.target.value,
                })
              }
              className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              2. Diagnóstico / Problema Detectado *
            </label>
            <textarea
              rows="2"
              required
              placeholder="Causa raíz encontrada por el usuario/técnico..."
              value={formData.diagnostico_problema}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  diagnostico_problema: e.target.value,
                })
              }
              className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              3. Observaciones y Recomendaciones *
            </label>
            <textarea
              rows="2"
              required
              placeholder="Solución ejecutada y pautas para el usuario..."
              value={formData.observaciones_recomendaciones}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  observaciones_recomendaciones: e.target.value,
                })
              }
              className="w-full border border-slate-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Módulo de Inventario Integrado: Refacciones y Herramientas */}
          <div className="border-t border-slate-200 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg">
            {/* Repuestos */}
            <div>
              <span className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-2">
                <Package size={14} /> Asignar Refacción (Opcional)
              </span>
              <div className="flex gap-2">
                <select
                  className="w-3/4 border border-slate-300 rounded px-2 py-1 text-xs"
                  value={selectedRefaccion.refaccion_id}
                  onChange={(e) =>
                    setSelectedRefaccion({
                      ...selectedRefaccion,
                      refaccion_id: e.target.value,
                    })
                  }
                >
                  <option value="">Ninguna...</option>
                  {refacciones.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre} (Stock: {r.stock_actual})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="w-1/4 border border-slate-300 rounded px-2 py-1 text-xs"
                  value={selectedRefaccion.cantidad}
                  onChange={(e) =>
                    setSelectedRefaccion({
                      ...selectedRefaccion,
                      cantidad: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Herramientas */}
            <div>
              <span className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-2">
                <Wrench size={14} /> Herramientas Usadas
              </span>
              <div className="max-h-24 overflow-y-auto space-y-1 text-xs">
                {herramientas.length === 0 ? (
                  <p className="text-slate-400">Sin herramientas disponibles</p>
                ) : (
                  herramientas.map((h) => (
                    <label
                      key={h.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={h.id}
                        onChange={(e) => {
                          const id = Number(e.target.value);
                          setSelectedHerramientas((prev) =>
                            e.target.checked
                              ? [...prev, id]
                              : prev.filter((x) => x !== id),
                          );
                        }}
                      />
                      <span>
                        {h.nombre} ({h.codigo})
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-sm text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-sm disabled:opacity-50"
            >
              <Send size={16} />
              {loading ? "Guardando..." : "Crear y Finalizar Informe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Plus, FileText, Cpu, CheckCircle2, Clock } from "lucide-react";
import { api } from "./services/api";
import NuevoInformeModal from "./components/NuevoInformeModal";

export default function App() {
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargarInformes = async () => {
    setLoading(true);
    try {
      const data = await api.getInformes();
      setInformes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInformes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Cpu className="text-blue-500" size={26} />
          <div>
            <h1 className="text-base font-bold tracking-tight">
              SIGITEC - Control de Informes e Inventario
            </h1>
            <p className="text-xs text-slate-400">
              Proyecto Socio-Tecnológico | TSU en Informática
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          <Plus size={18} /> Nuevo Informe Técnico
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            Informes Técnicos Registrados
          </h2>
          <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
            Total: {informes.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">
            Cargando registros desde Neon...
          </div>
        ) : informes.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-dashed border-slate-300">
            <p className="text-slate-500">No hay informes registrados aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {informes.map((inf) => (
              <div
                key={inf.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                      {inf.codigo_informe}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                        inf.estado === "completado"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {inf.estado === "completado" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {inf.estado.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 text-sm mb-1">
                    {inf.equipo_tipo} {inf.equipo_marca} {inf.equipo_modelo}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mb-3">
                    Serial: {inf.equipo_serial}
                  </p>

                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p>
                      <strong className="text-slate-700">Solicitante:</strong>{" "}
                      {inf.solicitante} ({inf.departamento})
                    </p>
                    <p>
                      <strong className="text-slate-700">Responsable:</strong>{" "}
                      {inf.tecnico_responsable}
                    </p>
                    <p className="line-clamp-2">
                      <strong className="text-slate-700">Falla:</strong>{" "}
                      {inf.diagnostico_problema}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  Registrado el:{" "}
                  {new Date(inf.fecha_solicitud).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <NuevoInformeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={cargarInformes}
      />
    </div>
  );
}

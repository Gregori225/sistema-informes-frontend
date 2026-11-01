import { CheckCircle2, Clock, Monitor } from "lucide-react";

export default function InformesList({ informes, loading }) {
  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span>Consultando informes en Neon...</span>
      </div>
    );
  }

  if (!informes || informes.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-dashed border-slate-300">
        <Monitor className="mx-auto text-slate-400 mb-2" size={32} />
        <p className="text-slate-500 font-medium">
          No hay informes técnicos registrados aún.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Presiona "Nuevo Informe Técnico" para registrar el primero.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {informes.map((inf) => (
        <div
          key={inf.id}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition"
        >
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
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
                {inf.estado?.toUpperCase()}
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
                <strong className="text-slate-700">Operador a cargo:</strong>{" "}
                {inf.tecnico_responsable}
              </p>
              <p className="line-clamp-2">
                <strong className="text-slate-700">Diagnóstico:</strong>{" "}
                {inf.diagnostico_problema}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between items-center">
            <span>
              Fecha:{" "}
              {inf.fecha_solicitud
                ? new Date(inf.fecha_solicitud).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

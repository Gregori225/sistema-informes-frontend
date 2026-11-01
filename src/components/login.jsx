import { useState } from "react";
import { Cpu, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { api } from "../services/api";

export default function Login({ onLoginSuccess }) {
  const [correo, setCorreo] = useState("carlos.mendoza@sistema.local");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await api.login({ correo, password });
      // Guardar sesión
      localStorage.setItem("sigitec_user", JSON.stringify(data.usuario));
      localStorage.setItem("sigitec_token", data.token);
      onLoginSuccess(data.usuario);
    } catch (err) {
      setError(err.message || "Error al autenticar. Verifique credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-800">
        <div className="bg-slate-950 p-6 text-center text-white border-b border-slate-800">
          <div className="inline-flex p-3 bg-blue-600/20 text-blue-500 rounded-xl mb-3">
            <Cpu size={32} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SIGITEC</h1>
          <p className="text-xs text-slate-400 mt-1">
            Sistema de Informes Técnicos e Inventario
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-2.5 text-slate-400"
                size={16}
              />
              <input
                type="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="ejemplo@sistema.local"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-2.5 text-slate-400"
                size={16}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? "Accediendo..." : "Iniciar Sesión"}
            <ArrowRight size={16} />
          </button>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <p className="font-semibold text-slate-700">
              Credenciales de prueba:
            </p>
            <p>
              • Operador: <code>carlos.mendoza@sistema.local</code> (rol:
              usuario)
            </p>
            <p>
              • Clave para ambos: <code>admin123</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

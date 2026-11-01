import { useState, useEffect } from "react";
import {
  FileText,
  Package,
  Cpu,
  LogOut,
  User,
  ShieldCheck,
  Plus,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { api } from "./services/api";
import Login from "./components/Login";
import InformesList from "./components/InformesList";
import InventarioView from "./components/InventarioView";
import NuevoInformeModal from "./components/NuevoInformeModal";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [moduloActivo, setModuloActivo] = useState("informes"); // 'informes' | 'inventario'
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorApi, setErrorApi] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Comprobar si hay sesión en localStorage al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem("sigitec_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("sigitec_user");
      }
    }
  }, []);

  const cargarInformes = async () => {
    setLoading(true);
    setErrorApi(null);
    try {
      const data = await api.getInformes();
      setInformes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setErrorApi(err.message || "No se pudo conectar con el servidor.");
      setInformes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && moduloActivo === "informes") {
      cargarInformes();
    }
  }, [currentUser, moduloActivo]);

  const handleLogout = () => {
    localStorage.removeItem("sigitec_user");
    localStorage.removeItem("sigitec_token");
    setCurrentUser(null);
  };

  // Si no está autenticado, muestra únicamente la pantalla de Login
  if (!currentUser) {
    return <Login onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* ========================================================= */}
      {/* BARRA LATERAL (SIDEBAR) - NAVEGACIÓN MODULAR INDEPENDIENTE */}
      {/* ========================================================= */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col justify-between shrink-0">
        <div>
          {/* Logo y Encabezado */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Cpu size={22} />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide">SIGITEC</h1>
              <p className="text-[10px] text-slate-400">
                Control Socio-Tecnológico
              </p>
            </div>
          </div>

          {/* Menú de Módulos (Completamente Desacoplados) */}
          <nav className="p-4 space-y-1">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Módulos del Sistema
            </p>

            <button
              onClick={() => setModuloActivo("informes")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                moduloActivo === "informes"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <FileText size={18} />
              <span>Informes Técnicos</span>
            </button>

            <button
              onClick={() => setModuloActivo("inventario")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                moduloActivo === "inventario"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Package size={18} />
              <span>Control de Inventario</span>
            </button>
          </nav>
        </div>

        {/* Perfil del Usuario y Cerrar Sesión */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-blue-400 font-bold text-xs">
              {currentUser.nombre.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white truncate">
                {currentUser.nombre}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold uppercase">
                <ShieldCheck size={10} /> Rol: {currentUser.rol}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-300 text-xs py-2 rounded-lg transition"
          >
            <LogOut size={14} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* ÁREA DE TRABAJO DINÁMICA (SEGÚN EL MÓDULO ACTIVO)         */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {moduloActivo === "informes"
                ? "Módulo de Informes Técnicos"
                : "Módulo de Gestión de Inventario"}
            </h2>
            <p className="text-xs text-slate-500">
              {moduloActivo === "informes"
                ? "Elaboración, seguimiento y diagnóstico de servicios técnicos"
                : "Control de Equipos, Refacciones y Disponibilidad de Herramientas"}
            </p>
          </div>

          {moduloActivo === "informes" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow transition"
            >
              <Plus size={16} /> Redactar Nuevo Informe
            </button>
          )}
        </header>

        <main className="p-8 flex-1">
          {errorApi && moduloActivo === "informes" && (
            <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-600" />
                <span>{errorApi}</span>
              </div>
              <button
                onClick={cargarInformes}
                className="flex items-center gap-1 font-semibold underline"
              >
                <RefreshCw size={12} /> Reintentar
              </button>
            </div>
          )}

          {/* Renderizado Condicional del Módulo Seleccionado */}
          {moduloActivo === "informes" ? (
            <InformesList informes={informes} loading={loading} />
          ) : (
            <InventarioView />
          )}
        </main>
      </div>

      {/* Modal para Crear Informe Técnico */}
      <NuevoInformeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={cargarInformes}
        usuarioActualId={currentUser.id}
      />
    </div>
  );
}

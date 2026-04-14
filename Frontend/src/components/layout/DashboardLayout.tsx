// Layout component
import { useState } from 'react';
import { Outlet, Link } from '@tanstack/react-router';
import { useAuth } from '../../hooks/useAuth';

export const DashboardLayout = () => {
  const { isVendedor, userName, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Extraer iniciales del nombre
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return (parts[0]?.[0] || '' + parts[1]?.[0] || '').toUpperCase();
  };

  // Para vendedor: Sidebar simplificado
  if (isVendedor) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] font-sans text-[#182442] antialiased">
        {/* HEADER VENDEDOR */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-[#c6c6ce]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="leading-tight">
                <div className="text-lg font-bold tracking-tighter text-[#182442]">CRM Intelligent</div>
                <div className="text-sm font-normal text-[#006c49]">Panel Vendedor</div>
              </div>
            </div>
            
            {/* BUSCADOR */}
            <div className="flex-1 max-w-md mx-2 sm:mx-8">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/50 px-3 py-1.5 focus-within:border-[#006c49] transition-all sm:px-4 sm:py-2">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                <input 
                  className="w-full bg-transparent border-0 p-0 text-sm focus:ring-0 placeholder:text-slate-400" 
                  placeholder="Buscar leads..." 
                  type="search" 
                />
              </div>
            </div>        

            {/* PERFIL AVATAR CON MENÚ */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-[#006c49] text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-md hover:bg-[#005236] transition-all"
              >
                {getInitials(userName)}
              </button>

              {/* Menú Desplegable */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-50">
                  {/* Encabezado */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-[#006c49] text-white flex items-center justify-center font-bold text-sm">
                      {getInitials(userName)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#182442]">{userName}</p>
                    </div>
                  </div>

                  {/* Opciones */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm text-[#182442] transition-all">
                      <span className="material-symbols-outlined text-lg">settings</span>
                      <span>Configuración</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm text-[#182442] transition-all">
                      <span className="material-symbols-outlined text-lg">image</span>
                      <span>Cambiar foto</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm text-[#182442] transition-all">
                      <span className="material-symbols-outlined text-lg">brightness_4</span>
                      <span>Tema oscuro</span>
                    </button>
                    <div className="border-t border-slate-100 pt-2 mt-2">
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600 font-semibold transition-all">
                        <span className="material-symbols-outlined text-lg">logout</span>
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CUERPO - SIDEBAR SIMPLIFICADO + CONTENIDO */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SIDEBAR VENDEDOR SIMPLIFICADO */}
          <aside className="lg:col-span-3">
            <nav className="bg-white/70 backdrop-blur-xl border border-[#c6c6ce]/20 rounded-2xl p-4 sticky top-24">
              <div className="space-y-1">
                <Link 
                  activeProps={{ className: "bg-[#006c49]/10 text-[#006c49] font-bold" }} 
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-[#f3f4f5]"
                  to="/dashboard"
                >     
                  <span className="material-symbols-outlined">space_dashboard</span> 
                  Resumen
                </Link>

                <Link 
                  activeProps={{ className: "bg-[#006c49]/10 text-[#006c49] font-bold" }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-[#f3f4f5]"
                  to="/contactos"
                >
                  <span className="material-symbols-outlined">person</span> Leads
                </Link>

                <Link 
                  activeProps={{ className: "bg-[#006c49]/10 text-[#006c49] font-bold" }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#f3f4f5] transition-all"
                  to="/mi-inbox"
                >
                  <span className="material-symbols-outlined">mail</span> Inbox
                </Link>

                <div className="mt-6 pt-4 border-t border-[#c6c6ce]/20">
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span> 
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </nav>
          </aside>

          {/* CONTENIDO */}
          <main className="lg:col-span-9">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  // ============================================
  // PARA ADMIN: Sidebar Completo (Original)
  // ============================================
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-[#182442] antialiased">
      
      {/* 1. HEADER CON BUSCADOR (Recuperado) */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-[#c6c6ce]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="leading-tight">
              <div className="text-lg font-bold tracking-tighter text-[#182442]">CRM Intelligent</div>
              <div className="text-[10px] uppercase tracking-widest text-[#006c49] font-bold">Panel Administrativo</div>
            </div>
          </div>
          
          {/* BUSCADOR CENTRAL */}
          <div className="flex-1 max-w-md mx-2 sm:mx-8">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/50 px-3 py-1.5 focus-within:border-[#006c49] transition-all sm:px-4 sm:py-2">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
              <input 
                className="w-full bg-transparent border-0 p-0 text-sm focus:ring-0 placeholder:text-slate-400" 
                placeholder="Buscar leads, clientes..." 
                type="search" 
              />
            </div>
          </div>        

          {/* ACCIONES Y PERFIL */}
          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-[#006c49] text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-md hover:bg-[#005236] transition-all"
            >
              {getInitials(userName)}
            </button>

            {/* Menú Desplegable */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-3 z-50 top-full">
                {/* Encabezado */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-[#006c49] text-white flex items-center justify-center font-bold text-sm">
                    {getInitials(userName)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#182442]">{userName}</p>
                  </div>
                </div>

                {/* Opciones */}
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm text-[#182442] transition-all">
                    <span className="material-symbols-outlined text-lg">settings</span>
                    <span>Configuración</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm text-[#182442] transition-all">
                    <span className="material-symbols-outlined text-lg">image</span>
                    <span>Cambiar foto</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm text-[#182442] transition-all">
                    <span className="material-symbols-outlined text-lg">brightness_4</span>
                    <span>Tema oscuro</span>
                  </button>
                  <div className="border-t border-slate-100 pt-2 mt-2">
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-sm text-red-600 font-semibold transition-all">
                      <span className="material-symbols-outlined text-lg">logout</span>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. CUERPO DEL DASHBOARD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIDEBAR (Módulos y Estados Recuperados) */}
        <aside className="lg:col-span-3">
          <nav className="bg-white/70 backdrop-blur-xl border border-[#c6c6ce]/20 rounded-2xl p-4 sticky top-24">
            
            {/* SECCIÓN MÓDULOS */}
            <div className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 mb-4 px-2">Módulos</div>
            <div className="space-y-1">
              <Link 
                activeProps={{ className: "bg-[#006c49]/10 text-[#006c49] font-bold" }} 
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-[#f3f4f5]"
                to="/dashboard"
              >     
                <span className="material-symbols-outlined">space_dashboard</span> 
                Resumen
              </Link>
              <Link 
                activeProps={{ className: "bg-[#006c49]/10 text-[#006c49] font-bold" }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#f3f4f5] transition-all"
                to="/contactos"
              >
                <span className="material-symbols-outlined">person</span> Leads
              </Link>
              <Link 
                activeProps={{ className: "bg-[#006c49]/10 text-[#006c49] font-bold" }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#f3f4f5] transition-all"
                to="/vendedores"
              >
                <span className="material-symbols-outlined">people</span> Vendedores
              </Link>
              <Link 
                activeProps={{ className: "bg-[#006c49]/10 text-[#006c49] font-bold" }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#f3f4f5] transition-all"
                to="/inbox"
              >
                <span className="material-symbols-outlined">mail</span> Inbox
              </Link>
              <Link 
                activeProps={{ className: "bg-[#006c49]/10 text-[#006c49] font-bold" }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#f3f4f5] transition-all"
                to="/metricas"
              >
                <span className="material-symbols-outlined">analytics</span> Métricas
              </Link>
              <Link 
                activeProps={{ className: "bg-[#006c49]/10 text-[#006c49] font-bold" }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#f3f4f5] transition-all"
                to="/plantillas"
              >
                <span className="material-symbols-outlined">mail_outline</span> Plantillas
              </Link>

              {/* BOTÓN SALIR */}
              <div className="mt-4 pt-4 border-t border-[#c6c6ce]/20">
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all">
                  <span className="material-symbols-outlined text-[20px]">logout</span> 
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </nav>
        </aside>

        {/* CONTENIDO DE LA PÁGINA */}
        <main className="lg:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
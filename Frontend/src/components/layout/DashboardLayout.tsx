import React from 'react';
import { Outlet, Link } from '@tanstack/react-router';

export const DashboardLayout = () => {
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
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 rounded-xl bg-[#182442] text-white px-4 py-2 text-xs font-bold shadow-lg shadow-[#182442]/20 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-sm">person_add</span>
              <span>Nuevo Lead</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-[#006c49] text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-md">HA</div>
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
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-[#182442] hover:bg-[#f3f4f5] transition-all">
                <span className="material-symbols-outlined">inbox</span> Inbox Unificado
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-[#182442] hover:bg-[#f3f4f5] transition-all">
                <span className="material-symbols-outlined">view_kanban</span> Funnel / Pipeline
              </button>
            </div>

            <div className="h-px bg-[#c6c6ce]/30 my-6"></div>
            
            {/* SECCIÓN ESTADOS */}
            <div className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 mb-3 px-2">Estados</div>
            <div className="flex flex-wrap gap-2 px-2">
              <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100 uppercase">Lead Activo</span>
              <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 text-[10px] font-bold border border-green-100 uppercase">Cliente</span>
              <span className="px-2 py-1 rounded-lg bg-yellow-50 text-yellow-700 text-[10px] font-bold border border-yellow-100 uppercase">Seguimiento</span>
            </div>

            {/* BOTÓN SALIR */}
            <div className="mt-8 pt-4 border-t border-[#c6c6ce]/20">
              <Link className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all" to="/">
                <span className="material-symbols-outlined text-[20px]">logout</span> 
                Cerrar Sesión
              </Link>
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
};
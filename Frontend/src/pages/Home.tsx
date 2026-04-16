import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';

export const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const authCardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8f9fa] font-body text-[#191c1d] antialiased min-h-screen flex flex-col">
      
      {/* 1. NAVBAR - CORREGIDA Y RESPONSIVA */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="flex justify-between items-center px-6 lg:px-12 py-4 max-w-[1440px] mx-auto w-full">
          {/* Logo Texto Izquierda */}
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tighter text-[#182442]">CRM Intelligent</span>
            <span className="text-[10px] uppercase tracking-widest text-[#006c49] font-bold">Smart Sync</span>
          </div>
          
          {/* Menú Desktop - Centrado/Derecha */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex gap-8 text-sm font-semibold text-[#45464e]">
              <a className="hover:text-[#006c49] transition-colors" href="#">Soluciones</a>
              <a className="hover:text-[#006c49] transition-colors" href="#">Precios</a>
              <a className="hover:text-[#006c49] transition-colors" href="#">Acerca de</a>
              <a className="hover:text-[#006c49] transition-colors" href="#">Soporte</a>
            </div>
            
            <div className="flex items-center gap-4 border-l pl-8 border-slate-200">
             <button 
              className="text-sm font-bold text-[#45464e] hover:text-[#006c49] transition-colors"
              onClick={() => navigate({ to: '/login' })}>
              Iniciar Sesión
            </button>
              <button 
                className="bg-[#182442] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:bg-[#25335a] transition-all"
                onClick={() => navigate({ to: '/register' })}>
                Registrarme
              </button>
            </div>
          </div>

          {/* Icono Menú Móvil */}
          <button className="lg:hidden p-2" onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); }}>
            <span className="material-symbols-outlined text-[#182442]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Menú Desplegable Móvil - Refinado y Reducido */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 p-4 flex flex-col gap-3 animate-in slide-in-from-top w-full shadow-xl">
            
            {/* Botón Iniciar Sesión: Ahora parece un botón real */}
            <button 
                className="w-full text-center py-2.5 px-4 rounded-lg font-bold text-sm text-white bg-[#008f60] hover:bg-[#00a36e] shadow-lg active:bg-[#006c49] transition-all" 
                onClick={() => { navigate({ to: '/login' }); setIsMobileMenuOpen(false); }}>
                Iniciar Sesión
           </button>

            {/* Botón Registrarme: Tamaño reducido */}
            <button 
              className="w-full bg-[#182442] text-white py-2.5 px-4 rounded-lg font-bold text-sm text-center shadow-md active:scale-[0.98] transition-all" 
              onClick={() => { navigate({ to: '/register' }); setIsMobileMenuOpen(false); }}
            >
              Registrarme
            </button>

            {/* Links adicionales opcionales (Soluciones, Precios) en tamaño pequeño */}
            <div className="flex justify-around mt-2 pt-2 border-t border-slate-100">
              <a className="text-[11px] font-bold text-[#006c49] uppercase tracking-wider" href="#">Soluciones</a>
              <a className="text-[11px] font-bold text-[#45464e] uppercase tracking-wider" href="#">Precios</a>
              <a className="text-[11px] font-bold text-[#45464e] uppercase tracking-wider" href="#">Soporte</a>
            </div>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION - SIN MÓDULOS NI SIDEBAR */}
      <main className="flex-grow pt-32 lg:pt-40 pb-20 aura-gradient">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Columna Texto */}
          <div className="flex flex-col gap-8 text-center lg:text-left">
            <img alt="Logo" className="h-44 w-fit mx-auto lg:mx-4 drop-shadow-md" src="/img/imagen_crm.webp" />
            
            <h1 className="text-4xl lg:text-[3.8rem] leading-[1.05] font-medium tracking-tight text-[#182442]">
              Centraliza tus ventas de <span className="text-[#006c49]">WhatsApp</span> y Email en un solo lugar
            </h1>

            <p className="text-[#45464e] text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
              Impulsa la productividad de tu PYME con nuestra interfaz unificada. Gestiona cada interacción comercial sin el ruido visual.
            </p>

            {/* KPIs y Avatares */}
            <div className="flex items-center justify-center lg:justify-start gap-10 mt-4">
              <div className="flex flex-col">
                <span className="text-5xl font-medium text-[#182442]">91%</span>
                <span className="text-[10px] uppercase tracking-widest text-[#45464e] font-black">Eficiencia</span>
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3].map(index => (
                  <img key={index} alt="user" className="w-11 h-11 rounded-full border-2 border-white shadow-sm" src={`https://i.pravatar.cc/100?u=${index}`} />
                ))}
                <div className="w-11 h-11 rounded-full border-2 border-white bg-[#edeeef] flex items-center justify-center text-[10px] font-bold text-[#182442] shadow-sm">
                  +12k
                </div>
              </div>
            </div>
          </div>

          {/* Columna CTA - Únete Ahora */}
          <div ref={authCardRef} className="w-full max-w-md mx-auto lg:mr-0 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-[#006c49] to-[#005a3d] rounded-[2rem] p-10 shadow-[0_25px_50px_-12px_rgba(0,108,73,0.3)] border border-[#008f60]/30 text-white">
              <h2 className="text-2xl font-bold mb-2">Listo para activar</h2>
              <p className="text-sm text-white/90 mb-8">
                Integra WhatsApp y Email en minutos. Sin instalaciones complicadas.
              </p>
              
              <button 
                onClick={() => navigate({ to: '/login' })}
                className="w-full py-3 bg-white text-[#006c49] rounded-lg font-bold text-sm shadow-lg hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                Iniciar Sesión
              </button>

              <p className="text-xs text-white/70 text-center mt-6">
                Prueba gratuita. Cancela en cualquier momento.
              </p>
            </div>

            {/* Card de Características */}
            <div className="bg-white rounded-[1.5rem] p-6 shadow-lg border border-slate-100 space-y-4">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-[#006c49] flex-shrink-0">check_circle</span>
                <p className="text-sm font-semibold text-slate-900">Soporte 24/7</p>
              </div>
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-[#006c49] flex-shrink-0">check_circle</span>
                <p className="text-sm font-semibold text-slate-900">Datos cifrados</p>
              </div>
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-[#006c49] flex-shrink-0">check_circle</span>
                <p className="text-sm font-semibold text-slate-900">GDPR Compliant</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. FOOTER - FIJO ABAJO */}
      <footer className="bg-white border-t border-slate-100 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-bold text-[#182442] tracking-tighter">CRM Intelligent</p>
            <p className="text-[10px] text-[#45464e] font-medium uppercase tracking-widest mt-1">© 2026 Global Smart Sync Solutions. Cartago, Valle.</p>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-[#45464e]">
            <a className="hover:text-[#006c49]" href="#">Privacidad</a>
            <a className="hover:text-[#006c49]" href="#">Términos</a>
            <a className="hover:text-[#006c49]" href="#">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
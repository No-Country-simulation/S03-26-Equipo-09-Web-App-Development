import { Outlet, useNavigate } from '@tanstack/react-router';
import { JSX, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { useLanguage } from '../../hooks/useLanguage';
import { Sidebar } from './Sidebar';
import { countSinLeer } from '../../services/conversacionesService';
import { countPendientes } from '../../services/seguimientosService';

export const DashboardLayout = (): JSX.Element => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sinLeer, setSinLeer] = useState(0);
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    void (async (): Promise<void> => {
      const [sl, pe] = await Promise.all([countSinLeer(), countPendientes()]);
      setSinLeer(sl);
      setPendientes(pe);
    })();
  }, []);

  const handleLogout = async (): Promise<void> => {
    await logout();
    void navigate({ to: '/' });
  };

  const userInitials = user
    ? user.username.split(/[._\s]+/).map(p => p[0]?.toUpperCase() ?? '').slice(0, 2).join('')
    : 'HA';

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f8fa] font-sans antialiased">

      {/* ══ SIDEBAR desktop ══ */}
      <div className="hidden lg:flex shrink-0 h-screen">
        <Sidebar pendientes={pendientes} sinLeer={sinLeer} />
      </div>

      {/* ══ MOBILE overlay ══ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => { setMobileOpen(false); }}
        />
      )}
      {/* Mobile sidebar panel */}
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* In mobile we always show expanded version */}
        <div className="h-full w-55" onMouseEnter={() => {}} onMouseLeave={() => {}}>
          <Sidebar pendientes={pendientes} sinLeer={sinLeer} />
        </div>
      </div>

      {/* ══ MAIN ══ */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── TOP HEADER ── */}
        <header className="shrink-0 h-14 bg-white border-b border-slate-100 flex items-center gap-4 px-4 sm:px-6">

          {/* Mobile menu button */}
          <button
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => { setMobileOpen(!mobileOpen); }}
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm hidden sm:block">
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 focus-within:bg-white focus-within:border-[#182442]/30 focus-within:ring-2 focus-within:ring-[#182442]/8 px-3 py-1.5 transition-all">
              <span className="material-symbols-outlined text-slate-400 text-[16px] shrink-0">search</span>
              <input
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 border-none outline-none"
                placeholder={language === 'es' ? 'Buscar...' : 'Search...'}
                type="search"
              />
              <kbd className="hidden md:inline text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded px-1">⌘K</kbd>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>
                notifications
              </span>
              {(sinLeer > 0 || pendientes > 0) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#006c49]" />
              )}
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200 mx-1" />

            {/* New Contact CTA */}
            <a
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182442] text-white text-xs font-semibold hover:bg-[#1e2e55] active:scale-95 transition-all"
              href="/dashboard/contactos"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              {language === 'es' ? 'Nuevo Lead' : 'New Lead'}
            </a>

            {/* Avatar */}
            <button
              className="w-7 h-7 rounded-full bg-[#006c49] text-white flex items-center justify-center text-[11px] font-bold hover:ring-2 hover:ring-[#006c49]/30 transition-all"
              title={t('nav.logout')}
              onClick={() => { void handleLogout(); }}
            >
              {userInitials}
            </button>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 overflow-y-auto crm-scroll">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
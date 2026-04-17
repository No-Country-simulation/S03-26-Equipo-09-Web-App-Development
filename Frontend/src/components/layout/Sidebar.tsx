import { useState, useRef } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { tx } from '../../common/tx';
import { useAuthStore } from '../../store/authStore';
import { useLanguage } from '../../hooks/useLanguage';

interface NavItem {
  to: string;
  labelKey: string;
  icon: string;
  badge?: number | null;
}

interface SidebarProps {
  sinLeer: number;
  pendientes: number;
}

const NAV_MAIN: Omit<NavItem, 'badge'>[] = [
  { to: '/dashboard',              labelKey: 'nav.summary',   icon: 'grid_view' },
  { to: '/dashboard/contactos',    labelKey: 'nav.contacts',  icon: 'people_alt' },
  { to: '/dashboard/inbox',        labelKey: 'nav.inbox',     icon: 'mark_unread_chat_alt' },
  { to: '/dashboard/pipeline',     labelKey: 'nav.pipeline',  icon: 'account_tree' },
  { to: '/dashboard/seguimientos', labelKey: 'nav.followups', icon: 'checklist' },
  { to: '/dashboard/plantillas',   labelKey: 'nav.templates', icon: 'description' },
];

const NAV_VENDEDOR: Omit<NavItem, 'badge'>[] = [
  { to: '/dashboard',              labelKey: 'nav.summary',  icon: 'grid_view' },
  { to: '/dashboard/contactos',    labelKey: 'nav.contacts', icon: 'people_alt' },
  { to: '/dashboard/mi-inbox',     labelKey: 'nav.inbox',    icon: 'mark_unread_chat_alt' },
];

export const Sidebar = ({ sinLeer, pendientes }: SidebarProps) => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuthStore();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const expanded = hovered;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHovered(false), 120);
  };

  const isActive = (to: string) =>
    to === '/dashboard' ? currentPath === '/dashboard' : currentPath.startsWith(to);

  const userInitials = user
    ? user.username.split(/[._\s]+/).map(p => p[0]?.toUpperCase() ?? '').slice(0, 2).join('')
    : 'HA';

  const isVendedor = (user?.rol ?? '').toUpperCase() === 'VENDEDOR';
  const navItems = isVendedor ? NAV_VENDEDOR : NAV_MAIN;

  const getBadge = (to: string) => {
    if (to === '/dashboard/inbox') return sinLeer > 0 ? sinLeer : null;
    if (to === '/dashboard/seguimientos') return pendientes > 0 ? pendientes : null;
    return null;
  };

  return (
    <aside
      className="relative flex flex-col h-full bg-white border-r border-slate-100 overflow-hidden z-30 flex-shrink-0"
      style={{
        width: expanded ? '220px' : '56px',
        transition: 'width 220ms cubic-bezier(0.4,0,0.2,1)',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Logo / Brand ── */}
      <div className="flex items-center h-14 px-3.5 border-b border-slate-100 flex-shrink-0 overflow-hidden">
        <div className="w-7 h-7 rounded-lg bg-[#182442] flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-white text-[14px] font-bold">auto_awesome</span>
        </div>
        <div
          className="ml-3 overflow-hidden whitespace-nowrap"
          style={{
            opacity: expanded ? 1 : 0,
            maxWidth: expanded ? '160px' : '0px',
            transition: 'opacity 160ms ease, max-width 220ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <p className="text-[13px] font-bold text-[#182442] leading-tight">CRM Intelligent</p>
          <p className="text-[9px] font-semibold text-[#006c49] uppercase tracking-widest">Admin Panel</p>
        </div>
      </div>

      {/* ── Nav Items ── */}
      <nav className="flex-1 py-3 overflow-x-hidden overflow-y-auto">
        <ul className="flex flex-col gap-0.5 px-2">
          {navItems.map(item => {
            const active = isActive(item.to);
            const badge = getBadge(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`
                    group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all duration-100
                    ${active
                      ? 'bg-[#182442] text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] flex-shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`}
                    style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span
                    className="flex-1 whitespace-nowrap font-medium overflow-hidden"
                    style={{
                      opacity: expanded ? 1 : 0,
                      maxWidth: expanded ? '140px' : '0px',
                      transition: 'opacity 140ms ease, max-width 220ms cubic-bezier(0.4,0,0.2,1)',
                    }}
                  >
                    {tx(item.labelKey)}
                  </span>

                  {/* Badge */}
                  {badge !== null && (
                    <span
                      className={`text-[10px] font-extrabold min-w-[18px] h-4.5 px-1 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${active ? 'bg-white/20 text-white' : 'bg-[#006c49] text-white'}`}
                      style={{
                        opacity: expanded ? 1 : 0,
                        transition: 'opacity 120ms ease',
                      }}
                    >
                      {badge}
                    </span>
                  )}

                  {/* Dot badge in collapsed mode */}
                  {badge !== null && !expanded && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#006c49] flex-shrink-0" />
                  )}

                  {/* Floating tooltip when collapsed */}
                  {!expanded && (
                    <div
                      className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 z-50"
                      style={{ opacity: 0 }}
                    >
                      <div className="bg-[#182442] text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                        {tx(item.labelKey)}
                        {badge !== null && (
                          <span className="ml-1.5 text-[#4ade80]">{badge}</span>
                        )}
                      </div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Separator ── */}
      <div className="mx-3 h-px bg-slate-100" />

      {/* ── Footer ── */}
      <div className="py-3 px-2 flex flex-col gap-0.5">

        {/* Language toggle */}
        <button
          className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors w-full text-left"
          onClick={toggleLanguage}
        >
          <span className="text-[18px] flex-shrink-0 leading-none">{language === 'es' ? '🇪🇸' : '🇺🇸'}</span>
          <span
            className="whitespace-nowrap font-medium overflow-hidden"
            style={{
              opacity: expanded ? 1 : 0,
              maxWidth: expanded ? '120px' : '0px',
              transition: 'opacity 140ms ease, max-width 220ms ease',
            }}
          >
            {language === 'es' ? 'Español' : 'English'}
          </span>
        </button>

        {/* User + logout */}
        <button
          className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left group"
          onClick={() => { void logout(); }}
        >
          <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-red-100 flex items-center justify-center text-[10px] font-extrabold text-slate-600 group-hover:text-red-600 flex-shrink-0 transition-colors">
            {userInitials}
          </div>
          <div
            className="flex-1 overflow-hidden whitespace-nowrap min-w-0"
            style={{
              opacity: expanded ? 1 : 0,
              maxWidth: expanded ? '130px' : '0px',
              transition: 'opacity 140ms ease, max-width 220ms ease',
            }}
          >
            <p className="text-xs font-semibold text-slate-700 group-hover:text-red-600 transition-colors truncate">{user?.username ?? 'Admin'}</p>
            <p className="text-[10px] text-slate-400 group-hover:text-red-400 transition-colors">{t('nav.logout')}</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  const linkCls = ({ isActive }) =>
    `text-sm font-medium tracking-wide transition-colors border-b-2 pb-0.5 ${
      isActive
        ? 'border-sky-600 text-sky-700 dark:border-sky-400 dark:text-sky-300'
        : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 text-slate-900 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100">
      <div className="mx-auto flex max-w-[min(100%,90rem)] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial">
          <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" aria-hidden>
            <rect width="24" height="24" rx="5" className="fill-amber-400 dark:fill-amber-300" />
            <path className="fill-slate-900 dark:fill-slate-950" d="M13.5 5L7 14h6.5l-1.5 7L17 9h-6l2.5-4z" />
          </svg>
          <div className="min-w-0">
            <div className="truncate font-display text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-base md:text-lg">
              SMART ENERGY OPTIMIZER · v1.0
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Industrial dashboard</div>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-end">
          <nav className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-2 sm:flex-initial sm:gap-x-5 md:gap-x-6">
            <NavLink to="/dashboard" className={linkCls}>
              Dashboard
            </NavLink>
            <NavLink to="/analytics" className={linkCls}>
              Analytics
            </NavLink>
            <NavLink to="/about" className={linkCls}>
              About
            </NavLink>
            <NavLink to="/settings" className={linkCls}>
              Settings
            </NavLink>
          </nav>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? (
              <>
                <svg className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Light
              </>
            ) : (
              <>
                <svg className="h-4 w-4 text-slate-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
                Dark
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

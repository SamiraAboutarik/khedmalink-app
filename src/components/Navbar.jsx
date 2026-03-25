import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Home, MessageCircle, Calendar, User, LogOut, LayoutDashboard, Map } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { user, role, logout, lang, toggleLang, t } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { logout(); navigate('/login') }

  const clientLinks = [
    { to: '/',         icon: Home,            label: t.nav_home      },
    { to: '/map',      icon: Map,             label: t.nav_map       },
    { to: '/chat',     icon: MessageCircle,   label: t.nav_chat      },
    { to: '/bookings', icon: Calendar,        label: t.nav_bookings  },
    { to: '/profile',  icon: User,            label: t.nav_profile   },
  ]
  const artisanLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: t.nav_dashboard },
    { to: '/map',       icon: Map,             label: t.nav_map       },
    { to: '/chat',      icon: MessageCircle,   label: t.nav_chat      },
    { to: '/bookings',  icon: Calendar,        label: t.nav_missions  },
    { to: '/profile',   icon: User,            label: t.nav_profile   },
  ]
  const links = role === 'artisan' ? artisanLinks : clientLinks

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-800 tracking-tight">
              <span className="text-teal">Khdima</span>
              <span className="text-white">Link</span>
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 glass px-2.5 py-1 rounded-full
                text-xs font-semibold text-slate-300 hover:text-white hover:border-teal/30
                transition-all border border-white/5"
              title={lang === 'fr' ? 'Passer en Arabe' : 'Passer en Français'}
            >
              <span className="text-sm leading-none">{lang === 'fr' ? '🇲🇦' : '🇫🇷'}</span>
              <span className="text-[10px]">{lang === 'fr' ? 'عربية' : 'FR'}</span>
            </button>

            {user ? (
              <>
                <span className="text-xs text-slate-400 capitalize bg-white/5 px-2 py-1 rounded-full hidden sm:block">
                  {role}
                </span>
                <button onClick={handleLogout}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
                  <LogOut size={15} className="text-slate-400" />
                </button>
              </>
            ) : (
              <Link to="/login"
                className="text-sm font-medium text-teal hover:text-white transition-colors">
                {lang === 'fr' ? 'Connexion' : 'دخول'}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Bottom nav */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5">
          <div className="max-w-lg mx-auto flex">
            {links.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to
              return (
                <Link key={to} to={to}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all
                    ${active ? 'text-teal' : 'text-slate-500 hover:text-slate-300'}`}>
                  <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
                  <span className="text-[9px] font-medium leading-tight text-center px-0.5">{label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}

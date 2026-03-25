import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Hammer, User, Phone } from 'lucide-react'
import { useApp } from '../context/AppContext'

// Moroccan phone validator: 06/07 + 8 digits
const isValidPhone = (p) => /^(06|07)\d{8}$/.test(p.replace(/\s/g, ''))

export default function Login() {
  const [mode, setMode]               = useState('login')
  const [selectedRole, setSelectedRole] = useState('client')
  const [form, setForm]               = useState({ name: '', phone: '', password: '' })
  const [showPwd, setShowPwd]         = useState(false)
  const [error, setError]             = useState('')

  const { login, lang, toggleLang, t } = useApp()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleanPhone = form.phone.replace(/\s/g, '')
    if (!cleanPhone || !form.password) { setError(t.error_fields); return }
    if (!isValidPhone(cleanPhone))     { setError(t.error_phone);  return }
    login({ name: form.name || 'Utilisateur', phone: cleanPhone }, selectedRole)
    navigate(selectedRole === 'artisan' ? '/dashboard' : '/')
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">

        {/* Language toggle — top right */}
        <div className="flex justify-end mb-4 animate-fadeInUp">
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 glass px-3 py-1.5 rounded-full
              text-sm font-semibold text-teal hover:bg-teal/10 transition-all border border-teal/20"
          >
            <span className="text-base">{lang === 'fr' ? '🇲🇦' : '🇫🇷'}</span>
            <span>{lang === 'fr' ? 'العربية' : 'Français'}</span>
          </button>
        </div>

        {/* Logo */}
        <div className="text-center mb-7 animate-fadeInUp">
          <h1 className="text-3xl font-display font-extrabold">
            <span className="text-teal">Khdima</span><span className="text-white">Link</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">{t.appTagline}</p>
        </div>

        {/* Role selector */}
        <div className="flex glass rounded-xl p-1 mb-5 animate-fadeInUp anim-delay-1">
          {[
            { value: 'client',  label: t.iam_client,  Icon: User   },
            { value: 'artisan', label: t.iam_artisan, Icon: Hammer },
          ].map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => setSelectedRole(value)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${selectedRole === value ? 'gradient-teal text-white shadow-glow' : 'text-slate-400 hover:text-white'}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Mode tabs */}
        <div className="flex gap-4 mb-5 animate-fadeInUp anim-delay-2">
          {[['login', t.login], ['signup', t.signup]].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)}
              className={`text-sm font-semibold pb-1 border-b-2 transition-all
                ${mode === m ? 'border-teal text-teal' : 'border-transparent text-slate-400 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 animate-fadeInUp anim-delay-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder={t.fullname}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500
                outline-none focus:border-teal/50 transition-all"
            />
          )}

          {/* Phone field */}
          <div className="relative">
            {/* Morocco flag prefix */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 border-r border-white/10 pr-2.5">
              <span className="text-base leading-none">🇲🇦</span>
              <span className="text-xs text-slate-400 font-medium">+212</span>
            </div>
            <input
              type="tel"
              placeholder={t.phonePlaceholder}
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              maxLength={14}
              className="w-full glass rounded-xl pl-20 pr-4 py-3 text-sm text-white placeholder-slate-500
                outline-none focus:border-teal/50 transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder={t.password}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full glass rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-500
                outline-none focus:border-teal/50 transition-all"
            />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="text-red-400 text-xs px-1">{error}</p>}

          <button type="submit"
            className="w-full gradient-orange py-3.5 rounded-xl font-semibold text-white
              shadow-orange hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-95 mt-1">
            {mode === 'login' ? t.connect : t.create_account}
          </button>
        </form>

        {/* OTP hint for artisans */}
        {selectedRole === 'artisan' && (
          <div className="glass rounded-xl p-3 mt-4 animate-fadeInUp anim-delay-4 border border-teal/20">
            <p className="text-xs text-teal text-center">
              📱 {lang === 'fr'
                ? 'Un SMS de vérification sera envoyé à votre numéro'
                : 'سيتم إرسال رسالة SMS للتحقق من رقمك'}
            </p>
          </div>
        )}

        <p className="text-center text-xs text-slate-600 mt-5 animate-fadeInUp anim-delay-4">
          {t.demo_hint}
        </p>
      </div>
    </div>
  )
}

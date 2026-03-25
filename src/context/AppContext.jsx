import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

// ─── TRANSLATIONS ─────────────────────────────────────────────────
export const T = {
  fr: {
    dir: 'ltr',
    appTagline: 'Services à domicile au Maroc 🇲🇦',
    iam_client: 'Je suis client',
    iam_artisan: 'Je suis prestataire de service',
    login: 'Connexion',
    signup: 'Inscription',
    phone: 'Numéro de téléphone',
    phonePlaceholder: '06 12 34 56 78',
    password: 'Mot de passe',
    fullname: 'Nom complet',
    connect: 'Se connecter',
    create_account: 'Créer mon compte',
    demo_hint: '💡 Demo : entrez n\'importe quel numéro',
    error_fields: 'Veuillez remplir tous les champs.',
    error_phone: 'Numéro invalide (ex: 0612345678)',
    nav_home: 'Accueil',
    nav_map: 'Carte',
    nav_chat: 'Messages',
    nav_bookings: 'Réservations',
    nav_profile: 'Profil',
    nav_dashboard: 'Dashboard',
    nav_missions: 'Missions',
    discuss: 'Discuter',
    book: 'Réserver ce service',
    pay_online: 'Payer en ligne',
    artisan_nearby: 'Artisans près de vous',
  },
  ar: {
    dir: 'rtl',
    appTagline: 'خدمات المنزل في المغرب 🇲🇦',
    iam_client: 'أنا عميل',
    iam_artisan: 'أنا حرفي',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    phone: 'رقم الهاتف',
    phonePlaceholder: '06 12 34 56 78',
    password: 'كلمة المرور',
    fullname: 'الاسم الكامل',
    connect: 'تسجيل الدخول',
    create_account: 'إنشاء حسابي',
    demo_hint: '💡 تجريبي: أدخل أي رقم هاتف',
    error_fields: 'يرجى ملء جميع الحقول.',
    error_phone: 'رقم غير صحيح (مثال: 0612345678)',
    nav_home: 'الرئيسية',
    nav_map: 'الخريطة',
    nav_chat: 'الرسائل',
    nav_bookings: 'الحجوزات',
    nav_profile: 'الملف',
    nav_dashboard: 'لوحة التحكم',
    nav_missions: 'المهام',
    discuss: 'تحدث',
    book: 'احجز هذه الخدمة',
    pay_online: 'الدفع الإلكتروني',
    artisan_nearby: 'الحرفيون بالقرب منك',
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [lang, setLang] = useState('fr')            // 'fr' | 'ar'
  const [darkMode, setDarkMode] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [bookings, setBookings] = useState([])

  const t = T[lang]  // current translations

  const login = (userData, userRole) => { setUser(userData); setRole(userRole) }
  const logout = () => { setUser(null); setRole(null) }
  const addBooking = (booking) => setBookings(prev => [...prev, { ...booking, id: Date.now() }])
  const toggleLang = () => setLang(l => l === 'fr' ? 'ar' : 'fr')

  return (
    <AppContext.Provider value={{
      user, role, login, logout,
      lang, setLang, toggleLang, t,
      darkMode, setDarkMode,
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      bookings, addBooking,
    }}>
      <div dir={t.dir} style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

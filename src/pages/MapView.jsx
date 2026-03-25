import { useState, useMemo } from 'react'
import { MapPin, Filter, Star, Clock, Navigation, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import artisans from '../data/artisans.json'
import categories from '../data/categories.json'

// Fake GPS offsets around Agadir city center (30.4278, -9.5981)
const POSITIONS = {
  1: { lat: 30.4310, lng: -9.5920, zone: 'Hay Mohammadi' },
  2: { lat: 30.4190, lng: -9.6050, zone: 'Talborjt' },
  3: { lat: 30.4350, lng: -9.5870, zone: 'Hay Salam' },
  4: { lat: 30.4130, lng: -9.5780, zone: 'Ait Melloul' },
  5: { lat: 30.4280, lng: -9.6120, zone: 'Dakhla' },
  6: { lat: 30.4400, lng: -9.5950, zone: 'Secteur Touristique' },
}

const CAT_COLOR = {
  plombier:    { bg: 'bg-blue-500/20',   text: 'text-blue-400',   dot: 'bg-blue-400'   },
  electricien: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  menuisier:   { bg: 'bg-amber-500/20',  text: 'text-amber-400',  dot: 'bg-amber-500'  },
  soudeur:     { bg: 'bg-slate-500/20',  text: 'text-slate-300',  dot: 'bg-slate-400'  },
}

// Map pin placed proportionally on a pseudo-map canvas (% of width/height)
// Derived from lat/lng normalized to a bounding box
const LAT_MIN = 30.405, LAT_MAX = 30.445
const LNG_MIN = -9.620, LNG_MAX = -9.570
function toPercent(lat, lng) {
  return {
    x: ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100,
    y: 100 - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * 100,
  }
}

export default function MapView() {
  const navigate = useNavigate()
  const [filterCat, setFilterCat]         = useState(null)
  const [filterAvail, setFilterAvail]     = useState(false)
  const [selectedArtisan, setSelectedArtisan] = useState(null)
  const [showFilters, setShowFilters]     = useState(false)

  const filtered = useMemo(() => artisans.filter(a => {
    if (filterCat && a.category !== filterCat) return false
    if (filterAvail && !a.available) return false
    return true
  }), [filterCat, filterAvail])

  const selected = selectedArtisan ? artisans.find(a => a.id === selectedArtisan) : null

  return (
    <div className="gradient-bg min-h-screen pb-20 pt-14 flex flex-col">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col px-0">

        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-lg font-display font-bold text-white">
              prestataire de services sur la carte
            </h1>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                transition-all border ${showFilters
                  ? 'bg-teal/20 text-teal border-teal/40'
                  : 'glass text-slate-300 border-white/10 hover:border-teal/30'}`}
            >
              <Filter size={12} />
              Filtres {(filterCat || filterAvail) ? `(${[filterCat, filterAvail].filter(Boolean).length})` : ''}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            <Navigation size={10} className="inline text-teal mr-1" />
            Agadir, Souss-Massa — {filtered.length} prestataires de service
          </p>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mx-4 mb-3 glass rounded-2xl p-4 animate-fadeInUp border border-teal/15">
            <p className="text-xs font-semibold text-slate-300 mb-2">Catégorie</p>
            <div className="flex gap-2 flex-wrap mb-3">
              <button
                onClick={() => setFilterCat(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${!filterCat ? 'bg-teal text-navy-900 font-bold' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                Tous
              </button>
              {categories.map(c => (
                <button key={c.id}
                  onClick={() => setFilterCat(filterCat === c.id ? null : c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1
                    ${filterCat === c.id ? 'bg-teal text-navy-900 font-bold' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterAvail(v => !v)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${filterAvail ? 'bg-brand-green/20 text-brand-green border border-brand-green/40' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
              >
                <span className={`w-2 h-2 rounded-full ${filterAvail ? 'bg-brand-green' : 'bg-slate-500'}`} />
                Disponibles seulement
              </button>
            </div>
          </div>
        )}

        {/* ── PSEUDO-MAP CANVAS ── */}
        <div className="mx-4 mb-4 relative rounded-2xl overflow-hidden" style={{ height: '280px' }}>
          {/* Map background – dark tile style */}
          <div className="absolute inset-0" style={{
            background: `
              linear-gradient(rgba(10,191,188,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(10,191,188,0.04) 1px, transparent 1px),
              #0B1120`,
            backgroundSize: '28px 28px',
          }} />

          {/* Major roads */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Horizontal roads */}
            <line x1="0" y1="38" x2="100" y2="38" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6"/>
            <line x1="0" y1="62" x2="100" y2="62" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
            <line x1="0" y1="78" x2="100" y2="78" stroke="rgba(255,255,255,0.05)" strokeWidth="0.4"/>
            {/* Vertical roads */}
            <line x1="30" y1="0" x2="30" y2="100" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6"/>
            <line x1="60" y1="0" x2="60" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
            <line x1="78" y1="0" x2="78" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4"/>
            {/* Diagonal boulevard */}
            <line x1="0" y1="25" x2="75" y2="100" stroke="rgba(10,191,188,0.12)" strokeWidth="0.8"/>
            {/* Boulevard Moqawama */}
            <line x1="15" y1="0" x2="15" y2="100" stroke="rgba(10,191,188,0.1)" strokeWidth="1.2"/>
          </svg>

          {/* Zone labels */}
          {[
            { label: 'Centre', x: '18%', y: '12%' },
            { label: 'Talborjt', x: '8%', y: '55%' },
            { label: 'Hay Salam', x: '62%', y: '18%' },
            { label: 'Dakhla', x: '2%', y: '78%' },
            { label: 'Aït Melloul', x: '72%', y: '72%' },
          ].map(z => (
            <span key={z.label} className="absolute text-[8px] text-slate-600 pointer-events-none font-medium"
              style={{ left: z.x, top: z.y }}>
              {z.label}
            </span>
          ))}

          {/* Artisan pins */}
          {filtered.map(a => {
            const pos = POSITIONS[a.id]
            if (!pos) return null
            const { x, y } = toPercent(pos.lat, pos.lng)
            const isSelected = selectedArtisan === a.id
            const cc = CAT_COLOR[a.category] || CAT_COLOR.soudeur

            return (
              <button
                key={a.id}
                onClick={() => setSelectedArtisan(isSelected ? null : a.id)}
                className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200"
                style={{ left: `${x}%`, top: `${y}%`, zIndex: isSelected ? 20 : 10 }}
              >
                {/* Pin */}
                <div className={`relative flex flex-col items-center transition-transform
                  ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                    border-2 shadow-lg transition-all
                    ${isSelected
                      ? 'bg-brand-orange border-white scale-110 shadow-orange'
                      : `${cc.bg} border-white/20 ${a.available ? '' : 'opacity-50'}`}
                  `}>
                    {a.category === 'plombier' ? '🔧'
                      : a.category === 'electricien' ? '⚡'
                      : a.category === 'menuisier' ? '🪚' : '🔩'}
                  </div>
                  {/* Stem */}
                  <div className={`w-0.5 h-2 ${isSelected ? 'bg-brand-orange' : 'bg-white/30'}`} />
                  <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-brand-orange' : 'bg-white/30'}`} />
                  {/* Availability dot */}
                  {a.available && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-green rounded-full border border-navy-900" />
                  )}
                </div>
              </button>
            )
          })}

          {/* User position */}
          <div className="absolute" style={{ left: '45%', top: '52%', transform: 'translate(-50%, -50%)' }}>
            <div className="relative">
              <div className="w-4 h-4 bg-teal rounded-full border-2 border-white shadow-glow" />
              <div className="absolute inset-0 bg-teal rounded-full opacity-40 animate-ping" />
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-2 right-2 glass rounded-lg p-2 text-[9px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-green" />
              Disponible
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal border-2 border-white" />
              Vous
            </div>
          </div>

          {/* Scale */}
          <div className="absolute bottom-2 left-2 flex items-end gap-1">
            <div className="w-8 h-0.5 bg-slate-500" />
            <span className="text-[8px] text-slate-500">~500m</span>
          </div>
        </div>

        {/* Selected artisan card */}
        {selected && (
          <div className="mx-4 mb-3 animate-fadeInUp">
            <div className="glass rounded-2xl p-4 border border-brand-orange/30">
              <div className="flex items-start gap-3">
                <img src={selected.avatar} alt={selected.name}
                  className="w-12 h-12 rounded-xl bg-navy-700" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white text-sm">{selected.name}</p>
                      <p className="text-xs text-teal capitalize">{selected.category}</p>
                    </div>
                    <button onClick={() => setSelectedArtisan(null)}
                      className="text-slate-500 hover:text-white">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Star size={10} className="text-amber-400" fill="#FBBF24" />
                      {selected.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={10} className="text-teal" />
                      {POSITIONS[selected.id]?.zone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} className="text-brand-green" />
                      <span className="text-brand-green">{selected.responseTime}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate('/chat')}
                  className="flex-1 py-2 rounded-xl border border-teal/40 text-teal text-xs font-semibold
                    hover:bg-teal/10 transition-all flex items-center justify-center gap-1.5"
                >
                  💬 Discuter
                </button>
                <button
                  onClick={() => navigate(`/artisan/${selected.id}`)}
                  className="flex-1 py-2 rounded-xl gradient-orange text-white text-xs font-semibold
                    shadow-orange hover:opacity-90 transition-all"
                >
                  Voir le profil →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List below map */}
        <div className="px-4">
          <p className="text-xs font-semibold text-slate-400 mb-2">
            {filtered.length} artisan{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
          </p>
          <div className="space-y-2">
            {filtered.map((a, i) => {
              const pos = POSITIONS[a.id]
              const cc = CAT_COLOR[a.category] || CAT_COLOR.soudeur
              return (
                <button key={a.id}
                  onClick={() => { setSelectedArtisan(a.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className={`w-full glass rounded-xl p-3 flex items-center gap-3 transition-all
                    hover:border-teal/30 animate-fadeInUp anim-delay-${(i % 4) + 1}
                    ${selectedArtisan === a.id ? 'border-brand-orange/50 bg-brand-orange/5' : ''}`}
                >
                  <img src={a.avatar} alt={a.name}
                    className="w-10 h-10 rounded-xl bg-navy-700 shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-white">{a.name}</p>
                      {a.available && <span className="w-1.5 h-1.5 bg-brand-green rounded-full" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className={`${cc.text} capitalize`}>{a.category}</span>
                      <span>·</span>
                      <MapPin size={9} className="text-teal" />
                      <span>{pos?.zone}</span>
                      <span>·</span>
                      <span>{a.distance}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
                      <Star size={10} fill="#FBBF24" />
                      {a.rating}
                    </div>
                    <div className="text-[10px] text-brand-orange">{a.price.split('–')[0]}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

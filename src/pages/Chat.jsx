import { useState, useRef, useEffect } from 'react'
import { Send, Phone, Video, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const CONTACTS = [
  { id: 1, name: 'Youssef El Fassi', role: 'Plombier', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef&backgroundColor=b6e3f4', online: true, lastMsg: 'D\'accord, j\'arrive dans 20 min !' },
  { id: 2, name: 'Ahmed Benali',    role: 'Électricien', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed&backgroundColor=ffdfbf',   online: false, lastMsg: 'Le devis est envoyé.' },
]

const INITIAL_MESSAGES = {
  1: [
    { id: 1, from: 'them', text: 'Salam ! Comment puis-je vous aider ?', time: '10:02' },
    { id: 2, from: 'me',   text: 'Bonjour, j\'ai une fuite sous l\'évier.', time: '10:04' },
    { id: 3, from: 'them', text: 'D\'accord, j\'arrive dans 20 min !', time: '10:05' },
  ],
  2: [
    { id: 1, from: 'them', text: 'Bonjour, quel est le problème ?', time: '09:30' },
    { id: 2, from: 'me',   text: 'Prise électrique HS dans le salon.', time: '09:32' },
    { id: 3, from: 'them', text: 'Le devis est envoyé.', time: '09:45' },
  ],
}

export default function Chat() {
  const navigate = useNavigate()
  const [activeContact, setActiveContact] = useState(null)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeContact])

  const send = () => {
    if (!input.trim() || !activeContact) return
    const now = new Date()
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`
    const newMsg = { id: Date.now(), from: 'me', text: input.trim(), time }
    setMessages(prev => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg]
    }))
    setInput('')

    // Simulate reply after 1.5s
    setTimeout(() => {
      const replies = [
        'Bien reçu !', 'Je vous confirme ça.', 'D\'accord, pas de problème.',
        'Je suis en route.', 'Merci pour l\'info.'
      ]
      const reply = { id: Date.now()+1, from: 'them', text: replies[Math.floor(Math.random()*replies.length)], time }
      setMessages(prev => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), reply]
      }))
    }, 1500)
  }

  // Conversation view
  if (activeContact) {
    const msgs = messages[activeContact.id] || []
    return (
      <div className="gradient-bg min-h-screen flex flex-col pt-14 pb-0 max-w-lg mx-auto">
        {/* Chat header */}
        <div className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setActiveContact(null)} className="text-slate-400 hover:text-white">
            <ArrowLeft size={18} />
          </button>
          <img src={activeContact.avatar} alt="" className="w-9 h-9 rounded-full bg-navy-700" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{activeContact.name}</p>
            <p className="text-[10px] text-brand-green flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green inline-block" />
              {activeContact.online ? 'En ligne' : 'Hors ligne'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 glass rounded-lg text-teal hover:text-white transition-colors"><Phone size={15} /></button>
            <button className="p-2 glass rounded-lg text-teal hover:text-white transition-colors"><Video size={15} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {msgs.map(msg => (
            <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm
                ${msg.from === 'me'
                  ? 'gradient-teal text-white rounded-br-sm'
                  : 'glass text-slate-200 rounded-bl-sm'}`}>
                {msg.text}
                <div className={`text-[10px] mt-1 ${msg.from === 'me' ? 'text-white/60' : 'text-slate-500'}`}>{msg.time}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
<div className="glass border-t border-white/5 px-4 py-3 flex items-center gap-3 fixed bottom-20  left-0 right-0 max-w-lg mx-auto">
          <input
            type="text" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Écrire un message..."
            className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500
              outline-none border border-white/5 focus:border-teal/40 transition-all"
          />
          <button onClick={send}
            className="w-10 h-10 gradient-teal rounded-xl flex items-center justify-center shadow-glow
              hover:opacity-90 transition-all shrink-0">
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
    )
  }

  // Contact list
  return (
    <div className="gradient-bg min-h-screen pb-20 pt-14">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <h1 className="text-xl font-display font-bold text-white mb-5 animate-fadeInUp">Messages</h1>
        <div className="space-y-3">
          {CONTACTS.map((c, i) => (
            <button key={c.id} onClick={() => setActiveContact(c)}
              className={`w-full glass rounded-2xl p-4 flex items-center gap-3 hover:border-teal/30 transition-all
                animate-fadeInUp anim-delay-${i+1}`}>
              <div className="relative shrink-0">
                <img src={c.avatar} alt="" className="w-12 h-12 rounded-full bg-navy-700" />
                {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-brand-green rounded-full border-2 border-navy-900" />}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{c.name}</p>
                  <p className="text-[10px] text-slate-500">maintenant</p>
                </div>
                <p className="text-xs text-teal mb-0.5">{c.role}</p>
                <p className="text-xs text-slate-400 truncate">{c.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

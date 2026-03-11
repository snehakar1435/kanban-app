import { useState, useEffect } from 'react'
import Board from './components/Board'
import { Search, Moon, Sun, LayoutDashboard } from 'lucide-react'

const initialData = {
  tasks: {},
  columns: {
    'col-1': { id: 'col-1', title: 'Todo', taskIds: [] },
    'col-2': { id: 'col-2', title: 'In Progress', taskIds: [] },
    'col-3': { id: 'col-3', title: 'Done', taskIds: [] },
  },
  columnOrder: ['col-1', 'col-2', 'col-3'],
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('darkMode') === 'true'
  )
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('kanban-data')
    if (!saved) return initialData
    const parsed = JSON.parse(saved)
    const merged = { ...initialData, ...parsed }
    merged.columns = { ...initialData.columns, ...parsed.columns }
    merged.columnOrder = [...new Set([...initialData.columnOrder, ...parsed.columnOrder])]
    return merged
  })
  const [search, setSearch] = useState('')

  useEffect(() => {
    localStorage.setItem('kanban-data', JSON.stringify(data))
  }, [data])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const totalTasks = Object.keys(data.tasks).length
  const doneTasks = Object.values(data.tasks).filter(t => t.done).length

  return (
    <div className="min-h-screen transition-colors duration-500"
      style={{
        background: darkMode
          ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
          : 'linear-gradient(135deg, #e0e7ff 0%, #f0fdf4 50%, #fef9c3 100%)'
      }}
    >
      {/* Floating background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />
        <div className="absolute top-[40%] left-[40%] w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4"
        style={{
          background: darkMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(20px)',
          borderBottom: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.6)'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg float"
              style={{ background: 'linear-gradient(135deg, #4285F4, #EA4335, #FBBC05, #34A853)' }}
            >
              <LayoutDashboard size={20} color="white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">
                <span style={{ color: '#4285F4' }}>K</span>
                <span style={{ color: '#EA4335' }}>a</span>
                <span style={{ color: '#FBBC05' }}>n</span>
                <span style={{ color: '#4285F4' }}>b</span>
                <span style={{ color: '#34A853' }}>a</span>
                <span style={{ color: '#EA4335' }}>n</span>
                <span className="text-gray-500 dark:text-gray-400 font-semibold"> Board</span>
              </h1>
              <p className="text-[10px] text-gray-400 tracking-widest uppercase">
                {doneTasks}/{totalTasks} tasks complete
              </p>
            </div>
          </div>

          {/* Search + Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-4 py-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 w-48 dark:text-white"
                style={{
                  background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
                  border: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                  backdropFilter: 'blur(8px)'
                }}
              />
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all liquid-btn shadow-md"
              style={{
                background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                border: darkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.08)'
              }}
            >
              {darkMode ? <Moon size={16} className="text-blue-300" /> : <Sun size={16} className="text-yellow-500" />}
            </button>
          </div>
        </div>
      </header>

      <Board data={data} setData={setData} search={search} darkMode={darkMode} />
    </div>
  )
}
import { useState, useEffect } from 'react'
import Board from './components/Board'

const initialData = {
  tasks: {},
  columns: {
    'col-1': { id: 'col-1', title: 'Todo', taskIds: [] },
    'col-2': { id: 'col-2', title: 'In Progress', taskIds: [] },
    'col-3': { id: 'col-3', title: 'Done', taskIds: [] },
  },
  columnOrder: ['col-1', 'col-2', 'col-3'],
}

function KanbanLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="#fff"/>
        <rect x="5" y="8" width="8" height="24" rx="2.5" fill="#4285F4"/>
        <rect x="16" y="8" width="8" height="16" rx="2.5" fill="#FBBC05"/>
        <rect x="27" y="8" width="8" height="10" rx="2.5" fill="#34A853"/>
        <circle cx="31" cy="30" r="5" fill="#EA4335"/>
        <path d="M29 30l1.5 1.5L33 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-black tracking-tight">
          <span className="text-[#4285F4]">K</span>
          <span className="text-[#EA4335]">a</span>
          <span className="text-[#FBBC05]">n</span>
          <span className="text-[#4285F4]">b</span>
          <span className="text-[#34A853]">a</span>
          <span className="text-[#EA4335]">n</span>
          <span className="text-gray-500 dark:text-gray-400 font-semibold"> Board</span>
        </span>
        <span className="text-[10px] tracking-widest text-gray-400 uppercase font-medium">Task Manager</span>
      </div>
    </div>
  )
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('darkMode') === 'true'
  )
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('kanban-data')
    return saved ? JSON.parse(saved) : initialData
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-3 flex items-center justify-between">
        <KanbanLogo />
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-full px-4 py-1.5 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
          />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition border dark:border-gray-600"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      <Board data={data} setData={setData} search={search} />
    </div>
  )
}
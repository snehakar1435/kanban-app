import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'
import { Plus, Trash2, ClipboardList, Zap, CheckCircle, Tag } from 'lucide-react'

const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

const COLUMN_CONFIG = {
  'Todo': {
    icon: ClipboardList,
    gradient: 'from-blue-500 to-indigo-500',
    border: 'rgba(99,102,241,0.5)',
    glow: 'rgba(99,102,241,0.15)',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  },
  'In Progress': {
    icon: Zap,
    gradient: 'from-yellow-400 to-orange-500',
    border: 'rgba(251,191,36,0.5)',
    glow: 'rgba(251,191,36,0.15)',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  },
  'Done': {
    icon: CheckCircle,
    gradient: 'from-green-400 to-emerald-500',
    border: 'rgba(34,197,94,0.5)',
    glow: 'rgba(34,197,94,0.15)',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  },
}

export default function Column({ column, tasks, data, setData, search, onDeleteColumn, darkMode }) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [priority, setPriority] = useState('medium')

  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const config = COLUMN_CONFIG[column.title] || {
    icon: Tag,
    gradient: 'from-purple-400 to-pink-500',
    border: 'rgba(168,85,247,0.5)',
    glow: 'rgba(168,85,247,0.15)',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
  }

  const Icon = config.icon

  const filtered = tasks.filter(t =>
    t && (t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(search.toLowerCase()))
  )

  function addTask() {
    if (!title.trim()) return
    const id = 'task-' + Date.now()
    const newTask = { id, title: title.trim(), description: desc.trim(), priority, done: false }
    setData(prev => ({
      ...prev,
      tasks: { ...prev.tasks, [id]: newTask },
      columns: {
        ...prev.columns,
        [column.id]: {
          ...prev.columns[column.id],
          taskIds: [...prev.columns[column.id].taskIds, id],
        }
      }
    }))
    setTitle('')
    setDesc('')
    setPriority('medium')
    setAdding(false)
  }

  function deleteTask(taskId) {
    const newTasks = { ...data.tasks }
    delete newTasks[taskId]
    setData(prev => ({
      ...prev,
      tasks: newTasks,
      columns: {
        ...prev.columns,
        [column.id]: {
          ...prev.columns[column.id],
          taskIds: prev.columns[column.id].taskIds.filter(id => id !== taskId),
        }
      }
    }))
  }

  function updateTask(taskId, updates) {
    setData(prev => ({
      ...prev,
      tasks: { ...prev.tasks, [taskId]: { ...prev.tasks[taskId], ...updates } }
    }))
  }

  return (
    <div className="min-w-[300px] max-w-[300px] flex flex-col gap-3">
      {/* Column Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-md`}>
            <Icon size={15} color="white" />
          </div>
          <h2 className="font-bold text-gray-700 dark:text-gray-200 text-sm">{column.title}</h2>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${config.badge}`}>
            {tasks.filter(Boolean).length}
          </span>
        </div>
        <button
          onClick={onDeleteColumn}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Column Body */}
      <div
        ref={setNodeRef}
        className="flex flex-col gap-2.5 min-h-[300px] rounded-2xl p-3 transition-all duration-300"
        style={{
          background: darkMode ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.45)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${isOver ? config.border : darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)'}`,
          boxShadow: isOver ? `0 0 30px ${config.glow}` : '0 4px 24px rgba(0,0,0,0.06)',
        }}
      >
        {/* Gradient top line */}
        <div className={`h-0.5 rounded-full bg-gradient-to-r ${config.gradient} -mt-0.5 mx-1 mb-1 opacity-60`} />

        {filtered.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={() => deleteTask(task.id)}
            onUpdate={(updates) => updateTask(task.id, updates)}
            priorityColors={PRIORITY_COLORS}
            columnTitle={column.title}
            darkMode={darkMode}
          />
        ))}

        {adding ? (
          <div className="rounded-xl p-3 flex flex-col gap-2 shadow-lg"
            style={{
              background: darkMode ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.9)',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)'
            }}
          >
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="Task title..."
              className="rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
              style={{
                background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)'
              }}
            />
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Description (optional)..."
              rows={2}
              className="rounded-lg px-3 py-2 text-sm focus:outline-none resize-none dark:text-white"
              style={{
                background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)'
              }}
            />
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm focus:outline-none dark:text-white"
              style={{
                background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)'
              }}
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
            <div className="flex gap-2">
              <button onClick={addTask} className="flex-1 py-1.5 rounded-lg text-sm font-semibold text-white liquid-btn shadow"
                style={{ background: `linear-gradient(135deg, ${config.gradient.includes('blue') ? '#6366f1, #4f46e5' : config.gradient.includes('yellow') ? '#f59e0b, #d97706' : '#22c55e, #16a34a'})` }}
              >Add Task</button>
              <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl px-3 py-2.5 text-sm transition-all hover:bg-white/50 dark:hover:bg-white/5 liquid-btn"
          >
            <Plus size={15} />
            Add Task
          </button>
        )}
      </div>
    </div>
  )
}
import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Pencil, Trash2, CheckCircle2, Zap, GripVertical } from 'lucide-react'

export default function TaskCard({ task, onDelete, onUpdate, priorityColors, columnTitle, darkMode }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [desc, setDesc] = useState(task.description || '')
  const [priority, setPriority] = useState(task.priority || 'medium')

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 'auto',
  }

  function saveEdit() {
    if (!title.trim()) return
    onUpdate({ title: title.trim(), description: desc.trim(), priority })
    setEditing(false)
  }

  const isInProgress = columnTitle === 'In Progress'
  const isDone = task.done

  const priorityConfig = {
    low: { color: '#22c55e', label: 'Low' },
    medium: { color: '#f59e0b', label: 'Medium' },
    high: { color: '#ef4444', label: 'High' },
  }
  const pConfig = priorityConfig[task.priority || 'medium']

  if (editing) {
    return (
      <div className="rounded-xl p-3 flex flex-col gap-2 shadow-xl"
        style={{
          background: darkMode ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.98)',
          border: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
          style={{
            background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)'
          }}
        />
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
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
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
        <div className="flex gap-2">
          <button onClick={saveEdit} className="flex-1 py-1.5 rounded-lg text-sm font-semibold text-white liquid-btn"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>Save</button>
          <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: isDone
          ? darkMode ? 'rgba(20,83,45,0.3)' : 'rgba(220,252,231,0.8)'
          : isInProgress
          ? darkMode ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.85)'
          : darkMode ? 'rgba(30,41,59,0.6)' : 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(8px)',
        border: isDone
          ? '1px solid rgba(34,197,94,0.3)'
          : isInProgress
          ? '1px solid rgba(251,191,36,0.3)'
          : darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.8)',
        boxShadow: isInProgress && !isDragging ? '0 0 0 0 rgba(251,191,36,0.4)' : '0 2px 12px rgba(0,0,0,0.06)',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      {...listeners}
      {...attributes}
      className={`rounded-xl p-3 flex flex-col gap-2 group card-3d ${isInProgress ? 'pulse-ring' : ''}`}
    >
      {/* Top row */}
      <div className="flex items-start gap-2">
        <div className="mt-0.5 text-gray-300 dark:text-gray-600 flex-shrink-0">
          <GripVertical size={14} />
        </div>

        {isDone && <CheckCircle2 size={15} className="text-green-500 flex-shrink-0 mt-0.5" />}
        {isInProgress && !isDone && <Zap size={15} className="text-yellow-500 flex-shrink-0 mt-0.5 animate-pulse" />}

        <p className={`text-sm font-semibold flex-1 leading-snug ${
          isDone ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'
        }`}>
          {task.title}
        </p>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); setEditing(true) }}
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
          >
            <Pencil size={11} />
          </button>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onDelete() }}
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-5">{task.description}</p>
      )}

      <div className="flex items-center justify-between pl-5">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: pConfig.color }} />
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{pConfig.label}</span>
        </div>
        {isInProgress && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(251,191,36,0.15)', color: '#d97706' }}>
            Active
          </span>
        )}
      </div>
    </div>
  )
}
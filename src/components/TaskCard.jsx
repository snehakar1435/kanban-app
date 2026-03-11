import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export default function TaskCard({ task, onDelete, onUpdate, priorityColors, columnTitle }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [desc, setDesc] = useState(task.description || '')
  const [priority, setPriority] = useState(task.priority || 'medium')

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  function saveEdit() {
    if (!title.trim()) return
    onUpdate({ title: title.trim(), description: desc.trim(), priority })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 flex flex-col gap-2 shadow-md">
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          rows={2}
          className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none resize-none"
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
          className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="low">🟢 Low</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
        <div className="flex gap-2">
          <button onClick={saveEdit} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Save</button>
          <button onClick={() => setEditing(false)} className="text-gray-500 px-3 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
        </div>
      </div>
    )
  }

  const isInProgress = columnTitle === 'In Progress'
  const isDone = task.done

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`rounded-lg p-3 shadow hover:shadow-md transition-all flex flex-col gap-2 group relative overflow-hidden
        ${isDone
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
          : isInProgress
          ? 'bg-white dark:bg-gray-700 border-l-4 border-l-yellow-400 border border-yellow-100 dark:border-yellow-900/40'
          : 'bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600'
        }`}
    >
      {/* In Progress animated top bar */}
      {isInProgress && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 animate-pulse" />
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          {isDone && <span className="text-green-500 text-base">✅</span>}
          {isInProgress && <span className="text-yellow-500 text-base animate-pulse">⚡</span>}
          <p className={`text-sm font-medium ${
            isDone
              ? 'line-through text-gray-400 dark:text-gray-500'
              : isInProgress
              ? 'text-gray-800 dark:text-gray-100 font-semibold'
              : 'text-gray-800 dark:text-gray-100'
          }`}>
            {task.title}
          </p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); setEditing(true) }}
            className="text-gray-400 hover:text-blue-500 text-sm transition"
          >✏️</button>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onDelete() }}
            className="text-gray-400 hover:text-red-500 text-sm transition"
          >🗑</button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full w-fit font-medium ${priorityColors[task.priority || 'medium']}`}>
          {task.priority === 'low' ? '🟢 Low' : task.priority === 'high' ? '🔴 High' : '🟡 Medium'}
        </span>
        {isInProgress && (
          <span className="text-[10px] text-yellow-500 font-semibold uppercase tracking-wide">In Progress</span>
        )}
      </div>
    </div>
  )
}
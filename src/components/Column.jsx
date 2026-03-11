import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'

const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

const COLUMN_STYLES = {
  'Todo': { icon: '📋', accent: 'border-t-4 border-blue-400', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  'In Progress': { icon: '⚡', accent: 'border-t-4 border-yellow-400', badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
  'Done': { icon: '✅', accent: 'border-t-4 border-green-400', badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
}

export default function Column({ column, tasks, data, setData, search, onDeleteColumn }) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [priority, setPriority] = useState('medium')

  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const style = COLUMN_STYLES[column.title] || { icon: '📌', accent: 'border-t-4 border-purple-400', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' }

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
    <div className="min-w-[280px] max-w-[280px] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">{style.icon} {column.title}</h2>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
            {tasks.filter(Boolean).length}
          </span>
        </div>
        <button onClick={onDeleteColumn} className="text-gray-400 hover:text-red-500 text-lg transition">🗑</button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-3 min-h-[200px] rounded-xl p-3 transition-all bg-white dark:bg-gray-800/80 shadow-sm ${style.accent} ${
          isOver ? 'ring-2 ring-blue-400 scale-[1.01]' : ''
        }`}
      >
        {filtered.map(task => (
          <TaskCard
         key={task.id}
         task={task}
         onDelete={() => deleteTask(task.id)}
         onUpdate={(updates) => updateTask(task.id, updates)}
         priorityColors={PRIORITY_COLORS}
         columnTitle={column.title}
         />
        ))}

        {adding ? (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex flex-col gap-2 shadow">
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="Task title..."
              className="border rounded px-2 py-1 text-sm dark:bg-gray-600 dark:text-white dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Description (optional)..."
              rows={2}
              className="border rounded px-2 py-1 text-sm dark:bg-gray-600 dark:text-white dark:border-gray-500 focus:outline-none resize-none"
            />
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="border rounded px-2 py-1 text-sm dark:bg-gray-600 dark:text-white dark:border-gray-500"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <div className="flex gap-2">
              <button onClick={addTask} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Add</button>
              <button onClick={() => setAdding(false)} className="text-gray-500 px-3 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-600">Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 text-sm text-left transition"
          >
            + Add Task
          </button>
        )}
      </div>
    </div>
  )
}
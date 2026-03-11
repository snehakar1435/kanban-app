import { useState } from 'react'
import Column from './Column'
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { Plus } from 'lucide-react'

export default function Board({ data, setData, search, darkMode }) {
  const [newColTitle, setNewColTitle] = useState('')
  const [addingCol, setAddingCol] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    const sourceColId = Object.keys(data.columns).find(colId =>
      data.columns[colId].taskIds.includes(activeId)
    )

    let destColId = Object.keys(data.columns).find(colId =>
      data.columns[colId].taskIds.includes(overId)
    )
    if (!destColId) destColId = overId
    if (!destColId || !data.columns[destColId]) return
    if (sourceColId === destColId) return

    const sourceTasks = [...data.columns[sourceColId].taskIds]
    const destTasks = [...data.columns[destColId].taskIds]

    sourceTasks.splice(sourceTasks.indexOf(activeId), 1)
    destTasks.push(activeId)

    const isDone = data.columns[destColId]?.title === 'Done'
    const updatedTasks = {
      ...data.tasks,
      [activeId]: { ...data.tasks[activeId], done: isDone }
    }

    setData(prev => ({
      ...prev,
      tasks: updatedTasks,
      columns: {
        ...prev.columns,
        [sourceColId]: { ...prev.columns[sourceColId], taskIds: sourceTasks },
        [destColId]: { ...prev.columns[destColId], taskIds: destTasks },
      }
    }))
  }

  function addColumn() {
    if (!newColTitle.trim()) return
    const id = 'col-' + Date.now()
    setData(prev => ({
      ...prev,
      columns: { ...prev.columns, [id]: { id, title: newColTitle.trim(), taskIds: [] } },
      columnOrder: [...prev.columnOrder, id],
    }))
    setNewColTitle('')
    setAddingCol(false)
  }

  function deleteColumn(colId) {
    const col = data.columns[colId]
    const newTasks = { ...data.tasks }
    col.taskIds.forEach(tid => delete newTasks[tid])
    const newColumns = { ...data.columns }
    delete newColumns[colId]
    setData(prev => ({
      ...prev,
      tasks: newTasks,
      columns: newColumns,
      columnOrder: prev.columnOrder.filter(id => id !== colId),
    }))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-5 p-6 overflow-x-auto min-h-[calc(100vh-72px)] items-start">
        {data.columnOrder.map(colId => (
          <Column
            key={colId}
            column={data.columns[colId]}
            tasks={data.columns[colId].taskIds.map(tid => data.tasks[tid])}
            data={data}
            setData={setData}
            search={search}
            onDeleteColumn={() => deleteColumn(colId)}
            darkMode={darkMode}
          />
        ))}

        <div className="min-w-[300px]">
          {addingCol ? (
            <div className="rounded-2xl p-4 flex flex-col gap-3 shadow-xl"
              style={{
                background: darkMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(16px)',
                border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.8)'
              }}
            >
              <input
                autoFocus
                value={newColTitle}
                onChange={e => setNewColTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addColumn()}
                placeholder="Column name..."
                className="rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
                style={{
                  background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
                  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)'
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={addColumn}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold text-white liquid-btn shadow"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                >
                  Add Column
                </button>
                <button
                  onClick={() => setAddingCol(false)}
                  className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingCol(true)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-medium transition-all liquid-btn"
              style={{
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.4)',
                backdropFilter: 'blur(12px)',
                border: darkMode ? '1px dashed rgba(255,255,255,0.15)' : '1px dashed rgba(0,0,0,0.15)',
                color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'
              }}
            >
              <Plus size={16} />
              Add Column
            </button>
          )}
        </div>
      </div>
    </DndContext>
  )
}
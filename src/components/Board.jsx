import { useState } from 'react'
import Column from './Column'
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'

export default function Board({ data, setData, search }) {
  const [newColTitle, setNewColTitle] = useState('')
  const [addingCol, setAddingCol] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor))

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
      <div className="flex gap-4 p-6 overflow-x-auto min-h-[calc(100vh-72px)] items-start">
        {data.columnOrder.map(colId => (
          <Column
            key={colId}
            column={data.columns[colId]}
            tasks={data.columns[colId].taskIds.map(tid => data.tasks[tid])}
            data={data}
            setData={setData}
            search={search}
            onDeleteColumn={() => deleteColumn(colId)}
          />
        ))}
        <div className="min-w-[280px]">
          {addingCol ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow flex flex-col gap-2">
              <input
                autoFocus
                value={newColTitle}
                onChange={e => setNewColTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addColumn()}
                placeholder="Column name..."
                className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex gap-2">
                <button onClick={addColumn} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Add</button>
                <button onClick={() => setAddingCol(false)} className="text-gray-500 px-3 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingCol(true)}
              className="w-full bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl px-4 py-3 text-sm font-medium shadow transition"
            >
              + Add Column
            </button>
          )}
        </div>
      </div>
    </DndContext>
  )
}
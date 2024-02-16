import { v4 as uuid } from 'uuid'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import boardData from '~/data/board.json'

export const useBoardStore = defineStore('boardStore', () => {
  const board = useStorage('board', boardData)

  /**
   * Tasks
   */
  const getTask = computed(() => {
    return (taskId: string | string[]) => {
      for (const column of board.value.columns) {
        const task = column.tasks.find((task) => task.id === taskId)
        if (task) return task
      }
    }
  })

  const addTask = (data: { columnIndex: number; taskName: string }) => {
    board.value.columns[data.columnIndex].tasks.push({
      id: uuid(),
      name: data.taskName,
      description: '',
    })
  }

  const deleteTask = (taskId: string | string[]) => {
    for (const column of board.value.columns) {
      const taskIndex = column.tasks.findIndex((task) => task.id === taskId)

      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1)
        return
      }
    }
  }

  const moveTask = (indexes: {
    fromTaskIndex: number
    toTaskIndex: number
    fromColumnIndex: number
    toColumnIndex: number
  }) => {
    const { fromTaskIndex, toTaskIndex, fromColumnIndex, toColumnIndex } =
      indexes
    const task = board.value.columns[fromColumnIndex].tasks.splice(
      fromTaskIndex,
      1
    )[0]

    board.value.columns[toColumnIndex].tasks.splice(toTaskIndex, 0, task)
  }

  /**
   * Columns
   */
  const addColumn = (columnName: string) => {
    board.value.columns.push({
      id: uuid(),
      name: columnName,
      tasks: [],
    })
  }

  const deleteColumn = (columnIndex: number) => {
    board.value.columns.splice(columnIndex, 1)
  }

  const moveColumn = (indexes: {
    fromColumnIndex: number
    toColumnIndex: number
  }) => {
    const column = board.value.columns.splice(indexes.fromColumnIndex, 1)[0]

    board.value.columns.splice(indexes.toColumnIndex, 0, column)
  }

  return {
    /* State */
    board,
    /* Getters */
    getTask,
    /* Actions */
    addTask,
    deleteTask,
    moveTask,
    addColumn,
    deleteColumn,
    moveColumn,
  }
})

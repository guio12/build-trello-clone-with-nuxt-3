import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import boardData from '~/data/board.json'

export const useBoardStore = defineStore('boardStore', () => {
  const board = useStorage('board', boardData)

  const getTask = computed(() => {
    return taskId => {
      for (const column of board.value.columns) {
        const task = column.tasks.find(task => task.id === taskId)
        if (task) return task
      }
    }
  })

  const addColumn = (columnName: string) => {
    board.value.columns.push({
      //id: self.crypto.randomUUID(),
      name: columnName,
      tasks: [],
    })
  }

  const deleteColumn = (columnIndex: number) => {
    board.value.columns.splice(columnIndex, 1)
  }

  return {
    /* State */
    board,
    /* Getters */
    getTask,
    /* Actions */
    addColumn,
    deleteColumn,
  }
})

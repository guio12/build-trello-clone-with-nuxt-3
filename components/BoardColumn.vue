<script setup lang="ts">
import { useBoardStore } from '~/stores/boardStore'
import type { ColumnI } from '~/model/ColumnI'

const toast = useToast()

const props = defineProps<{
  column: ColumnI
  columnIndex: number
}>()

const boardStore = useBoardStore()
const router = useRouter()

const editNameState = ref(false)
const newTaskName = ref('')

const pickupColumn = (event: DragEvent, fromColumnIndex: number) => {
  event.dataTransfer?.effectAllowed === 'move'
  event.dataTransfer?.dropEffect === 'move'
  event.dataTransfer?.setData('type', 'column')
  event.dataTransfer?.setData('from-column-index', fromColumnIndex.toString())
}

const deleteColumn = (columnName: string, columnIndex: number) => {
  toast.add({
    title: 'Column delete',
    description: `${columnName} has been deleted.`,
    icon: 'i-heroicons-trash',
    color: 'red',
  })
  boardStore.deleteColumn(columnIndex)
}

const goToTask = (taskId: string) => {
  router.push(`/tasks/${taskId}`)
}

const addTask = () => {
  boardStore.addTask({
    taskName: newTaskName.value,
    columnIndex: props.columnIndex,
  })
  newTaskName.value = ''
}

const pickupTask = (
  event: DragEvent,
  indexes: { fromColumnIndex: number; fromTaskIndex: number }
) => {
  const { fromColumnIndex, fromTaskIndex } = indexes
  event.dataTransfer?.effectAllowed === 'move'
  event.dataTransfer?.dropEffect === 'move'
  event.dataTransfer?.setData('type', 'task')
  event.dataTransfer?.setData('from-column-index', fromColumnIndex.toString())
  event.dataTransfer?.setData('from-task-index', fromTaskIndex.toString())
}

const dropItem = (
  event: DragEvent,
  indexes: { toColumnIndex: number; toTaskIndex?: number }
) => {
  const { toColumnIndex, toTaskIndex } = indexes

  const type = event.dataTransfer?.getData('type')
  const fromColumnIndex = Number(
    event?.dataTransfer?.getData('from-column-index')
  )

  if (type === 'task') {
    const fromTaskIndex = Number(
      event?.dataTransfer?.getData('from-task-index')
    )

    if (toTaskIndex !== undefined) {
      boardStore.moveTask({
        fromTaskIndex,
        toTaskIndex,
        fromColumnIndex,
        toColumnIndex,
      })
    }
  } else if (type === 'column') {
    boardStore.moveColumn({
      fromColumnIndex,
      toColumnIndex,
    })
  }
}
</script>

<template>
  <UContainer
    class="column"
    draggable="true"
    @dragstart.self="pickupColumn($event, columnIndex)"
    @dragenter.prevent
    @dragover.prevent
    @drop.stop="dropItem($event, { toColumnIndex: columnIndex })"
  >
    <div class="column-header mb-4">
      <div>
        <UInput
          v-if="editNameState"
          type="text"
          v-model="column.name"
          @keyup.enter="editNameState = !editNameState"
        />
        <h2 v-else>{{ column.name }}</h2>
      </div>

      <div>
        <UButton
          v-if="!editNameState"
          icon="i-heroicons-pencil-square"
          class="mr-2"
          @click="editNameState = !editNameState"
        />
        <UButton
          v-else
          icon="i-heroicons-check"
          class="mr-2"
          @click="editNameState = !editNameState"
        />
        <UButton
          icon="i-heroicons-trash"
          color="red"
          @click="deleteColumn(column.name, columnIndex)"
        />
      </div>
    </div>
    <ul>
      <li v-for="(task, taskIndex) in column.tasks" :key="task.id">
        <UCard
          class="mb-4 cursor-pointer"
          @click="goToTask(task.id)"
          draggable="true"
          @dragstart="
            pickupTask($event, {
              fromColumnIndex: columnIndex,
              fromTaskIndex: taskIndex,
            })
          "
          @drop.stop="
            dropItem($event, {
              toColumnIndex: columnIndex,
              toTaskIndex: taskIndex,
            })
          "
        >
          <strong>{{ task.name }}</strong>
          <p>{{ task.description }}</p>
        </UCard>
      </li>
    </ul>
    <UInput
      v-model="newTaskName"
      type="text"
      placeholder="Create new task"
      icon="i-heroicons-plus-circle-solid"
      @keyup.enter="addTask"
    />
  </UContainer>
</template>

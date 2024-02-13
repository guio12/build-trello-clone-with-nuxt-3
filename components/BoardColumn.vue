<script setup lang="ts">
import { useBoardStore } from '../stores/boardStore'

const props = defineProps<{
  column: object
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
  event.dataTransfer?.setData('from-column-index', fromColumnIndex.toString()) // remove toString at some point?
}

const deleteColumn = (columnIndex: number) =>
  boardStore.deleteColumn(columnIndex)

const goToTask = (taskId: number) => {
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
  event.dataTransfer?.effectAllowed === 'move'
  event.dataTransfer?.dropEffect === 'move'
  event.dataTransfer?.setData('type', 'task')
  event.dataTransfer?.setData(
    'from-column-index',
    indexes.fromColumnIndex.toString()
  ) // remove toString at some point?
  event.dataTransfer?.setData(
    'from-task-index',
    indexes.fromTaskIndex.toString()
  ) // remove toString at some point?
}

const dropItem = (event: DragEvent, toColumnIndex: number) => {
  const type = event.dataTransfer?.getData('type')
  const fromColumnIndex = event?.dataTransfer?.getData('from-column-index')

  // to remove?
  toColumnIndex = toColumnIndex.toString()

  if (type === 'task') {
    const fromTaskIndex = event?.dataTransfer?.getData('from-task-index')

    boardStore.moveTask({
      taskIndex: fromTaskIndex,
      fromColumnIndex,
      toColumnIndex,
    })
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
    @drop.stop="dropItem($event, columnIndex)"
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
          icon="i-heroicons-pencil-square"
          class="mr-2"
          @click="editNameState = !editNameState"
        />
        <UButton
          icon="i-heroicons-trash"
          color="red"
          @click="deleteColumn(columnIndex)"
        />
      </div>
    </div>
    <ul>
      <li v-for="(task, taskIndex) in column.tasks" :key="task.id">
        <UCard
          class="mb-4"
          @click="goToTask(task.id)"
          draggable="true"
          @dragstart="
            pickupTask($event, {
              fromColumnIndex: columnIndex,
              fromTaskIndex: taskIndex,
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
      placeholder="Create new column"
      icon="i-heroicons-plus-circle-solid"
      @keyup.enter="addTask"
    />
  </UContainer>
</template>

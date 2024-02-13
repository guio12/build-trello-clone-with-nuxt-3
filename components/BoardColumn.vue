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

const addTask = () => {
  boardStore.addTask({
    taskName: newTaskName.value,
    columnIndex: props.columnIndex,
  })
  newTaskName.value = ''
}

const deleteColumn = (columnIndex: number) =>
  boardStore.deleteColumn(columnIndex)

const goToTask = (taskId: number) => {
  router.push(`/tasks/${taskId}`)
}

const pickupTask = (
  event: DragEvent,
  indexes: { fromColumnIndex: number; fromTaskIndex: number }
) => {
  event?.dataTransfer?.effectAllowed === 'move'
  event?.dataTransfer?.dropEffect === 'move'
  event?.dataTransfer?.setData('from-column-index', indexes.fromColumnIndex.toString()) // remove toString at some point?
  event?.dataTransfer?.setData('from-task-index', indexes.fromTaskIndex.toString()) // remove toString at some point?
}

const dropTask = (event: DragEvent, toColumnIndex: number) => {
  const fromColumnIndex = event?.dataTransfer?.getData('from-column-index')
  const fromTaskIndex = event?.dataTransfer?.getData('from-task-index')

  // to remove?
  toColumnIndex = toColumnIndex.toString()

  boardStore.moveTask({
    taskIndex: fromTaskIndex,
    fromColumnIndex,
    toColumnIndex,
  })
}
</script>

<template>
  <UContainer
    class="column"
    @dragenter.prevent
    @dragover.prevent
    @drop.stop="dropTask($event, columnIndex)"
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

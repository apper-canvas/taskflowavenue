import taskData from '../mockData/tasks.json'
import { taskListService } from '../index'

let tasks = [...taskData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getAll = async (filters = {}) => {
  await delay(300)
  
  let filteredTasks = [...tasks]
  
  // Filter by completion status
  if (filters.completed !== undefined) {
    filteredTasks = filteredTasks.filter(task => task.completed === filters.completed)
  }
  
  // Filter by list
  if (filters.listId) {
    filteredTasks = filteredTasks.filter(task => task.listId === filters.listId)
  }
  
  // Filter by priority
  if (filters.priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === filters.priority)
  }
  
  // Search by title or description
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm) ||
      (task.description && task.description.toLowerCase().includes(searchTerm))
    )
  }
  
  // Sort by due date, then by created date
  filteredTasks.sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    if (a.dueDate) return -1
    if (b.dueDate) return 1
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
  
  return filteredTasks
}

export const getById = async (id) => {
  await delay(250)
  const task = tasks.find(t => t.Id === parseInt(id, 10))
  if (!task) {
    throw new Error('Task not found')
  }
  return { ...task }
}

export const create = async (taskData) => {
  await delay(400)
  
  const newTask = {
    Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
    title: taskData.title,
    description: taskData.description || '',
    priority: taskData.priority || 'medium',
    dueDate: taskData.dueDate || null,
    completed: false,
    completedAt: null,
    listId: taskData.listId || '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  tasks.push(newTask)
  
  // Update task count in list
  await taskListService.updateTaskCount(newTask.listId)
  
  return { ...newTask }
}

export const update = async (id, updates) => {
  await delay(350)
  
  const taskIndex = tasks.findIndex(t => t.Id === parseInt(id, 10))
  if (taskIndex === -1) {
    throw new Error('Task not found')
  }
  
  const currentTask = tasks[taskIndex]
  const updatedTask = {
    ...currentTask,
    ...updates,
    Id: currentTask.Id,
    updatedAt: new Date().toISOString()
  }
  
  // Handle completion status change
  if (updates.completed !== undefined && updates.completed !== currentTask.completed) {
    updatedTask.completedAt = updates.completed ? new Date().toISOString() : null
  }
  
  tasks[taskIndex] = updatedTask
  
  // Update task count in list if list changed
  if (updates.listId && updates.listId !== currentTask.listId) {
    await taskListService.updateTaskCount(currentTask.listId)
    await taskListService.updateTaskCount(updates.listId)
  }
  
  return { ...updatedTask }
}

export const deleteTask = async (id) => {
  await delay(300)
  
  const taskIndex = tasks.findIndex(t => t.Id === parseInt(id, 10))
  if (taskIndex === -1) {
    throw new Error('Task not found')
  }
  
  const task = tasks[taskIndex]
  tasks.splice(taskIndex, 1)
  
  // Update task count in list
  await taskListService.updateTaskCount(task.listId)
  
  return { success: true }
}

export const toggleComplete = async (id) => {
  await delay(250)
  
  const taskIndex = tasks.findIndex(t => t.Id === parseInt(id, 10))
  if (taskIndex === -1) {
    throw new Error('Task not found')
  }
  
  const task = tasks[taskIndex]
  const completed = !task.completed
  
  tasks[taskIndex] = {
    ...task,
    completed,
    completedAt: completed ? new Date().toISOString() : null,
    updatedAt: new Date().toISOString()
  }
  
  return { ...tasks[taskIndex] }
}

export const getTaskStats = async () => {
  await delay(200)
  
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const activeTasks = totalTasks - completedTasks
  const overdueTasks = tasks.filter(t => 
    !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
  ).length
  
  return {
    total: totalTasks,
    completed: completedTasks,
    active: activeTasks,
    overdue: overdueTasks
  }
}
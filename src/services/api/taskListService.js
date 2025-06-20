import taskListData from '../mockData/taskLists.json'

let taskLists = [...taskListData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const getAll = async () => {
  await delay(250)
  return taskLists.map(list => ({ ...list })).sort((a, b) => a.order - b.order)
}

export const getById = async (id) => {
  await delay(200)
  const list = taskLists.find(tl => tl.Id === parseInt(id, 10))
  if (!list) {
    throw new Error('Task list not found')
  }
  return { ...list }
}

export const create = async (listData) => {
  await delay(350)
  
  const newList = {
    Id: Math.max(...taskLists.map(tl => tl.Id), 0) + 1,
    name: listData.name,
    color: listData.color || '#5B47E0',
    icon: listData.icon || 'List',
    taskCount: 0,
    order: Math.max(...taskLists.map(tl => tl.order), 0) + 1
  }
  
  taskLists.push(newList)
  return { ...newList }
}

export const update = async (id, updates) => {
  await delay(300)
  
  const listIndex = taskLists.findIndex(tl => tl.Id === parseInt(id, 10))
  if (listIndex === -1) {
    throw new Error('Task list not found')
  }
  
  const updatedList = {
    ...taskLists[listIndex],
    ...updates,
    Id: taskLists[listIndex].Id
  }
  
  taskLists[listIndex] = updatedList
  return { ...updatedList }
}

export const deleteList = async (id) => {
  await delay(300)
  
  const listIndex = taskLists.findIndex(tl => tl.Id === parseInt(id, 10))
  if (listIndex === -1) {
    throw new Error('Task list not found')
  }
  
  taskLists.splice(listIndex, 1)
  return { success: true }
}

export const updateTaskCount = async (listId) => {
  await delay(100)
  
  // Import tasks here to avoid circular dependency
  const { default: taskData } = await import('../mockData/tasks.json')
  const activeTasks = taskData.filter(task => task.listId === listId && !task.completed)
  
  const listIndex = taskLists.findIndex(tl => tl.Id === parseInt(listId, 10))
  if (listIndex !== -1) {
    taskLists[listIndex].taskCount = activeTasks.length
  }
  
  return taskLists[listIndex] ? { ...taskLists[listIndex] } : null
}
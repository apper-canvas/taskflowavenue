import Tasks from '@/components/pages/Tasks'
import Archive from '@/components/pages/Archive'
import Lists from '@/components/pages/Lists'

export const routes = {
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  lists: {
    id: 'lists',
    label: 'Lists',
    path: '/lists',
    icon: 'FolderOpen',
    component: Lists
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    path: '/archive',
    icon: 'Archive',
    component: Archive
  }
}

export const routeArray = Object.values(routes)
export default routes
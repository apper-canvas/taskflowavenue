import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import TaskCard from '@/components/molecules/TaskCard'
import EmptyState from '@/components/molecules/EmptyState'
import ErrorState from '@/components/molecules/ErrorState'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import AddTaskModal from '@/components/organisms/AddTaskModal'
import { taskService } from '@/services'
import { toast } from 'react-toastify'

const TaskList = ({ filters = {}, showCompleted = false }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    loadTasks()
  }, [filters, showCompleted, searchParams])

  const loadTasks = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const searchTerm = searchParams.get('search') || ''
      const taskFilters = {
        ...filters,
        completed: showCompleted,
        search: searchTerm
      }
      
      const result = await taskService.getAll(taskFilters)
      setTasks(result)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ))
  }

  const handleTaskDelete = async (task) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      await taskService.deleteTask(task.Id)
      setTasks(prev => prev.filter(t => t.Id !== task.Id))
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
  }

  if (loading) {
    return <SkeletonLoader count={5} type="task" />
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadTasks}
      />
    )
  }

  if (tasks.length === 0) {
    const searchTerm = searchParams.get('search')
    
    if (searchTerm) {
      return (
        <EmptyState
          icon="Search"
          title="No tasks found"
          description={`No tasks match your search for "${searchTerm}"`}
        />
      )
    }
    
    return (
      <EmptyState
        icon="CheckSquare"
        title={showCompleted ? "No completed tasks" : "No active tasks"}
        description={showCompleted 
          ? "Complete some tasks to see them here"
          : "Create your first task to get started"
        }
        actionLabel={showCompleted ? undefined : "Add Task"}
        onAction={showCompleted ? undefined : () => setEditingTask({})}
      />
    )
  }

  return (
    <>
      <motion.div 
        layout
        className="space-y-3"
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <motion.div
              key={task.Id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.05 }}
            >
              <TaskCard
                task={task}
                onUpdate={handleTaskUpdate}
                onEdit={handleEditTask}
                onDelete={handleTaskDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AddTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onSuccess={loadTasks}
      />
    </>
  )
}

export default TaskList
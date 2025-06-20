import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import { taskService, taskListService } from '@/services'

const AddTaskModal = ({ isOpen, onClose, task = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    listId: '1'
  })
  const [loading, setLoading] = useState(false)
  const [taskLists, setTaskLists] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      loadTaskLists()
      if (task) {
        // Edit mode
        setFormData({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || 'medium',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          listId: task.listId || '1'
        })
      } else {
        // Add mode
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          dueDate: '',
          listId: '1'
        })
      }
      setErrors({})
    }
  }, [isOpen, task])

  const loadTaskLists = async () => {
    try {
      const lists = await taskListService.getAll()
      setTaskLists(lists)
    } catch (error) {
      console.error('Failed to load task lists:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const taskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate || null
      }

      if (task) {
        // Update existing task
        await taskService.update(task.Id, taskData)
        toast.success('Task updated successfully!')
      } else {
        // Create new task
        await taskService.create(taskData)
        toast.success('Task created successfully!')
      }
      
      onSuccess?.()
      onClose()
    } catch (error) {
      toast.error(task ? 'Failed to update task' : 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-semibold text-surface-900">
                    {task ? 'Edit Task' : 'Add New Task'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter task title"
                    error={errors.title}
                    autoFocus
                  />

                  <Textarea
                    label="Description (optional)"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Add more details about this task"
                    rows={3}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => handleChange('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <Input
                      label="Due Date (optional)"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleChange('dueDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      List
                    </label>
                    <select
                      value={formData.listId}
                      onChange={(e) => handleChange('listId', e.target.value)}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
{taskLists.map(list => (
                        <option key={list.Id} value={list.Id}>
                          {list.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      className="flex-1"
                    >
                      {task ? 'Update Task' : 'Create Task'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AddTaskModal
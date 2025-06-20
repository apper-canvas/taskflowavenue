import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import TaskListCard from '@/components/molecules/TaskListCard'
import EmptyState from '@/components/molecules/EmptyState'
import ErrorState from '@/components/molecules/ErrorState'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import { taskListService } from '@/services'

const Lists = () => {
  const navigate = useNavigate()
  const [taskLists, setTaskLists] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingList, setEditingList] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    color: '#5B47E0',
    icon: 'List'
  })
  const [formLoading, setFormLoading] = useState(false)

  const colorOptions = [
    '#5B47E0', '#8B7FE8', '#00D4AA', '#FFB547', 
    '#FF5757', '#3B82F6', '#10B981', '#F59E0B'
  ]

  const iconOptions = [
    'List', 'Briefcase', 'User', 'FolderOpen', 'Star', 
    'Heart', 'Home', 'Zap', 'Target', 'Calendar'
  ]

  useEffect(() => {
    loadTaskLists()
  }, [])

  const loadTaskLists = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await taskListService.getAll()
      setTaskLists(result)
    } catch (err) {
      setError(err.message || 'Failed to load task lists')
      toast.error('Failed to load task lists')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateList = () => {
    setEditingList(null)
    setFormData({ name: '', color: '#5B47E0', icon: 'List' })
    setIsAddModalOpen(true)
  }

  const handleEditList = (list) => {
    setEditingList(list)
    setFormData({
      name: list.name,
      color: list.color,
      icon: list.icon
    })
    setIsAddModalOpen(true)
  }

  const handleDeleteList = async (list) => {
    if (!confirm(`Are you sure you want to delete "${list.name}"? This action cannot be undone.`)) {
      return
    }
    
    try {
      await taskListService.deleteList(list.Id)
      setTaskLists(prev => prev.filter(l => l.Id !== list.Id))
      toast.success('List deleted successfully')
    } catch (error) {
      toast.error('Failed to delete list')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('List name is required')
      return
    }

    setFormLoading(true)
    try {
      if (editingList) {
        const updatedList = await taskListService.update(editingList.Id, formData)
        setTaskLists(prev => prev.map(list => 
          list.Id === updatedList.Id ? updatedList : list
        ))
        toast.success('List updated successfully')
      } else {
        const newList = await taskListService.create(formData)
        setTaskLists(prev => [...prev, newList])
        toast.success('List created successfully')
      }
      
      setIsAddModalOpen(false)
    } catch (error) {
      toast.error(editingList ? 'Failed to update list' : 'Failed to create list')
    } finally {
      setFormLoading(false)
    }
  }

const handleListClick = (list) => {
    navigate(`/tasks?list=${list.Id}`)
  }

  if (loading) {
    return (
      <div className="h-full max-w-full overflow-hidden">
        <div className="h-full flex flex-col p-6 max-w-6xl mx-auto">
          <div className="flex-shrink-0 mb-6">
            <div className="h-8 bg-surface-200 rounded w-48 animate-pulse mb-2" />
            <div className="h-4 bg-surface-200 rounded w-64 animate-pulse" />
          </div>
          <div className="flex-1 overflow-y-auto">
            <SkeletonLoader count={3} type="list" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full max-w-full overflow-hidden">
        <div className="h-full flex flex-col p-6 max-w-6xl mx-auto">
          <div className="flex-1 flex items-center justify-center">
            <ErrorState 
              message={error}
              onRetry={loadTaskLists}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full max-w-full overflow-hidden">
      <div className="h-full flex flex-col p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex-shrink-0 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="FolderOpen" size={24} className="text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-surface-900">
                  Task Lists
                </h1>
                <p className="text-surface-600">
                  Organize your tasks into different categories
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleCreateList}
              icon="Plus"
              className="whitespace-nowrap"
            >
              Create List
            </Button>
          </div>
        </div>

        {/* Lists Grid */}
        <div className="flex-1 overflow-y-auto">
          {taskLists.length === 0 ? (
            <EmptyState
              icon="FolderOpen"
              title="No task lists yet"
              description="Create your first list to organize your tasks by project or category"
              actionLabel="Create List"
              onAction={handleCreateList}
            />
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {taskLists.map((list, index) => (
                  <motion.div
                    key={list.Id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TaskListCard
                      taskList={list}
                      onClick={handleListClick}
                      onEdit={handleEditList}
                      onDelete={handleDeleteList}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add/Edit List Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsAddModalOpen(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-semibold text-surface-900">
                      {editingList ? 'Edit List' : 'Create New List'}
                    </h2>
                    <button
                      onClick={() => setIsAddModalOpen(false)}
                      className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                    >
                      <ApperIcon name="X" size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="List Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter list name"
                      autoFocus
                    />

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Color
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                            className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                              formData.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Icon
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {iconOptions.map(icon => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, icon }))}
                            className={`p-3 rounded-lg transition-all duration-200 flex items-center justify-center ${
                              formData.icon === icon 
                                ? 'bg-primary/10 text-primary border-2 border-primary/20' 
                                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                            }`}
                          >
                            <ApperIcon name={icon} size={20} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsAddModalOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        loading={formLoading}
                        className="flex-1"
                      >
                        {editingList ? 'Update List' : 'Create List'}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Lists
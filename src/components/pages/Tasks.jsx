import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import TaskList from '@/components/organisms/TaskList'
import TaskStats from '@/components/organisms/TaskStats'
import AddTaskModal from '@/components/organisms/AddTaskModal'
import SearchBar from '@/components/molecules/SearchBar'
import { taskListService } from '@/services'

const Tasks = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [taskLists, setTaskLists] = useState([])
  const [selectedFilters, setSelectedFilters] = useState({
    listId: searchParams.get('list') || '',
    priority: searchParams.get('priority') || ''
  })

  useEffect(() => {
    loadTaskLists()
  }, [])

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams(searchParams)
    if (selectedFilters.listId) {
      params.set('list', selectedFilters.listId)
    } else {
      params.delete('list')
    }
    if (selectedFilters.priority) {
      params.set('priority', selectedFilters.priority)
    } else {
      params.delete('priority')
    }
    setSearchParams(params)
  }, [selectedFilters, setSearchParams])

  const loadTaskLists = async () => {
    try {
      const lists = await taskListService.getAll()
      setTaskLists(lists)
    } catch (error) {
      console.error('Failed to load task lists:', error)
    }
  }

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }))
  }

  const clearFilters = () => {
    setSelectedFilters({ listId: '', priority: '' })
  }

  const hasActiveFilters = selectedFilters.listId || selectedFilters.priority

  return (
    <div className="h-full max-w-full overflow-hidden">
      <div className="h-full flex flex-col p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex-shrink-0 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-surface-900 mb-2">
                My Tasks
              </h1>
              <p className="text-surface-600">
                Stay organized and get things done efficiently
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="block md:hidden">
                <SearchBar />
              </div>
              <Button 
                onClick={() => setIsAddTaskModalOpen(true)}
                icon="Plus"
                className="whitespace-nowrap"
              >
                Add Task
              </Button>
            </div>
          </div>

          {/* Stats */}
          <TaskStats />
        </div>

        {/* Filters */}
        <div className="flex-shrink-0 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-surface-700">Filter by:</span>
            
            {/* List filters */}
            {taskLists.map(list => (
              <motion.button
                key={list.Id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFilterChange('listId', list.Id.toString())}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  selectedFilters.listId === list.Id.toString()
                    ? 'text-white shadow-sm'
                    : 'text-surface-600 bg-surface-100 hover:bg-surface-200'
                }`}
                style={selectedFilters.listId === list.Id.toString() ? { backgroundColor: list.color } : {}}
              >
                <ApperIcon name={list.icon} size={14} />
                {list.name}
              </motion.button>
            ))}
            
            {/* Priority filters */}
            {['high', 'medium', 'low'].map(priority => (
              <Badge
                key={priority}
                variant={selectedFilters.priority === priority ? priority : 'default'}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedFilters.priority === priority ? 'ring-2 ring-white ring-offset-2' : 'hover:bg-surface-200'
                }`}
                onClick={() => handleFilterChange('priority', priority)}
              >
                {priority}
              </Badge>
            ))}
            
            {/* Clear filters */}
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearFilters}
                className="text-sm text-surface-500 hover:text-error transition-colors flex items-center gap-1"
              >
                <ApperIcon name="X" size={14} />
                Clear
              </motion.button>
            )}
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto">
          <TaskList 
            filters={selectedFilters}
            showCompleted={false}
          />
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
      />
    </div>
  )
}

export default Tasks
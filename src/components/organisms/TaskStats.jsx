import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services'

const TaskStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    overdue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const result = await taskService.getTaskStats()
      setStats(result)
    } catch (error) {
      console.error('Failed to load task stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statItems = [
    {
      id: 'total',
      label: 'Total Tasks',
      value: stats.total,
      icon: 'CheckSquare',
      color: 'bg-primary',
      textColor: 'text-primary'
    },
    {
      id: 'active',
      label: 'Active',
      value: stats.active,
      icon: 'Clock',
      color: 'bg-accent',
      textColor: 'text-accent'
    },
    {
      id: 'completed',
      label: 'Completed',
      value: stats.completed,
      icon: 'CheckCircle',
      color: 'bg-success',
      textColor: 'text-success'
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: stats.overdue,
      icon: 'AlertCircle',
      color: 'bg-error',
      textColor: 'text-error'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-surface-200">
            <div className="animate-pulse space-y-2">
              <div className="w-8 h-8 bg-surface-200 rounded" />
              <div className="h-6 bg-surface-200 rounded w-12" />
              <div className="h-4 bg-surface-200 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg p-4 shadow-sm border border-surface-200"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${item.color}/10 rounded-lg flex items-center justify-center`}>
              <ApperIcon name={item.icon} size={20} className={item.textColor} />
            </div>
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                className={`text-2xl font-display font-bold ${item.textColor}`}
              >
                {item.value}
              </motion.div>
              <div className="text-sm text-surface-600">
                {item.label}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default TaskStats
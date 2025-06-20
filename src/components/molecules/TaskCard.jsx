import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isPast } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { taskService } from '@/services'
import { toast } from 'react-toastify'

const TaskCard = ({ task, onUpdate, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(task.completed)

  const handleToggleComplete = async (e) => {
    e.stopPropagation()
    setIsCompleting(true)
    
    try {
      const updatedTask = await taskService.toggleComplete(task.Id)
      setIsCompleted(updatedTask.completed)
      onUpdate?.(updatedTask)
      
      if (updatedTask.completed) {
        toast.success('Task completed! 🎉')
      }
    } catch (error) {
      toast.error('Failed to update task')
    } finally {
      setIsCompleting(false)
    }
  }

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null
    const date = new Date(dueDate)
    if (isToday(date)) return 'Today'
    return format(date, 'MMM d')
  }

  const isDueToday = task.dueDate && isToday(new Date(task.dueDate))
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
  const dueDateText = formatDueDate(task.dueDate)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.12)' }}
      className={`bg-white rounded-lg p-4 shadow-sm border border-surface-200 cursor-pointer transition-all duration-200 ${
        isCompleted ? 'opacity-60' : ''
      }`}
      onClick={() => onEdit?.(task)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleComplete}
          disabled={isCompleting}
          className="flex-shrink-0 mt-0.5"
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            isCompleted 
              ? 'bg-accent border-accent' 
              : 'border-surface-400 hover:border-primary'
          }`}>
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-white"
              >
                <ApperIcon name="Check" size={12} />
              </motion.div>
            )}
            {isCompleting && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <ApperIcon name="Loader" size={12} className="text-primary" />
              </motion.div>
            )}
          </div>
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-surface-900 mb-1 ${
            isCompleted ? 'line-through text-surface-500' : ''
          }`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`text-sm text-surface-600 mb-2 line-clamp-2 ${
              isCompleted ? 'line-through' : ''
            }`}>
              {task.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority badge */}
            <Badge variant={task.priority} size="xs">
              {task.priority}
            </Badge>

            {/* Due date */}
            {dueDateText && (
              <div className={`flex items-center gap-1 text-xs ${
                isOverdue ? 'text-error' : isDueToday ? 'text-warning' : 'text-surface-500'
              }`}>
                <ApperIcon name="Calendar" size={12} />
                <span>{dueDateText}</span>
                {isOverdue && <ApperIcon name="AlertCircle" size={12} />}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(task)
            }}
            className="p-1.5 text-surface-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
          >
            <ApperIcon name="Edit2" size={14} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.(task)
            }}
            className="p-1.5 text-surface-400 hover:text-error hover:bg-error/10 rounded transition-colors"
          >
            <ApperIcon name="Trash2" size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const TaskListCard = ({ taskList, onEdit, onDelete, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.12)' }}
      className="bg-white rounded-lg p-6 shadow-sm border border-surface-200 cursor-pointer transition-all duration-200 group"
      onClick={() => onClick?.(taskList)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: taskList.color }}
          >
            <ApperIcon name={taskList.icon} size={20} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-surface-900 mb-1">
              {taskList.name}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="default" size="xs">
                {taskList.taskCount} tasks
              </Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(taskList)
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
              onDelete?.(taskList)
            }}
            className="p-1.5 text-surface-400 hover:text-error hover:bg-error/10 rounded transition-colors"
          >
            <ApperIcon name="Trash2" size={14} />
          </motion.button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-surface-600">
          <span>Active tasks</span>
          <span>{taskList.taskCount}</span>
        </div>
        <div className="w-full bg-surface-100 rounded-full h-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((taskList.taskCount / 10) * 100, 100)}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-2 rounded-full"
            style={{ backgroundColor: taskList.color }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default TaskListCard
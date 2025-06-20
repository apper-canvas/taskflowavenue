import { motion } from 'framer-motion'
import TaskList from '@/components/organisms/TaskList'
import ApperIcon from '@/components/ApperIcon'

const Archive = () => {
  return (
    <div className="h-full max-w-full overflow-hidden">
      <div className="h-full flex flex-col p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex-shrink-0 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-surface-200 rounded-lg flex items-center justify-center">
              <ApperIcon name="Archive" size={24} className="text-surface-600" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-surface-900">
                Completed Tasks
              </h1>
              <p className="text-surface-600">
                View your accomplishments and completed work
              </p>
            </div>
          </div>
        </div>

        {/* Completed Tasks List */}
        <div className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-1 shadow-sm border border-surface-200 mb-4"
          >
            <div className="flex items-center gap-2 text-sm text-surface-600 p-3">
              <ApperIcon name="Info" size={16} />
              <span>
                These are tasks you've completed. Great job on staying productive!
              </span>
            </div>
          </motion.div>

          <TaskList 
            showCompleted={true}
          />
        </div>
      </div>
    </div>
  )
}

export default Archive
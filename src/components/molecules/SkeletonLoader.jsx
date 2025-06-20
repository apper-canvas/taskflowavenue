import { motion } from 'framer-motion'

const SkeletonLoader = ({ count = 3, type = 'task' }) => {
  const skeletonItems = Array.from({ length: count }, (_, i) => i)

  const TaskSkeleton = ({ delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-lg p-4 shadow-sm border border-surface-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-surface-200 rounded animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-surface-200 rounded w-1/2 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-5 bg-surface-200 rounded-full w-16 animate-pulse" />
            <div className="h-5 bg-surface-200 rounded w-20 animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  )

  const ListSkeleton = ({ delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-surface-200 rounded-lg animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 bg-surface-200 rounded w-24 animate-pulse" />
          <div className="h-4 bg-surface-200 rounded w-16 animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-surface-200 rounded w-full animate-pulse" />
        <div className="h-2 bg-surface-200 rounded-full w-full animate-pulse" />
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-4">
      {skeletonItems.map((_, index) => (
        <div key={index}>
          {type === 'task' && <TaskSkeleton delay={index * 0.1} />}
          {type === 'list' && <ListSkeleton delay={index * 0.1} />}
        </div>
      ))}
    </div>
  )
}

export default SkeletonLoader
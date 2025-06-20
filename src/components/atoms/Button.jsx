import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-600 disabled:bg-surface-300 disabled:text-surface-500',
    secondary: 'bg-secondary text-white hover:bg-secondary-600 disabled:bg-surface-300 disabled:text-surface-500',
    accent: 'bg-accent text-white hover:bg-accent-600 disabled:bg-surface-300 disabled:text-surface-500',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white disabled:border-surface-300 disabled:text-surface-500',
    ghost: 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 disabled:text-surface-400',
    danger: 'bg-error text-white hover:bg-red-600 disabled:bg-surface-300 disabled:text-surface-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5'
  }
  
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  }
  
  const isDisabled = disabled || loading
  
  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <ApperIcon name="Loader" size={iconSizes[size]} />
        </motion.div>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} size={iconSizes[size]} />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} size={iconSizes[size]} />
      )}
    </motion.button>
  )
}

export default Button
import { NavLink, Outlet, useLocation } from "react-router-dom";
import React, { useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { routeArray } from "@/config/routes";
import AddTaskModal from "@/components/organisms/AddTaskModal";
import SearchBar from "@/components/molecules/SearchBar";
import { AuthContext } from "@/context/AuthContext";
const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const location = useLocation()

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="h-full flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={16} className="text-white" />
              </div>
              <h1 className="font-display font-bold text-xl text-surface-900 hidden sm:block">
                TaskFlow
              </h1>
            </div>
          </div>

<div className="flex items-center gap-3">
            {/* Search bar - hidden on mobile */}
            <div className="hidden md:block">
              <SearchBar />
            </div>
            
            {/* Quick add button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddTaskModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary-600 transition-colors"
            >
              <ApperIcon name="Plus" size={16} />
              <span className="hidden sm:inline">Add Task</span>
            </motion.button>
            
            {/* Logout button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const { logout } = useContext(AuthContext);
                logout();
              }}
              className="bg-surface-200 text-surface-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-surface-300 transition-colors"
            >
              <ApperIcon name="LogOut" size={16} />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-surface-200 flex-col z-40">
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={20} />
                  {route.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.aside
                initial={sidebarVariants.closed}
                animate={sidebarVariants.open}
                exit={sidebarVariants.closed}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 lg:hidden flex flex-col"
              >
                <div className="h-16 flex items-center justify-between px-4 border-b border-surface-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <ApperIcon name="CheckSquare" size={16} className="text-white" />
                    </div>
                    <h1 className="font-display font-bold text-xl text-surface-900">
                      TaskFlow
                    </h1>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-2">
                    {routeArray.map((route) => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-accent/10 text-accent border border-accent/20'
                              : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} size={20} />
                        {route.label}
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
      />
    </div>
  )
}

export default Layout
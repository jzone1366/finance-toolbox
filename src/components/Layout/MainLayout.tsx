import { Link, Outlet } from '@tanstack/react-router'
import { CalculatorIcon } from '@heroicons/react/24/outline'

export default function MainLayout() {
  const baseClassName = "px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
  const activeClassName = "px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-indigo-50 text-indigo-600"
  const mobileBaseClassName = "flex items-center py-3 px-4 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
  const mobileActiveClassName = "flex items-center py-3 px-4 text-sm font-medium rounded-lg transition-colors bg-indigo-50 text-indigo-600"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-20 items-center justify-between">
            {/* Logo section */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalculatorIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-500">
                  Finance Toolbelt
                </span>
              </div>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:flex sm:space-x-1">
              <Link
                to="/"
                className={baseClassName}
                activeProps={{ className: activeClassName }}
              >
                Loan Calculator
              </Link>
              <Link
                to="/paycheck"
                className={baseClassName}
                activeProps={{ className: activeClassName }}
              >
                Paycheck Calculator
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden border-t border-gray-200">
          <div className="space-y-1 px-4">
            <Link
              to="/"
              className={mobileBaseClassName}
              activeProps={{ className: mobileActiveClassName }}
            >
              Loan Calculator
            </Link>
            <Link
              to="/paycheck"
              className={mobileBaseClassName}
              activeProps={{ className: mobileActiveClassName }}
            >
              Paycheck Calculator
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="py-4">
        <Outlet />
      </main>
    </div>
  )
} 
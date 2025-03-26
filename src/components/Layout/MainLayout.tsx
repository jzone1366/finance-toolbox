import { Link, Outlet } from '@tanstack/react-router'
import { FeatureFlag } from '../FeatureFlag'
import { CalculatorIcon } from '@heroicons/react/24/outline'

interface LinkClassProps {
  isActive: boolean
}

export default function MainLayout() {
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
                <div className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                  Finance Toolbelt
                </div>
              </div>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:flex sm:space-x-1">
              <Link
                to="/"
                className={({ isActive }: LinkClassProps) =>
                  `group relative px-6 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`
                }
              >
                {({ isActive }: LinkClassProps) => (
                  <>
                    <span>Loan Calculator</span>
                    <span
                      className={`absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/70 to-indigo-500/0 transition-opacity duration-500 ${
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                      }`}
                    />
                  </>
                )}
              </Link>
              <FeatureFlag flag="isPaycheckCalculatorEnabled">
                <Link
                  to="/paycheck"
                  className={({ isActive }: LinkClassProps) =>
                    `group relative px-6 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-indigo-600'
                        : 'text-gray-600 hover:text-indigo-600'
                    }`
                  }
                >
                  {({ isActive }: LinkClassProps) => (
                    <>
                      <span>Paycheck Calculator</span>
                      <span
                        className={`absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/70 to-indigo-500/0 transition-opacity duration-500 ${
                          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                        }`}
                      />
                    </>
                  )}
                </Link>
              </FeatureFlag>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden border-t border-gray-200">
          <div className="space-y-1 px-4">
            <Link
              to="/"
              className={({ isActive }: LinkClassProps) =>
                `flex items-center py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`
              }
            >
              Loan Calculator
            </Link>
            <FeatureFlag flag="isPaycheckCalculatorEnabled">
              <Link
                to="/paycheck"
                className={({ isActive }: LinkClassProps) =>
                  `flex items-center py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`
                }
              >
                Paycheck Calculator
              </Link>
            </FeatureFlag>
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
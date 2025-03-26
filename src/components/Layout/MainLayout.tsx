import { Link, Outlet } from '@tanstack/react-router'
import { FeatureFlag } from '../FeatureFlag'
import { CalculatorIcon } from '@heroicons/react/24/outline'

interface NavLinkProps {
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
            <div className="flex gap-8">
              <Link
                to="/"
                className={({ isActive }: NavLinkProps) =>
                  `inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                Loan Calculator
              </Link>
              <FeatureFlag flag="isPaycheckCalculatorEnabled">
                <Link
                  to="/paycheck"
                  className={({ isActive }: NavLinkProps) =>
                    `inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                >
                  Paycheck Calculator
                </Link>
              </FeatureFlag>
            </div>
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

import { RouterProvider, Router, Route, RootRoute, NotFoundRoute } from '@tanstack/react-router'
import MainLayout from './components/Layout/MainLayout'
import AmortizationForm from './components/Amortization/AmortizationForm'
import PaycheckCalculator from './components/Paycheck/PaycheckCalculator'
import NotFound from './components/NotFound'
import { featureFlags } from './utils/featureFlags'

const rootRoute = new RootRoute({
  component: MainLayout,
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AmortizationForm,
})

const paycheckRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/paycheck',
  component: PaycheckCalculator,
  beforeLoad: () => {
    if (!featureFlags.isPaycheckCalculatorEnabled) {
      throw new Response('Not Found', { status: 404 })
    }
  },
  errorComponent: () => <NotFound />,
})

// This handles both non-existent routes and thrown 404s
const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: NotFound,
})

const routeTree = rootRoute.addChildren([indexRoute, paycheckRoute])

const router = new Router({ 
  routeTree,
  notFoundRoute,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export { router } 
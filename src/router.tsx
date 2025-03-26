import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import MainLayout from './components/Layout/MainLayout'
import AmortizationLayout from './components/Amortization/AmortizationLayout'
import PaycheckCalculator from './components/Paycheck/PaycheckCalculator'
import NotFound from './components/NotFound'

const rootRoute = createRootRoute({
  component: MainLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AmortizationLayout,
})

const paycheckRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/paycheck',
  component: PaycheckCalculator,
})

const routeTree = rootRoute.addChildren([indexRoute, paycheckRoute])

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export { router } 

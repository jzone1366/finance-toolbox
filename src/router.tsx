import { 
  Router, 
  Route,
  RootRoute,
  RouterProvider,
} from '@tanstack/react-router'
import MainLayout from './components/Layout/MainLayout'
import AmortizationLayout from './components/Amortization/AmortizationLayout'
import PaycheckCalculator from './components/Paycheck/PaycheckCalculator'

const rootRoute = new RootRoute({
  component: MainLayout,
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AmortizationLayout,
})

const paycheckRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/paycheck',
  component: PaycheckCalculator,
})

const routeTree = rootRoute.addChildren([indexRoute, paycheckRoute])

const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export { router } 
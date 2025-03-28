import './App.css'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { FlagsProvider } from 'flagged'
import { featureFlags } from './config/featureFlags'

function App() {
  return (
    <FlagsProvider features={featureFlags}>
      <RouterProvider router={router} />
    </FlagsProvider>
  )
}

export default App

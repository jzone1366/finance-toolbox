import { Outlet } from '@tanstack/react-router'
import { useFeature } from 'flagged'
import Navigation from './Navigation'

export default function MainLayout() {
  const showNav = useFeature('showNav')

  if (!showNav) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="py-4">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="py-4">
        <Outlet />
      </main>
    </div>
  )
} 

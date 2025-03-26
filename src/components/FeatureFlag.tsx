import { ReactNode } from 'react'
import { featureFlags } from '../utils/featureFlags'

interface FeatureFlagProps {
  flag: keyof typeof featureFlags
  children: ReactNode
  fallback?: ReactNode
}

export function FeatureFlag({ flag, children, fallback = null }: FeatureFlagProps) {
  if (!featureFlags[flag]) {
    return fallback
  }

  return <>{children}</>
} 
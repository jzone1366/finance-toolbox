export const featureFlags = {
  isPaycheckCalculatorEnabled: import.meta.env.VITE_FEATURE_PAYCHECK_CALCULATOR === 'true',
} as const

export type FeatureFlags = typeof featureFlags 
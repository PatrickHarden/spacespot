import { useEffect } from 'react'
import Analytics from './index'

export const usePixel = (ct: string) => {
  useEffect(() => {
    Analytics.pixel(ct)
  }, [ct])
}

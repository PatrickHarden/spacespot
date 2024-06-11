import React from 'react'
import { useLoadScript } from '@react-google-maps/api'
import CONFIG from 'config'

export function noPrerender<T>(Component: React.ComponentType<T>) {
  const enabled = navigator.userAgent !== 'ReactSnap'
  const Comp = (props: T) => <>{enabled && <Component {...props} />}</>
  return Comp
}

export function withGoogle<T>(Component: React.ComponentType<T>) {
  const Comp = (props: T) => {
    const { isLoaded } = useLoadScript({
      googleMapsClientId: CONFIG.GOOGLE_MAPS_CLIENT,
      channel: CONFIG.GOOGLE_MAPS_CHANNEL,
      // @ts-ignore
      libraries: CONFIG.GOOGLE_MAPS_LIBS,
    })
    return <>{isLoaded && <Component {...props} />}</>
  }
  return Comp
}

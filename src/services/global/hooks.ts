import {
  useState,
  useEffect,
  useCallback,
  useRef,
  RefObject,
  Dispatch,
  SetStateAction,
} from 'react'

export const useWindowSize = () => {
  const isClient = typeof window === 'object'
  const [windowSize, setWindowSize] = useState({
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined,
  })

  const handleResize = useCallback(() => {
    setWindowSize({
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    })
  }, [isClient])

  useEffect(() => {
    if (!isClient) {
      return
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isClient, handleResize])

  return windowSize
}

/**
 * Hook that closes the ovelay
 */
export const useCloseOverlayHook = (
  ref: RefObject<HTMLDivElement>,
  setShow: Dispatch<SetStateAction<boolean>>,
) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShow(false)
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, setShow])
}

export const useSetInputFocusOnLoading = (
  ref: RefObject<HTMLInputElement>,
  disable: boolean,
) => {
  useEffect(() => {
    console.log(disable, 'bb')
    if (!disable && ref.current) {
      console.log(disable, 'aaa')
      ref.current.focus()
    }
  }, [disable, ref])
}

// Dan Abramov's useInterval
export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

import React, { useEffect, ReactNode } from 'react'
import { useHistory } from 'react-router-dom'

function ScrollToTop(props: { children: ReactNode }) {
  const history = useHistory()
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0)
    })
    return () => {
      unlisten()
    }
  }, [history])

  return <>{props.children}</>
}

export default ScrollToTop

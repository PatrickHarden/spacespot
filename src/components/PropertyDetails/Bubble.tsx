import React, { ReactNode, useRef, useEffect } from 'react'
import styled from 'styled-components'

const Content = styled.div`
  position: absolute;
  box-shadow: 10px 10px 31px -14px black;
  top: 10px;
  left: -50%;
  background: white;
  padding: 15px;
`

const Tail = styled.div`
  position: absolute;
  top: 5px;
  left: 2px;
  width: 10px;
  height: 10px;
  background: white;
  transform: rotate(45deg);
`

const Bubble = styled(
  (props: {
    className?: string
    children: ReactNode
    open: boolean
    setOpen: (open: boolean) => void
  }) => {
    const { className, children, setOpen } = props
    const ref = useRef<HTMLDivElement>(null)
    const handleClickOutside = (event: MouseEvent) => {
      if (ref && ref.current && !ref.current.contains(event.target as any)) {
        setOpen(false)
      }
    }

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    })
    return (
      <div className={className} ref={ref}>
        <Content>{children}</Content>
        <Tail />
      </div>
    )
  },
)`
  position: relative;
  display: ${props => (props.open ? 'block' : 'none')};
`

export default Bubble

import React, { useState, useEffect } from 'react'
import Input from './Input'

interface InputProps {
  className?: string
  label?: string
  id: string
  value: any
  min?: any
  max?: any
  onChange?: (value: string) => void
  onKeyPress?: (e: React.KeyboardEvent) => void
  onFocusOut?: () => void
  autoFocus?: boolean
  placeholder?: string
}

const TimeInput: React.FC<InputProps> = (props: InputProps) => {
  const { onChange, value, ...rest } = props
  const [time, setTime] = useState(value)
  const valid = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)

  useEffect(() => {
    setTime(value)
  }, [value])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value != null) {
      setTime(value)
    }
  }

  const onBlur = () => {
    if (valid) {
      if (onChange) onChange(time)
    } else {
      setTime(value)
    }
  }

  return (
    <Input
      type="time"
      value={time}
      onChange={handleChange}
      error={valid ? '' : 'hh:mm'}
      onBlur={onBlur}
      {...rest}
    />
  )
}

export default TimeInput

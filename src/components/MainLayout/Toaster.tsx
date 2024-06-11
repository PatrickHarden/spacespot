import React from 'react'
import { useSelector } from 'react-redux'
import Check from '@material-ui/icons/Check'
import ErrorIcon from '@material-ui/icons/ErrorOutline'
import Info from '@material-ui/icons/Info'
import Close from '@material-ui/icons/Close'
import Warning from '@material-ui/icons/Warning'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import styled from 'styled-components'
import selectors from 'services/toaster/selectors'

const variantIcon: { [key: string]: React.FC } = {
  success: Check,
  warning: Warning,
  error: ErrorIcon,
  info: Info,
}

const variantBg: { [key: string]: string } = {
  success: '#caebf3',
  warning: '#ffffff',
  error: '#f4c7c3',
  info: '#ffffff',
}

const variantBorder: { [key: string]: string } = {
  success: '#4fbbd8',
  warning: '#ffffff',
  error: '#db4437',
  info: '#ffffff',
}

const ContentWrapper = (props: {
  message: string
  onClose: () => void
  variant: string
}) => {
  const { message, onClose, variant, ...other } = props
  const Icon = variantIcon[variant]

  return (
    <SnackbarContent
      message={
        <span>
          <Icon />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={onClose}>
          <Close />
        </IconButton>,
      ]}
      {...other}
    />
  )
}

const ToasterSnackbar = styled(
  (props: { className?: string; variant: string; message: string }) => {
    const [open, setOpen] = React.useState(true)
    const { className, variant, message } = props

    const handleClose = () => {
      setOpen(false)
    }

    return (
      <Snackbar
        className={className}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}>
        <ContentWrapper
          onClose={handleClose}
          variant={variant}
          message={message}
        />
      </Snackbar>
    )
  },
)`
  .MuiSnackbarContent-root {
    color: black;
    background: ${props => variantBg[props.variant]};
    border: 1px solid ${props => variantBorder[props.variant]};
    box-shadow: none;
  }
  .MuiSnackbarContent-message span {
    font-size: 16px;
    display: flex;
    align-items: center;
    svg {
      margin-right: 14px;
    }
  }
`

function Toaster() {
  const messages = useSelector(selectors.getMessages)
  return (
    <div>
      {messages.map(msg => (
        <ToasterSnackbar
          key={msg.maxTime}
          variant={msg.type}
          message={msg.message}
        />
      ))}
    </div>
  )
}

export default Toaster

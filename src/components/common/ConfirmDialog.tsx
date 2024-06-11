import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core'
import styled from 'styled-components'

import OutlinedButton from 'components/common/OutlinedButton'
import FilledButton from 'components/common/FilledButton'

const DialogActionsFrame = styled.div`
  padding: 5px;
`

const DialogBody = styled.p`
  color: #828286;
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  max-width: 500px;
`
const DialogTitleCenter = styled(DialogTitle)`
  text-align: center;
`
const ButtonDisabled = styled(FilledButton)`
  background: #ffffff;
  color: #404042;
`
const ButtonEnabled = styled(OutlinedButton)`
  box-sizing: border-box;
  border: 1px solid #000000;
  color: #404042;
  outline: none;
  margin-left: 24px;
`

/**
 * Confirmation Dialog
 */
const ConfirmDialog = (props: {
  open: boolean
  setOpen: (value: boolean) => void
  onClick: () => void
  title: string
  bodyText?: string
  cancelText: string
  okText: string
}) => {
  const { open, setOpen, onClick, title, bodyText, cancelText, okText } = props

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <DialogTitleCenter>{title}</DialogTitleCenter>
      {bodyText && (
        <DialogContent>
          <DialogBody>{bodyText}</DialogBody>
        </DialogContent>
      )}
      <DialogActions>
        <DialogActionsFrame>
          <ButtonDisabled
            id="dialogCancel"
            color="primary"
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
            ) => {
              event.stopPropagation()
              setOpen(false)
            }}>
            {cancelText}
          </ButtonDisabled>
          <ButtonEnabled
            id="dialogDelete"
            color="primary"
            autoFocus
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
            ) => {
              event.stopPropagation()
              onClick()
            }}>
            {okText}
          </ButtonEnabled>
        </DialogActionsFrame>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog

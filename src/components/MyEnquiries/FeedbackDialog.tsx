import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core'
import styled from 'styled-components'

import OutlinedButton from 'components/common/OutlinedButton'
import FilledButton from 'components/common/FilledButton'
import TextArea from 'components/common/TextArea'

const DialogActionsFrame = styled.div`
  padding: 5px;
`

const DialogBody = styled.div`
  color: #828286;
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  max-width: 500px;
`
const DialogTitleCenter = styled(DialogTitle)`
  h2 {
    color: #000000;
    font-size: 28px;
    font-weight: 400;
    letter-spacing: -0.25px;
    line-height: 35px;
  }
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

const InfoText = styled.p`
  margin: 0;
`

/**
 * Close Enquiry Dialog
 */
const FeedbackDialog = (props: {
  open: boolean
  setOpen: (value: boolean) => void
  onClick: (value?: string) => void
  title: string
  cancelText: string
  okText: string
  whyText: string
  useText?: string
}) => {
  const {
    open,
    setOpen,
    onClick,
    title,
    whyText,
    useText,
    cancelText,
    okText,
  } = props
  const [value, setValue] = useState('')

  const onChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(ev.target.value)
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}>
      <DialogTitleCenter>{title}</DialogTitleCenter>
      {whyText && (
        <DialogContent>
          <DialogBody>
            <TextArea
              id="endEnquiryWhy"
              value={value}
              label={whyText}
              onChange={onChange}
              rows={4}
            />
            <InfoText>{useText}</InfoText>
          </DialogBody>
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
              onClick(value)
            }}>
            {okText}
          </ButtonEnabled>
        </DialogActionsFrame>
      </DialogActions>
    </Dialog>
  )
}

export default FeedbackDialog

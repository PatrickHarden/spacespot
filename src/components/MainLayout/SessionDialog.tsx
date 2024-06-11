import React from 'react'
import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core'
import styled from 'styled-components'

import OutlinedButton from 'components/common/OutlinedButton'
import FilledButton from 'components/common/FilledButton'
import selectors from 'services/user/selectors'
import actions from 'services/user/actions'

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
 * Session Dialog
 */
const SessionDialog = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const open = useSelector(selectors.showSessionDialog)
  const dispatch = useDispatch()
  const title = t('TIMEOUT_TITLE')
  const cancelText = t('TIMEOUT_CANCEL')
  const okText = t('TIMEOUT_OK')
  const bodyText = t('TIMEOUT_MSG')

  const close = () => {
    dispatch(actions.showSessionPopup(false))
    dispatch(actions.logout())
  }

  const keep = () => {
    dispatch(actions.ping())
    dispatch(actions.showSessionPopup(false))
  }

  return (
    <Dialog onClose={close} open={open}>
      <DialogTitleCenter>{title}</DialogTitleCenter>
      <DialogContent>
        <DialogBody>{bodyText}</DialogBody>
      </DialogContent>
      <DialogActions>
        <DialogActionsFrame>
          <ButtonDisabled
            id="dialogCancel"
            color="primary"
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
            ) => {
              event.stopPropagation()
              close()
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
              keep()
            }}>
            {okText}
          </ButtonEnabled>
        </DialogActionsFrame>
      </DialogActions>
    </Dialog>
  )
}

export default SessionDialog

import React from 'react'
import styled from 'styled-components'
import FilledButton from 'components/common/FilledButton'

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row-reverse;
  padding: 15px;
`

const Accept = styled(FilledButton)`
  background-color: #404042;
  color: #fffff0;
`

const Cancel = styled(FilledButton)`
  background-color: transparent;
  color: #404042;
`

export interface AppointmentsButtonsProps {
  onAccept: () => void
  onCancel: () => void
  acceptLabel: string
  cancelLabel: string
}
const AppointmentsButtons = (props: AppointmentsButtonsProps): JSX.Element => {
  const { onAccept, onCancel, acceptLabel, cancelLabel } = props
  return (
    <Container>
      <Accept data-testid="appointment-button-accept" onClick={onAccept}>
        {acceptLabel}
      </Accept>
      <Cancel data-testid="appointment-button-cancel" onClick={onCancel}>
        {cancelLabel}
      </Cancel>
    </Container>
  )
}
export default AppointmentsButtons

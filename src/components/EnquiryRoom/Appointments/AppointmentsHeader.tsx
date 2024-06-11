import React, { SetStateAction, Dispatch } from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import FilledButton from 'components/common/FilledButton'

import Plus from 'components/icons/Plus'
import Heading2 from 'components/common/Heading2'

const Button = styled(FilledButton)`
  color: white;
  float: right;
  min-width: 90px;
`
const PlusWithMargin = styled(Plus)`
  margin: -2px;
`

const Header = styled.div`
  height: 32px;
  color: #000;
  font-size: 25px;
  font-weight: 500;
  letter-spacing: -0.23px;
  line-height: 32px;
  padding: 15px 15px 17px 15px;
`

const Title = styled(Heading2)`
  display: inline-block;
  margin: 0;
`

const TextAdd = styled.span`
  padding-left: 5px;
`

export interface AppointmentsHeaderProps {
  showAddAppointment: Dispatch<SetStateAction<boolean>>
}

const AppointmentsHeader = (props: AppointmentsHeaderProps) => {
  const { showAddAppointment } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <Header>
      <Title>{t('APPOINTMENTS_TITLE')}</Title>
      <Button
        data-testid="appointment-add"
        onClick={() => showAddAppointment(true)}>
        <PlusWithMargin color="white" size="1.1em" />
        <TextAdd>{t('APPOINTMENTS_BUTTONNEW')}</TextAdd>
      </Button>
    </Header>
  )
}

export default AppointmentsHeader

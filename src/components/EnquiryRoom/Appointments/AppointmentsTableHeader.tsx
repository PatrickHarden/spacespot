import React from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'

const Header = styled.div`
  display: flex;
  opacity: 0.98;
  background-color: #f4f4f4;
  color: #000;
  font-weight: 500;
  font-size: 16px;
`
const DateText = styled.div`
  padding: 10px;
  width: 70px;
  min-width: 70px;
`
const TimeText = styled.div`
  padding: 10px;
  width: 70px;
  min-width: 70px;
`

const Description = styled.div`
  flex: 1;
  padding: 10px;
  flex-grow: 1;
  min-width: 90px;
  & > div {
    width: 100%;
  }
`

const AppointmentsTableHeader = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <Header>
      <DateText>{t('APPOINTMENTS_DATE')}</DateText>
      <TimeText>{t('APPOINTMENTS_TIME')}</TimeText>
      <Description>{t('APPOINTMENTS_DESCRIPTION')}</Description>
    </Header>
  )
}

export default AppointmentsTableHeader

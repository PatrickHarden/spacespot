import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import device from 'services/global/device'
import selectors from 'services/dashboard/selectors'
import actions from 'services/onboarding/actions'
import { TranslatePropSpace } from 'services/space'
import SpacesSeparator from './SpacesSeparator'
import Building from './Building'
import Heading1 from 'components/common/Heading1'
import PlusIcon from 'components/icons/Plus'
import FilledButton from 'components/common/FilledButton'
import Colors from 'assets/Colors'
import history from 'browserhistory'

const Title = styled(Heading1)``
const Container = styled.div`
  margin: 0 auto 40px auto;
  max-width: 1042px;
  width: 90vw;
`
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 25px;
  @media ${device.mobile} {
    margin: 15px 0;
    flex-wrap: wrap;
  }
`

const AddButton = styled(FilledButton)`
  float: right;
  color: white;
  background: ${Colors.main.headerBg};
  cursor: pointer;
  span {
    margin-right: 10px;
  }
`

const Dashboard = () => {
  const dispatch = useDispatch()
  const spaces = useSelector(selectors.selectDashboardSpaces)
  const buildings = useSelector(selectors.selectDashboardBuildings)

  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })

  const countSpaces = spaces
    ? Object.keys(spaces).reduce(
        (numberAcumulator: number, key: string) =>
          numberAcumulator + spaces[key].length,
        0,
      )
    : 0
  return (
    <Container>
      <Row>
        <Title>{t('DASHBOARD_TITLE')}</Title>
        <AddButton
          data-testid="add-space"
          onClick={() => {
            dispatch(actions.resetSpaces())
            history.push(`/onboarding/`)
          }}>
          <span>
            <PlusIcon size="14px" color="white" />
          </span>
          {t('DASHBOARD_ADD_SPACE')}
        </AddButton>
      </Row>
      <SpacesSeparator num={countSpaces} />
      {buildings
        ? buildings.map((building: TranslatePropSpace) => (
            <Building
              key={building.key}
              building={building}
              spaces={spaces[building.key]}
            />
          ))
        : null}
    </Container>
  )
}
export default Dashboard

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import dashboardSelectors from 'services/dashboard/selectors'
import actions from 'services/onboarding/actions'
import { TranslatePropSpace } from 'services/space'
import Heading4 from 'components/common/Heading4'
import HTMLContent from 'components/common/HTMLContent'
import DOMPurify from 'dompurify'

export const BuildingBox = styled.div`
  box-sizing: border-box;
  border: 1px solid #dddddd;
  border-radius: 2px;
  border-color:#dddddd
  background-color: #f4f4f4;
  padding: 0 0 20px 0;
  color: #000000;
  font-weight: 300;
  line-height: 21px;
  text-align: center;
  margin-top: 20px;
  min-width: 350px;
  max-width: 407px;
  cursor: pointer;
  :hover {
    box-sizing: border-box;
    border: 1px solid #6CB9D5;
    box-shadow: 0 1px 4px 0 #6CB9D5;
  }

  @media(max-width: 480px){
    min-width: 100%;
  }
`

const BuildingHeading = styled.h2`
  color: black;
  font-size: 16px;
  line-height: 21px;
  font-weight: 500;
  text-align: left;
  margin: 10.5px 10.5px 0 10.5px;
`

const BuildingDescription = styled.h3`
  color: #828286;
  font-size: 16px;
  line-height: 18px;
  font-weight: 400;
  text-align: left;
  margin: 10.5px 10.5px 0 10.5px;
`

const BuildingList = () => {
  const dispatch = useDispatch()
  const buildings = useSelector(dashboardSelectors.selectDashboardBuildings)
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const selectBuilding = (selected: TranslatePropSpace) => () => {
    dispatch(actions.setBuildingId(selected.key))
    dispatch(actions.setName(selected.name))
    dispatch(actions.setDescription(selected.description))
    dispatch(actions.setLocation(selected.location || ''))
    dispatch(actions.setAddress(selected.address))
    dispatch(actions.setPostCode(selected.postCode))
    dispatch(actions.setCity(selected.city))
    dispatch(actions.setCountry(selected.country))
    dispatch(actions.setLatLng(selected.latLng))
    dispatch(actions.setAspects(selected.aspects))
    dispatch(actions.goToSpace('0'))
  }

  return (
    <>
      <Heading4>{t('ONBOARDING_EXISTING_SUBHEADER')}</Heading4>
      {buildings.map(building => (
        <BuildingBox key={building.key} onClick={selectBuilding(building)}>
          <BuildingHeading>{building.name}</BuildingHeading>
          <BuildingDescription>
            <HTMLContent
              html={DOMPurify.sanitize(
                (building.location || '').split(/\s+/).length > 8
                  ? (building.location || '')
                      .split(/\s+/)
                      .slice(0, 8)
                      .join(' ') + ' ...'
                  : building.location || '',
              )}
            />
          </BuildingDescription>
        </BuildingBox>
      ))}
    </>
  )
}

export default BuildingList

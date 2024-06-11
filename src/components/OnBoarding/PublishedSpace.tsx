import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'
import { FormControlLabel } from '@material-ui/core'
import styled from 'styled-components'
import { TranslatePropSpace } from 'services/space/types'
import {
  formatFloor,
  showAvailability,
  isSpaceFlex,
} from 'services/onboarding/utils'
import {
  getRegionSizeDesc,
  getRegionCurrencyDesc,
} from 'services/global/region'
import SpaceImg from 'assets/img/space.svg'
import history from 'browserhistory'
import { SpaceStatus } from 'services/onboarding/types'
import actions from 'services/onboarding/actions'
import selectors from 'services/dashboard/selectors'
import ConfirmDialog from 'components/common/ConfirmDialog'
import device from 'services/global/device'

const Container = styled.div<{
  error: boolean
  warning: boolean
  clickable: boolean
  deleted: boolean
}>`
  position: relative;
  box-sizing: border-box;
  height: 90px;
  width: 100%;
  border: 1px solid
    ${props =>
      props.error ? '#db4437' : props.warning ? '#EBBF59' : '#dddddd'};
  opacity: 0.98;
  border-radius: 2px;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  margin: 10px 0;
  ${props =>
    props.deleted &&
    `
  opacity: 0.2;
  display: none;
  `}
  ${props =>
    props.clickable &&
    `
  :hover {
    box-sizing: border-box;
    border: 1px solid #4fbbd8;
    opacity: 0.98;
    border-radius: 2px;
    box-shadow: 0 0 4px 1px #4fbbd8;
    cursor: pointer;
  }`}
`
const Image = styled.img`
  flex: 0 0 110px;
  width: 110px;
  background-color: #dddddd;
`
const ContainerTitle = styled.div`
  width: calc(100% - 140px);
  padding: 4px 15px;
  @media (min-width: 900px) {
    flex: 0 0 286px;
  }
`
const ContainerInfo = styled.div`
  flex: 0 0 279px;
  margin: 10px 0px;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-left: 1px solid #e7e7e7;
  @media ${device.mobile} {
    display: none;
  }
`

const ContainerControls = styled.div`
  flex: 1 1 270px;
  padding: 4px 15px;
  margin: 10px 0px;
  border-left: 1px solid #e7e7e7;
  display: none;
  @media (min-width: 1000px) {
    display: flex;
    align-items: center;
  }
  label span {
    font-size: 16px;
  }
`

const ControlListed = styled.div`
  flex: 0 0 auto;
`

const ControlEnquiries = styled.div`
  flex: 1 1 auto;
`

const Size = styled.div`
  width: 33.33%;
  padding: 0 5px 0 0;
  :last-child {
    padding: 0;
  }
`
const HotDesks = Size
const FixedDesks = Size
const Rent = Size
const Availability = Size

const ServicedOffices = Availability

const InfoData = styled.div`
  width: 100%;
  color: #000000;
  font-size: 16px;
  font-weight: 400;
`
const SpaceName = styled.div`
  width: 100%;
  color: #000000;
  font-size: 16px;
  font-weight: 500;
  @media ${device.mobile} {
    white-space: nowrap;
    overflow: hidden;
    max-width: 80%;
    text-overflow: ellipsis;
  }
`

const InfoTitle = styled.div`
  width: 100%;
  color: #828286;
  font-size: 14px;
  font-weight: 400;
  word-break: break-all;
`

const InfoDataSub = styled.div`
  margin-top: 4px;
  height: 21px;
  color: #828286;
  font-size: 16px;
  font-weight: 400;
`

const CheckMark = styled((props: { className?: string }) => (
  <span className={props.className}>&#10003;</span>
))`
  color: #4fbbd8;
  font-size: 20px !important;
  padding-right: 4px;
`

const TextWarning = styled.div`
  text-align: right;
  color: #ebbf59;
  font-size: 14px;
  font-weight: 300;
  line-height: 18px;
`
const DeleteButton = styled.button`
  position: absolute;
  top: 4px;
  right: 0px;
  font-size: 10px;
  cursor: pointer;
  border: none;
  z-index: 10;
  background-color: white;
  outline: none;
`

const PublishedSpace = (props: {
  space: TranslatePropSpace
  showControls?: boolean
  clickable?: boolean
}) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const dispatch = useDispatch()
  const pendingDelete = useSelector(selectors.pendingDelete)
  const [removePopup, setRemovePopup] = useState(false)
  const { space, showControls } = props
  const isPendingDelete = pendingDelete.includes(space.key)
  const clickable = props.clickable !== false && !isPendingDelete

  const getFirstImage = () => {
    const src = space.photo || get(space, 'images[0].uri') || SpaceImg
    return src
  }
  const status = space.status

  const shorten40 = (name: string) => {
    return name
      ? name.length < 40
        ? name
        : name.substring(0, 36) + '...'
      : name
  }

  const getType = (space: TranslatePropSpace) =>
    isSpaceFlex(space) ? t('ONBOARDING_FLEX') : t('ONBOARDING_FIXED')

  const onClick = () => {
    if (status === SpaceStatus.Published && clickable !== false) {
      history.push(`/onboarding/edit/space/${space.key}`)
    }
  }
  const showError = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation()
    setRemovePopup(!removePopup)
  }

  const deleteSpace = () => {
    setRemovePopup(false)
    dispatch(actions.deleteSpace(space.key))
  }

  return (
    <>
      <Container
        error={status === SpaceStatus.ErrorPublishing}
        warning={status === SpaceStatus.PublishedWithErrors}
        onClick={onClick}
        clickable={clickable}
        deleted={isPendingDelete}>
        {clickable && (
          <DeleteButton
            data-testid="delete-space"
            title={t('ONBOARDING_REMOVE')}
            onClick={showError}>
            &#9587;
          </DeleteButton>
        )}
        <Image src={getFirstImage()} />
        <ContainerTitle>
          <SpaceName>{shorten40(space.name)}</SpaceName>
          {space.floor !== 0 ? (
            <InfoDataSub>
              {formatFloor(
                space.floor,
                t('ONBOARDING_SPACE_FLOOR'),
                space.country,
              )}
            </InfoDataSub>
          ) : null}
          <InfoDataSub>{getType(space)}</InfoDataSub>
        </ContainerTitle>
        {isSpaceFlex(space) ? (
          <ContainerInfo>
            <HotDesks>
              <InfoData>{space.hotDesks}</InfoData>
              <InfoTitle>{t('ONBOARDING_HOT_DESKS')}</InfoTitle>
            </HotDesks>
            <FixedDesks>
              <InfoData>{space.fixedDesks}</InfoData>
              <InfoTitle>{t('ONBOARDING_FIXED_DESKS')}</InfoTitle>
            </FixedDesks>
            <ServicedOffices>
              <InfoData>{space.sevicedOffices}</InfoData>
              <InfoTitle>{t('ONBOARDING_SERVICED_OFFICES')}</InfoTitle>
            </ServicedOffices>
          </ContainerInfo>
        ) : (
          <ContainerInfo>
            <Size>
              <InfoData>{`${space.size} ${getRegionSizeDesc(
                space.country,
              )}`}</InfoData>
              <InfoTitle>{t('ONBOARDING_TITLE_SIZE')}</InfoTitle>
            </Size>
            <Rent>
              <InfoData>{`${space.rent} ${getRegionCurrencyDesc(
                space.country,
              )}`}</InfoData>
              <InfoTitle>{t('ONBOARDING_MONTHLY_RENT')}</InfoTitle>
            </Rent>
            <Availability>
              <InfoData>
                {showAvailability(space, t('ONBOARDING_AVAILABILITY_NOW'))}
              </InfoData>
              <InfoTitle>{t('ONBOARDING_AVAILABILITY')}</InfoTitle>
            </Availability>
          </ContainerInfo>
        )}
        {showControls && (
          <ContainerControls>
            <ControlEnquiries></ControlEnquiries>
            <ControlListed>
              <FormControlLabel
                control={
                  /*
                <Switch checked={true} color="primary" value="checkedA" />
                */
                  <CheckMark />
                }
                label={t('ONBOARDING_SPACE_LISTED')}
              />
            </ControlListed>
          </ContainerControls>
        )}
      </Container>
      {status === SpaceStatus.PublishedWithErrors ? (
        <TextWarning>
          {t('ONBOARDING_SPACE_PUBLISHED_WITH_WARNING')}
        </TextWarning>
      ) : null}
      {removePopup && (
        <ConfirmDialog
          open={removePopup}
          setOpen={setRemovePopup}
          onClick={deleteSpace}
          title={t('ONBOARDING_REMOVE_SPACE_POPUP_TITLE')}
          cancelText={t('ONBOARDING_REMOVE_SPACE_POPUP_KO')}
          okText={t('ONBOARDING_REMOVE_SPACE_POPUP_OK')}
        />
      )}
    </>
  )
}

export default PublishedSpace

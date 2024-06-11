import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { TranslatePropSpace } from 'services/space'
import actions from 'services/onboarding/actions'
import selectors from 'services/dashboard/selectors'
import PublishedSpace from '../OnBoarding/PublishedSpace'
import Trash from 'components/icons/Trash'
import ConfirmDialog from 'components/common/ConfirmDialog'
import Heading2 from 'components/common/Heading2'
import OutlinedButton from 'components/common/OutlinedButton'
import HTMLContent from 'components/common/HTMLContent'
import DOMPurify from 'dompurify'

const Container = styled.div<{
  deleted: boolean
}>`
  max-width: 1042px;
  margin-bottom: 60px;
  ${props =>
    props.deleted &&
    `
  opacity: 0.2;
  display: none;
  `}
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

const Title = styled(Heading2)`
  margin-bottom: 0.3em;
`

const Address = styled.div`
  width: 100%;
  color: #828286;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
`
const Edit = styled(Link)`
  display: block;
  margin-top: 45px;
  color: #4fbbd8;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  text-decoration: none;
`

const DeleteButton = styled(OutlinedButton)`
  color: #404042;
  background-color: #ffffff;
  border: 1px solid #000000;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  svg {
    margin-right: 6px;
    padding-top: 2px;
  }
`

const shorten = (name?: string) => {
  return !name || name.length < 100 ? name : name.substring(0, 96) + '...'
}

const Building = (props: {
  building: TranslatePropSpace
  spaces: Array<TranslatePropSpace>
}) => {
  const { formatMessage } = useIntl()
  const dispatch = useDispatch()
  const [showPopup, setShowPopup] = useState(false)
  const t = (s: string) => formatMessage({ id: s })
  const pendingDelete = useSelector(selectors.pendingDelete)
  const { building, spaces } = props
  const isPendingDelete = pendingDelete.includes(building.key)

  const deleteBuilding = () => {
    dispatch(actions.deleteBuilding(building.key))
    setShowPopup(false)
  }
  const location = DOMPurify.sanitize(shorten(building.location) as string)

  return (
    <Container deleted={isPendingDelete}>
      <Row>
        <div>
          <Title>{building.address}</Title>
          <Address>
            <HTMLContent html={location} />
          </Address>
        </div>
        <div>
          <Edit to={`/onboarding/edit/building/${building.key}`}>
            {t('ONBOARDING_EDIT_BUILDING')}
          </Edit>
        </div>
      </Row>
      {(spaces && spaces.length) > 0 ? (
        spaces.map((space: TranslatePropSpace) => (
          <PublishedSpace key={space.key} space={space} showControls={true} />
        ))
      ) : (
        <>
          <p>{t('DASHBOARD_NO_SPACES')}</p>
          <DeleteButton
            data-testid="delete-building"
            onClick={() => setShowPopup(true)}>
            <span>
              <Trash color="#000" />
            </span>
            {t('ONBOARDING_DELETE_BUILDING')}
          </DeleteButton>
        </>
      )}
      {showPopup && (
        <ConfirmDialog
          open={showPopup}
          setOpen={setShowPopup}
          onClick={deleteBuilding}
          title={t('ONBOARDING_REMOVE_BUILDING_POPUP_TITLE')}
          cancelText={t('ONBOARDING_REMOVE_BUILDING_POPUP_KO')}
          okText={t('ONBOARDING_REMOVE_BUILDING_POPUP_OK')}
        />
      )}
    </Container>
  )
}
export default Building

import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'

import selectors from 'services/user/selectors'
import actions from 'services/user/actions'
import { useAvatar, useProfile } from 'services/user/hooks'
import FileUpload from 'components/EnquiryRoom/FileUpload'
import Initials from 'components/common/Initials'
import { getUserInitials } from 'services/user/avatar'
import FilledButton from 'components/common/FilledButton'
import Heading2 from 'components/common/Heading2'
import BInput from 'components/common/Input'
import { UserProfileDTO } from 'services/user/types'
import { invalidString } from 'services/global/util'
import device from 'services/global/device'

const Container = styled.div`
  background: white;
  color: black;
  padding: 10px;
  @media ${device.mobile} {
    padding: 20px;
  }
`

const Input = styled(BInput)`
  margin-top: 0;
`

const SaveButton = styled(FilledButton)`
  background: #404042;
`

const CancelButton = styled(FilledButton)`
  background: white;
  color: #404042;
`

const Row = styled.div`
  display: flex;
`

const Actions = styled.div`
  display: flex;
  margin-top: 30px;
  align-items: space-between;
`

const Form = styled.div`
  margin-left: 30px;
  flex: 1 1 auto;
`

const Upload = styled.div`
  cursor: pointer;
`

const ImageAvatar = styled.div<{ image?: string }>`
  background-color: #ffffff;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  margin: 0;
  border-radius: 50%;
  height: 54px;
  width: 54px;
  background-image: url(${props => props.image});
  resize: none;
`

const Title = styled(Heading2)`
  margin-top: 0;
  margin-bottom: 30px;
`

const Desc = styled.p`
  margin: 5px 0;
  color: #404042;
  font-size: 14px;
  font-weight: 550;
  letter-spacing: 0;
  line-height: 18px;
  text-align: center;
`

const EditProfile = (props: {
  className?: string
  setShow: (show: boolean) => void
}) => {
  const { className, setShow } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const dispatch = useDispatch()
  const id = useSelector(selectors.accountIdentifier)
  const profile = useProfile(id)
  const displayName = profile ? profile.displayName : ''
  const avatar = useAvatar(id)
  const isLandlord = useSelector(selectors.isLandlord)
  const [hasTried, setHasTried] = useState(false)

  const [image, setImage] = useState('')
  useEffect(() => {
    if (avatar) {
      setImage(avatar)
    }
  }, [setImage, avatar])

  const [name, setName] = useState('')
  useEffect(() => {
    if (displayName) {
      setName(displayName)
    }
  }, [setName, displayName])

  const [fileName, setFileName] = useState('')

  const validate = () => {
    const errors: { [key: string]: string } = {}
    if (invalidString(name)) errors.name = t('VAL_REQUIRED')
    return errors
  }
  const errors = hasTried ? validate() : {}
  const initials = getUserInitials(id, name)

  const addFile = (file: File, reader: FileReader) => (): void => {
    const uri = reader.result as string
    const name = file.name
    setImage(uri)
    setFileName(name)
  }

  const focusInto = (id: string) => {
    const elm = document.getElementById(id)
    if (elm) elm.focus()
  }

  const save = () => {
    const errors = validate()
    const keys = Object.keys(errors)
    if (keys.length > 0) {
      focusInto(keys[0])
      setHasTried(true)
      return
    }
    if (fileName) {
      dispatch(actions.postAvatar(image, fileName))
    }
    const newProfile: UserProfileDTO = {
      displayName: name,
      emailId: profile.emailId,
    }
    dispatch(actions.putProfile(newProfile))
    setShow(false)
  }

  return (
    <Container className={className}>
      <Title>{t('EDIT_PROFILE_TITLE')}</Title>
      <Row>
        <FileUpload accept="image/jpeg,image/png" addFile={addFile}>
          <Upload>
            {image ? (
              <ImageAvatar image={image} />
            ) : (
              <Initials name={initials} palette={isLandlord ? 1 : 0} />
            )}
            <Desc>{t('EDIT_PROFILE_UPLOAD')}</Desc>
          </Upload>
        </FileUpload>
        <Form>
          <Input
            onChange={e => setName(e.target.value)}
            id="name"
            data-testid="name"
            label={t('EDIT_PROFILE_NAME')}
            type="string"
            value={name}
            error={errors.name}
          />
          <Actions>
            <SaveButton onClick={save}>{t('EDIT_PROFILE_SAVE')}</SaveButton>
            <CancelButton onClick={() => setShow(false)}>
              {t('EDIT_PROFILE_CANCEL')}
            </CancelButton>
          </Actions>
        </Form>
      </Row>
    </Container>
  )
}

export default EditProfile

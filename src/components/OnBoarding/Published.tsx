import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { TranslatePropSpace } from 'services/space/types'
import history from 'browserhistory'

import ErrorOutlineRounded from '@material-ui/icons/ErrorOutlineRounded'
import CheckCircleOutlined from '@material-ui/icons/CheckCircleOutlined'
import selectors from 'services/onboarding/selectors'
import CloudImg from 'assets/img/cloud.svg'

import PublishedSpace from './PublishedSpace'
import { SpaceStatus } from 'services/onboarding/types'
import FilledButton from 'components/common/FilledButton'
import Container from './MainContainer'

const Heading = styled.h2`
  text-align: center;
  color: #404042;
  font-size: 25px;
  font-weight: 400;
  line-height: 33px;
  margin: 10px 0;
`

const ErrorMsg = styled.p`
  color: #000000;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  border: 1px solid #db4437;
  border-radius: 2px;
  background-color: rgba(219, 68, 55, 0.3);
  padding: 7px;
`
const IconCloud = styled.div`
  margin-top: 40px;
  text-align: center;
`

const IconOK = styled(CheckCircleOutlined)`
  &.MuiSvgIcon-root {
    font-size: 18px;
    position: relative;
    top: 2px;
    padding-right: 4px;
  }
`

const IconKO = styled(ErrorOutlineRounded)`
  &.MuiSvgIcon-root {
    font-size: 18px;
    position: relative;
    top: 2px;
    padding-right: 4px;
  }
`

const Title = styled.div`
  margin-top: 40px;
  color: black;
  font-size: 18px;
  font-weight: 500;
`
const Line = styled.div<{ width: number; error: boolean }>`
  box-sizing: border-box;
  height: 1px;
  width: 100%;
  border: 2px solid #f2f2f2;
  margin-top: 10px;
  :after {
    display: block;
    position: relative;
    top: -2px;
    content: '';
    box-sizing: border-box;
    height: 1px;
    width: ${props => props.width}%;
    border: 2px solid ${props => (props.error ? '#db4437' : '#4fbbd8')};
  }
`

const ButtonNext = styled(FilledButton)`
  background-color: #404042;
  color: #fffff0;
  float: right;
  margin: 20px 0;
`

const Published = () => {
  const spaces = useSelector(selectors.onboardingState2Space)
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const pubSpaces = spaces.filter(
    (space: TranslatePropSpace) =>
      space.status === SpaceStatus.Published ||
      space.status === SpaceStatus.PublishedWithErrors,
  )
  const errorSpaces = spaces.filter(
    (space: TranslatePropSpace) => space.status === SpaceStatus.ErrorPublishing,
  )
  const pendSpaces = spaces.filter(
    (space: TranslatePropSpace) => space.status === SpaceStatus.ReadyForPublish,
  )
  const total = pubSpaces.length + errorSpaces.length + pendSpaces.length
  const pending = pendSpaces.length
  const pct =
    total > 0 ? (100 * (pubSpaces.length + errorSpaces.length)) / total : 100

  return (
    <Container>
      <IconCloud>
        <img alt="publishing" src={CloudImg} />
      </IconCloud>
      <Heading>
        {pending > 0
          ? `${t('ONBOARDING_SAVING')} ${pubSpaces.length + 1} ${t(
              'ONBOARDING_SAVING_OF',
            )} ${total}`
          : t('ONBOARDING_SAVING_END')}
      </Heading>
      <Line width={pct} error={errorSpaces.length > 0} />
      {pubSpaces.length > 0 && (
        <>
          <Title>
            <IconOK htmlColor="#6cb9d5" />
            {t('ONBOARDING_PUBLISHED_OK')}
          </Title>
          {pubSpaces.map((space: TranslatePropSpace) => (
            <PublishedSpace space={space} key={space.key} clickable={false} />
          ))}
        </>
      )}
      {errorSpaces.length > 0 && (
        <>
          <Title>
            <IconKO htmlColor="#db4437" />
            {t('ONBOARDING_PUBLISHED_KO')}
          </Title>
          <ErrorMsg>{t('ONBOARDING_PUBLISH_ERROR_MSG')}</ErrorMsg>
        </>
      )}
      {errorSpaces.map((space: TranslatePropSpace) => (
        <PublishedSpace space={space} key={space.key} clickable={false} />
      ))}
      {pending === 0 && (
        <ButtonNext
          data-testid="publish-ok"
          onClick={() => {
            history.push('/onboarding/validating')
          }}>
          {t('ONBOARDING_CONTINUE')}
        </ButtonNext>
      )}
    </Container>
  )
}
export default Published

import React from 'react'
import { useIntl } from 'react-intl'
import Space from 'components/icons/Space'
import IconSeparator from './IconSeparator'

const SpaceSeparator = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return <IconSeparator label={t('ONBOARDING_SPACE')} icon={<Space />} />
}

export default SpaceSeparator

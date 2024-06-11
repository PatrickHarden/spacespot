import React from 'react'
import { useIntl } from 'react-intl'
import Building from 'components/icons/Building'
import IconSeparator from './IconSeparator'

const BuildingSeparator = () => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  return (
    <IconSeparator
      label={t('ONBOARDING_BUILDING_AND_AMMENITIES')}
      icon={<Building />}
    />
  )
}

export default BuildingSeparator

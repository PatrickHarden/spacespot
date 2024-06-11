import React from 'react'
import styled from 'styled-components'
import defaultImage from 'assets/icons/account.svg'
import Initials from 'components/common/Initials'

import { getUserInitials } from 'services/user/avatar'
import { useAvatar, useProfile } from 'services/user/hooks'

const ImageAvatar = styled.div<{ image?: string }>`
  background-color: #ffffff;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  margin: 0;
  border-radius: 50%;
  height: 54px;
  width: 54px;
  background-image: url(${props => props.image || defaultImage});
  resize: none;
`

const Avatar = (props: {
  className?: string
  isLandlord?: boolean
  userId: string
  isDefaultImage?: boolean
  palette?: number
}) => {
  const { userId, isLandlord, className, isDefaultImage, palette } = props
  const image = useAvatar(userId)
  // get initials fallback
  const profile = useProfile(userId)
  const displayName = profile ? profile.displayName : ''
  const initials = getUserInitials(userId, displayName)
  const colors = palette !== undefined ? palette : isLandlord ? 1 : 0

  return image || isDefaultImage ? (
    <ImageAvatar
      className={className}
      image={isDefaultImage ? undefined : image}
    />
  ) : (
    <Initials className={className} name={initials} palette={colors} />
  )
}

export default Avatar

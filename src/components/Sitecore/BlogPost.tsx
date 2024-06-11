import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { RichText } from '@sitecore-jss/sitecore-jss-react'

import ModuleTextImg from 'components/SubHome/ModuleTextImg'
import OutlinedButton from 'components/common/OutlinedButton'

const ModuleContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  text-align: left;
`

const Text = styled(RichText)`
  padding: 0 30px 0 0;
  color: #404042;
  font-size: 16px;
  font-weight: 400;
  text-align: left;
`

const OutlinedButtonGrey = styled(OutlinedButton)`
  color: #404042;
  border-color: #404042;
  margin-top: 35px;
`
const LinkCenterd = styled(Link)`
  display: block;
  text-align: center;
}
`
export const ImageRight = ({ fields }: any) => {
  if (!fields) {
    return <p>No fields</p>
  }
  return (
    <ModuleContainer>
      <ModuleTextImg
        title={fields.Title.value}
        img={fields.Image.value.src}
        fullWidth={true}>
        <Text field={fields.Text} />
        {fields.CTA && fields.CTA.value.href && (
          <LinkCenterd to={fields.CTA.value.href}>
            <OutlinedButtonGrey>{fields.CTA.value.text}</OutlinedButtonGrey>
          </LinkCenterd>
        )}
      </ModuleTextImg>
    </ModuleContainer>
  )
}

export default ImageRight

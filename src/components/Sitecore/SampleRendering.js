import React from 'react'
import { Text } from '@sitecore-jss/sitecore-jss-react'

const SampleRendering = ({ fields }) => (
  <React.Fragment>
    <Text tag="h2" className="display-4" field={fields.Title} />
  </React.Fragment>
)

export default SampleRendering

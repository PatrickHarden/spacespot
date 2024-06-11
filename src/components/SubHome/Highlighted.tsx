import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { search } from 'services/space/api'
import { Space } from 'services/space/types'
import { useWindowSize } from 'services/global/hooks'
import PropertyListing from 'components/PropertyListing/PropertyListing'

const Container = styled.div`
  max-width: 1260px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  grid-gap: 20px;
  justify-content: center;
`

export const Highlighted = (props: { usageType: 'Office' | 'FlexOffice' }) => {
  const { usageType } = props
  const [spaces, setSpaces] = useState((null as unknown) as Array<Space>)
  const [fit, setFit] = useState((null as unknown) as Array<Space>)
  const [selected, setSelected] = useState((null as unknown) as Space)
  const wBox = useWindowSize()

  // Sort: 'asc(_distance)',
  useEffect(() => {
    const data = {
      Lat: 59.9138688,
      Lon: 10.7522454,
      radius: 50,
      'Common.IsParent': false,
      'Common.UsageType': usageType,
    }
    const fetchData = async () => {
      const response = await search(data)
      setSpaces(response.Documents[0])
      return response
    }
    fetchData()
  }, [usageType])

  useEffect(() => {
    if (spaces && wBox && wBox.width) {
      const n = Math.min(4, (wBox.width - 100) / 320)
      setFit(spaces.slice(0, n < 2 ? 4 : n))
    }
  }, [wBox, spaces])

  const choose = (space: Space) => {
    setSelected(space)
  }

  return (
    <Container>
      {fit && fit.length > 0 && (
        <PropertyListing
          spaces={fit}
          selected={selected}
          setSelected={choose}
        />
      )}
    </Container>
  )
}

export default Highlighted

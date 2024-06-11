import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  text-align: left;
  position: relative;
`

const SpacesCount = styled.span`
  line-height: 1.5em;
  color: black;
  font-size: 16px;
  font-weight: 400;
  background-color: white;
  padding: 0 25px;
  margin-left: 20px;
`
const Line = styled.div`
  :after {
    content: ' ';
    position: absolute;
    top: 60%;
    left: 50%;
    width: 100%;
    border: 1px solid #979797;
    border-top: 0;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
    transform: translateX(-50%);
    z-index: -2;
  }
`

const SpacesSeparator = (props: { num: number }) => {
  const { formatMessage } = useIntl()
  const tn = (s: string, value: number) =>
    formatMessage({ id: s }, { number: value })
  const { num } = props
  return (
    <>
      <Container>
        <Line>
          <SpacesCount>{tn('DASHBOARD_NUM_SPACES', num)}</SpacesCount>
        </Line>
      </Container>
    </>
  )
}
export default SpacesSeparator

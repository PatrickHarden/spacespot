import React from 'react'
import styled from 'styled-components'
import FilledButton from 'components/common/FilledButton'

type ButtonProps = {
  onClick: () => void
  label: string
  disabled?: boolean
}
interface NextBackProps {
  next: ButtonProps
  back?: ButtonProps
}
const Container = styled.div`
  overflow: hidden;
  padding-top: 10px;
  margin-bottom: 30px;
`
const Line = styled.div`
  box-sizing: border-box;
  height: 1px;
  width: 100%;
  margin: 15px 0 10px 0;
  border: 1px solid #ddddd0;
  border-top: 0;
`
const ButtonBack = styled(FilledButton)`
  color: #404042;
  background-color: #ffffff;
  float: left;
`
const ButtonNext = styled(FilledButton)<{ disabled?: boolean }>`
  background-color: ${props => (props.disabled ? '#b3b3b3' : '#404042')};
  color: #ffffff;
  float: right;
`

const NextBack = (props: NextBackProps) => {
  const { next, back } = props
  return (
    <Container>
      <Line />
      {back ? (
        <ButtonBack data-testid="button-back" onClick={back.onClick}>
          {back.label}
        </ButtonBack>
      ) : null}
      <ButtonNext
        id="button-next"
        data-testid="button-next"
        onClick={next.onClick}
        disabled={next.disabled}>
        {next.label}
      </ButtonNext>
    </Container>
  )
}
export default NextBack

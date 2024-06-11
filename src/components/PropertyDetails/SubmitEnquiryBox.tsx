import React, { useState } from 'react'

import styled from 'styled-components'
import { useIntl } from 'react-intl'
import EnquiryDialogFixed from './EnquiryDialogFixed'
import EnquiryDialogFlex from './EnquiryDialogFlex'
import device from 'services/global/device'
import { useWindowSize } from 'services/global/hooks'
import FilledButton from 'components/common/FilledButton'

const Container = styled.div<{ vh: string }>`
  position: sticky;
  top: 70px;
  width: 260px;
  padding: 15px;
  h2 {
    color: #000000;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.18px;
    line-height: 26px;
    margin-top: 0;
    margin-block-end: 0.5em;
  }
  border: 1px solid #dddddd;
  border-radius: 2px;
  background-color: #ffffff;
  @media ${device.mobile} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    left: 0;
    bottom: 0;
    top: inherit;
    width: 100%
    height: 70px;
    box-sizing: border-box;
    border: none;
    border-top: 1px solid black;
    h2 {
      display: inline-block;
      font-size: 14px;
      margin: 0;
      line-height: 20px;
      width: 50%;
      padding-right: 5px;
    }
    p {
      display: none;
    }
  }
`

const Button = styled(FilledButton)`
  color: #fffff0;
  background-color: #f35c2b;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  @media ${device.mobile} {
    min-width: 160px;
  }
`
const Actions = styled.div`
  margin: 25px auto 0 auto;
  width: 100%;
  @media ${device.mobile} {
    margin: 0;
    display: inline;
    width: unset;
  }
`

const SubmitEnquiryBox = (props: { isFixed: boolean; className?: string }) => {
  const { className, isFixed } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const [open, setOpen] = useState(false)
  const wBox = useWindowSize()

  const openModal = () => {
    setOpen(true)
  }

  return (
    <Container
      className={className}
      vh={wBox.height ? `${wBox.height}px` : '100vh'}>
      <h2>{t('ENQUIRY_BOX_TITLE')}</h2>
      <p>{t('ENQUIRY_BOX_BODY')}</p>
      <Actions>
        <Button
          onClick={openModal}
          data-testid="submit-enquiry-box"
          data-auto="submit-enquiry-box">
          {t('ENQUIRY_BOX_BUTTON')}
        </Button>
      </Actions>
      {isFixed ? (
        <EnquiryDialogFixed open={open} setOpen={setOpen} />
      ) : (
        <EnquiryDialogFlex open={open} setOpen={setOpen} />
      )}
    </Container>
  )
}

export default SubmitEnquiryBox

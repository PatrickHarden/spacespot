import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import Close from '@material-ui/icons/Close'
import Check from 'components/icons/Check'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import device from 'services/global/device'

const DialogTitle1 = styled(DialogTitle)`
  padding-bottom: 0;
  h2 {
    font-size: 25px;
    font-weight: 500;
  }
  svg {
    position: absolute;
    right: 25px;
    top: 10px;
    cursor: pointer;
  }
`
const DialogContainer = styled(Dialog)`
  .MuiPaper-root {
    max-width: 880px;
  }
`
const CheckAligned = styled(Check)`
  padding-top: 6px;
`
const ContentContainer = styled.div`
  display: flex;
  padding: 10px;
  @media ${device.mobile} {
    flex-direction: column;
  }
`
const Side = styled.div`
  padding: 20px;
`
const List = styled.div`
  display: flex;
`
const Heading = styled.h2`
  color: #000000;
  font-size: 18px;
  font-weight: 500;
  @media ${device.mobile} {
    margin-top: 10px;
  }
`
const Text = styled.div`
  color: #000000;
  font-size: 16px;
  font-weight: 400;
  padding-left: 5px;
`
const WhatsThisText = styled.div`
  color: #404042;
  float: right;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
`
const WhatsThis = () => {
  const [open, setOpen] = useState(false)
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })

  return (
    <>
      <WhatsThisText onClick={() => setOpen(true)}>
        {t('WIZARD_WHATS_THIS')}
      </WhatsThisText>
      <DialogContainer onClose={() => setOpen(false)} open={open}>
        <DialogTitle1>
          {t('WIZARD_WHATS_THIS_TITLE')}
          <Close onClick={() => setOpen(false)} />
        </DialogTitle1>
        <DialogContent>
          <ContentContainer>
            <Side>
              <Heading>{t('WIZARD_WHATS_THIS_HEADER_LEFT')}</Heading>
              <List>
                <CheckAligned />
                <Text>{t('WIZARD_WHATS_THIS_TEXT_LEFT_1')}</Text>
              </List>
              <List>
                <CheckAligned />
                <Text>{t('WIZARD_WHATS_THIS_TEXT_LEFT_2')}</Text>
              </List>
              <List>
                <CheckAligned />
                <Text>{t('WIZARD_WHATS_THIS_TEXT_LEFT_3')}</Text>
              </List>
              <List>
                <CheckAligned />
                <Text>{t('WIZARD_WHATS_THIS_TEXT_LEFT_4')}</Text>
              </List>
            </Side>
            <Side>
              <Heading>{t('WIZARD_WHATS_THIS_HEADER_RIGHT')}</Heading>
              <List>
                <CheckAligned />
                <Text>{t('WIZARD_WHATS_THIS_TEXT_RIGHT_1')}</Text>
              </List>
              <List>
                <CheckAligned />
                <Text>{t('WIZARD_WHATS_THIS_TEXT_RIGHT_2')}</Text>
              </List>
              <List>
                <CheckAligned />
                <Text>{t('WIZARD_WHATS_THIS_TEXT_RIGHT_3')}</Text>
              </List>
              <List>
                <CheckAligned />
                <Text>{t('WIZARD_WHATS_THIS_TEXT_RIGHT_4')}</Text>
              </List>
              <List>
                <CheckAligned />
                <Text>{t('WIZARD_WHATS_THIS_TEXT_RIGHT_5')}</Text>
              </List>
            </Side>
          </ContentContainer>
        </DialogContent>
      </DialogContainer>
    </>
  )
}

export default WhatsThis

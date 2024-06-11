import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import { NegotiationStatus } from 'services/negotiation/types'

const CustomStep = styled(Step)`
  .MuiStepIcon-text {
    font-size: 14px;
    font-weight: 400;
  }
  .MuiStepIcon-root {
    color: white;
    border: 1px solid black;
    border-radius: 50%;
  }
  .MuiStepIcon-completed {
    color: #404042;
    border: none;
  }
  .MuiStepIcon-active {
    border: none;
    color: #404042;
    .MuiStepIcon-text {
      fill: #ffffff;
    }
  }
  .MuiStepLabel-label.MuiStepLabel-alternativeLabel {
    margin-top: 2px;
  }
  .MuiStepLabel-label.MuiStepLabel-alternativeLabel.MuiTypography-body2 {
    font-size: 14px;
  }
`

const CustomStep2 = styled(CustomStep)`
  .MuiStepIcon-active {
    border: 1px solid black;
    color: #ffffff;
    .MuiStepIcon-text {
      fill: #000000;
    }
  }
`

const SignStepper = styled(
  (props: {
    className?: string
    userStatus: NegotiationStatus
    peerStatus: NegotiationStatus
  }) => {
    const { formatMessage } = useIntl()
    const t = (s: string) => formatMessage({ id: s })
    const { className, userStatus, peerStatus } = props
    let currentInWhite = false
    let signStep = 0
    if (userStatus === NegotiationStatus.SignInfo) {
      signStep = 0
    }
    if (userStatus === NegotiationStatus.AcceptLease) {
      signStep = 1
    }
    if (
      userStatus === NegotiationStatus.LeaseAccepted &&
      peerStatus !== NegotiationStatus.LeaseAccepted
    ) {
      signStep = 2
      currentInWhite = true
    }
    if (
      userStatus === NegotiationStatus.LeaseAccepted &&
      peerStatus === NegotiationStatus.LeaseAccepted
    ) {
      signStep = 2
    }
    if (
      userStatus === NegotiationStatus.LeaseSigned ||
      userStatus === NegotiationStatus.LeaseSignInitiated
    ) {
      signStep = 2
    }
    return (
      <Stepper className={className} activeStep={signStep} alternativeLabel>
        <CustomStep key={1}>
          <StepLabel>{t('SUMMARY_SIGNING_DETAILS')}</StepLabel>
        </CustomStep>
        <CustomStep key={2}>
          <StepLabel>{t('SUMMARY_SIGNING_ACCEPT')}</StepLabel>
        </CustomStep>
        {currentInWhite ? (
          <CustomStep2 key={3}>
            <StepLabel>{t('SUMMARY_SIGNING_SIGN')}</StepLabel>
          </CustomStep2>
        ) : (
          <CustomStep key={3}>
            <StepLabel>{t('SUMMARY_SIGNING_SIGN')}</StepLabel>
          </CustomStep>
        )}
      </Stepper>
    )
  },
)`
  padding: 20px 0;
  background: #fafafa;
`

export default SignStepper

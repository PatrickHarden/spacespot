import { select, call, put } from 'redux-saga/effects'

import userSelectors from '../../user/selectors'
import enquirySelectors from '../../enquiry/selectors'
import selectors from '../selectors'

import actions from '../actions'
import {
  getNegotiationTerms,
  getNegotiationTermsFields,
  putCounterNegotiationTerms,
  acceptNegotiationTerms,
  rejectNegotiationTerms,
  getCustomFitout,
  putCustomFitout,
  saveSpecialProvision,
  acceptSpecialProvision,
  rejectSpecialProvision,
  selectFitoutAPI,
  deleteFitoutAPI,
  putSignLeaseStatusAPI,
  postSignerInfo,
  putSignerInfo,
  getSignerInfo,
  acceptLease,
  finalSign,
  getSigners,
  getPreviewLeaseSagaAPI,
} from '../api'
import {
  getNegotiationTermsSaga,
  getNegotiationTermsFieldsSaga,
  putCounterNegotiationTermsSaga,
  acceptNegotiationTermsSaga,
  rejectNegotiationTermsSaga,
  customFitoutSaga,
  putCustomFitoutSaga,
  saveSpecialProvisionSaga,
  acceptSpecialProvisionSaga,
  rejectSpecialProvisionSaga,
  selectFitoutSaga,
  deleteFitoutSaga,
  putSignLeaseStatusSaga,
  postSignerInfoSaga,
  putSignerInfoSaga,
  getSignerInfoSaga,
  acceptLeaseSaga,
  getSignersSaga,
  getPreviewLeaseSaga,
} from '../saga'
import {
  NegotiationTerm,
  NegotiationAPIResponse,
  FitoutOptionProps,
  SelectedFitoutOption,
  NegotiationStatus,
} from '../types'

import MockDate from 'mockdate'
import { getUserIntl } from 'intl'
import toaster from 'services/toaster/actions'

type AnyGen = Generator<void, any, any>

describe('negotiation sagas', () => {
  it('getNegotiationTermsSaga should work', async () => {
    const gen = getNegotiationTermsSaga() as AnyGen
    const enquiryId = '1'
    const token = '123'
    const reply: any = {}

    expect(gen.next().value).toEqual(select(enquirySelectors.getEnquiryId))
    expect(gen.next(enquiryId).value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(getNegotiationTerms, token, enquiryId),
    )
    expect(gen.next(reply).value).toEqual(put(actions.getSuccess(reply)))
    expect(gen.next().done).toEqual(true)
  })

  it('getNegotiationTermsSaga should fail', async () => {
    const gen = getNegotiationTermsSaga() as AnyGen
    const enquiryId = '1'
    const token = '123'
    expect(gen.next().value).toEqual(select(enquirySelectors.getEnquiryId))
    expect(gen.next(enquiryId).value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(getNegotiationTerms, token, enquiryId),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.getError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('getNegotiationTermsFieldsSaga should work', async () => {
    const gen = getNegotiationTermsFieldsSaga() as AnyGen
    const token = '123'
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(getNegotiationTermsFields, token),
    )
    expect(gen.next(reply).value).toEqual(put(actions.getFieldsSuccess(reply)))
    expect(gen.next().done).toEqual(true)
  })

  it('getNegotiationTermsFieldsSaga should fail', async () => {
    const gen = getNegotiationTermsFieldsSaga() as AnyGen
    const token = '123'
    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(
      call(getNegotiationTermsFields, token),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.getFieldsError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('putCounterNegotiationTermsSaga should work', async () => {
    const data = {} as Array<NegotiationTerm>
    const gen = putCounterNegotiationTermsSaga(
      actions.putCounter(data),
    ) as AnyGen
    const token = '123'
    const enquiryId = 1
    const reply: any = {}
    const dataPut: NegotiationAPIResponse = {
      terms: {},
    } as NegotiationAPIResponse

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(enquirySelectors.getEnquiryId))

    expect(gen.next(enquiryId).value).toEqual(
      call(putCounterNegotiationTerms, token, enquiryId, dataPut),
    )
    expect(gen.next(reply).value).toEqual(put(actions.putCounterSuccess(reply)))
    expect(gen.next().value).toEqual(call(getNegotiationTermsSaga))
    expect(gen.next().done).toEqual(true)
  })

  it('putCounterNegotiationTermsSaga should fail', async () => {
    const data = {} as Array<NegotiationTerm>
    const gen = putCounterNegotiationTermsSaga(
      actions.putCounter(data),
    ) as AnyGen
    const token = '123'
    const enquiryId = 1
    const dataPut: NegotiationAPIResponse = {
      terms: {},
    } as NegotiationAPIResponse

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(enquirySelectors.getEnquiryId))

    expect(gen.next(enquiryId).value).toEqual(
      call(putCounterNegotiationTerms, token, enquiryId, dataPut),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.putCounterError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('acceptNegotiationTermsSaga should work', async () => {
    const gen = acceptNegotiationTermsSaga() as AnyGen
    const token = '123'
    const enquiryId = 1
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(enquirySelectors.getEnquiryId))

    expect(gen.next(enquiryId).value).toEqual(
      call(acceptNegotiationTerms, token, enquiryId),
    )
    expect(gen.next(reply).value).toEqual(put(actions.acceptSuccess(reply)))
    expect(gen.next().value).toEqual(put(actions.get()))
    expect(gen.next().done).toEqual(true)
  })

  it('acceptNegotiationTermsSaga should fail', async () => {
    const gen = acceptNegotiationTermsSaga() as AnyGen
    const token = '123'
    const enquiryId = 1

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(enquirySelectors.getEnquiryId))

    expect(gen.next(enquiryId).value).toEqual(
      call(acceptNegotiationTerms, token, enquiryId),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.acceptError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('rejectNegotiationTermsSaga should work', async () => {
    const gen = rejectNegotiationTermsSaga() as AnyGen
    const token = '123'
    const enquiryId = 1
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(enquirySelectors.getEnquiryId))

    expect(gen.next(enquiryId).value).toEqual(
      call(rejectNegotiationTerms, token, enquiryId),
    )
    expect(gen.next(reply).value).toEqual(put(actions.rejectSuccess(reply)))
    expect(gen.next().value).toEqual(put(actions.get()))
    expect(gen.next().done).toEqual(true)
  })

  it('rejectNegotiationTermsSaga should work', async () => {
    const gen = rejectNegotiationTermsSaga() as AnyGen
    const token = '123'
    const enquiryId = 1

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(enquirySelectors.getEnquiryId))

    expect(gen.next(enquiryId).value).toEqual(
      call(rejectNegotiationTerms, token, enquiryId),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.rejectError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('customFitoutSaga should work', async () => {
    const gen = customFitoutSaga() as AnyGen
    const token = '123'
    const negotiationId = 1
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(getCustomFitout, token, negotiationId),
    )
    expect(gen.next(reply).value).toEqual(
      put(actions.getCustomFitoutSuccess(reply)),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('customFitoutSaga should fail', async () => {
    const gen = customFitoutSaga() as AnyGen
    const token = '123'
    const negotiationId = 1

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(getCustomFitout, token, negotiationId),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.getCustomFitoutError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('putCustomFitoutSaga should work', async () => {
    const fitoutOption: FitoutOptionProps = {
      name: 'test',
      description: 'test',
      amount: 5000,
    }
    const action = actions.putCustomFitout(fitoutOption)
    const gen = putCustomFitoutSaga(action) as AnyGen
    const token = '123'
    const negotiationId = 1
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(putCustomFitout, token, negotiationId, action.payload),
    )
    expect(gen.next(reply).value).toEqual(
      put(actions.putCustomFitoutSuccess(reply)),
    )
    expect(gen.next().done).toEqual(true)
  })
  it('putCustomFitoutSaga should fail', async () => {
    const fitoutOption: FitoutOptionProps = {
      name: 'test',
      description: 'test',
      amount: 5000,
    }
    const action = actions.putCustomFitout(fitoutOption)
    const gen = putCustomFitoutSaga(action) as AnyGen
    const token = '123'
    const negotiationId = 1

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(putCustomFitout, token, negotiationId, action.payload),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.putCustomFitoutError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('saveSpecialProvisions should work', async () => {
    const data = 'special issue'
    const action = actions.saveSpecialProvisions(data)
    const gen = saveSpecialProvisionSaga(action) as AnyGen
    const token = '123'
    const negotiationId = 1
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(enquirySelectors.getEnquiryId))

    expect(gen.next(negotiationId).value).toEqual(
      call(saveSpecialProvision, token, negotiationId, action.payload),
    )
    expect(gen.next(reply).value).toEqual(
      put(actions.saveSpecialProvisionsSuccess()),
    )
    expect(gen.next().value).toEqual(put(actions.get()))
    expect(gen.next().done).toEqual(true)
  })

  it('saveSpecialProvisions should fail', async () => {
    const data = 'special issue'
    const action = actions.saveSpecialProvisions(data)
    const gen = saveSpecialProvisionSaga(action) as AnyGen
    const token = '123'
    const negotiationId = 1

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(enquirySelectors.getEnquiryId))

    expect(gen.next(negotiationId).value).toEqual(
      call(saveSpecialProvision, token, negotiationId, action.payload),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.saveSpecialProvisionsError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('acceptSpecialProvisions should work', async () => {
    const gen = acceptSpecialProvisionSaga() as AnyGen
    const token = '123'
    const negotiationId = 1
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(acceptSpecialProvision, token, negotiationId),
    )
    expect(gen.next(reply).value).toEqual(
      put(actions.saveSpecialProvisionsSuccess()),
    )
    expect(gen.next().value).toEqual(put(actions.get()))
    expect(gen.next().done).toEqual(true)
  })
  it('acceptSpecialProvisions should fail', async () => {
    const gen = acceptSpecialProvisionSaga() as AnyGen
    const token = '123'
    const negotiationId = 1

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(acceptSpecialProvision, token, negotiationId),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.saveSpecialProvisionsError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('rejectSpecialProvisions should work', async () => {
    const gen = rejectSpecialProvisionSaga() as AnyGen
    const token = '123'
    const negotiationId = 1
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(rejectSpecialProvision, token, negotiationId),
    )
    expect(gen.next(reply).value).toEqual(
      put(actions.saveSpecialProvisionsSuccess()),
    )
    expect(gen.next().value).toEqual(put(actions.get()))
    expect(gen.next().done).toEqual(true)
  })

  it('rejectSpecialProvisions should fail', async () => {
    const gen = rejectSpecialProvisionSaga() as AnyGen
    const token = '123'
    const negotiationId = 1

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(rejectSpecialProvision, token, negotiationId),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.saveSpecialProvisionsError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('selectFitoutSaga should work', async () => {
    const data: SelectedFitoutOption = { custom: false, fitoutOption: '1' }
    const action = actions.selectFitout(data)
    const gen = selectFitoutSaga(action) as AnyGen
    const token = '123'
    const negotiationId = '1'
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(selectFitoutAPI, token, negotiationId, data),
    )
    expect(gen.next(reply).value).toEqual(
      put(actions.selectFitoutSuccess(reply)),
    )
    expect(gen.next().done).toEqual(true)
  })
  it('selectFitoutSaga should fail', async () => {
    const data: SelectedFitoutOption = { custom: false, fitoutOption: '1' }
    const action = actions.selectFitout(data)
    const gen = selectFitoutSaga(action) as AnyGen
    const token = '123'
    const negotiationId = '1'

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(selectFitoutAPI, token, negotiationId, data),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.selectFitoutError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })

  it('deleteFitoutSaga should work', async () => {
    const data = '1'
    const action = actions.deleteFitout(data)
    const gen = deleteFitoutSaga(action) as AnyGen
    const token = '123'
    const negotiationId = '1'
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(deleteFitoutAPI, token, negotiationId, data),
    )
    expect(gen.next(reply).value).toEqual(
      put(actions.deleteFitoutSuccess(data)),
    )
    expect(gen.next().done).toEqual(true)
  })
  it('deleteFitoutSaga should fail', async () => {
    const data = '1'
    const action = actions.deleteFitout(data)
    const gen = deleteFitoutSaga(action) as AnyGen
    const token = '123'
    const negotiationId = '1'

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(deleteFitoutAPI, token, negotiationId, data),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.deleteFitoutError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })
  it('putSignLeaseStatusSaga should work', async () => {
    const data = NegotiationStatus.PreviewStart
    const action = actions.putNegotiationStatus(data)
    const gen = putSignLeaseStatusSaga(action) as AnyGen
    const token = '123'
    const negotiationId = '1'
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(putSignLeaseStatusAPI, token, negotiationId, {
        signLeaseStatus: data,
      }),
    )
    expect(gen.next(reply).value).toEqual(
      put(actions.putNegotiationStatusSuccess(reply)),
    )
    expect(gen.next().done).toEqual(true)
  })
  it('putSignLeaseStatusSaga should fail', async () => {
    const data = NegotiationStatus.PreviewStart
    const action = actions.putNegotiationStatus(data)
    const gen = putSignLeaseStatusSaga(action) as AnyGen
    const token = '123'
    const negotiationId = '1'

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(putSignLeaseStatusAPI, token, negotiationId, {
        signLeaseStatus: data,
      }),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.putNegotiationStatusError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })
  it('postSignerInfoSaga should work', async () => {
    const data = {
      name: 'test1',
      emailId: 'tes@test.testt',
      companyNumber: '1234',
      companyName: 'test',
    }
    const action = actions.postSignerInfo(data)
    const gen = postSignerInfoSaga(action) as AnyGen
    const token = '123'
    const negotiationId = '1'
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(postSignerInfo, token, negotiationId, data),
    )
    expect(gen.next(reply).value).toEqual(put(actions.signerInfoSuccess(reply)))
    expect(gen.next(reply).value).toEqual(
      put(actions.putNegotiationStatus(NegotiationStatus.AcceptLease)),
    )
    expect(gen.next().done).toEqual(true)
  })
  it('postSignerInfoSaga should fail', async () => {
    const data = {
      name: 'test1',
      emailId: 'tes@test.testt',
      companyNumber: '1234',
      companyName: 'test',
    }
    const action = actions.postSignerInfo(data)
    const gen = postSignerInfoSaga(action) as AnyGen
    const token = '123'
    const negotiationId = '1'

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(postSignerInfo, token, negotiationId, data),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.signerInfoError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })
  it('putSignerInfoSaga should work', async () => {
    const data = {
      name: 'test1',
      emailId: 'tes@test.testt',
      companyNumber: '1234',
      companyName: 'test',
    }
    const action = actions.putSignerInfo(data)
    const gen = putSignerInfoSaga(action) as AnyGen
    const token = '123'
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))

    expect(gen.next(token).value).toEqual(call(putSignerInfo, token, data))
    expect(gen.next(reply).value).toEqual(put(actions.signerInfoSuccess(reply)))
    expect(gen.next(reply).value).toEqual(
      put(actions.putNegotiationStatus(NegotiationStatus.AcceptLease)),
    )
    expect(gen.next().done).toEqual(true)
  })
  it('putSignerInfoSaga should fail', async () => {
    const data = {
      name: 'test1',
      emailId: 'tes@test.testt',
      companyNumber: '1234',
      companyName: 'test',
    }
    const action = actions.putSignerInfo(data)
    const gen = putSignerInfoSaga(action) as AnyGen
    const token = '123'

    expect(gen.next().value).toEqual(select(userSelectors.token))

    expect(gen.next(token).value).toEqual(call(putSignerInfo, token, data))
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.signerInfoError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })
  it('getSignerInfoSaga should work', async () => {
    const gen = getSignerInfoSaga() as AnyGen
    const token = '123'
    const negotiationId = '1'
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(getSignerInfo, token, negotiationId),
    )
    expect(gen.next(reply).value).toEqual(put(actions.signerInfoSuccess(reply)))

    expect(gen.next().done).toEqual(true)
  })
  it('getSignerInfoSaga should fail', async () => {
    const gen = getSignerInfoSaga() as AnyGen
    const token = '123'
    const negotiationId = '1'

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(getSignerInfo, token, negotiationId),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.signerInfoError('Error1')),
    )
    expect(gen.next().done).toEqual(true)
  })
  it('acceptLeaseSaga should work', async () => {
    const gen = acceptLeaseSaga() as AnyGen
    const token = '123'
    const negotiationId = '1'
    const enquiryId = '2'
    const reply: any = {}
    const replyNegotiation: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))
    expect(gen.next(negotiationId).value).toEqual(
      select(enquirySelectors.getEnquiryId),
    )

    expect(gen.next(enquiryId).value).toEqual(
      call(acceptLease, token, negotiationId),
    )
    expect(gen.next(reply).value).toEqual(
      put(actions.putNegotiationStatus(NegotiationStatus.LeaseAccepted)),
    )
    expect(gen.next().value).toEqual(
      call(getNegotiationTerms, token, enquiryId),
    )
    expect(gen.next(replyNegotiation).value).toEqual(
      put(actions.getSuccess(replyNegotiation)),
    )
    expect(gen.next().value).toEqual(select(selectors.getNegotiationPeerStatus))
    expect(gen.next(NegotiationStatus.LeaseAccepted).value).toEqual(
      call(finalSign, token, enquiryId),
    )
    expect(gen.next().value).toEqual(
      put(actions.putNegotiationStatus(NegotiationStatus.LeaseSignInitiated)),
    )
    expect(gen.next().done).toEqual(true)
  })
  it('acceptLeaseSaga should fail', async () => {
    const gen = acceptLeaseSaga() as AnyGen
    const token = '123'
    const negotiationId = '1'
    const enquiryId = '2'
    const intl = getUserIntl()
    MockDate.set(1434319925275)

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))
    expect(gen.next(negotiationId).value).toEqual(
      select(enquirySelectors.getEnquiryId),
    )

    expect(gen.next(enquiryId).value).toEqual(
      call(acceptLease, token, negotiationId),
    )
    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.putNegotiationStatus(NegotiationStatus.AcceptLease)),
    )
    expect(gen.next().value).toEqual(put(actions.signerInfoError('Error1')))
    expect(gen.next().value).toEqual(
      put(toaster.showError(intl.formatMessage({ id: 'SIGNING_KO' }))),
    )
    MockDate.reset()

    expect(gen.next().done).toEqual(true)
  })
  it('getSignersSaga should work', async () => {
    const gen = getSignersSaga() as AnyGen
    const token = '123'
    const negotiationId = '1'
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(getSigners, token, negotiationId),
    )
    expect(gen.next(reply).value).toEqual(put(actions.signersSuccess(reply)))

    expect(gen.next().done).toEqual(true)
  })
  it('getSignersSaga should fail', async () => {
    const gen = getSignersSaga() as AnyGen
    const token = '123'
    const negotiationId = '1'

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(selectors.getNegotiationId))

    expect(gen.next(negotiationId).value).toEqual(
      call(getSigners, token, negotiationId),
    )

    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.signersError('Error1')),
    )

    expect(gen.next().done).toEqual(true)
  })
  it('getPreviewLeaseSaga should work', async () => {
    window.URL.createObjectURL = jest.fn()
    window.open = jest.fn()
    const gen = getPreviewLeaseSaga() as AnyGen
    const token = '123'
    const enquiryId = '1'
    const documentCulture = '3'
    const reply: any = {}

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(enquirySelectors.getEnquiryId))

    expect(gen.next(enquiryId).value).toEqual(
      select(selectors.getDocumentCulture),
    )
    expect(gen.next(documentCulture).value).toEqual(
      call(getPreviewLeaseSagaAPI, token, enquiryId, {
        culture: documentCulture,
      }),
    )
    expect(gen.next(reply).value).toEqual(
      put(actions.putNegotiationStatusSuccess(reply)),
    )
    expect(gen.next().done).toEqual(true)
  })
  it('getPreviewLeaseSaga should fail', async () => {
    const gen = getPreviewLeaseSaga() as AnyGen
    const token = '123'
    const enquiryId = '1'
    const documentCulture = '3'

    expect(gen.next().value).toEqual(select(userSelectors.token))
    expect(gen.next(token).value).toEqual(select(enquirySelectors.getEnquiryId))

    expect(gen.next(enquiryId).value).toEqual(
      select(selectors.getDocumentCulture),
    )
    expect(gen.next(documentCulture).value).toEqual(
      call(getPreviewLeaseSagaAPI, token, enquiryId, {
        culture: documentCulture,
      }),
    )

    expect(gen.throw(new Error('Error1')).value).toEqual(
      put(actions.putNegotiationStatusError('Error1')),
    )

    expect(gen.next().done).toEqual(true)
  })
})

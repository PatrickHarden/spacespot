import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import selectors from 'services/negotiation/selectors'
import actions from 'services/negotiation/actions'

import { getFields } from './helpers'
import { NegotiationStatus } from './types'
import { get } from 'lodash'

export const useNegotiationFields = () => {
  const fields = useSelector(selectors.getNegotiationFields)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!fields) {
      dispatch(actions.getFields())
    }
  }, [dispatch, fields])

  return fields
}

export const useNegotiationFieldsIds = () => {
  const fieldIds = useSelector(selectors.getNegotiationFieldIds)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!fieldIds) {
      dispatch(actions.getFields())
    }
  }, [dispatch, fieldIds])

  return fieldIds
}

export const useNegotiationTerms = () => {
  const negTerms = useSelector(selectors.getTerms)
  const fields = useNegotiationFields()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!negTerms) {
      dispatch(actions.get())
    }
  }, [dispatch, negTerms])

  // getFields returns a different instance each time
  // useMemo to avoid infinite updates
  // or use a redux selector that returns the thing | undefined
  const terms = useMemo(() => getFields(fields, negTerms), [fields, negTerms])
  return terms
}

export const useCustomFitout = () => {
  const fitouts = useSelector(selectors.getCustomFitout)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!fitouts) {
      dispatch(actions.getCustomFitout())
    }
  }, [dispatch, fitouts])

  return fitouts
}

export const useSignerInfo = () => {
  const info = useSelector(selectors.getSignerInfo)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!info) {
      dispatch(actions.getSignerInfo())
    }
  }, [dispatch, info])

  return info
}

export const useSigners = () => {
  const info = useSelector(selectors.getSigners)
  const negId = useSelector(selectors.getNegotiationId)
  const neg = useSelector(selectors.getNegotiation)
  const peer1s = get(neg, 'peer1SignLeaseStatus')
  const peer2s = get(neg, 'peer2SignLeaseStatus')
  const dispatch = useDispatch()

  useEffect(() => {
    if (
      !info &&
      peer1s === NegotiationStatus.LeaseSignInitiated &&
      peer2s === NegotiationStatus.LeaseSignInitiated
    ) {
      dispatch(actions.getSigners())
    }
  }, [dispatch, info, peer1s, peer2s, negId])

  return info
}

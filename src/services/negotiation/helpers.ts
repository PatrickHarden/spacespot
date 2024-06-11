import { get } from 'lodash'
import {
  NegotiationTerms,
  NegotiationTerm,
  NegotiationTermFields,
  NegotiationTermFieldsIds,
} from './types'

export const getNegotiationTermArray = (
  terms: NegotiationTerms,
  ids: NegotiationTermFieldsIds,
) => {
  const values: Array<NegotiationTerm> = Object.keys(terms).map(key => {
    return {
      termId: ids[key],
      value: get(terms, key),
    }
  })
  return values
}

const decapitalize = (title: string) => title[0].toLowerCase() + title.slice(1)

export const getFields = (
  fields: NegotiationTermFields,
  negTerms: Array<NegotiationTerm>,
): NegotiationTerms => {
  const initialTerms = {} as NegotiationTerms
  if (!negTerms || !fields) return initialTerms
  return (negTerms.reduce(
    (acc, term) => ({
      ...acc,
      [decapitalize(fields[term.termId])]: term.value,
    }),
    initialTerms,
  ) as unknown) as NegotiationTerms
}

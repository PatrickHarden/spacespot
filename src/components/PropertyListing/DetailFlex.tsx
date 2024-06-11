import React from 'react'
import { get } from 'lodash'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { Space } from 'services/space/types'
import { toSpaceData, getCountry } from 'services/space/selectors'
import { formatCurrency } from 'services/global/util'
import { getRegionCurrencyCode } from 'services/global/region'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  & > div {
    margin-right: 20px;
    text-overflow: clip;
    overflow: hidden;
    white-space: nowrap;
  }
  h5 {
    margin: 0;
    font-size: 16px;
    font-weight: 400;
  }
  div > div {
    font-size: 14px;
    color: #828286;
  }
`

const DetailFlex = (props: { className?: string; space: Space }) => {
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const { space, className } = props
  const spaceData = toSpaceData(space)
  const currency = getRegionCurrencyCode(getCountry(space))
  const from = spaceData.servicedOffices
    ? spaceData.servicedOffices.reduce((m: number, soffice) => {
        return m === null || soffice.price < m ? soffice.price : m
      }, (null as unknown) as number)
    : 0

  const contact = t('PRICE_CONTACT_US')
  const desks = Math.max(
    get(spaceData, 'hotDesks.desks', 0),
    get(spaceData, 'fixedDesks.desks', 0),
  )

  const hprice = get(spaceData, 'hotDesks.price', 0)
  const fprice = get(spaceData, 'fixedDesks.price', 0)
  let price = hprice
  if (price === 0) price = fprice
  if (hprice > 0 && fprice > 0) {
    price = Math.min(hprice, fprice)
  }

  const numSO = get(spaceData, 'servicedOffices.length', 0)

  return (
    <Container className={className}>
      <div>
        <h5>
          {desks} {t('PROPCARD_DESKS')}
        </h5>
        <div>
          {price < 99
            ? desks > 0
              ? contact
              : ''
            : `${t('PROPCARD_FROM')} ${formatCurrency(price, currency)}`}
        </div>
      </div>
      <div>
        <h5> {`${numSO} ${t('PROPCARD_SERVICED_OFFICES')}`} </h5>
        <div>
          {numSO > 0
            ? from < 99
              ? contact
              : `${t('PROPCARD_FROM')} ${formatCurrency(from, currency)}`
            : ''}
        </div>
      </div>
    </Container>
  )
}

export default DetailFlex

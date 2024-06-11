import React from 'react'
import styled from 'styled-components'
import { formatCurrency } from 'services/global/util'

const ContactUs = styled.button`
  color: #f35c2b;
  font-size: 16px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`
const ShowPrice = (props: {
  value: number
  currencyCode: string
  setOpenModal: (val: boolean) => void
  label: string
}) => {
  const { value, currencyCode, setOpenModal, label } = props

  const openModal = () => {
    setOpenModal(true)
  }
  return value < 99 ? (
    <ContactUs onClick={openModal}>{label}</ContactUs>
  ) : (
    <span>{formatCurrency(value, currencyCode)}</span>
  )
}

export default ShowPrice

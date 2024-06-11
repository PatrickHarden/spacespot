import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MyEnquiriesMain from 'components/MyEnquiries/MyEnquiriesMain'
import Layout from 'components/MainLayout/Layout'
import Spinner from 'components/icons/Spinner'
import styled from 'styled-components'
import selectors from 'services/myEnquiries/selectors'
import { useHistory } from 'react-router-dom'
import enquiryActions from 'services/myEnquiries/actions'
const SpinnerC = styled((props: { className?: string }) => (
  <div className={props.className}>
    <Spinner />
  </div>
))`
  text-align: center;
  margin-top: 40px;
`

const Enquiries = () => {
  const loading = useSelector(selectors.getMyEnquiriesLoading)
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    if (
      history.location.pathname === '/enquiries' &&
      history.action === 'POP'
    ) {
      dispatch(enquiryActions.get())
    }
  }, [dispatch, history.action, history.location.pathname])

  return <Layout>{loading ? <SpinnerC /> : <MyEnquiriesMain />}</Layout>
}

export default Enquiries

import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import EnquiryRoomLayout from 'components/EnquiryRoomLayout'
import enquiryActions from 'services/enquiry-screen/actions'
import myEnquiriesActions from 'services/myEnquiries/actions'

export const EnquiryRoom = () => {
  const { enquiryId } = useParams()
  const dispatch = useDispatch()
  useEffect(() => {
    if (enquiryId) {
      dispatch(
        enquiryActions.get({
          id: enquiryId,
        }),
      )
      dispatch(myEnquiriesActions.getNotifications())
    }
  }, [dispatch, enquiryId])

  return <EnquiryRoomLayout />
}

export default EnquiryRoom

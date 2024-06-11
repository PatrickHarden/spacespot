import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import selectors from 'services/myEnquiries/selectors'
import actions from 'services/myEnquiries/actions'
import user from 'services/user/selectors'
import { useInterval } from 'services/global/hooks'

export const useMyEnquiries = () => {
  const dispatch = useDispatch()
  const enquiries = useSelector(selectors.getMyEnquiries)
  const err = useSelector(selectors.getMyEnquiriesError)

  useEffect(() => {
    if (!enquiries && !err) {
      dispatch(actions.get())
    }
  }, [dispatch, enquiries, err])

  return enquiries
}

export const useNotificationCount = () => {
  const token = useSelector(user.token)
  const count = useSelector(selectors.getNotifications)
  const dispatch = useDispatch()

  const getCount = async () => {
    dispatch(actions.getNotifications())
  }

  const delay = token ? (count === undefined ? 1000 : 20000) : null
  useInterval(getCount, delay)
  return count
}

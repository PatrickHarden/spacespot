import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import selectors from 'services/user/selectors'
import actions from 'services/user/actions'

export const useAvatar = (userId: string) => {
  const avatar = useSelector(selectors.avatar(userId))
  const dispatch = useDispatch()

  useEffect(() => {
    if (avatar === undefined && userId) {
      dispatch(actions.getAvatar(userId))
    }
  }, [dispatch, avatar, userId])

  return avatar
}

export const useProfile = (userId: string) => {
  const profile = useSelector(selectors.profile(userId))
  const dispatch = useDispatch()

  useEffect(() => {
    if (!profile && userId) {
      dispatch(actions.getProfile(userId))
    }
  }, [dispatch, profile, userId])

  return profile
}

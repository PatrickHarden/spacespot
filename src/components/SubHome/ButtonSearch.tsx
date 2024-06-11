import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'

import actions from 'services/search/actions'
import OutlinedButton from 'components/common/OutlinedButton'
import { SearchType, TypeFilter } from 'services/search/types'

const OutlinedButtonGrey = styled(OutlinedButton)`
  color: #404042;
  border-color: #404042;
`

const ButtonSearch = (props: { title: string; searchType: SearchType }) => {
  const { title, searchType } = props
  const dispatch = useDispatch()
  const doSearch = () => {
    dispatch(
      actions.changeFilter({
        type: TypeFilter.type,
        data: searchType,
        notSearching: true,
      }),
    )
    dispatch(actions.searchInit())
  }
  return <OutlinedButtonGrey onClick={doSearch}>{title}</OutlinedButtonGrey>
}

export default ButtonSearch

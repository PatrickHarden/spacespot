import { SpaceSearchResponse } from 'services/space'
import { SpacespotErrorApi } from 'services/global/types'

export enum SearchType {
  None = 'NONE',
  Fixed = 'FIXED',
  Flex = 'FLEX',
  Both = 'BOTH',
}
export enum TypeFilter {
  where = 'where',
  desks = 'desks',
  when = 'when',
  type = 'type',
  radius = 'radius',
  length = 'length',
  maxRent = 'maxRent',
}
export interface FilterAction {
  type: TypeFilter
  data: string | number | SearchType | FilterWhere | null
  notSearching?: boolean
}
export interface FilterState {
  where?: FilterWhere
  desks?: number
  when?: string
  type?: SearchType
  radius?: number
  length?: number
  maxRent?: number
}

export interface FilterWhere {
  location: string
  latLng?: { lat: number; lng: number }
}

export interface SearchState {
  search?: SpaceSearchResponse | SpacespotErrorApi
  filters?: FilterState
}

export interface SearchAction {
  type: string
  payload?: string | FilterAction | SpaceSearchResponse | SpacespotErrorApi
}

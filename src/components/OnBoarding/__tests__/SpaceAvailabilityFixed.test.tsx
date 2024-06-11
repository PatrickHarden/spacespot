import React from 'react'
import SpaceAvailabilityFixed from '../SpaceAvailabilityFixed'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import { SpaceFormFields } from '../SpaceForm'

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
}))

jest.mock('react-redux', () => ({
  useDispatch: () => {
    return jest.fn()
  },
  useSelector: () => () => '',
}))

it('renders without crashing ', async () => {
  const fields: SpaceFormFields = {
    spaceName: '',
    spaceDescription: '',
    spaceHighlights: '',
    spaceSize: '',
    spaceSizeCommon: '',
    spaceFloor: '',
    spaceMatterPort: '',
    spaceFloored: '',
    use: '',
    months: '',
    spaceRent: '',
    spaceServices: '',
    availabilityFixed: '',
    spaceServicesNotNegotiable: false,
  }
  const wrapper = shallow(
    <SpaceAvailabilityFixed
      fields={fields}
      setFields={jest.fn()}
      errors={{}}
    />,
  )
  expect(shallowToJson(wrapper)).toMatchSnapshot()
})

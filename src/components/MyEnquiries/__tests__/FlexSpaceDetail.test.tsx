import React from 'react'
import FlexSpaceDetail from '../FlexSpaceDetail'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'
import MockDate from 'mockdate'
import space1 from 'services/space/__mocks__/space1.json'
import { EnquiryType } from 'services/enquiry'
import { Space } from 'services/space'

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (s: any) => s.id }),
  createIntl: jest.fn(),
  createIntlCache: jest.fn(),
}))

it('renders without crashing each type of space', async () => {
  MockDate.set(1434319925275)
  const wrapperUndefined = shallow(
    <FlexSpaceDetail
      space={(undefined as unknown) as Space}
      type={EnquiryType.HotDesk}
    />,
  )
  expect(shallowToJson(wrapperUndefined)).toMatchSnapshot()

  const wrapperHotDesk = shallow(
    <FlexSpaceDetail
      space={(space1 as unknown) as Space}
      type={EnquiryType.HotDesk}
    />,
  )
  expect(shallowToJson(wrapperHotDesk)).toMatchSnapshot()

  const wrapperFixedDesk = shallow(
    <FlexSpaceDetail
      space={(space1 as unknown) as Space}
      type={EnquiryType.FixedDesk}
    />,
  )
  expect(shallowToJson(wrapperFixedDesk)).toMatchSnapshot()

  const wrapperServicedOffice = shallow(
    <FlexSpaceDetail
      space={(space1 as unknown) as Space}
      type={EnquiryType.ServicedOffice}
    />,
  )
  expect(shallowToJson(wrapperServicedOffice)).toMatchSnapshot()
  MockDate.reset()
})

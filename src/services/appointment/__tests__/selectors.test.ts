import { SpacespotState } from '../../global/types'
import { Appointment } from '../types'
import selectors from '../selectors'

describe('Appointment selectors', () => {
  const errorState: SpacespotState = {
    appointment: { error: 'test' },
  }

  const data: Array<Appointment> = []

  const testState: SpacespotState = {
    appointment: {
      data,
    },
  }
  const dataUser = [
    {
      id: 1,
      description: 'test 1',
      createdAt: '2019-10-18T08:39:10.602',
      lastUpdatedAt: '2019-10-18T08:39:10.602+0000',
      proposedTime: '2019-11-29T18:00:00.000+0000',
      peer1Id: '8fa47f17-c44e-48eb-8e88-9e8c8fe5cda3',
      peer2Id: '99a5081a-795e-4638-85fa-e9390e3c6fba',
      enquireId: 1,
      appointmentStatus: 'PROPOSED',
      lastProposedBy: '8fa47f17-c44e-48eb-8e88-9e8c8fe5cda3',
    },
    {
      id: 2,
      description: 'test 2',
      createdAt: '2019-10-18T08:44:30.893',
      proposedTime: '2019-11-29T18:00:00.000+0000',
      lastUpdatedAt: '2019-10-18T08:44:30.893+0000',
      peer1Id: '8fa47f17-c44e-48eb-8e88-9e8c8fe5cda3',
      peer2Id: '99a5081a-795e-4638-85fa-e9390e3c6fba',
      enquireId: 2,
      appointmentStatus: 'PROPOSED',
      lastProposedBy: '8fa47f17-c44e-48eb-8e88-9e8c8fe5cda3',
    },
  ]
  const testUserState: SpacespotState = {
    appointment: {
      data: dataUser,
    },
  }

  it('selector should return error', () => {
    expect(selectors.error(errorState)).toEqual('test')
  })

  it('selector should return same appointment', () => {
    expect(selectors.appointment(testState)).toEqual(data)
  })

  it('selector should return user appointment', () => {
    expect(selectors.appointmentsUser(testUserState)).toEqual([
      {
        description: 'test 1',
        appointmentStatus: 'PROPOSED',
        date: new Date('2019-11-29T18:00:00.000Z'),
        isOwnLast: false,
        id: '1',
      },
      {
        appointmentStatus: 'PROPOSED',
        date: new Date('2019-11-29T18:00:00.000Z'),
        description: 'test 2',
        id: '2',
        isOwnLast: false,
      },
    ])
  })
})

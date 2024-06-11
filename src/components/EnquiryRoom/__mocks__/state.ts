export const mockState: any = {
  enquiry: {
    data: {
      spaceId: 'SS_SPACE_665',
      peer1Id: '1',
      peer2Id: '2',
      chatId: 159,
      enquireStatus: 'ACCEPTED',
      negotiationId: 139,
      enquireId: 159,
      flex: false,
    },
  },
  negotiation: {
    data: {
      flexible: false,
      terms: [
        {
          termId: 5,
          value: 'MONTHLY',
        },
        {
          termId: 6,
          value: '2000',
        },
        {
          termId: 7,
          value: '2',
        },
        {
          termId: 8,
          value: '2000',
        },
        {
          termId: 9,
          value: 'GUARANTEE',
        },
        {
          termId: 1,
          value: '3500',
        },
        {
          termId: 2,
          value: '40000',
        },
        {
          termId: 3,
          value: '2020-04-22',
        },
        {
          termId: 4,
          value: '13',
        },
      ],
      negotiationId: 139,
      enquireId: 159,
      createdAt: '2020-02-14T06:30:08.354+0000',
      lastUpdated: '2020-03-05T16:35:02.513+0000',
      lastModifyBy: '0062fb00-e389-4bb8-9119-613e3c45938a',
      status: 'PROPOSED',
      customFitout: false,
      fitoutOption: 0,
      specialProvision: 'gfd',
      specialProvisionStatus: 'CREATED',
    },
    loading: false,
    termsFields: {
      '1': 'Area',
      '2': 'Rent',
      '3': 'Start',
      '4': 'Duration',
      '5': 'Frequency',
      '6': 'AdditionalCosts',
      '7': 'Deposit',
      '8': 'ServiceCharges',
      '9': 'DepositType',
    },
    signerInfo: {
      id: 1,
      name: 'Name1',
      emailId: 'name1@email.com',
      companyName: 'companyA',
      companyNumber: '12345678',
    },
    customFitout: [],
  },
  user: {
    auth: {
      idToken: {
        claims: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          extension_Landlord: true,
        },
      },
    },
  },
}

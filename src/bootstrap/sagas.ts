import { all } from 'redux-saga/effects'

import chat from 'services/chat/saga'
import enquiry from 'services/enquiry/saga'
import enquiryScreen from 'services/enquiry-screen/saga'
import space from 'services/space/saga'
import user from 'services/user/saga'
import appointment from 'services/appointment/saga'
import onboarding from 'services/onboarding/saga'
import negotiation from 'services/negotiation/saga'
import event from 'services/event/saga'
import dashboard from 'services/dashboard/saga'
import myenquiries from 'services/myEnquiries/saga'
import search from 'services/search/saga'

export default function* sagas() {
  yield all([
    chat(),
    enquiry(),
    enquiryScreen(),
    space(),
    user(),
    appointment(),
    onboarding(),
    negotiation(),
    event(),
    dashboard(),
    myenquiries(),
    search(),
  ])
}

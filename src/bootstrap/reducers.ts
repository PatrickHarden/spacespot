import { combineReducers } from 'redux'
import chat from 'services/chat/reducer'
import enquiry from 'services/enquiry/reducer'
import enquiryscreen from 'services/enquiry-screen/reducer'
import user from 'services/user/reducer'
import space from 'services/space/reducer'
import appointment from 'services/appointment/reducer'
import onboarding from 'services/onboarding/reducer'
import toaster from 'services/toaster/reducer'
import negotiation from 'services/negotiation/reducer'
import event from 'services/event/reducer'
import dashboard from 'services/dashboard/reducer'
import myenquiries from 'services/myEnquiries/reducer'
import search from 'services/search/reducer'

// follow alphabetic order to keep it simple in redux devtools
export default combineReducers({
  appointment,
  chat,
  dashboard,
  enquiry,
  enquiryscreen,
  event,
  myenquiries,
  negotiation,
  onboarding,
  search,
  space,
  toaster,
  user,
})

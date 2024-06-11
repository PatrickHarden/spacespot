// setup file
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

window.google = {
  maps: {
    Point: class {},
    LatLngBounds: class {
      extend() {
        return
      }
      getCenter() {
        return
      }
    },
    LatLng: class {},
  },
}

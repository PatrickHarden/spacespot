import { Autocomplete } from '@react-google-maps/api'
import { noPrerender, withGoogle } from './hocs'

export default noPrerender(withGoogle(Autocomplete))

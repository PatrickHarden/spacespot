import { createMuiTheme } from '@material-ui/core/styles'
import { theme as UIComponentsTheme } from '@cbreenterprise/spacespot-ui'
import merge from 'lodash/merge'

const createTheme = {
  typography: {
    fontFamily: '"futura-pt", sans-serif',
    fontSize: 12,
  },
  fontSizes: {
    form: '200px',
  },
  palette: {
    primary: {
      main: '#4FBBD8',
    },
    secondary: {
      main: '#F35C2B',
    },
  },
  colors: {
    primaryAccent: '#00A384', // primary green color
    primaryAccentLght: '#29BC9C', // primary light green color
    secondaryAccent: '#EF7D00', // secondary orange color
    tertiaryAccent: '#06B4DD', // tertiary sky blue color
    primaryBackground: '#fbfbfb', // app background
    highlight: '#00b2dd', // highlight an item (blue)
    success: '#64dd7c',
    active: '#55dcdd',
    fixed: '#6CB9D5',
    error: 'darkred',
    border: '#cccccc', // normal border state
    notice: '#b0b0b0', // gray notice states
    inputFocus: '#29BC9C', // input focus color
    iconPrimary: '#828286',
    iconAlternative: '#3d3d41',
  },
}

const theme = merge(createTheme, UIComponentsTheme)
const MUITheme = createMuiTheme(theme)
export { theme, MUITheme }

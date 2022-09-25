
import { red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'
// A custom theme for this app
const theme = {
  palette: {
    primary: {
      main: '#556cd6'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#fff'
    }
  },
  infectionColors:
  {
    red: red.A400
  }
} as const
type CustomTheme = {
  [Key in keyof typeof theme]: typeof theme[Key]
}
declare module '@mui/material/styles/createTheme' {
  interface Theme extends CustomTheme { }
  interface ThemeOptions extends CustomTheme { }
}
export default createTheme(theme)

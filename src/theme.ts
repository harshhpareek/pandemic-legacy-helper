
import { createTheme, ThemeOptions } from '@mui/material/styles'
// A custom theme for this app
const theme: ThemeOptions = {
  components: {
    MuiContainer: {
      defaultProps: {
        sx: {
          // iPhone X dimensions are 375x812 px
          maxWidth: 370
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 3
      }
    },
    MuiList: {
      defaultProps: {
        dense: true,
        sx: {
          // iPhone X dimensions are 375x812 px
          maxWidth: 360,
          maxHeight: 800,
          position: 'relative',
          overflow: 'auto',
          '& ul': { padding: 0 }
        }
      }
    }
  }
  // infectionColors:
  // {
  //   red: red.A400
  // }
} as const
// type CustomTheme = {
//   [Key in keyof typeof theme]: typeof theme[Key]
// }
// declare module '@mui/material/styles/createTheme' {
//   interface Theme extends CustomTheme { }
//   interface ThemeOptions extends CustomTheme { }
// }
export default createTheme(theme)

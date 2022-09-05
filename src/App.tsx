import { mdiBiohazard } from '@mdi/js'
import Icon from '@mdi/react'
import CoronavirusOutlinedIcon from '@mui/icons-material/CoronavirusOutlined'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin'
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import SettingsModal from './components/SettingsModal'
import { TPlayerCard, TState } from './types'

function stringToColor (string: string): string {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar (name: string): { sx: { bgcolor: string }, children: string } {
  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
  }
}

function BackgroundLetterAvatars (): JSX.Element {
  return (
    <Stack direction="row" spacing={2}>
      <Avatar {...stringAvatar('Kent Dodds')} />
      <Avatar {...stringAvatar('Jed Watson')} />
      <Avatar {...stringAvatar('Tim Neutkens')} />
    </Stack>
  )
}

function playerCardIcon (card: TPlayerCard): globalThis.JSX.Element {
  switch (card) {
    case '_':
      return <IndeterminateCheckBoxOutlinedIcon />
    case 'Epidemic':
      return <Icon path={mdiBiohazard} color="red" size="25" />
    case 'Black':
      return <CoronavirusOutlinedIcon sx={{ color: 'black' }} />
    case 'Yellow':
      return <CoronavirusOutlinedIcon sx={{ color: 'orange' }} />
    case 'Blue':
      return <CoronavirusOutlinedIcon sx={{ color: 'blue' }} />
    case 'Red':
      return <CoronavirusOutlinedIcon color="error" />
    case 'Funded':
      return <CurrencyBitcoinIcon color="success" />
  }
}

function renderRow (props: ListChildComponentProps): JSX.Element {
  const { index, style } = props

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItem>
        <Avatar {...stringAvatar('Harsh Pareek')} />
        <ListItemText primary="drew" inset />
        <ListItemButton dense disableGutters>
          <ListItemIcon>{playerCardIcon('Red')} </ListItemIcon>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>{playerCardIcon('Epidemic')} </ListItemIcon>
        </ListItemButton>
        <ListItemText primary="infected" inset />
      </ListItem>
    </ListItem>
  )
}

export default function App (): globalThis.JSX.Element {
  const [showSettings, setShowSettings] = React.useState(false)
  const [state, setState] = React.useState<TState>({
    // Game Setup settings
    player0Name: 'P0',
    player1Name: 'P1',
    player2Name: 'P2',
    player3Name: 'P3',
    fundingLevel: 4,

    // Game state
    history: [[['Red', 'Blue'], []]]
  })
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pandemic Helper
        </Typography>
        <Button variant="contained"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </Button>
        {showSettings && <SettingsModal
          onClose={() => {
            setShowSettings(false)
          }}
          show={showSettings}
          parentState={state}
          setParentState={setState}
        />}
        <Typography variant="h4" component="h1" gutterBottom>
          Setup instructions
        </Typography>
        <BackgroundLetterAvatars />
        <div>
          <p>
            Enter <u>player names</u> or initials in Settings, and enter the{' '}
            <u>funding level</u>.
          </p>

          <p>Follow the manual, but pay attention to the following:</p>
          <ul>
            <li>
              Shuffle the <span style={{ color: 'green' }}>infection</span>{' '}
              deck. Do the initial{' '}
              <span style={{ color: 'green' }}>infection</span> step: 3 cities
              with 3 cubes, 3 cities with 2 cubes, blah blah. You can select
              funded events after this step.
            </li>
            <li>
              Shuffle the <span style={{ color: 'blue' }}>player</span> deck.
              Give two cards to each player. This page assumes 4 players. You
              should now have <b>40 cards</b>. Add funded events. Split into 5
              piles and add <span style={{ color: 'red' }}>Epidemic</span>{' '}
              cards.
            </li>
          </ul>
        </div>
        <h3>Enter Rounds </h3>
        <p />Glossary
        <ul>
          <li>
            <IndeterminateCheckBoxOutlinedIcon />: Not entered yet
          </li>
          <li>{playerCardIcon('Epidemic')}: Epidemic</li>
          <li>{playerCardIcon('Black')}: Black city player card</li>
          <li>{playerCardIcon('Yellow')}: Yellow city player card</li>
          <li>{playerCardIcon('Blue')}: Blue city player card</li>
          <li>{playerCardIcon('Red')}: Red city player card</li>
          <li>{playerCardIcon('Funded')}: Funded event</li>
        </ul>

        <Paper sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }} elevation={3}>
          <FixedSizeList
            height={400}
            width={360}
            itemSize={46}
            itemCount={200}
            overscanCount={1}
          >
            {renderRow}
          </FixedSizeList>
        </Paper>
        <h3>(Debug) State</h3>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </Box >
    </Container >
  )
}

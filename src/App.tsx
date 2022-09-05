import { mdiBiohazard } from '@mdi/js'
import Icon from '@mdi/react'
import CoronavirusOutlinedIcon from '@mui/icons-material/CoronavirusOutlined'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin'
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { ListChildComponentProps, FixedSizeList } from 'react-window'
import {
  DragDropContext,
  Droppable, DropResult, Draggable
} from 'react-beautiful-dnd'
import { TState, TPlayerCard } from './types'
import Stack from '@mui/material/Stack'
import NameDialog from './components/NameDialog'

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
      bgcolor: stringToColor(name + '__slt__')
    },
    children: name.length === 2 ? name : (name.includes(' ') ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : name[0])
  }
}

interface TAvatarProps {
  players: string[]
  positionToPlayerId: number[]
  setState: React.Dispatch<React.SetStateAction<TState>>
}

function BackgroundLetterAvatars (props: TAvatarProps): JSX.Element {
  function onDragEnd ({ destination, source }: DropResult): void { // dropped outside the list
    if (destination === undefined || destination === null) { return }
    const oldPositionToPlayerId = props.positionToPlayerId
    const newPositionToPlayerId = oldPositionToPlayerId.map((playerId, position) => {
      if (position === destination.index) {
        return oldPositionToPlayerId[source.index]
      }
      if ((position < source.index && position < destination.index) || (position > source.index && position > destination.index)) {
        return playerId
      } else if (position <= source.index && position > destination.index) {
        // No Array OOB because position cannot be 0 if it is strictly greater than destination.index (>= 0)
        return oldPositionToPlayerId[position - 1]
      } else if (position >= source.index && position < destination.index) {
        // No Array OOB because position cannot be the last element if it is strictly less than destination.index (<= length-1)
        return oldPositionToPlayerId[position + 1]
      }
      // Should never happen. This will crash the program
      return -1
    })
    console.log(props.positionToPlayerId)
    console.log(newPositionToPlayerId)
    props.setState((current: TState) => ({
      ...current,
      positionToPlayerId: newPositionToPlayerId
    }))
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="avatars" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <Stack direction="row" spacing={2}>
              {props.positionToPlayerId.map((playerId, position) => {
                const [showNameDialog, setShowNameDialog] = React.useState(false)
                console.log(props.positionToPlayerId)
                return (
                  <Draggable key={playerId} draggableId={String(playerId)} index={position}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <NameDialog
                          show={showNameDialog}
                          value={props.players[playerId]}
                          onClose={() => { setShowNameDialog(false) }}
                          onChange={(name) => {
                            props.setState((current: TState) =>
                              ({ ...current, players: props.players.map((oldName, j) => (j === playerId ? name : oldName)) }))
                          }} />
                        <Avatar component={Paper} elevation={5} {...stringAvatar(props.players[playerId])} onClick={() => { setShowNameDialog(true) }} />
                      </div>)}
                  </Draggable>)
              })}
            </Stack>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
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

function renderHistory (props: ListChildComponentProps): JSX.Element {
  const { data, index, style } = props
  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItem>
        <Avatar {...stringAvatar('Harsh Pareek')} />
        <ListItemText primary="drew" />
        <ListItemButton dense sx={{ width: '2%' }}>
          <ListItemIcon>{playerCardIcon(data[index].playerCards[0])} </ListItemIcon>
        </ListItemButton>
        <ListItemButton dense sx={{ width: '2%' }}>
          <ListItemIcon>{playerCardIcon(data[index].playerCards[1])} </ListItemIcon>
        </ListItemButton>
        <ListItemText primary="infected" />
        <ListItemButton>
          <ListItemText primary="Kinshasa" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Essen" />
        </ListItemButton>
      </ListItem>
    </ListItem>
  )
}

export default function App (): globalThis.JSX.Element {
  const [state, setState] = React.useState<TState>({
    // Game Setup settings
    players: ['HP', 'CJ', 'MT', 'SK'],
    fundingLevel: 4,
    positionToPlayerId: [0, 1, 2, 3],

    // Game state
    history: [{ player_id: 0, playerCards: ['Red', 'Blue'], infectionCards: ['Atlanta', 'Chicago'] }, { player_id: 1, playerCards: ['Yellow', 'Epidemic'], infectionCards: ['Algiers', 'Osaka'] }]
  })
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pandemic Card Counter
        </Typography>
        <TextField
          label="Funding Level"
          variant="filled"
          type="number"
          InputLabelProps={{
            shrink: true
          }}
          value={state.fundingLevel}
          onChange={(event) =>
            setState((current: TState) => ({ ...current, fundingLevel: Number(event.target.value) }))
          }
        />
        <Typography variant="h5" component="h1" gutterBottom>
          Player Order
        </Typography>
        <BackgroundLetterAvatars players={state.players} positionToPlayerId={state.positionToPlayerId} setState={setState} />
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
        <h3> Game Log </h3>

        <Paper sx={{ width: '100%', height: 400, maxWidth: 600, bgcolor: 'background.paper' }} elevation={3}>
          <FixedSizeList
            height={400}
            width={600}
            itemSize={46}
            itemCount={state.history.length}
            overscanCount={10}
            itemData={state.history}
          >
            {renderHistory}
          </FixedSizeList>
        </Paper>
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
        <h3>(Debug) State</h3>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </Box >
    </Container >
  )
}

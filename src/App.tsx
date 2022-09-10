import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { playerCardIcon, TState } from './types'
import Link from '@mui/material/Link'
import DraggableAvatarStack from './components/DraggableAvatarStack'
import GameLog from './components/GameLog'
import InitialPlayerCardsLog from './components/InitialPlayerCards'
import InitialInfectionsLog from './components/InitialInfections'
import Paper from '@mui/material/Paper'
import { List, TextareaAutosize } from '@mui/material'
import { genHistoryRows } from './utils'
import Inferences from './components/Inferences'

export default class App extends React.Component<{}, TState> {
  state: TState = {
    // Game Setup settings
    players: ['HP', 'CJ', 'MT', 'SK'],
    playerColors: ['Blue', 'Black', 'White', 'Pink'],
    fundingLevel: 4,
    positionToPlayerId: [0, 1, 2, 3],
    initialPlayerCards: Array(4).fill(['_', '_']),
    initialInfections: Array(9).fill('_'),

    // Game state
    history: [],

    // debug
    textArea: ''
  }

  constructor (props: {}) {
    super(props)
    this.setState = this.setState.bind(this)
    this.state.history = genHistoryRows(this.state.fundingLevel, this.state.positionToPlayerId)
  }

  render (): React.ReactNode {
    return (
      <Container>
        <Box>
          <Typography variant="h5" component="h1" gutterBottom marginTop='1em'>
            Players:
          </Typography>
          <DraggableAvatarStack parentState={this.state} setParentState={this.setState} />
          <p></p>

          <Typography variant="h3" component="h3" gutterBottom>
            Game Setup
          </Typography>
          Follow the <Link href="https://www.boardgamebarrister.com/unboxing-pandemic-legacy/" target="_blank" rel="noopener">Legacy Season 1 setup guide </Link>:

          <Typography variant="h5" component="h1" gutterBottom marginTop='1em'>
            Step 4: Infect 9 cities
          </Typography>
          <Paper elevation={3}>
            <List>
              <InitialInfectionsLog parentState={this.state} setParentState={this.setState}></InitialInfectionsLog>
            </List>
          </Paper>

          <Typography variant="h5" component="h1" gutterBottom marginTop='1em'>
            Step 6: Add funded events to player deck and deal cards
          </Typography>
          <TextField
            label="Funding Level"
            variant="filled"
            type="number"
            InputLabelProps={{
              shrink: true
            }}
            value={this.state.fundingLevel}
            onChange={(event) =>
              this.setState((current: TState) =>
                ({
                  ...current,
                  fundingLevel: Number(event.target.value),
                  history: genHistoryRows(Number(event.target.value), this.state.positionToPlayerId)
                }))
            }
          />
          <p></p>
          Give two cards to each player. This page assumes 4 players. You
          should now have <b>40 cards</b>. Add funded events. Split into 5
          piles and add <span style={{ color: 'red' }}>Epidemic</span>{' '}
          cards.
          <p></p>
          Cards dealt:
          <Paper sx={{ width: '100%' }} elevation={3}>
            <List
              sx={{
                width: '100%',
                maxWidth: 600,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 300,
                '& ul': { padding: 0 }
              }}
            >
              <InitialPlayerCardsLog parentState={this.state} setParentState={this.setState}></InitialPlayerCardsLog>
            </List>
          </Paper>
          <p></p>
          The position by which epidemics MUST occur are:

          <Typography variant="h5" component="h1" gutterBottom marginTop='1em'>
            Step 10: Player Order
          </Typography>
          <p></p>
          Drag to reorder players
          <DraggableAvatarStack parentState={this.state} setParentState={this.setState} />

          <Typography variant="h5" component="h1" gutterBottom marginTop='1em'>Game Log</Typography>
          <Paper elevation={3}>
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 300,
                '& ul': { padding: 0 }
              }}
            >
              <GameLog parentState={this.state} setParentState={this.setState} />
            </List>
          </Paper>

          <Typography variant="h5" component="h1" gutterBottom marginTop='1em'> Inferences </Typography>
          <Inferences parentState={this.state}></Inferences>

          <Typography variant="h5" component="h1" gutterBottom marginTop='1em'> Glossary </Typography>
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
          <Typography variant="h5" component="h1" gutterBottom marginTop='1em'>(Debug) State</Typography>
          <Button onClick={() => {
            this.setState({
              ...this.state,
              textArea: JSON.stringify(this.state, null, 2)
            })
          }}>
            Dump state to Text Area</Button>
          <Button onClick={() => {
            this.setState({ ...JSON.parse(this.state.textArea), textArea: '' })
          }}>Set state (dangerously) from Text Area</Button>
          <p></p>
          <TextareaAutosize
            minRows={5}
            style={{ width: '100%' }}
            value={this.state.textArea}
            onChange={(event) => {
              this.setState({
                ...this.state,
                textArea: event.target.value
              })
            }}
          />
        </Box >
      </Container >
    )
  }
}

import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined'
import Box from '@mui/material/Box'
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
import { List } from '@mui/material'

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
    history: [
      { player_id: 0, playerCards: ['Red', 'Blue'], infectionCards: ['Atlanta', 'Chicago'] },
      { player_id: 1, playerCards: ['Yellow', 'Epidemic'], infectionCards: ['Algiers', 'Osaka', 'Kinshasa'] }
    ]
  }

  constructor (props: {}) {
    super(props)
    this.setState = this.setState.bind(this)
  }

  render (): React.ReactNode {
    return (
      <Container>
        <Box>
          <Typography variant="h5" component="h1" gutterBottom marginTop='1em'>
            Players:
          </Typography>
          <DraggableAvatarStack players={this.state.players} playerColors={this.state.playerColors} positionToPlayerId={this.state.positionToPlayerId} setState={this.setState} />
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
              this.setState((current: TState) => ({ ...current, fundingLevel: Number(event.target.value) }))
            }
          />
          <p></p>
          Give two cards to each player. This page assumes 4 players. You
          should now have <b>40 cards</b>. Add funded events. Split into 5
          piles and add <span style={{ color: 'red' }}>Epidemic</span>{' '}
          cards.
          <p></p>
          Cards dealt:
          <Paper sx={{ width: '100%', height: 400, maxWidth: 600, bgcolor: 'background.paper' }} elevation={3}>
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
          <DraggableAvatarStack players={this.state.players} playerColors={this.state.playerColors} positionToPlayerId={this.state.positionToPlayerId} setState={this.setState} />

          <Typography variant="h5" component="h1" gutterBottom marginTop='1em'>Game Log</Typography>
          <Paper sx={{ width: '100%', height: 400, maxWidth: 900, bgcolor: 'background.paper' }} elevation={3}>
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
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
        </Box >
      </Container >
    )
  }
}

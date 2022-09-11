import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import DraggableAvatarStack from './components/DraggableAvatarStack'
import GameLog from './components/GameLog'
import Inferences from './components/Inferences'
import InitialInfectionsLog from './components/InitialInfections'
import InitialPlayerCardsLog from './components/InitialPlayerCards'
import { cumSum } from './utils'
import { playerCardIcon, TPlayerCard, TPlayerMove, TState } from './types'

function pileNum (pileTransitions: number[], position: number): number {
  return pileTransitions.findIndex((n) => n > position)
}

function numInfectionCards (pileNum: number): number {
  if (pileNum === -1) {
    return 2
  } else {
    // infection cards: (< EP1) 2, (> EP1) 2, (> EP2) 2, (>EP3) 3, (> EP4) 3, (> EP5) 4
    const infectionArr = [2, 2, 3, 3, 4]
    return infectionArr[pileNum]
  }
}

export default class App extends React.Component<{}, TState> {
  totalPlayerCards: number = -1
  pileSizes: number[] = []
  pileTransitions: number[] = []

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
    this.state.history = this.regenerateGameLog()
  }

  componentDidUpdate (_prevProps: {}, prevState: TState): void {
    if (prevState.fundingLevel !== this.state.fundingLevel || prevState.positionToPlayerId !== this.state.positionToPlayerId) {
      this.setState({ ...this.state, history: this.regenerateGameLog() })
    }
  }

  regenerateGameLog (): TPlayerMove[] {
    // funded events + 48 city cards - 8 cards initially dealt to players + 5 epidemics
    this.totalPlayerCards = 45 + this.state.fundingLevel
    const remainder = this.totalPlayerCards % 5
    const minPileSize = Math.floor(this.totalPlayerCards / 5)
    this.pileSizes =
      (new Array<number>(remainder).fill(minPileSize + 1)).concat(
        (new Array<number>(5 - remainder).fill(minPileSize)))
    this.pileTransitions = cumSum(this.pileSizes)

    const numRounds = Math.ceil(this.totalPlayerCards / 2)
    const oldHistory = [...this.state.history]
    const newHistory = new Array(numRounds).fill(null).map((_, n) => {
      // TODO:make sure this is always right
      const numInfCards = numInfectionCards(
        pileNum(this.pileTransitions, n * 2))

      const getPlayerCards = (): TPlayerCard[] => {
        if (n === numRounds - 1 && this.totalPlayerCards % 2 === 1) {
          return [(n < oldHistory.length)
            ? oldHistory[n].playerCards[0]
            : '_'
          ]
        } else {
          return Array(2).fill('_').map((card, m) => (n < oldHistory.length)
            ? (oldHistory[n].playerCards[m] ?? card)
            : card)
        }
      }
      const playerCards = getPlayerCards()
      const infectionCards = Array(numInfCards).fill('_').map(
        (card, m) =>
          (n < oldHistory.length && m < oldHistory[n].infectionCards.length) ? oldHistory[n].infectionCards[m] : card
      )

      return {
        // If game log is being regenerate, we will rewrite who received the cards
        playerId: this.state.positionToPlayerId[n % 4],
        playerCards,
        infectionCards
      }
    })

    return newHistory
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
                  fundingLevel: Number(event.target.value)
                }))
            }
          />
          <p></p>
          Give two cards to each player. This page assumes 4 players. You
          should now have <b>{48 + this.state.fundingLevel} cards</b>. Add funded events. Split into 5
          piles of sizes {this.pileSizes.join(', ')} and add <span style={{ color: 'red' }}>Epidemic</span>{' '}
          cards.
          <p></p>
          Cards dealt:
          <Paper elevation={3}>
            <List
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
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
            <List dense
              sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 400,
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
          <Button variant="contained" onClick={() => {
            const newHistory = [...this.state.history]
            const toCopy = [
              { playerId: 0, playerCards: ['Red', 'Funded'], infectionCards: ['Milan', 'Khartoum'] },
              { playerId: 3, playerCards: ['Black', 'Yellow'], infectionCards: ['Sao Paulo', 'Manila'] },
              { playerId: 1, playerCards: ['Blue', 'Red'], infectionCards: ['Taipei', 'Istanbul'] },
              { playerId: 2, playerCards: ['Epidemic', 'Yellow'], infectionCards: ['Istanbul', 'Khartoum'] },
              { playerId: 0, playerCards: ['Blue', 'Blue'], infectionCards: ['St. Petersburg', 'Taipei'] },
              { playerId: 3, playerCards: ['Yellow', 'Red'], infectionCards: ['Kinshasa', 'Milan'] },
              { playerId: 1, playerCards: ['Epidemic', 'Funded'], infectionCards: ['Istanbul', 'Taipei'] },
              { playerId: 2, playerCards: ['Red', 'Black'], infectionCards: ['Kinshasa', 'Khartoum'] }
            ] as TPlayerMove[]
            toCopy.forEach((move, i) => {
              newHistory[i] = toCopy[i]
            })
            this.setState({
              ...this.state,
              fundingLevel: 4,
              positionToPlayerId: [0, 3, 1, 2],
              initialPlayerCards: [['Black', 'Black'], ['Yellow', 'Blue'], ['Funded', 'Black'], ['Red', 'Black']],
              initialInfections: ['Paris', 'Kinshasa', 'London', 'Osaka', 'Cairo', 'Riyadh', 'Delhi', 'St. Petersburg', 'Bogota'],
              history: newHistory
            })
          }}>Load Test State</Button>
          <p></p>
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

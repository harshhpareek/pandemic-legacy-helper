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
import { useState } from 'react'
import DraggableAvatarStack from './components/DraggableAvatarStack'
import GameLog from './components/GameLog'
import Inferences from './components/Inferences'
import InitialInfectionsLog from './components/InitialInfections'
import InitialPlayerCardsLog from './components/InitialPlayerCards'
import { cumSum } from './utils'
import { playerCardIcon, TPlayerCard, TGameLogRow, TGameSetup, TGameLog } from './types'

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

function regenerateGameLog (fundingLevel: number, positionToPlayerId: number[], oldGameLog?: TGameLog): {
  totalPlayerCards: number
  pileSizes: number[]
  generatedGameLog: TGameLog
} {
  // funded events + 48 city cards - 8 cards initially dealt to players + 5 epidemics
  const totalPlayerCards = 45 + fundingLevel
  const remainder = totalPlayerCards % 5
  const minPileSize = Math.floor(totalPlayerCards / 5)
  const pileSizes =
    (new Array<number>(remainder).fill(minPileSize + 1)).concat(
      (new Array<number>(5 - remainder).fill(minPileSize)))
  const pileTransitions = cumSum(pileSizes)

  const numRounds = Math.ceil(totalPlayerCards / 2)
  // const oldHistory = [...this.state.history]
  const generatedGameLog = new Array(numRounds).fill(null).map((_, n) => {
    // TODO:make sure this is always right
    const numInfCards = numInfectionCards(
      pileNum(pileTransitions, n * 2))

    const getPlayerCards = (): TPlayerCard[] => {
      if (n === numRounds - 1 && totalPlayerCards % 2 === 1) {
        return [((oldGameLog != null) && n < oldGameLog.length)
          ? oldGameLog[n].playerCards[0]
          : '_'
        ]
      } else {
        return Array(2).fill('_').map((card, m) => ((oldGameLog != null) && n < oldGameLog.length)
          ? (oldGameLog[n].playerCards[m] ?? card)
          : card)
      }
    }
    const playerCards = getPlayerCards()
    const infectionCards = Array(numInfCards).fill('_').map(
      (card, m) =>
        ((oldGameLog != null) && n < oldGameLog.length && m < oldGameLog[n].infectionCards.length) ? oldGameLog[n].infectionCards[m] : card
    )

    const newGameLogRow: TGameLogRow = {
      playerId: positionToPlayerId[n % 4],
      playerCards,
      infectionCards
    }
    return newGameLogRow
  })

  return {
    totalPlayerCards,
    pileSizes,
    generatedGameLog
  }
}

export default function App (): JSX.Element {
  const [setup, setSetup] = useState<TGameSetup>({
    // Game Setup settings
    players: ['HP', 'CJ', 'MT', 'SK'],
    playerColors: ['Blue', 'Black', 'White', 'Pink'],
    fundingLevel: 4,
    positionToPlayerId: [0, 1, 2, 3],
    initialPlayerCards: Array(4).fill(['_', '_']),
    initialInfections: Array(9).fill('_')
  })
  const [debugTextArea, setDebugTextArea] = useState<string>('')

  const { totalPlayerCards, pileSizes, generatedGameLog } = regenerateGameLog(setup.fundingLevel, setup.positionToPlayerId)
  const [gameLog, setGameLog] = useState<TGameLog>(generatedGameLog)

  // componentDidUpdate (_prevProps: {}, prevState: TState): void {
  //   if (this.state.isWaiting) {
  //     return
  //   }
  //   if (prevState.fundingLevel !== this.state.fundingLevel || prevState.positionToPlayerId !== this.state.positionToPlayerId || prevState.isWaiting !== this.state.isWaiting) {
  //     this.setState({ ...this.state, history: this.regenerateGameLog() })
  //   }
  // }

  return (
    <Container>
      <Box>
        <Typography variant="h5" component="h1" gutterBottom marginTop='1em'>
          Players:
        </Typography>
        <DraggableAvatarStack parentState={setup} setParentState={setSetup} />
        <p></p>

        <Typography variant="h3" component="h3" gutterBottom>
          Game Setup
        </Typography>
        Follow the <Link href="https://www.boardgamebarrister.com/unboxing-pandemic-legacy/" target="_blank" rel="noopener">Legacy Season 1 setup guide </Link>:

        <Typography variant="h5" component="h1" gutterBottom marginTop='1em'>
          Step 4: Infect 9 cities
        </Typography>
        <Paper sx={{ maxWidth: 360 }} elevation={3}>
          <List sx={{
            maxWidth: 360,
            position: 'relative',
            overflow: 'auto',
            maxHeight: 400,
            '& ul': { padding: 0 }
          }}>
            <InitialInfectionsLog parentState={setup} setParentState={setSetup}></InitialInfectionsLog>
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
          value={setup.fundingLevel}
          onChange={(event) =>
            setSetup(
              {
                ...setup,
                fundingLevel: Number(event.target.value)
              })
          }
        />
        <p></p>
        Give two cards to each player. This page assumes 4 players. You
        should now have <b>{totalPlayerCards} cards</b>. Add funded events. Split into 5
        piles of sizes {pileSizes.join(', ')} and add <span style={{ color: 'red' }}>Epidemic</span>{' '}
        cards.
        <p></p>
        Cards dealt:
        <Paper sx={{ maxWidth: 360 }} elevation={3}>
          <List
            sx={{
              maxWidth: 360,
              position: 'relative',
              overflow: 'auto',
              '& ul': { padding: 0 }
            }}
          >
            <InitialPlayerCardsLog parentState={setup} setParentState={setSetup}></InitialPlayerCardsLog>
          </List>
        </Paper>
        <p></p>
        The position by which epidemics MUST occur are:

        <Typography variant="h5" component="h1" gutterBottom marginTop='1em'>
          Step 10: Player Order
        </Typography>
        <p></p>
        Drag to reorder players
        <DraggableAvatarStack parentState={setup} setParentState={setSetup} />

        <Typography variant="h5" component="h1" gutterBottom marginTop='1em'>Game Log</Typography>
        <Paper sx={{ maxWidth: 360 }} elevation={3}>
          <List dense
            sx={{
              maxWidth: 360,
              position: 'relative',
              overflow: 'auto',
              maxHeight: 400,
              '& ul': { padding: 0 }
            }}
          >
            <GameLog parentState={setup} setParentState={setSetup} gameLog={gameLog} setGameLog={setGameLog}/>
          </List>
        </Paper>

        <Typography variant="h5" component="h1" gutterBottom marginTop='1em'> Inferences </Typography>
        <Inferences parentState={setup} gameLog={gameLog}></Inferences>

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
          setSetup({
            ...setup,
            fundingLevel: 4,
            positionToPlayerId: [0, 3, 1, 2],
            initialPlayerCards: [['Black', 'Black'], ['Yellow', 'Blue'], ['Funded', 'Black'], ['Red', 'Black']],
            initialInfections: ['Paris', 'Kinshasa', 'London', 'Osaka', 'Cairo', 'Riyadh', 'Delhi', 'St. Petersburg', 'Bogota']
          })

          const newGameLog = [...gameLog]
          const toCopy = [
            { playerId: 0, playerCards: ['Red', 'Funded'], infectionCards: ['Milan', 'Khartoum'] },
            { playerId: 3, playerCards: ['Black', 'Yellow'], infectionCards: ['Sao Paulo', 'Manila'] },
            { playerId: 1, playerCards: ['Blue', 'Red'], infectionCards: ['Taipei', 'Istanbul'] },
            { playerId: 2, playerCards: ['Epidemic', 'Yellow'], infectionCards: ['Istanbul', 'Khartoum'] },
            { playerId: 0, playerCards: ['Blue', 'Blue'], infectionCards: ['St. Petersburg', 'Taipei'] },
            { playerId: 3, playerCards: ['Yellow', 'Red'], infectionCards: ['Kinshasa', 'Milan'] },
            { playerId: 1, playerCards: ['Epidemic', 'Funded'], infectionCards: ['Istanbul', 'Taipei'] },
            { playerId: 2, playerCards: ['Red', 'Black'], infectionCards: ['Kinshasa', 'Khartoum'] }
          ] as TGameLog
          toCopy.forEach((move, i) => {
            newGameLog[i] = toCopy[i]
          })
          setGameLog(newGameLog)
        }}>Load Test State</Button>
        <p></p>
        <Button onClick={() => {
          setDebugTextArea(JSON.stringify(setup, null, 2))
        }}>
          Dump state to Text Area</Button>
        <Button onClick={() => {
          setSetup(JSON.parse(debugTextArea))
        }}>Set state (dangerously) from Text Area</Button>
        <p></p>
        <TextareaAutosize
          minRows={5}
          style={{ width: '100%' }}
          value={debugTextArea}
          onChange={(event) =>
            setDebugTextArea(
              event.target.value)
          }
        />
      </Box >
    </Container >
  )
}

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
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, child, get, onValue } from 'firebase/database'

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

function genGameLog (fundingLevel: number, positionToPlayerId: number[], oldGameLog?: TGameLog): TGameLog {
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

  return generatedGameLog
}

interface TLastUpdatedTextProps {
  lastUpdatedByUser: string
  lastUpdatedTimestamp: number
}
function LastUpdatedText (props: TLastUpdatedTextProps): JSX.Element {
  return <p><small><i>
    Last updated by: {props.lastUpdatedByUser} at {props.lastUpdatedTimestamp > 0 ? (new Date(props.lastUpdatedTimestamp)).toLocaleString() : ''}
  </i></small></p>
}

export default function App (): JSX.Element {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: 'pandemic-legacy-helper.firebaseapp.com',
    projectId: 'pandemic-legacy-helper',
    storageBucket: 'pandemic-legacy-helper.appspot.com',
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    databaseURL: 'https://pandemic-legacy-helper-default-rtdb.firebaseio.com/'
  }
  const app = initializeApp(firebaseConfig)
  const db = getDatabase(app)

  const [key, setKey] = useState('')
  const [user, setUser] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  const [setup, setSetup] = useState<TGameSetup>({
    // Game Setup settings
    players: ['HP', 'CJ', 'MT', 'SK'],
    playerColors: ['Blue', 'Black', 'White', 'Pink'],
    fundingLevel: 4,
    positionToPlayerId: [0, 1, 2, 3],
    initialPlayerCards: Array(4).fill(['_', '_']),
    initialInfections: Array(9).fill('_')
  })
  const [gameLog, setGameLog] = useState<TGameLog>(genGameLog(4, [0, 1, 2, 3]))

  // Timestamp represents last manual action. Automatic state updates don't update timestamp
  const [timestamp, setTimestamp] = useState(0)
  const [lastUpdatedByUser, setLastUpdatedByUser] = useState('')
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState(0)
  function setSetupWithTimestamp (setup: React.SetStateAction<TGameSetup>): void {
    setTimestamp(Date.now())
    setSetup(setup)
  }
  function setGameLogWithTimestamp (gameLog: React.SetStateAction<TGameLog>): void {
    setTimestamp(Date.now())
    setGameLog(gameLog)
  }

  React.useEffect(() => {
    // Write state only if there is a user-generated change
    if (timestamp > 0 && timestamp > lastUpdatedTimestamp) {
      set(ref(db, 'state/' + key), { setup, gameLog, user, timestamp }).then((value) => {
        console.log('Write succeeded! for', timestamp)
      }).catch((reason) => {
        alert('Write failed! ' + JSON.stringify(reason))
      })
    }
  }, [setup, gameLog])

  React.useEffect(() => {
    onValue(ref(db, 'state/' + key), (snapshot) => {
      if (snapshot.exists()) {
        if (snapshot.val().user !== null && snapshot.val().user !== undefined) {
          if (snapshot.val().user !== lastUpdatedByUser && snapshot.val().timestamp !== lastUpdatedTimestamp) {
            console.log('Updating state to ' + String(snapshot.val().user) + 'at ' + String(snapshot.val().timestamp))
            setSetup(snapshot.val().setup)
            setGameLog(snapshot.val().gameLog)
            setLastUpdatedByUser(snapshot.val().user)
            setLastUpdatedTimestamp(snapshot.val().timestamp)
          }
        }
      } else {
        alert('Database read called without a snapshot')
      }
    })
  }, [lastUpdatedTimestamp])

  const totalPlayerCards = 0
  const pileSizes: number[] = []

  // iPhone X dimensions are 375x812 px
  return (
    <Container>
      <Box sx={{ maxWidth: 370 }}>
        <p></p>
        <TextField label="Game Code" value={key} onChange={(event) => setKey(event.target.value)} />
        <p></p>
        <TextField label="User" value={user} onChange={(event) => setUser(event.target.value)} />
        <p></p>
        <Button variant="contained" onClick={() => {
          if (key === '' || user === '') {
            alert('Enter something pls fren')
          } else {
            get(child(ref(db), `state/${key}`)).then((snapshot) => {
              if (snapshot.exists()) {
                const loadedSetup: TGameSetup = snapshot.val().setup
                setSetup(loadedSetup)
                const loadedGameLog: TGameLog = snapshot.val().gameLog
                setGameLog(loadedGameLog)
                const lastUpdatedByUser: string = snapshot.val().user
                setLastUpdatedByUser(lastUpdatedByUser)
                const lastUpdatedTimestamp: number = snapshot.val().timestamp
                setLastUpdatedTimestamp(lastUpdatedTimestamp)
              } else {
                // This is a new game. This is fine. A new key will be uploaded on next user interaction.
              }
              // XXX: Should actually be set true after setState is finished, but its probably not going to be noticeable
              setIsLoaded(true)
            }).catch((error) => {
              alert(error)
              console.error(error)
            })
          }
        }}>Connect</Button>
        <LastUpdatedText lastUpdatedByUser={lastUpdatedByUser} lastUpdatedTimestamp={lastUpdatedTimestamp} />

        {isLoaded &&
          (<><Typography variant="h5" component="h1" gutterBottom marginTop='1em'>
            Players:
          </Typography>
            <DraggableAvatarStack parentState={setup} setParentState={setSetupWithTimestamp} regenGameLog={(newPositionToPlayerId: number[]) => setGameLog(genGameLog(
              setup.fundingLevel, newPositionToPlayerId, gameLog
            ))} />
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
                <InitialInfectionsLog parentState={setup} setParentState={setSetupWithTimestamp}></InitialInfectionsLog>
              </List>
            </Paper>
            <LastUpdatedText lastUpdatedByUser={lastUpdatedByUser} lastUpdatedTimestamp={lastUpdatedTimestamp} />

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
              onChange={(event) => {
                setSetup(
                  {
                    ...setup,
                    fundingLevel: Number(event.target.value)
                  })
                setGameLog(genGameLog(
                  Number(event.target.value), setup.positionToPlayerId, gameLog
                ))
              }
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
                <InitialPlayerCardsLog minWidth={60} parentState={setup} setParentState={setSetupWithTimestamp}></InitialPlayerCardsLog>
              </List>
            </Paper>
            <LastUpdatedText lastUpdatedByUser={lastUpdatedByUser} lastUpdatedTimestamp={lastUpdatedTimestamp} />
            <p></p>
            The position by which epidemics MUST occur are:

            <Typography variant="h5" component="h1" gutterBottom marginTop='1em'>
              Step 10: Player Order
            </Typography>
            <p></p>
            Drag to reorder players
            <DraggableAvatarStack parentState={setup} setParentState={setSetupWithTimestamp} regenGameLog={(newPositionToPlayerId: number[]) => setGameLog(genGameLog(
              setup.fundingLevel, newPositionToPlayerId, gameLog
            ))} />

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
                <GameLog minWidth={60} parentState={setup} setParentState={setSetupWithTimestamp} gameLog={gameLog} setGameLog={setGameLogWithTimestamp} />
              </List>
            </Paper>
            <LastUpdatedText lastUpdatedByUser={lastUpdatedByUser} lastUpdatedTimestamp={lastUpdatedTimestamp} />

            <Typography variant="h5" component="h1" gutterBottom marginTop='1em'> Inferences </Typography>
            <Inferences parentState={setup} gameLog={gameLog}></Inferences>

            <Typography variant="h5" component="h1" gutterBottom marginTop='1em'> Glossary </Typography>
            <Glossary />

            <Typography variant="h5" component="h1" gutterBottom marginTop='1em'>(Debug) State</Typography>
            <Debug setup={setup} setSetup={setSetup} gameLog={gameLog} setGameLog={setGameLog} />
          </>
          )}
      </Box >
    </Container >
  )
}

function Glossary (): JSX.Element {
  return (<>
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
    </ul></>)
}

interface TDebugProps {
  setup: TGameSetup
  setSetup: React.Dispatch<React.SetStateAction<TGameSetup>>
  gameLog: TGameLog
  setGameLog: React.Dispatch<React.SetStateAction<TGameLog>>
}

function Debug ({ setup, setSetup, gameLog, setGameLog }: TDebugProps): JSX.Element {
  const [debugTextArea, setDebugTextArea] = useState<string>('')

  return (
    <>
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
    </>
  )
}

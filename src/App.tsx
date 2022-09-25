import MoreVertIcon from '@mui/icons-material/MoreVert'
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import TextField from '@mui/material/TextField'
import { Typography as T } from '@mui/material'
import * as React from 'react'
import { useState } from 'react'
import DraggableAvatarStack from './components/DraggableAvatarStack'
import GameLog from './components/GameLog'
import Inferences from './components/Inferences'
import InitialInfectionsLog from './components/InitialInfections'
import InitialPlayerCardsLog from './components/InitialPlayerCards'
import { playerCardIcon, TGameSetup, TGameLog } from './types'
import { initializeApp } from 'firebase/app'
import { genGameLog, getPlayerDeckSetup } from './utils'
import { getDatabase, ref, set, child, get, onValue } from 'firebase/database'
import LastUpdatedText from './components/LastUpdatedText'
import Divider from '@mui/material/Divider'

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
  const [isDebug] = useState(false)

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

  const { totalPlayerCards, pileSizes } = getPlayerDeckSetup(setup.fundingLevel)

  return (
    <Container>
      <Box>
        <TextField disabled={isLoaded} label="Game Code" value={key} onChange={(event) => setKey(event.target.value.trim())} />
        <TextField disabled={isLoaded} label="User" value={user} onChange={(event) => setUser(event.target.value.trim())} />
        <Button onClick={() => {
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
        <T></T>
        <LastUpdatedText lastUpdatedByUser={lastUpdatedByUser} lastUpdatedTimestamp={lastUpdatedTimestamp} />

        <Divider variant="middle" sx={{ mt: 2 }} />

        {isLoaded &&
          (<>
            <T variant="h5"> Players: </T>
            <DraggableAvatarStack parentState={setup} setParentState={setSetupWithTimestamp} regenGameLog={(newPositionToPlayerId: number[]) => setGameLog(genGameLog(
              setup.fundingLevel, newPositionToPlayerId, gameLog
            ))} />

            <T variant="h3"> Game Setup </T>
            Follow the <Link href="https://www.boardgamebarrister.com/unboxing-pandemic-legacy/" target="_blank" rel="noopener">Legacy Season 1 setup guide </Link>:

            <T variant="h5">Step 4: Infect 9 cities</T>
            <Paper>
              <List>
                <InitialInfectionsLog parentState={setup} setParentState={setSetupWithTimestamp}></InitialInfectionsLog>
              </List>
            </Paper>
            <LastUpdatedText lastUpdatedByUser={lastUpdatedByUser} lastUpdatedTimestamp={lastUpdatedTimestamp} />

            <T variant="h5">Step 6: Add funded events to player deck and deal cards</T>
            <TextField
              label="Funding Level"
              type="number"
              value={setup.fundingLevel}
              onChange={(event) => {
                setSetup({ ...setup, fundingLevel: Number(event.target.value) })
                setGameLog(genGameLog(Number(event.target.value), setup.positionToPlayerId, gameLog))
              }
              }
            />

            Adding funded events, you should have <b>{48 + setup.fundingLevel} </b> player cards (= funding level + 48 city cards, 12 of each color). Deal two cards to each player. (This page assumes 4 players)

            Cards dealt:
            <Paper>
              <List>
                <InitialPlayerCardsLog minWidth={60} parentState={setup} setParentState={setSetupWithTimestamp} />
              </List>
            </Paper>
            <LastUpdatedText lastUpdatedByUser={lastUpdatedByUser} lastUpdatedTimestamp={lastUpdatedTimestamp} />

            Split the remaining {totalPlayerCards - 5} cards into 5
            piles of sizes {pileSizes.map(n => (n - 1)).join(', ')}. Add one <span style={{ color: 'red' }}>Epidemic</span>{' '}
            card to each.

            <T variant="h5"> Step 10: Player Order </T>

            Drag to reorder players
            <DraggableAvatarStack parentState={setup} setParentState={setSetupWithTimestamp} regenGameLog={(newPositionToPlayerId: number[]) => setGameLog(genGameLog(
              setup.fundingLevel, newPositionToPlayerId, gameLog
            ))} />

            <T variant="h5"> Game Log </T>
            <Paper>
              <List>
                <GameLog minWidth={60} parentState={setup} setParentState={setSetupWithTimestamp} gameLog={gameLog} setGameLog={setGameLogWithTimestamp} showPositions />
              </List>
            </Paper>
            <LastUpdatedText lastUpdatedByUser={lastUpdatedByUser} lastUpdatedTimestamp={lastUpdatedTimestamp} />

            <T variant="h5"> Inferences </T>
            <Inferences parentState={setup} gameLog={gameLog} isDebug={isDebug}></Inferences>

            <T variant="h5"> Glossary </T>
            <Glossary />

            <T variant="h5"> (Debug) State </T>
            <Debug setup={setup} setSetup={setSetup} gameLog={gameLog} setGameLog={setGameLog} />
          </>
          )}
      </Box>
    </Container>
  )
}

function Glossary (): JSX.Element {
  return (<>
    <ul>
      <li> <MoreVertIcon />: End of a pile in the Player deck </li>
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
      <Button onClick={() => {
        setSetup({
          ...setup,
          fundingLevel: 4,
          positionToPlayerId: [0, 3, 1, 2],
          initialPlayerCards: [['Black', 'Black'], ['Yellow', 'Blue'], ['Funded', 'Black'], ['Red', 'Black']],
          initialInfections: ['Paris', 'Kinshasa', 'London', 'Osaka', 'Cairo', 'Riyadh', 'Delhi', 'St. Petersburg', 'Bogota']
        })

        const newGameLog = [...gameLog]
        const toCopy = [
          { playerId: 0, playerCards: ['Red', 'Funded'], infectionCards: ['Milan', 'Khartoum'], epidemicInfectStepCard: '_' },
          { playerId: 3, playerCards: ['Black', 'Yellow'], infectionCards: ['Sao Paulo', 'Manila'], epidemicInfectStepCard: '_' },
          { playerId: 1, playerCards: ['Blue', 'Red'], infectionCards: ['Taipei', 'Istanbul'], epidemicInfectStepCard: '_' },
          { playerId: 2, playerCards: ['Epidemic', 'Yellow'], infectionCards: ['Istanbul', 'Khartoum'], epidemicInfectStepCard: 'Essen' },
          { playerId: 0, playerCards: ['Blue', 'Blue'], infectionCards: ['St. Petersburg', 'Taipei'], epidemicInfectStepCard: '_' },
          { playerId: 3, playerCards: ['Yellow', 'Red'], infectionCards: ['Kinshasa', 'Milan'], epidemicInfectStepCard: '_' },
          { playerId: 1, playerCards: ['Epidemic', 'Funded'], infectionCards: ['Istanbul', 'Taipei'], epidemicInfectStepCard: 'Santiago' },
          { playerId: 2, playerCards: ['Red', 'Black'], infectionCards: ['Kinshasa', 'Khartoum'], epidemicInfectStepCard: '_' }
        ] as TGameLog
        toCopy.forEach((move, i) => {
          newGameLog[i] = toCopy[i]
        })
        setGameLog(newGameLog)
      }}>Load Test State</Button>

      <Button onClick={() => { setDebugTextArea(JSON.stringify(setup, null, 2)) }}>
        Dump state to Text Area
      </Button>
      <TextareaAutosize
        minRows={5}
        style={{ width: '100%' }}
        value={debugTextArea}
        onChange={(event) =>
          setDebugTextArea(
            event.target.value)
        }
      />
      <Button onClick={() => { setSetup(JSON.parse(debugTextArea)) }}>
        Set state (dangerously) from Text Area
      </Button>

    </>
  )
}

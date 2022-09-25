import * as React from 'react'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, child, get, onValue } from 'firebase/database'
import { TGameLog, TGameSetup } from '../types'

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

export function firebaseDB (): any {
  const app = initializeApp(firebaseConfig)
  const db = getDatabase(app)
  return db
}

export function firebaseWrite (key: string, setup: TGameSetup, gameLog: TGameLog, user: string, timestamp: number): void {
  set(ref(firebaseDB(), 'state/' + key), { setup, gameLog, user, timestamp }).then((value) => {
    console.log('Write succeeded! for', timestamp)
  }).catch((reason) => {
    alert('Write failed! ' + JSON.stringify(reason))
  })
}

export function firebaseStateUpdate (key: string, lastUpdatedByUser: string, lastUpdatedTimestamp: number, setSetup: React.Dispatch<React.SetStateAction<TGameSetup>>, setGameLog: React.Dispatch<React.SetStateAction<TGameLog>>, setLastUpdatedByUser: React.Dispatch<React.SetStateAction<string>>, setLastUpdatedTimestamp: React.Dispatch<React.SetStateAction<number>>): void {
  onValue(ref(firebaseDB(), 'state/' + key), (snapshot) => {
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
}

export function firebaseManualGet (key: string, setSetup: React.Dispatch<React.SetStateAction<TGameSetup>>, setGameLog: React.Dispatch<React.SetStateAction<TGameLog>>, setLastUpdatedByUser: React.Dispatch<React.SetStateAction<string>>, setLastUpdatedTimestamp: React.Dispatch<React.SetStateAction<number>>, setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>): void {
  get(child(ref(firebaseDB()), `state/${key}`)).then((snapshot) => {
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

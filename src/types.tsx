
import * as React from 'react'
import { mdiBiohazard } from '@mdi/js'
import Icon from '@mdi/react'
import CoronavirusOutlinedIcon from '@mui/icons-material/CoronavirusOutlined'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin'
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined'

import { grey, pink, indigo } from '@mui/material/colors'

export interface TState {
  // Game Setup settings
  players: string[]
  playerColors: TPawnColor[]
  fundingLevel: number
  positionToPlayerId: number[]
  initialPlayerCards: Array<[TPlayerCard, TPlayerCard]>
  initialInfections: TInfectionCard[]
  // Game State
  history: TPlayerMove[]
}

export type TPawnColor = 'Blue' | 'Pink' | 'White' | 'Black'

export function pawnColor (color: TPawnColor): string {
  switch (color) {
    case 'Blue':
      return indigo[400]
    case 'Pink':
      return pink[400]
    case 'White':
      return grey[300]
    case 'Black':
      return grey[800]
  }
}

// For the player deck, we will not track individual player cards, just the colour
const PlayerCardTypes = ['_', 'Epidemic', 'Black', 'Yellow', 'Blue', 'Red', 'Funded']
export type TPlayerCard = typeof PlayerCardTypes[number]

// For the Infection Deck, we will track each card
const BlueCities = ['Atlanta', 'Chicago', 'Essen', 'London', 'Madrid', 'Milan', 'Montreal', 'New York', 'Paris', 'San Francisco', 'St. Petersburg', 'Washington'] as const
const BlackCities = ['Algiers', 'Baghdad', 'Cairo', 'Chennai', 'Delhi', 'Istanbul', 'Karachi', 'Kolkata', 'Moscow', 'Mumbai', 'Riyadh', 'Tehran'] as const
const YellowCities = ['Bogota', 'Buenos Aries', 'Johannesburg', 'Khartoum', 'Kinshasa', 'Lagos', 'Lima', 'Los Angeles', 'Mexico City', 'Miami', 'Santiago', 'Sao Paulo'] as const
const RedCities = ['Bangkok', 'Beijing', 'Ho Chi Minh City', 'Hong Kong', 'Jakarta', 'Manila', 'Osaka', 'Seoul', 'Shanghai', 'Sydney', 'Taipei', 'Tokyo'] as const

export type TBlueInfectionCard = typeof BlueCities[number]
export type TBlackInfectionCard = typeof BlackCities[number]
export type TYellowInfectionCard = typeof YellowCities[number]
export type TRedInfectionCard = typeof RedCities[number]
export type TInfectionCard = '_' | TBlueInfectionCard | TBlackInfectionCard | TYellowInfectionCard | TRedInfectionCard

export function infectionCardColor (card: TInfectionCard): string {
  if (BlueCities.find((city) => card === city) !== undefined) {
    console.log('blue')
    return 'blue'
  }
  if (BlackCities.find((city) => card === city) !== undefined) {
    return 'black'
  }
  if (YellowCities.find((city) => card === city) !== undefined) {
    return 'orange'
  }
  if (RedCities.find((city) => card === city) !== undefined) {
    return 'red'
  }
  return 'black'
}

export interface TPlayerMove { player_id: number, playerCards: [TPlayerCard, TPlayerCard], infectionCards: TInfectionCard[] }

export function playerCardIcon (card: TPlayerCard): JSX.Element {
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
  // Should never happen
  return <IndeterminateCheckBoxOutlinedIcon />
}

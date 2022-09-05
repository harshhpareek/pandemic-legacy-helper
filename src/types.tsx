
import * as React from 'react'
import { mdiBiohazard } from '@mdi/js'
import Icon from '@mdi/react'
import CoronavirusOutlinedIcon from '@mui/icons-material/CoronavirusOutlined'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin'
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined'

export interface TState {
  // Game Setup settings
  players: string[]
  fundingLevel: number
  positionToPlayerId: number[]
  // Game State
  history: TPlayerMove[]
}

// For the player deck, we will not track individual player cards, just the colour
export type TPlayerCard = '_' | 'Epidemic' | 'Black' | 'Yellow' | 'Blue' | 'Red' | 'Funded'

// For the Infection Deck, we will track each card
export type TBlueInfectionCard = 'Atlanta' | 'Chicago' | 'Essen' | 'London' | 'Madrid' | 'Milan' | 'Montreal' | 'New York' | 'Paris' | 'San Francisco' | 'St. Petersburg' | 'Washington'
export type TBlackInfectionCard = 'Algiers' | 'Baghdad' | 'Cairo' | 'Chennai' | 'Delhi' | 'Istanbul' | 'Karachi' | 'Kolkata' | 'Moscow' | 'Mumbai' | 'Riyadh' | 'Tehran'
export type TYellowInfectionCard = 'Bogota' | 'Buenos Aries' | 'Johannesburg' | 'Khartoum' | 'Kinshasa' | 'Lagos' | 'Lima' | 'Los Angeles' | 'Mexico City' | 'Miami' | 'Santiago' | 'Sao Paulo'
export type TRedInfectionCard = 'Bangkok' | 'Beijing' | 'Ho Chi Minh City' | 'Hong Kong' | 'Jakarta' | 'Manila' | 'Osaka' | 'Seoul' | 'Shanghai' | 'Sydney' | 'Taipei' | 'Tokyo'
export type TInfectionCard = TBlueInfectionCard | TBlackInfectionCard | TYellowInfectionCard | TRedInfectionCard

export interface TPlayerMove {player_id: number, playerCards: [TPlayerCard, TPlayerCard], infectionCards: TInfectionCard[]}

export function playerCardIcon (card: TPlayerCard): globalThis.JSX.Element {
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

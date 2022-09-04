export interface TState {
  // Game Setup settings
  player0Name: string
  player1Name: string
  player2Name: string
  player3Name: string
  fundingLevel: number
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

export type TPlayerMove = [playerCards: [TPlayerCard, TPlayerCard], infectionCards: TInfectionCard[]]

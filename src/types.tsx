export interface TState {
  // Game Setup settings
  player0Name: string
  player1Name: string
  player2Name: string
  player3Name: string
  fundingLevel: 2
}

// For the player deck, we will not track individual player cards, just the colour
export type TPlayerCard = '_' | 'Epidemic' | 'Black' | 'Yellow' | 'Blue' | 'Red' | 'Funded'

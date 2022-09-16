import { TPlayerCard, TGameLogRow, TGameLog } from './types'

export function cumSum (arr: number[]): number[] {
  const newArr = new Array<number>(arr.length)
  arr.reduce((prev, curr, i) => (newArr[i] = prev + curr), 0)
  return newArr
}

export function pileNum (pileTransitions: number[], position: number): number {
  return pileTransitions.findIndex((n) => n > position)
}

export function numInfectionCards (pileNum: number): number {
  if (pileNum === -1) {
    return 2
  } else {
    // infection cards: (< EP1) 2, (> EP1) 2, (> EP2) 2, (>EP3) 3, (> EP4) 3, (> EP5) 4
    const infectionArr = [2, 2, 3, 3, 4]
    return infectionArr[pileNum]
  }
}

export function getPlayerDeckSetup (fundingLevel: number): {
  totalPlayerCards: number
  pileSizes: number[]
  pileTransitions: number[]
} {
  // funded events + (48 city cards - 8 cards initially dealt to players + 5 epidemics = ) 45
  const totalPlayerCards = fundingLevel + 45
  const remainder = totalPlayerCards % 5
  const minPileSize = Math.floor(totalPlayerCards / 5)
  // Largest sizes go first according to rules
  const pileSizes =
    (new Array<number>(remainder).fill(minPileSize + 1)).concat(
      (new Array<number>(5 - remainder).fill(minPileSize)))
  const pileTransitions = cumSum(pileSizes).map(n => n - 1)
  return { totalPlayerCards, pileSizes, pileTransitions }
}

export function genGameLog (fundingLevel: number, positionToPlayerId: number[], oldGameLog?: TGameLog): TGameLog {
  const { totalPlayerCards } = getPlayerDeckSetup(fundingLevel)

  const numRounds = Math.ceil(totalPlayerCards / 2)
  // const oldHistory = [...this.state.history]
  const generatedGameLog = new Array(numRounds).fill(null).map((_, n) => {
    // TODO: Finetune this
    // const numInfCards = numInfectionCards(pileNum(pileTransitions, n * 2))
    const numInfCards = 4

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

export function EpidemicProbability (cardsLeftInPile: number): number {
  return Math.round(10000 / cardsLeftInPile) * 0.01
}

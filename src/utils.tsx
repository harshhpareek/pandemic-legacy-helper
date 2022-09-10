import { TPlayerCard, TPlayerMove } from './types'

export function cumSum (arr: number[]): number[] {
  const newArr = new Array<number>(arr.length)
  arr.reduce((prev, curr, i) => (newArr[i] = prev + curr), 0)
  return newArr
}
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

export function genHistoryRows (fundingLevel: number, positionToPlayerId: number[]): TPlayerMove[] {
  // funded events + 48 city cards - 8 cards initially dealt to players + 5 epidemics
  const totalPlayerCards = 45 + fundingLevel
  const remainder = totalPlayerCards % 5
  const minPileSize = Math.floor(totalPlayerCards / 5)
  const pileSizes =
    (new Array<number>(remainder).fill(minPileSize + 1)).concat(
      (new Array<number>(5 - remainder).fill(minPileSize)))
  const pileTransitions = cumSum(pileSizes)
  const numRounds = Math.ceil(totalPlayerCards / 2)

  const newHistory = new Array(numRounds).fill(null).map((_, n) => {
    const numInfCards = numInfectionCards(pileNum(pileTransitions, n * 2))
    return {
      playerId: positionToPlayerId[n % 4],
      playerCards: (n === numRounds - 1 && totalPlayerCards % 2 === 1)
        ? ['_' as TPlayerCard]
        : ['_' as TPlayerCard, '_' as TPlayerCard],
      infectionCards: Array(numInfCards).fill('_')
    }
  })
  return newHistory
}

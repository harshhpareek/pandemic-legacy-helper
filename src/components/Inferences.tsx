import { Alert } from '@mui/material'
import * as React from 'react'
import { playerCardIcon, PlayerCardTypes, TGameLog, TGameSetup, TInfectionCard, TPlayerCard } from '../types'
import { EpidemicProbability, getPlayerDeckSetup } from '../utils'
import InfectionCardChipStack from './InfectionCardChipStack'

interface InferencesProps {
  parentState: TGameSetup
  gameLog: TGameLog
  isDebug: boolean
}

export default function Inferences (props: InferencesProps): JSX.Element {
  const alerts: string[] = []

  const epidemicPositions: number[] = []
  const playerCardCounts: Map<TPlayerCard, number> = new Map<TPlayerCard, number>()
  const allInfectionCards: Set<TInfectionCard> = new Set<TInfectionCard>()
  const pastInfectionCardStacks: TInfectionCard[][] = []

  const { totalPlayerCards, pileTransitions } = getPlayerDeckSetup(props.parentState.fundingLevel)

  let playerDeckPosition: number = 0
  let pileNum: number = 0
  let numEpidemics: number = 0
  let infectionsDiscardPile: TInfectionCard[] = []
  const upcomingInfectionCards: Set<TInfectionCard> = new Set<TInfectionCard>()

  props.parentState.initialPlayerCards.forEach(hand => {
    hand.forEach(card => {
      if (card === 'Epidemic') {
        alerts.push('Epidemic cannot happen in initially dealt cards')
      }
      playerCardCounts.set(card, (playerCardCounts.get(card) ?? 0) + 1)
    })
  })

  props.parentState.initialInfections.forEach(card => {
    if (allInfectionCards.has(card)) {
      alerts.push(`Infection Card ${card} was repeated in Initial Infections`)
    }
    if (card !== '_') {
      infectionsDiscardPile.push(card)
      allInfectionCards.add(card)
    }
  })

  function trackGameLog (): void {
    let shouldBreak = false

    for (const row of props.gameLog) {
      const { playerCards, infectionCards } = row
      if (shouldBreak) {
        break
      }
      for (const card of playerCards) {
        if (card === '_') {
          shouldBreak = true
          break
        } else {
          if (card === 'Epidemic') {
            numEpidemics += 1
            if (numEpidemics > pileNum + 1) {
              alerts.push(`Epidemic ${numEpidemics} happened too early at position ${playerDeckPosition}. It can't happen until position ${pileTransitions[numEpidemics - 1]}`)
            }
            epidemicPositions.push(playerDeckPosition)
          }
          playerDeckPosition++
          if (playerDeckPosition === pileTransitions[pileNum]) {
            pileNum += 1
          }
          playerCardCounts.set(card, (playerCardCounts.get(card) ?? 0) + 1)
        }
      }
      if (shouldBreak) {
        break
      }

      if (playerCards.includes('Epidemic')) {
        pastInfectionCardStacks.push(infectionsDiscardPile)
        infectionsDiscardPile.forEach(card => upcomingInfectionCards.add(card))
        infectionsDiscardPile = []
      }
      for (const card of infectionCards) {
        if (infectionsDiscardPile.includes(card)) {
          alerts.push(`Infection card ${card} (before Position ${playerDeckPosition}) should already be in the discard pile`)
        }
        if (card !== '_') {
          if (upcomingInfectionCards.size > 0 && !upcomingInfectionCards.has(card)) {
            alerts.push(`${card} unexpected (Position ${playerDeckPosition}). ${upcomingInfectionCards.size} seen cards are still on top of the infection deck: ${Array.from(upcomingInfectionCards).join(', ')}`)
          }
          infectionsDiscardPile.push(card)
          upcomingInfectionCards.delete(card)
          allInfectionCards.add(card)
        }
      }
    }
  }

  trackGameLog()

  if (playerDeckPosition > totalPlayerCards) {
    alerts.push(`Player Deck Position ${playerDeckPosition} is greater than total cards ${totalPlayerCards}`)
  }

  return (<>
    {alerts.map((alert, i) => <Alert key={i} severity="error">{alert}</Alert>)}
    <span style={numEpidemics > pileNum ? { color: 'green' } : {}}> Probability of next card being Epidemic: {numEpidemics > pileNum ? 0 : EpidemicProbability(pileTransitions[pileNum] - playerDeckPosition)}%</span>
    <h4>Infection discard pile</h4>
    <InfectionCardChipStack cards={infectionsDiscardPile} />
    <h4>Upcoming Infection Cards</h4>
    <InfectionCardChipStack cards={Array.from(upcomingInfectionCards)} />
    {props.isDebug && (<><h4> Current position: {playerDeckPosition}. Pile {pileNum}. Cards left in this pile: {pileTransitions[pileNum] - playerDeckPosition}</h4>
      Epidemics so far: {numEpidemics} at positions [{epidemicPositions.join(',')}], expected by {pileTransitions.join(', ')}</>)}
    <h4> Past Summary: Infection Cards</h4>
    {pastInfectionCardStacks.map((stack, j) =>
      <div key={j}>
        <h5 key={j}>Before Epidemic {j + 1}:</h5>
        <InfectionCardChipStack cards={stack} />
      </div>)}
    <p></p>
    <h4>Player Card counts</h4>
    <ul>
      {PlayerCardTypes.filter(c => c !== '_').map((cardType, i) =>
        <li key={i}>{playerCardIcon(cardType)}: {playerCardCounts.get(cardType) ?? 0} {
          '/ ' + String(getMaxForPlayerCardType(cardType, props.parentState.fundingLevel))
        }
        </li>)}
    </ul>
  </>)
}

function getMaxForPlayerCardType (cardType: TPlayerCard, fundingLevel: number): number | null {
  switch (cardType) {
    case 'Epidemic': return 5
    case 'Black':
    case 'Yellow':
    case 'Blue':
    case 'Red':
      return 12
    case 'Funded':
      return fundingLevel
  }
  return null
}

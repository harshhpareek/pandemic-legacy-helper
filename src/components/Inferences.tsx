import { Alert } from '@mui/material'
import * as React from 'react'
import { playerCardIcon, PlayerCardTypes, TGameLog, TGameSetup, TInfectionCard, TPlayerCard } from '../types'
import InfectionCardChipStack from './InfectionCardChipStack'

interface InferencesProps {
  parentState: TGameSetup
  gameLog: TGameLog
}

export default class InitialInfectionsLog extends React.Component<InferencesProps, {}> {
  numEpidemic: number = 0
  epidemicPositions: number[] = []
  alerts: string[] = []
  playerCardCounts: Map<TPlayerCard, number> = new Map<TPlayerCard, number>()
  allInfectionCards: Set<TInfectionCard> = new Set<TInfectionCard>()
  pastInfectionCardStacks: TInfectionCard[][] = []
  infectionCardsOnTop: TInfectionCard[] = []

  countPlayerCards (): void {
    const counts = new Map<TPlayerCard, number>()
    let playerDeckPosition: number = 0
    this.props.parentState.initialPlayerCards.forEach(hand => {
      hand.forEach(card => {
        if (card === 'Epidemic') {
          this.alerts.push('Epidemic cannot happen in initially dealt cards')
        }
        counts.set(card, (counts.get(card) ?? 0) + 1)
      })
    })

    this.props.gameLog.forEach(({ playerCards }) => {
      playerCards.forEach(card => {
        playerDeckPosition++
        if (card === 'Epidemic') {
          this.numEpidemic += 1
          this.epidemicPositions.push(playerDeckPosition)
        }
        counts.set(card, (counts.get(card) ?? 0) + 1)
      })
    })
    this.playerCardCounts = counts
  }

  trackInfectionCards (): void {
    this.infectionCardsOnTop = []
    this.props.parentState.initialInfections.forEach(card => {
      if (card === '_') {
        return
      }
      this.infectionCardsOnTop.push(card)
      this.allInfectionCards.add(card)
    })

    this.props.gameLog.forEach(({ playerCards, infectionCards }) => {
      if (playerCards.includes('Epidemic')) {
        // The cards drawn after epidemic
        this.pastInfectionCardStacks.push(this.infectionCardsOnTop)
        this.infectionCardsOnTop = []
      }
      infectionCards.forEach(card => {
        if (card === '_') {
          return
        }
        this.infectionCardsOnTop.push(card)
      })
    })
  }

  render (): React.ReactNode {
    this.numEpidemic = 0
    this.alerts = []

    this.countPlayerCards()
    this.trackInfectionCards()
    return (<>
      {this.alerts.map((alert, i) => <Alert key={i} severity="error">{alert}</Alert>)}
      <h4>On Pile: </h4>
      <h4>Cards left in this pile: </h4>
      <h4>Probability of Epidemic in next 2 cards: </h4>
      <h4>Infection Cards on Top</h4>
      <InfectionCardChipStack cards={this.infectionCardsOnTop} />
      <h4>Upcoming Infection Cards</h4>
      <InfectionCardChipStack cards={Array.from(this.allInfectionCards).filter(card => !this.infectionCardsOnTop.includes(card))} />
      <h4> Past Summary: Infection Cards</h4>
      {this.pastInfectionCardStacks.map((stack, j) =>
        <div key={j}>
          <h5 key={j}>Before Epidemic {j + 1}:</h5>
          <InfectionCardChipStack cards={stack} />
        </div>)}
      <p></p>
      <h4>Player Card counts</h4>
      <ul>
        {PlayerCardTypes.map((cardType, i) =>
          <li key={i}>{playerCardIcon(cardType)}: {this.playerCardCounts.get(cardType) ?? 0}</li>)}
      </ul>
    </>)
  }
}

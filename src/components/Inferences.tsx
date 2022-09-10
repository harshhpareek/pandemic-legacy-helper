import * as React from 'react'
import { TState, TPlayerCard } from '../types'

interface InferencesProps {
  parentState: TState
}

interface TInferencesState {
  cardCounts: Map<TPlayerCard, number>
}

function countCards (state: TState): Map<TPlayerCard, number> {
  const counts = new Map<TPlayerCard, number>()
  state.initialPlayerCards.forEach(hand => {
    hand.forEach(card => {
      counts.set(card, (counts.get(card) ?? 0) + 1)
    })
  }
  )
  return counts
}

export default class InitialInfectionsLog extends React.Component<InferencesProps, TInferencesState> {
  constructor (props: InferencesProps) {
    super(props)

    this.state = {
      cardCounts: countCards(props.parentState)
    }
  }

  render (): React.ReactNode {
    return (<>
            <pre>{JSON.stringify(Object.fromEntries(countCards(this.props.parentState)), null, 2)}</pre>
        </>)
  }
}

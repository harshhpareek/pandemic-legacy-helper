import { Chip, Stack } from '@mui/material'
import * as React from 'react'
import { infectionCardColor, TInfectionCard } from '../types'

interface TInfectionCardChipStack {
  cards: TInfectionCard[]
}

export default function InfectionCardChipStack (props: TInfectionCardChipStack): JSX.Element {
  return (
  <Stack direction="row" flexWrap='wrap'>
    {props.cards.map((card, i) =>
        <Chip size="small" key={i} label={card} sx={{ color: infectionCardColor(card) }} />)}
    </Stack>
  )
}

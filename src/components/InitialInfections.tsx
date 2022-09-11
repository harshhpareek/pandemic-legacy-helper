import { ListItem, ListItemText, FormControl, MenuItem, Select } from '@mui/material'
import * as React from 'react'
import { AllCities, infectionCardColor, TState } from '../types'

interface InitialInfectionsLogProps {
  parentState: TState
  setParentState: React.Dispatch<React.SetStateAction<TState>>
}

export default class InitialInfectionsLog extends React.Component<InitialInfectionsLogProps, {}> {
  render (): React.ReactNode {
    const infections = this.props.parentState.initialInfections
    return <>
      {infections.map((card, i) => {
        return (<ListItem key={i}>
          <ListItemText
            primary={'Initial Infection (' + String(Math.ceil((9 - i) / 3)) + 'x)'}
            sx={{ color: 'blue' }} />
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={card}
              sx={{ color: infectionCardColor(card) }}
              onChange={(event) => {
                this.props.setParentState(
                  {
                    ...this.props.parentState,
                    initialInfections:
                      infections.map((inf, k) => (k === i ? event.target.value : inf))
                  })
              }}
            >
              {AllCities.map((city, j) => {
                return (
                  <MenuItem key={j} sx={{ color: infectionCardColor(city) }} value={city}>{city}</MenuItem>)
              })}
            </Select >
          </FormControl>
        </ListItem>)
      })
      }
    </>
  }
}

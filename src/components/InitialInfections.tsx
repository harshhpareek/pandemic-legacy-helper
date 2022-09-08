import { ListItem, ListItemText, ListItemButton } from '@mui/material'
import * as React from 'react'
import { infectionCardColor, TState } from '../types'

interface InitialInfectionsLogProps {
  parentState: TState
  setParentState: React.Dispatch<React.SetStateAction<TState>>
}

export default class InitialInfectionsLog extends React.Component<InitialInfectionsLogProps, {}> {
  render (): React.ReactNode {
    return <ListItem>
            <ListItemText primary="Initial Infection" sx={{ color: 'blue' }} />
            <ListItemButton>
                <ListItemText primary='Kinshasa' sx={{ color: infectionCardColor('Kinshasa') }} />
            </ListItemButton>
        </ListItem>
  }
}

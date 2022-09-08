import { ListItem, ListItemText, Avatar, ListItemAvatar, ListItemButton, ListItemIcon } from '@mui/material'
import * as React from 'react'
import { infectionCardColor, playerCardIcon, TState } from '../types'
import { stringAvatar } from './DraggableAvatarStack'
import InitialInfectionsLog from './InitialInfections'
import InitialPlayerCardsLog from './InitialPlayerCards'

interface GameLogProps {
  parentState: TState
  setParentState: React.Dispatch<React.SetStateAction<TState>>
}

export default class GameLog extends React.Component<GameLogProps, {}> {
  render (): React.ReactNode {
    return (<>
            <InitialInfectionsLog parentState={this.props.parentState} setParentState={this.props.setParentState}></InitialInfectionsLog>
            <InitialPlayerCardsLog parentState={this.props.parentState} setParentState={this.props.setParentState}></InitialPlayerCardsLog>
            <ListItem>
                <ListItemAvatar>
                    <Avatar {...stringAvatar('Harsh Pareek', 'Blue')} />
                </ListItemAvatar>
                <ListItemText primary="drew" sx={{ color: 'blue' }} />
                <ListItemButton sx={{ width: '2%' }}>
                    <ListItemIcon>{playerCardIcon('Epidemic')} </ListItemIcon>
                </ListItemButton>
                <ListItemButton sx={{ width: '2%' }}>
                    <ListItemIcon>{playerCardIcon('Red')} </ListItemIcon>
                </ListItemButton>
                <ListItemText primary="and" />
                <ListItemText primary="infected" sx={{ color: 'green' }} />
                <ListItemButton>
                    <ListItemText primary='Kinshasa' sx={{ color: infectionCardColor('Kinshasa') }} />
                </ListItemButton>
                <ListItemButton>
                    <ListItemText primary='Algiers' sx={{ color: infectionCardColor('Algiers') }} />
                </ListItemButton>
            </ListItem>
        </>
    )
  }
}

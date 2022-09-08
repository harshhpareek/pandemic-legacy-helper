import { ListItem, ListItemAvatar, Avatar, ListItemText, ListItemButton, ListItemIcon } from '@mui/material'
import * as React from 'react'
import { playerCardIcon, TState } from '../types'
import { stringAvatar } from './DraggableAvatarStack'

interface InitialPlayerCardsLogProps {
  parentState: TState
  setParentState: React.Dispatch<React.SetStateAction<TState>>
}

export default class InitialPlayerCardsLog extends React.Component<InitialPlayerCardsLogProps, {}> {
  render (): React.ReactNode {
    return (<ListItem>
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
        </ListItem>)
  }
}

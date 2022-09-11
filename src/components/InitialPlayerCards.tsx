import { ListItem, ListItemAvatar, Avatar, ListItemText, FormControl, MenuItem, Select } from '@mui/material'
import * as React from 'react'
import { playerCardIcon, TState, PlayerCardTypes, TPlayerCard } from '../types'
import { stringAvatar } from './DraggableAvatarStack'

interface InitialPlayerCardsLogProps {
  parentState: TState
  setParentState: React.Dispatch<React.SetStateAction<TState>>
}

export default class InitialPlayerCardsLog extends React.Component<InitialPlayerCardsLogProps, {}> {
  render (): React.ReactNode {
    const players = this.props.parentState.players
    const playerColors = this.props.parentState.playerColors
    const initialPlayerCards = this.props.parentState.initialPlayerCards
    const positionToPlayerId = this.props.parentState.positionToPlayerId
    return (<>{positionToPlayerId.map((playerId, position) => {
      const player = players[playerId]
      return (<ListItem key={position}>
        <ListItemAvatar>
          <Avatar {...stringAvatar(player, playerColors[playerId])} />
        </ListItemAvatar>
        <ListItemText primary="drew" sx={{ color: 'blue' }} />

        {initialPlayerCards[playerId].map((handCard, handCardIdx) => {
          return (
            <FormControl
              key={handCardIdx}
              sx={{
                minWidth: 60,
                alignItems: 'center',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderWidth: '0 !important'
                }
              }}
            ><Select
              value={handCard}
              onChange={(event) => {
                const newCard = event.target.value as TPlayerCard
                this.props.setParentState(
                  {
                    ...this.props.parentState,
                    initialPlayerCards:
                      initialPlayerCards.map((hand, k) =>
                        (k === playerId
                          ? (handCardIdx === 0 ? [newCard, hand[1]] : [hand[0], newCard])
                          : hand))
                  })
              }}
              IconComponent={() => null}
              inputProps={
                {
                  sx: {
                    padding: '0 !important'
                  }
                }}
            >
                {PlayerCardTypes.map((card, j) => {
                  return (
                    <MenuItem key={j} value={card}>{playerCardIcon(card)}</MenuItem>)
                })}
              </Select>
            </FormControl>)
        })
        }
      </ListItem>)
    })}</>)
  }
}

import { ListItem, ListItemText, Avatar, ListItemAvatar, FormControl, MenuItem, Select } from '@mui/material'
import * as React from 'react'
import { AllCities, infectionCardColor, playerCardIcon, PlayerCardTypes, TState } from '../types'
import { stringAvatar } from './DraggableAvatarStack'
import InitialInfectionsLog from './InitialInfections'
import InitialPlayerCardsLog from './InitialPlayerCards'

interface GameLogProps {
  parentState: TState
  setParentState: React.Dispatch<React.SetStateAction<TState>>
}

export default class GameLog extends React.Component<GameLogProps, {}> {
  render (): React.ReactNode {
    const players = this.props.parentState.players
    const playerColors = this.props.parentState.playerColors
    const history = this.props.parentState.history
    return (<>
            <InitialInfectionsLog parentState={this.props.parentState} setParentState={this.props.setParentState}></InitialInfectionsLog>
            <InitialPlayerCardsLog parentState={this.props.parentState} setParentState={this.props.setParentState}></InitialPlayerCardsLog>
            {history.map((row, turnIdx) => {
              return (
                    <React.Fragment key={turnIdx}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar {...stringAvatar(players[row.player_id], playerColors[row.player_id])} />
                            </ListItemAvatar>
                            <ListItemText primary="drew" sx={{ color: 'blue' }} />
                            {row.playerCards.map((handCard, handCardIdx) => {
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
                                          console.log(event)
                                          this.props.setParentState(
                                            (current: TState) =>
                                              ({
                                                ...current
                                                //   initialPlayerCards:
                                                //   initialPlayerCards.map((hand, k) =>
                                                //     (k === playerId
                                                //       ? (handCardIdx === 0 ? [event.target.value, hand[1]] : [hand[0], event.target.value])
                                                //       : hand))
                                              }))
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
                        </ListItem>
                        <ListItem>
                            <ListItemText inset
                                primary={'infected'}
                                sx={{ color: 'green' }} />

                            {row.infectionCards.map((card, j) => {
                              return (
                                    <FormControl key={j}>
                                        <Select
                                            value={card}
                                            sx={{ color: infectionCardColor(card) }}
                                            onChange={(event) => {
                                              this.props.setParentState(
                                                (current: TState) =>
                                                  ({
                                                    ...current
                                                    // initialInfections:
                                                    // infections.map((inf, k) => (k === i ? event.target.value : inf))
                                                  }))
                                            }}
                                        >
                                            {AllCities.map((city, j) => {
                                              return (
                                                    <MenuItem key={j} sx={{ color: infectionCardColor(city) }} value={city}>{city}</MenuItem>)
                                            })}
                                        </Select >
                                    </FormControl>)
                            })}
                        </ListItem>
                    </React.Fragment>)
            })}</>)
  }
}

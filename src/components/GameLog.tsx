import { Avatar, FormControl, ListItem, ListItemAvatar, ListItemText, ListSubheader, MenuItem, Select } from '@mui/material'
import * as React from 'react'
import { AllCities, infectionCardColor, playerCardIcon, PlayerCardTypes, TGameLog, TGameLogRow, TGameSetup, TPlayerCard } from '../types'
import { stringAvatar } from './DraggableAvatarStack'
import InitialInfectionsLog from './InitialInfections'
import InitialPlayerCardsLog from './InitialPlayerCards'

interface GameLogProps {
  parentState: TGameSetup
  setParentState: React.Dispatch<React.SetStateAction<TGameSetup>>
  gameLog: TGameLog
  setGameLog: React.Dispatch<React.SetStateAction<TGameLog>>
  minWidth: number
}

export default class GameLog extends React.Component<GameLogProps, {}> {
  render (): React.ReactNode {
    const players = this.props.parentState.players
    const playerColors = this.props.parentState.playerColors
    const history = this.props.gameLog
    return (<>
      <ListSubheader>Initial Infections</ListSubheader>
      <InitialInfectionsLog parentState={this.props.parentState} setParentState={this.props.setParentState}></InitialInfectionsLog>
      <ListSubheader>Initial Player Cards</ListSubheader>
      <InitialPlayerCardsLog minWidth={this.props.minWidth} parentState={this.props.parentState} setParentState={this.props.setParentState}></InitialPlayerCardsLog>
      {history.map((row, histIdx) => {
        return (
          <React.Fragment key={histIdx}>
            {(histIdx % 4 === 0) && (<ListSubheader>Round {histIdx / 4 + 1}</ListSubheader>)}
            <ListItem>
              <ListItemAvatar>
                <Avatar {...stringAvatar(players[row.playerId], playerColors[row.playerId])} />
              </ListItemAvatar>
              <ListItemText primary="drew" sx={{ color: 'blue' }} />
              {row.playerCards.map((handCard, handCardIdx) => {
                return (
                  <FormControl
                    key={handCardIdx}
                    sx={{
                      minWidth: this.props.minWidth,
                      alignItems: 'center',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '0 !important'
                      }
                    }}
                  ><Select
                    value={handCard}
                    onChange={(event) => {
                      this.props.setGameLog(
                        history.map((oldRow, k) => {
                          if (k !== histIdx) {
                            return oldRow
                          } else {
                            const newRow: TGameLogRow = { ...oldRow }
                            newRow.playerCards = oldRow.playerCards.map(
                              (oldCard, m) => (
                                m === handCardIdx
                                  ? (event.target.value as TPlayerCard)
                                  : oldCard))
                            return newRow
                          }
                        }
                        )
                      )
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
                      IconComponent={() => null}
                      onChange={(event) => {
                        this.props.setGameLog(
                          history.map((oldRow, k) => {
                            if (k !== histIdx) {
                              return oldRow
                            } else {
                              const newRow = { ...oldRow }
                              newRow.infectionCards = oldRow.infectionCards.map((oldCard, m) => (m === j ? event.target.value : oldCard))
                              return newRow
                            }
                          }
                          )
                        )
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

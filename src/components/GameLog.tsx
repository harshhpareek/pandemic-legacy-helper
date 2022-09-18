import { Avatar, FormControl, ListItem, ListItemAvatar, ListItemText, ListSubheader, MenuItem, Select } from '@mui/material'
import * as React from 'react'
import { AllCities, infectionCardColor, playerCardIcon, PlayerCardTypes, TGameLog, TGameSetup, TInfectionCard, TPlayerCard } from '../types'
import { getPlayerDeckSetup } from '../utils'
import { stringAvatar } from './DraggableAvatarStack'
import InitialInfectionsLog from './InitialInfections'
import InitialPlayerCardsLog from './InitialPlayerCards'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import InfectionCardChipStack from './InfectionCardChipStack'

interface GameLogProps {
  parentState: TGameSetup
  setParentState: React.Dispatch<React.SetStateAction<TGameSetup>>
  gameLog: TGameLog
  setGameLog: React.Dispatch<React.SetStateAction<TGameLog>>
  minWidth: number
  showPositions: boolean
}

export default function GameLog (props: GameLogProps): JSX.Element {
  const players = props.parentState.players
  const playerColors = props.parentState.playerColors
  const history = props.gameLog

  const { pileTransitions } = getPlayerDeckSetup(props.parentState.fundingLevel)

  return (<>
    <ListSubheader>Initial Infections</ListSubheader>
    <InitialInfectionsLog parentState={props.parentState} setParentState={props.setParentState}></InitialInfectionsLog>
    <ListSubheader>Initial Player Cards</ListSubheader>
    <InitialPlayerCardsLog minWidth={props.minWidth} parentState={props.parentState} setParentState={props.setParentState}></InitialPlayerCardsLog>
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
                <React.Fragment key={handCardIdx}>
                  <sub>
                    {props.showPositions && (histIdx * 2 + handCardIdx)}
                  </sub>
                  <FormControl
                    key={handCardIdx}
                    sx={{
                      minWidth: props.minWidth,
                      alignItems: 'center',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: '0 !important'
                      }
                    }}
                  ><Select
                    value={handCard}
                    onChange={(event) => {
                      const newHistory = history
                      newHistory[histIdx].playerCards[handCardIdx] = event.target.value as TPlayerCard
                      props.setGameLog(newHistory)
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
                          <MenuItem key={j} value={card}>
                            {playerCardIcon(card)}
                          </MenuItem>)
                      })}
                    </Select>
                  </FormControl>
                  {(pileTransitions.includes(histIdx * 2 + handCardIdx)) && <MoreVertIcon />}
                </React.Fragment>)
            })
            }
          </ListItem>
          {row.playerCards.includes('Epidemic') && (
            <>
              <ListItem>
                <ListItemText inset> <b>Increase</b> num infections to 2 </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText inset><b>Infect</b> city:</ListItemText>
                <FormControl>
                  <Select
                    value={row.epidemicInfectStepCard}
                    sx={{ color: infectionCardColor(row.epidemicInfectStepCard) }}
                    IconComponent={() => null}
                    onChange={(event) => {
                      props.setGameLog(
                        history.map((oldRow, k) => {
                          if (k !== histIdx) {
                            return oldRow
                          } else {
                            const newRow = { ...oldRow }
                            newRow.epidemicInfectStepCard = event.target.value as TInfectionCard
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
                  </Select>
                </FormControl>
              </ListItem>
              <ListItem><ListItemText inset><b>Intensify</b>: Cities go back on the stack
              </ListItemText> </ListItem>
            </>)
          }
          <ListItem>
            <ListItemText inset
              primary={'infected'}
              sx={{ color: 'green' }} />
              <InfectionCardChipStack cards={row.infectionCards} />
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
                      props.setGameLog(
                        history.map((oldRow, k) => {
                          if (k !== histIdx) {
                            return oldRow
                          } else {
                            const newRow = { ...oldRow }
                            newRow.infectionCards = oldRow.infectionCards.map((oldCard, m) => (m === j ? event.target.value as TInfectionCard : oldCard))
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

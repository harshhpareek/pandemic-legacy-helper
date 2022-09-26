import { Autocomplete, Avatar, Box, Chip, Divider, FormControl, ListItem, ListItemAvatar, ListItemText, MenuItem, Select, TextField } from '@mui/material'
import * as React from 'react'
import { AllCities, infectionCardColor, infectionCardType, playerCardIcon, PlayerCardTypes, TGameLog, TGameSetup, TInfectionCard, TPlayerCard } from '../types'
import { getPlayerDeckSetup } from '../utils'
import { stringAvatar } from './DraggableAvatarStack'
import InitialInfectionsLog from './InitialInfections'
import InitialPlayerCardsLog from './InitialPlayerCards'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import InfectionCardChipStack from './InfectionCardChipStack'
import update from 'immutability-helper'

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
    <Divider>Initial Infections</Divider>
    <InitialInfectionsLog parentState={props.parentState} setParentState={props.setParentState}></InitialInfectionsLog>
    <Divider>Initial Player Cards</Divider>
    <InitialPlayerCardsLog minWidth={props.minWidth} parentState={props.parentState} setParentState={props.setParentState} />
    {history.map((row, histIdx) => {
      const hasEpidemic = row.playerCards.includes('Epidemic')
      return (
        <Box key={histIdx} bgcolor={hasEpidemic ? 'lightpink' : 'white'}>
          {(histIdx % 4 === 0) && (<Divider>Round {histIdx / 4 + 1}</Divider>)}
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
                      props.setGameLog(update(history, { [histIdx]: { playerCards: { [handCardIdx]: { $set: event.target.value as TPlayerCard } } } }))
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
          {hasEpidemic && (
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
                      props.setGameLog(update(
                        history, {
                          [histIdx]:
                          { epidemicInfectStepCard: { $set: event.target.value as TInfectionCard } }
                        }))
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
            <ListItemText
              primary={'infected'}
              sx={{ color: 'green' }} />
            <Autocomplete
              multiple
              popupIcon={null}
              disableClearable
              size="small"
              options={AllCities}
              renderOption={(props, option) => <li {...props} style={{ color: infectionCardColor(option) }}> {option}</li>}
              renderTags={(tagValue, getTagProps) => {
                return tagValue.map((option, index) => (
                  // eslint-disable-next-line react/jsx-key
                  <Chip sx={{
                    bgcolor: infectionCardColor(option),
                    color: 'white',
                    opacity: 0.8,
                    p: 0.1,
                    m: 0.1,
                    '& .MuiChip-deleteIcon': {
                      color: 'silver'
                    }
                  }} size="small" {...getTagProps({ index })} label={option} />
                ))
              }}
              groupBy={(option) => infectionCardType(option)}
              renderInput={(params) => (
                <TextField {...params} sx={{ m: 0, p: 0 }} />
              )}
              sx={{ maxWidth: 250 }}
            />
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
                        update(
                          history, {
                            [histIdx]:
                          {
                            infectionCards:
                            {
                              [j]: { $set: event.target.value as TInfectionCard }
                            }
                          }
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
        </Box>)
    })}</>)
}

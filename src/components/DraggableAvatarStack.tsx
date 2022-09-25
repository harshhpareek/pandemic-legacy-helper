import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import * as React from 'react'
import {
  DragDropContext, Draggable, Droppable, DropResult
} from 'react-beautiful-dnd'
import { pawnColor, TGameSetup, TPawnColor } from '../types'
import NameDialog from './NameDialog'
import update from 'immutability-helper'

export function stringAvatar (name: string, color: TPawnColor): { sx: { bgcolor: string }, children: string } {
  return {
    sx: {
      bgcolor: pawnColor(color)
    },
    children: name.length === 2 ? name : (name.includes(' ') ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : name[0])
  }
}

interface TAvatarProps {
  parentState: TGameSetup
  setParentState: React.Dispatch<React.SetStateAction<TGameSetup>>
  regenGameLog: (newPositionToPlayerId: number[]) => void
}

export default class DraggableAvatarStack extends React.Component<TAvatarProps, {}> {
  constructor (props: TAvatarProps) {
    super(props)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.newPlayerId = this.newPlayerId.bind(this)
  }

  newPlayerId (position: number, sourceIdx: number, destinationIdx: number, oldPositionToPlayerId: number[], playerId: number): number {
    if (position === destinationIdx) {
      return oldPositionToPlayerId[sourceIdx]
    }
    if ((position < sourceIdx && position < destinationIdx) || (position > sourceIdx && position > destinationIdx)) {
      return playerId
    } else if (position <= sourceIdx && position > destinationIdx) {
      // position - 1 is not OOB because position is strictly greater than destination.index, and will be at least 1
      return oldPositionToPlayerId[position - 1]
    } else if (position >= sourceIdx && position < destinationIdx) {
      // position + 1 is not OOB of Array because position is strictly less than destination.index, and will be at worst the 2nd last element
      return oldPositionToPlayerId[position + 1]
    }
    // Should never happen. This will crash the program
    return -1
  }

  onDragEnd ({ destination, source }: DropResult): void { // dropped outside the list
    if (destination === undefined || destination === null) { return }
    const oldPositionToPlayerId = this.props.parentState.positionToPlayerId
    const newPositionToPlayerId = oldPositionToPlayerId.map((playerId, position) => { return this.newPlayerId(position, source.index, destination.index, oldPositionToPlayerId, playerId) })
    this.props.setParentState({
      ...this.props.parentState,
      positionToPlayerId: newPositionToPlayerId
    })
    this.props.regenGameLog(newPositionToPlayerId)
  }

  render (): React.ReactNode {
    const players = this.props.parentState.players
    const playerColors = this.props.parentState.playerColors
    const positionToPlayerId = this.props.parentState.positionToPlayerId
    return (
      <div style={{ overflow: 'hidden', height: 75 }}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="avatars" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <Stack direction="row" spacing={2} margin={2}>
                  {positionToPlayerId.map((playerId, position) => {
                    const [showNameDialog, setShowNameDialog] = React.useState(false)
                    return (
                      <Draggable key={playerId} draggableId={String(playerId)} index={position}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <NameDialog
                              show={showNameDialog}
                              name={players[playerId]}
                              color={playerColors[playerId]}
                              onClose={() => { setShowNameDialog(false) }}
                              onChangeName={(name: string) => {
                                this.props.setParentState(update(this.props.parentState, { players: { [playerId]: { $set: name } } }))
                              }}
                              onChangeColor={(color: TPawnColor) => {
                                this.props.setParentState(update(this.props.parentState, { playerColors: { [playerId]: { $set: color } } }))
                              }} />
                            <Avatar component={Paper} elevation={5} {...stringAvatar(players[playerId], playerColors[playerId])} onClick={() => { setShowNameDialog(true) }} />
                          </div>)}
                      </Draggable>)
                  })}
                </Stack>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    )
  }
}

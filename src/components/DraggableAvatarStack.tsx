import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import * as React from 'react'
import {
  DragDropContext,
  Droppable, DropResult, Draggable
} from 'react-beautiful-dnd'
import { pawnColor, TPawnColor, TState } from '../types'
import Stack from '@mui/material/Stack'
import NameDialog from './NameDialog'

export function stringAvatar (name: string, color: TPawnColor): { sx: { bgcolor: string }, children: string } {
  return {
    sx: {
      bgcolor: pawnColor(color)
    },
    children: name.length === 2 ? name : (name.includes(' ') ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : name[0])
  }
}

interface TAvatarProps {
  parentState: TState
  setParentState: React.Dispatch<React.SetStateAction<TState>>
}

export default class DraggableAvatarStack extends React.Component<TAvatarProps, {}> {
  constructor (props: TAvatarProps) {
    super(props)
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  onDragEnd ({ destination, source }: DropResult): void { // dropped outside the list
    if (destination === undefined || destination === null) { return }
    const oldPositionToPlayerId = this.props.parentState.positionToPlayerId
    const newPositionToPlayerId = oldPositionToPlayerId.map((playerId, position) => {
      if (position === destination.index) {
        return oldPositionToPlayerId[source.index]
      }
      if ((position < source.index && position < destination.index) || (position > source.index && position > destination.index)) {
        return playerId
      } else if (position <= source.index && position > destination.index) {
        // position - 1 is not OOB because position is strictly greater than destination.index, and will be at least 1
        return oldPositionToPlayerId[position - 1]
      } else if (position >= source.index && position < destination.index) {
        // position + 1 is not OOB of Array because position is strictly less than destination.index, and will be at worst the 2nd last element
        return oldPositionToPlayerId[position + 1]
      }
      // Should never happen. This will crash the program
      return -1
    })
    this.props.setParentState({
      ...this.props.parentState,
      positionToPlayerId: newPositionToPlayerId
    })
  }

  render (): React.ReactNode {
    const players = this.props.parentState.players
    const playerColors = this.props.parentState.playerColors
    const positionToPlayerId = this.props.parentState.positionToPlayerId
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="avatars" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <Stack direction="row" spacing={2}>
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
                              this.props.setParentState({ ...this.props.parentState, players: players.map((oldName, j) => (j === playerId ? name : oldName)) })
                            }}
                            onChangeColor={(color: TPawnColor) => {
                              this.props.setParentState({ ...this.props.parentState, playerColors: playerColors.map((oldColor, j) => (j === playerId ? color : oldColor)) })
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

    )
  }
}

import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import * as React from 'react'
import {
  DragDropContext,
  Droppable, DropResult, Draggable
} from 'react-beautiful-dnd'
import { TState } from '../types'
import Stack from '@mui/material/Stack'
import NameDialog from './NameDialog'

function stringToColor (string: string): string {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

export function stringAvatar (name: string): { sx: { bgcolor: string }, children: string } {
  return {
    sx: {
      bgcolor: stringToColor(name + '__slt__')
    },
    children: name.length === 2 ? name : (name.includes(' ') ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : name[0])
  }
}

interface TAvatarProps {
  players: string[]
  positionToPlayerId: number[]
  setState: React.Dispatch<React.SetStateAction<TState>>
}

export default class DraggableAvatarStack extends React.Component<TAvatarProps, {}> {
  constructor (props: TAvatarProps) {
    super(props)
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  onDragEnd ({ destination, source }: DropResult): void { // dropped outside the list
    if (destination === undefined || destination === null) { return }
    const oldPositionToPlayerId = this.props.positionToPlayerId
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
    this.props.setState((current: TState) => ({
      ...current,
      positionToPlayerId: newPositionToPlayerId
    }))
  }

  render (): React.ReactNode {
    return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="avatars" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <Stack direction="row" spacing={2}>
                                {this.props.positionToPlayerId.map((playerId, position) => {
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
                                                        value={this.props.players[playerId]}
                                                        onClose={() => { setShowNameDialog(false) }}
                                                        onChange={(name: string) => {
                                                          this.props.setState((current: TState) =>
                                                            ({ ...current, players: this.props.players.map((oldName, j) => (j === playerId ? name : oldName)) }))
                                                        }} />
                                                    <Avatar component={Paper} elevation={5} {...stringAvatar(this.props.players[playerId])} onClick={() => { setShowNameDialog(true) }} />
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

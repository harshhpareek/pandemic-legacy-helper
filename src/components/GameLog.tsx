import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import * as React from 'react'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import { TPlayerMove, playerCardIcon } from '../types'
import { stringAvatar } from '../components/DraggableAvatarStack'

function renderHistory (props: ListChildComponentProps): JSX.Element {
  const { data, index, style } = props
  return (
        <ListItem style={style} key={index} component="div" disablePadding>
            <ListItem>
                <Avatar {...stringAvatar('Harsh Pareek')} />
                <ListItemText primary="drew" sx={{ color: 'blue' }} inset />
                <ListItemButton dense sx={{ width: '2%' }}>
                    <ListItemIcon>{playerCardIcon(data[index].playerCards[0])} </ListItemIcon>
                </ListItemButton>
                <ListItemButton dense sx={{ width: '2%' }}>
                    <ListItemIcon>{playerCardIcon(data[index].playerCards[1])} </ListItemIcon>
                </ListItemButton>
                <ListItemText primary="infected" sx={{ color: 'green' }} inset />
                <ListItemButton>
                    <ListItemText primary="Kinshasa" />
                </ListItemButton>
                <ListItemButton>
                    <ListItemText primary="Essen" />
                </ListItemButton>
            </ListItem>
        </ListItem>
  )
}

interface GameLogProps { history: TPlayerMove[] }

export default class GameLog extends React.Component<GameLogProps, {}> {
  render (): React.ReactNode {
    return (
            <Paper sx={{ width: '100%', height: 400, maxWidth: 900, bgcolor: 'background.paper' }} elevation={3}>
                <FixedSizeList
                    height={400}
                    width={600}
                    itemSize={46}
                    itemCount={this.props.history.length}
                    overscanCount={10}
                    itemData={this.props.history}
                >
                    {renderHistory}
                </FixedSizeList>
            </Paper>)
  }
}

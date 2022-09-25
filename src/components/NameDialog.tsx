import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import React from 'react'
import { TPawnColor } from '../types'

interface NameDialogProps {
  show: boolean
  name: string
  color: string
  onClose: React.MouseEventHandler
  onChangeName: (value: string) => void
  onChangeColor: (value: TPawnColor) => void
}

export default function NameDialog (props: NameDialogProps): JSX.Element {
  return (
    <Dialog open={props.show} onClose={props.onClose}>
      <DialogTitle>Player initials</DialogTitle>
      <DialogContent>
        <TextField
          label="Initials"
          value={props.name}
          onChange={(event) =>
            props.onChangeName(event.target.value)
          }
        />
        <FormControl>
          <InputLabel>Color</InputLabel>
          <Select
            value={props.color}
            label="Age"
            onChange={(event) => {
              const color = event.target.value as TPawnColor
              props.onChangeColor(color)
            }}
          >
            <MenuItem value='Blue'>Blue</MenuItem>
            <MenuItem value='Pink'>Pink</MenuItem>
            <MenuItem value='White'>White</MenuItem>
            <MenuItem value='Black'>White</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

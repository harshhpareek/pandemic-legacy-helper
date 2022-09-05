import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import React from 'react'

interface NameDialogProps {
  show: boolean
  value: string
  onClose: React.MouseEventHandler
  onChange: (value: string) => void
}

export default function NameDialog (props: NameDialogProps): JSX.Element {
  return (
    <Dialog open={props.show} onClose={props.onClose}>
      <DialogTitle>Player initials</DialogTitle>
      <DialogContent>
        <TextField
          label="Initials"
          variant="standard"
          size="small"
          value={props.value}
          onChange={(event) =>
            props.onChange(event.target.value)
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

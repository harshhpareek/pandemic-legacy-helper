import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import  {TState} from "../types"

type SettingsProps = {
    show: boolean,
    onClose: (event: {}) => void,
    parentState: TState,
    setParentState:  React.Dispatch<React.SetStateAction<TState>>
}

const SettingsModal = (props: SettingsProps) => {
  return (
    <Dialog open={props.show} onClose={props.onClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter player initials and funding level.
        </DialogContentText>
        <TextField
          label="Player 0"
          variant="standard"
          size="small"
          value={props.parentState.player0Name}
          onChange={(event) =>
            props.setParentState((current: TState) => ({ ...current, player0Name: event.target.value }))
          }
        />
        <TextField
          label="Player 1"
          variant="standard"
          size="small"
          value={props.parentState.player1Name}
          onChange={(event) =>
            props.setParentState((current: TState) => ({ ...current, player1Name: event.target.value }))
          }
        />
        <br></br>
        <TextField
          label="Player 2"
          variant="standard"
          size="small"
          value={props.parentState.player2Name}
          onChange={(event) =>
            props.setParentState((current: TState) => ({ ...current, player2Name: event.target.value }))
          }
        />
        <TextField
          label="Player 3"
          variant="standard"
          size="small"
          value={props.parentState.player3Name}
          onChange={(event) =>
            props.setParentState((current: TState) => ({ ...current, player3Name: event.target.value }))
          }
        />
        <p></p>
        <Button
          onClick={() =>
            props.setParentState((current: TState) => ({ ...current,
              player0Name: props.parentState.player3Name,
              player1Name: props.parentState.player0Name,
              player2Name: props.parentState.player1Name,
              player3Name: props.parentState.player2Name,
            }))
          }
        >
          Rotate Names (left)
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal;

import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ProTip from './ProTip';
import SettingsModal from "./components/SettingsModal";
import { TState } from './types';
import Button from '@mui/material/Button';

export default function App() {

  const [showSettings, setShowSettings] = React.useState(false);
  const [state, setState] = React.useState<TState>({
    // Game Setup settings
    player0Name: "P0",
    player1Name: "P1",
    player2Name: "P2",
    player3Name: "P3",
    fundingLevel: 2,
  });
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pandemic Helper
        </Typography>
        <Button variant="contained"
          onClick={() => setShowSettings(true)}

        >
          Settings
        </Button>
        <SettingsModal
          onClose={() => {
            setShowSettings(false);
          }}
          show={showSettings}
          parentState={state}
          setParentState={setState}
        />
        {JSON.stringify(state)}
      </Box>
    </Container>
  );
}

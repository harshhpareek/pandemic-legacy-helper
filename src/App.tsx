import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SettingsModal from "./components/SettingsModal";
import { TState, TPlayerCard } from './types';
import Button from '@mui/material/Button';
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import CoronavirusOutlinedIcon from "@mui/icons-material/CoronavirusOutlined";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import Icon from "@mdi/react";
import { mdiBiohazard } from "@mdi/js";

declare namespace JSX {
  interface IntrinsicElements {
    div: any;
    p: any;
    u: any;
    ul: any;
    li: any;
  }
}

function playerCardIcon(card: TPlayerCard): globalThis.JSX.Element {
  switch (card) {
    case "_":
      return <IndeterminateCheckBoxOutlinedIcon />;
    case "Epidemic":
      return <Icon path={mdiBiohazard} color="red" size="25" />;
    case "Black":
      return <CoronavirusOutlinedIcon sx={{ color: "black" }} />;
    case "Yellow":
      return <CoronavirusOutlinedIcon sx={{ color: "orange" }} />;
    case "Blue":
      return <CoronavirusOutlinedIcon sx={{ color: "blue" }} />;
    case "Red":
      return <CoronavirusOutlinedIcon color="error" />;
    case "Funded":
      return <CurrencyBitcoinIcon color="success" />;
  }
}

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
        {showSettings && <SettingsModal
          onClose={() => {
            setShowSettings(false);
          }}
          show={showSettings}
          parentState={state}
          setParentState={setState}
        />}
        <Typography variant="h4" component="h1" gutterBottom>
          Setup instructions
        </Typography>
        <div>
          <p>
            Enter <u>player names</u> or initials in "Settings", and enter the{" "}
            <u>funding level</u>.
          </p>

          <p>Follow the manual, but pay attention to the following:</p>
          <ul>
            <li>
              Shuffle the <span style={{ color: "green" }}>infection</span>{" "}
              deck. Do the initial{" "}
              <span style={{ color: "green" }}>infection</span> step: 3 cities
              with 3 cubes, 3 cities with 2 cubes, blah blah. You can select
              funded events after this step.
            </li>
            <li>
              Shuffle the <span style={{ color: "blue" }}>player</span> deck.
              Give two cards to each player. This page assumes 4 players. You
              should now have <b>40 cards</b>. Add funded events. Split into 5
              piles and add <span style={{ color: "red" }}>Epidemic</span>{" "}
              cards.
            </li>
          </ul>
        </div>
        <h3>Enter Rounds </h3>
        <p />Glossary
        <ul>
          <li>
            <IndeterminateCheckBoxOutlinedIcon />: Not entered yet
          </li>
          <li>{playerCardIcon("Epidemic")}: Epidemic</li>
          <li>{playerCardIcon("Black")}: Black city player card</li>
          <li>{playerCardIcon("Yellow")}: Yellow city player card</li>
          <li>{playerCardIcon("Blue")}: Blue city player card</li>
          <li>{playerCardIcon("Red")}: Red city player card</li>
          <li>{playerCardIcon("Funded")}: Funded event</li>
        </ul>

        <h3>(Debug) State</h3>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </Box>
    </Container>
  );
}

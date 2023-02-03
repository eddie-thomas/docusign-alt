import { type ChangeEvent, useState } from "react";
import {
  Container,
  createTheme,
  CssBaseline,
  type Theme,
  ThemeProvider,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Switch,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import DialogDisclaimer from "./components/DialogDisclaimer";
import Form from "./components/Form";

/**
 *
 * @returns JSX.Element
 */
export default function App() {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  /**
   * Theme object
   */
  const THEME: Theme = createTheme({
    palette: {
      mode,
    },
  });

  /**
   *
   * @param _ - Unused event
   * @param checked - Whether the slider is on or off
   */
  const handleLightingChange = (_: ChangeEvent, checked: boolean) => {
    setMode(checked ? "light" : "dark");
  };

  return (
    <ThemeProvider theme={THEME}>
      <CssBaseline />
      <DialogDisclaimer />
      <Header mode={mode} onLightingChange={handleLightingChange} />
      <Body />
    </ThemeProvider>
  );
}

/**
 *
 * @returns JSX.Element
 */
function Body() {
  return (
    <Container>
      <Form />
    </Container>
  );
}

/**
 *
 * @param props -
 * @param props.mode - Dark or light
 * @param props.onLightingChange - Change handler
 * @returns JSX.Element
 */
function Header({
  mode,
  onLightingChange,
}: {
  mode: "dark" | "light";
  onLightingChange: (_: ChangeEvent, checked: boolean) => void;
}) {
  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <b style={{ textTransform: "capitalize" }}>{mode}</b>&nbsp;Mode
          </Typography>
          <Switch onChange={onLightingChange} color="default" />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}

// import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";
/**
 * https://nodemailer.com/smtp/well-known/
 * For emailing via node-mailer
 */

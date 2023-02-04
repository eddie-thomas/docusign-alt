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
import { SnackbarProvider, useSnackbar } from "notistack";
import MenuIcon from "@mui/icons-material/Menu";

import DialogDisclaimer from "./components/DialogDisclaimer";
import Form from "./components/Form";

import "./App.css";

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
      <SnackbarProvider maxSnack={3}>
        <DialogDisclaimer />
        <Header mode={mode} onLightingChange={handleLightingChange} />
        <Body />
      </SnackbarProvider>
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
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={() => {
              const id = enqueueSnackbar("Not implemented yet.", {
                onClick: () => closeSnackbar(id),
              });
            }}
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

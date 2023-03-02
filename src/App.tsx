import { type ChangeEvent, useState, useCallback } from "react";
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
  const [pdf, setPdf] = useState<Uint8Array>();

  /**
   * Hanlder to close dialog
   */
  const handleDialogClose = () => {
    setPdf(undefined);
  };

  /**
   * Handler to change PDF bytes
   */
  const handlePdfChange = useCallback((pdf: Uint8Array) => {
    setPdf(pdf);
  }, []);

  return (
    <>
      {pdf && <DialogDisclaimer pdf={pdf} onClose={handleDialogClose} />}
      <Container>
        <Form onPdfSubmit={handlePdfChange} />
      </Container>
    </>
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

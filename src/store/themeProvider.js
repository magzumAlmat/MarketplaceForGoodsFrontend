"use client";
import { createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import { blue, lightBlue} from "@mui/material/colors";

export default function ThemeProviderWrapper({ children }) {
  const theme = createTheme({
    typography: {
      fontFamily: [
        "Montserrat",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
    palette: {
      primary: blue,
      secondary: lightBlue,
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

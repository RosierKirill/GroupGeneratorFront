"use client"

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "media" },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#5b4bff" },
        secondary: { main: "#ff7a59" },
        background: { default: "#faf7f2", paper: "#ffffff" },
        text: { primary: "#1b1b1f", secondary: "#6b6b76" },
        divider: "#e7e2d9",
      },
    },
    dark: {
      palette: {
        primary: { main: "#8a7dff" },
        secondary: { main: "#ff8f73" },
        background: { default: "#16151a", paper: "#201f26" },
        text: { primary: "#f1eee8", secondary: "#9c9aa6" },
        divider: "#33313b",
      },
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    h1: { fontWeight: 600, letterSpacing: "-0.02em" },
    h2: { fontWeight: 600, letterSpacing: "-0.01em" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 999, textTransform: "none" } },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 999 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
})

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}

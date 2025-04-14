// src/app/client-provider.js
"use client";

import { Provider } from "react-redux";
import store from "@/store";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "@/store/provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
// import LoggedDataDisplay from "@/components/logged-data-display";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const theme = createTheme();

export default function ClientProvider({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          {/* <LoggedDataDisplay /> */}
          {/* <ToastContainer /> */}
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
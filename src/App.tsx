import React, { useState } from "react";
import { Slide, ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { gql, ServerError, useQuery } from "@apollo/client";
// import logo from './logo.svg';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LoginPageContainer } from "./pages/login-page/login-page-container";
import { HomePageContainer } from "./pages/home-page/home-page-container";
import { ExpensesPageContainer } from "./pages/expenses-page/expenses-page-container";
import { Header } from "./components/header/header";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "./constants";
import { CategoriesPageContainer } from "./pages/categories-page/categories-page-container";
import { ResetPasswordPageContainer } from "./pages/reset-password-page/reset-password-page-container";
import { WelcomePageContainer } from "./pages/welcome-page/welcome-page-container";
import "./App.css";
import "react-toastify/dist/ReactToastify.min.css";

const muiTheme = createTheme({
  palette: {
    // light: will be calculated from palette.primary.main,
    // dark: will be calculated from palette.primary.main,
    // contrastText: will be calculated to contrast with palette.primary.main
    primary: {
      main: "#277bc0",
    },
    warning: {
      main: "#ffb200",
    },
  },
});

export const GET_USER_ME = gql`
  query Me {
    me {
      email
    }
  }
`;

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(AUTH_TOKEN)
  );

  const { loading: userMeLoading, error: userMeError } = useQuery(GET_USER_ME);

  if (userMeLoading) {
    return null;
  }

  if (userMeError?.networkError) {
    const serverError = userMeError?.networkError as ServerError;
    const errorMessage = serverError.result.errors[0].message;

    if (errorMessage.includes("invalid token")) {
      localStorage.removeItem(AUTH_TOKEN);
      localStorage.removeItem(AUTH_TOKEN_USER);
      window.location.replace("/app");
    }
  }

  if (token && !localStorage.getItem(AUTH_TOKEN_USER)) {
    localStorage.removeItem(AUTH_TOKEN);
    window.location.replace("/app");
  }

  return (
    <div className="App">
      <ThemeProvider theme={muiTheme}>
        <Router>
          <Routes>
            <Route path="/" element={<WelcomePageContainer />} />
            <Route
              path="/app"
              element={
                token ? (
                  <>
                    <Header setToken={setToken} />
                    <HomePageContainer />
                  </>
                ) : (
                  <LoginPageContainer setToken={setToken} />
                )
              }
            />
            <Route
              path="/app/expenses"
              element={
                <>
                  <Header setToken={setToken} />
                  <ExpensesPageContainer />
                </>
              }
            />
            <Route
              path="/app/categories"
              element={
                <>
                  <Header setToken={setToken} />
                  <CategoriesPageContainer />
                </>
              }
            />
            <Route
              path="/reset-password"
              element={<ResetPasswordPageContainer />}
            />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Router>

        {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}
        <ToastContainer
          transition={Slide}
          position="bottom-center"
          autoClose={2500}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="colored"
        />
      </ThemeProvider>
    </div>
  );
}

export default App;

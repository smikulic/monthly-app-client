import React, { useState } from "react";
import { Slide, ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { gql, ServerError, useQuery } from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LoginPageContainer } from "./pages/login-page/login-page-container";
import { HomePageContainer } from "./pages/home-page/home-page-container";
import { ExpensesPageContainer } from "./pages/expenses-page/expenses-page-container";
import { Header } from "./components/header/header";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "./constants";
import { CategoriesPageContainer } from "./pages/categories-page/categories-page-container";
import { ResetPasswordPageContainer } from "./pages/reset-password-page/reset-password-page-container";
import { WelcomePageContainer } from "./pages/welcome-page/welcome-page-container";
import { handleLogout } from "./utils/handleLogout";

const muiTheme = createTheme({
  palette: {
    // light: will be calculated from palette.primary.main,
    // dark: will be calculated from palette.primary.main,
    // contrastText: will be calculated to contrast with palette.primary.main
    primary: {
      main: "#41efcd",
    },
    warning: {
      main: "#eec22f",
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
      handleLogout();
    }
  }

  if (token && !localStorage.getItem(AUTH_TOKEN_USER)) {
    handleLogout();
  }

  return (
    <div className="App">
      <ThemeProvider theme={muiTheme}>
        <Router>
          <Routes>
            <Route path="/" element={<WelcomePageContainer />} />

            <Route
              path="/reset-password"
              element={<ResetPasswordPageContainer />}
            />

            {!token && (
              <Route
                path="/app"
                element={<LoginPageContainer setToken={setToken} />}
              />
            )}

            {token && (
              <>
                <Route
                  element={
                    <>
                      <Header onLogout={handleLogout} />
                      <Outlet />
                    </>
                  }
                >
                  <Route path="/app" element={<HomePageContainer />} />
                  <Route
                    path="/app/expenses"
                    element={<ExpensesPageContainer />}
                  />
                  <Route
                    path="/app/categories"
                    element={<CategoriesPageContainer />}
                  />
                </Route>
              </>
            )}

            <Route
              path="*"
              element={<LoginPageContainer setToken={setToken} />}
            />
          </Routes>
        </Router>

        <ToastContainer
          transition={Slide}
          position="bottom-center"
          autoClose={2500}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          closeButton={false}
          icon={false}
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

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
import { WelcomePageContainer } from "./pages/welcome-page/welcome-page-container";
import { LoginPageContainer } from "./pages/login-page/login-page-container";
import { ResetPasswordPageContainer } from "./pages/reset-password-page/reset-password-page-container";
import { HomePageContainer } from "./pages/home-page/home-page-container";
import { ExpensesPageContainer } from "./pages/expenses-page/expenses-page-container";
import { CategoriesPageContainer } from "./pages/categories-page/categories-page-container";
import { SavingGoalsPageContainer } from "./pages/saving-goals-page/saving-goals-page-container";
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { AUTH_TOKEN, AUTH_TOKEN_USER } from "./constants";
import { handleLogout } from "./utils/handleLogout";
import { FooterPaddingStyled } from "./shared";

const muiTheme = createTheme({
  palette: {
    // light: will be calculated from palette.primary.main,
    // dark: will be calculated from palette.primary.main,
    // contrastText: will be calculated to contrast with palette.primary.main
    primary: {
      main: "#41efcd",
      contrastText: "#181818",
    },
    secondary: {
      main: "#f199c0",
      contrastText: "#6a1fde",
    },
    warning: {
      main: "#eec22f",
    },
    error: {
      main: "#ff7777",
    },
    text: {
      secondary: "#878BAC",
      disabled: "#d6d7e0",
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
  const currentDate = new Date();
  const [pageDate, setPageDate] = useState(currentDate);
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

  const onClickNext = () => {
    const nextDate = new Date(
      pageDate.getFullYear(),
      pageDate.getMonth() + 1,
      pageDate.getDate()
    );
    setPageDate(nextDate);
  };

  const onClickPrevious = () => {
    const previousDate = new Date(
      pageDate.getFullYear(),
      pageDate.getMonth() - 1,
      pageDate.getDate()
    );
    setPageDate(previousDate);
  };

  const subdomain = window.location.hostname.split(".").slice(0, -2).join(".");
  const isAppSubdomain = subdomain === "app";
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="App">
      <ThemeProvider theme={muiTheme}>
        <Router>
          <Routes>
            {!isAppSubdomain && !isDevelopment && (
              <Route path="/" element={<WelcomePageContainer />} />
            )}

            {(isAppSubdomain || isDevelopment) && (
              <>
                <Route path="/welcome" element={<WelcomePageContainer />} />

                <Route
                  path="/reset-password"
                  element={<ResetPasswordPageContainer />}
                />

                {!token && (
                  <Route
                    path="/"
                    element={<LoginPageContainer setToken={setToken} />}
                  />
                )}

                {token && (
                  <>
                    <Route
                      element={
                        <>
                          <Header onLogout={handleLogout} />
                          <FooterPaddingStyled>
                            <Outlet />
                          </FooterPaddingStyled>
                          <Footer />
                        </>
                      }
                    >
                      <Route
                        path="/"
                        element={
                          <HomePageContainer
                            pageDate={pageDate}
                            onClickNext={onClickNext}
                            onClickPrevious={onClickPrevious}
                          />
                        }
                      />
                      <Route
                        path="/expenses"
                        element={
                          <ExpensesPageContainer
                            pageDate={pageDate}
                            onClickNext={onClickNext}
                            onClickPrevious={onClickPrevious}
                          />
                        }
                      />
                      <Route
                        path="/budget"
                        element={<CategoriesPageContainer />}
                      />
                      <Route
                        path="/saving-goals"
                        element={<SavingGoalsPageContainer />}
                      />
                    </Route>
                  </>
                )}

                <Route
                  path="*"
                  element={<LoginPageContainer setToken={setToken} />}
                />
              </>
            )}

            {/* <Route
              path="/reset-password"
              element={<ResetPasswordPageContainer />}
            /> */}

            {/* {!token && (
              <Route
                path="/"
                element={<LoginPageContainer setToken={setToken} />}
              />
            )}

            {token && (
              <>
                <Route
                  element={
                    <>
                      <Header onLogout={handleLogout} />
                      <FooterPaddingStyled>
                        <Outlet />
                      </FooterPaddingStyled>
                      <Footer />
                    </>
                  }
                >
                  <Route
                    path="/"
                    element={
                      <HomePageContainer
                        pageDate={pageDate}
                        onClickNext={onClickNext}
                        onClickPrevious={onClickPrevious}
                      />
                    }
                  />
                  <Route
                    path="/expenses"
                    element={
                      <ExpensesPageContainer
                        pageDate={pageDate}
                        onClickNext={onClickNext}
                        onClickPrevious={onClickPrevious}
                      />
                    }
                  />
                  <Route
                    path="/budget"
                    element={<CategoriesPageContainer />}
                  />
                  <Route
                    path="/saving-goals"
                    element={<SavingGoalsPageContainer />}
                  />
                </Route>
              </>
            )}

            <Route
              path="*"
              element={<LoginPageContainer setToken={setToken} />}
            /> */}
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

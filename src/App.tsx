import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { gql } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import logo from './logo.svg';
import { LoginPageContainer } from "./pages/login-page/login-page-container";
import { HomePageContainer } from "./pages/home-page/home-page-container";
import { ExpensesPageContainer } from "./pages/expenses-page/expenses-page-container";
import "./App.css";
import "react-toastify/dist/ReactToastify.min.css";
import { Header } from "./components/header/header";
import { AUTH_TOKEN } from "./constants";

export const QUERY_CATEGORY_LIST = gql`
  query CategoryList {
    categories {
      name
    }
  }
`;

function App() {
  const [authenticated, setAuthenticated] = useState<string | null>(
    localStorage.getItem(AUTH_TOKEN)
  );

  return (
    <div className="App">
      {/* <CategoriesListContainer /> */}
      <Router>
        {authenticated && <Header setAuthenticated={setAuthenticated} />}
        <Routes>
          <Route
            path="/"
            element={
              authenticated ? (
                <HomePageContainer />
              ) : (
                <LoginPageContainer setAuthenticated={setAuthenticated} />
              )
            }
          />
          <Route path="/expenses" element={<ExpensesPageContainer />} />
          <Route
            path="/login"
            element={<LoginPageContainer setAuthenticated={setAuthenticated} />}
          />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>

      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="colored"
      />
    </div>
  );
}

export default App;

import React from "react";
import { gql } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import logo from './logo.svg';
import { LoginPageContainer } from "./pages/login-page/login-page-container";
import { HomePageContainer } from "./pages/home-page/home-page-container";
import { ExpensesPageContainer } from "./pages/expenses-page/expenses-page-container";
import "./App.css";
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
  const authToken = localStorage.getItem(AUTH_TOKEN);

  return (
    <div className="App">
      {/* <CategoriesListContainer /> */}
      <Router>
        {/* <Header authToken={authToken} /> */}
        <Routes>
          <Route
            path="/"
            element={authToken ? <HomePageContainer /> : <LoginPageContainer />}
          />
          <Route path="/expenses" element={<ExpensesPageContainer />} />
          <Route path="/login" element={<LoginPageContainer />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>

      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}
    </div>
  );
}

export default App;

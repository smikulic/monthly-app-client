import React from "react";
import { gql } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import logo from './logo.svg';
import { HomePageContainer } from "./pages/home-page/home-page-container";
import { ExpensesPageContainer } from "./pages/expenses-page/expenses-page-container";
import "./App.css";

export const QUERY_CATEGORY_LIST = gql`
  query CategoryList {
    categories {
      name
    }
  }
`;

function App() {
  return (
    <div className="App">
      {/* <CategoriesListContainer /> */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePageContainer />} />
          <Route path="/expenses" element={<ExpensesPageContainer />} />
          {/* <Route exact path="/login" element={<Login />} /> */}
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

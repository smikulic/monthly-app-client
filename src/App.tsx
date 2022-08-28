import React from "react";
import { gql } from "@apollo/client";
// import logo from './logo.svg';
import "./App.css";
import { CategoriesListContainer } from "./pages/home-page/home-page-container";

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
      {/* bok ljuuu!! */}
      {/* <CategoriesListContainer /> */}
      <div className="listContainer">
        <div className="listItem">
          Expenses
          <span className="red">3.660,00 kn</span>
        </div>
        <div className="listItem">
          Budget
          <span className="green">15.000,00 kn</span>
        </div>
      </div>
      <div className="actions">
        <div className="green">Add expense</div>
      </div>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;

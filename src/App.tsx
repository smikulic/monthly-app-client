import React, { useState } from "react";
import { Slide, ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import logo from './logo.svg';
import { LoginPageContainer } from "./pages/login-page/login-page-container";
import { HomePageContainer } from "./pages/home-page/home-page-container";
import { ExpensesPageContainer } from "./pages/expenses-page/expenses-page-container";
import "./App.css";
import "react-toastify/dist/ReactToastify.min.css";
import { Header } from "./components/header/header";
import { AUTH_TOKEN } from "./constants";
import { CategoriesPageContainer } from "./pages/categories-page/categories-page-container";

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
          <Route path="/categories" element={<CategoriesPageContainer />} />
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
    </div>
  );
}

export default App;

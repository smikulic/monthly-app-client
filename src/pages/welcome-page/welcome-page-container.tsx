import React from "react";
import { Link } from "react-router-dom";
import "./welcome-page-container.css";

export const WelcomePageContainer = () => {
  return (
    <div className="welcomePage">
      <div className="oval-wrapper">
        <svg viewBox="400 0 500 500" preserveAspectRatio="xMinYMin meet">
          <path
            d="M0,290 C170,240 900,0 1000,140 L1000,00 L0,0 Z"
            style={{ stroke: "none", fill: "#277bc0", opacity: "0.5" }}
            // style={{ stroke: "none", fill: "#46eaa6", opacity: "0.7" }}
          />
          <path
            d="M0,220 C170,220 750,0 1000,140 L1000,00 L0,0 Z"
            style={{ stroke: "none", fill: "#c8e4fc", opacity: "0.4" }}
            // style={{ stroke: "none", fill: "#96fcd2", opacity: "0.6" }}
          />
        </svg>
      </div>
      <div className="welcome-header">
        <Link to="/login" className="button-start">
          Sign In
        </Link>
      </div>
      <div className="welcome-content">
        <h1 className="title">
          <span>A new way to </span>
          <br />
          <span>track your savings!</span>
        </h1>

        <div className="feature-box">
          <span>
            <h3 className="feature-box-title">
              Not sure how much to spend this month?
            </h3>
            <p className="feature-box-description">
              A bunch of apps out there offer complex budget tracking but none
              give insight about how much should you actually save up.
            </p>
          </span>
        </div>
        <div className="feature-box">
          <span>
            <h3 className="feature-box-title">There is a simpler way.</h3>
            <p className="feature-box-description">
              Monthly App offers a quick and easy way to add your expenses,
              organize your budget and have your monthly spending overview.
            </p>
          </span>
        </div>
        <div className="feature-box">
          <span>
            <h3 className="feature-box-title">Monthly is 100% free.</h3>
            <p className="feature-box-description">
              Don't worry, there are no fees involved and no bank accounts
              information needed, Monthly App is just a glorified calculator and
              a way to unload the burden of financial planning.
            </p>
          </span>
        </div>
        <div className="feature-box">
          <Link to="/login" className="button-start">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

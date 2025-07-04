import React from "react";
import CookieConsent from "react-cookie-consent";
import ProductDemoImg from "../../assets/product-demo.png";
import { handleAnalyticsConsent, COOKIE_CONSENT_KEY } from "@/utils/mixpanel";
import "./welcome-page-container.css";

export const WelcomePageContainer = () => {
  const signInUrl =
    import.meta.env.MODE === "production"
      ? "https://app.yourmonthly.app/"
      : "http://localhost:3000/";

  return (
    <div className="welcomePage">
      <div className="oval-wrapper">
        <svg viewBox="400 0 500 500" preserveAspectRatio="xMinYMin meet">
          <path
            d="M0,290 C170,240 900,0 1000,140 L1000,00 L0,0 Z"
            style={{ stroke: "none", fill: "#46eaa6", opacity: "0.7" }}
          />
          <path
            d="M0,220 C170,220 750,0 1000,140 L1000,00 L0,0 Z"
            style={{ stroke: "none", fill: "#96fcd2", opacity: "0.6" }}
          />
        </svg>
      </div>
      <div className="welcome-header">
        <a className="button-start" href={signInUrl}>
          Sign In
        </a>
      </div>
      <div className="welcome-content">
        <div className="headline">
          <h1 className="title">
            <span>An easier way to </span>
            <br />
            <span>track your personal finances!</span>
          </h1>
          <img
            className="product-demo-image"
            src={ProductDemoImg}
            alt="Monthly Product Demo"
          />
        </div>

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

        <br />
        <a className="button-start" href={signInUrl}>
          Get Started
        </a>
        <br />
        <br />
      </div>

      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName={COOKIE_CONSENT_KEY}
        style={{
          background: "#2B373B",
          fontSize: "14px",
          padding: "15px",
        }}
        buttonStyle={{
          backgroundColor: "#46eaa6",
          color: "#2B373B",
          fontSize: "14px",
          padding: "10px 20px",
          borderRadius: "4px",
          fontWeight: "500",
        }}
        declineButtonStyle={{
          backgroundColor: "transparent",
          color: "#fff",
          fontSize: "14px",
          padding: "10px 20px",
          borderRadius: "4px",
          border: "1px solid #fff",
          fontWeight: "500",
        }}
        expires={365}
        onAccept={() => {
          handleAnalyticsConsent(true);
        }}
        onDecline={() => {
          handleAnalyticsConsent(false);
        }}
      >
        This website uses cookies to enhance your experience and provide
        analytics. By clicking "Accept", you consent to our use of cookies for
        analytics purposes. View our{" "}
        <a
          href="/privacy"
          style={{ color: "#46eaa6", textDecoration: "underline" }}
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          href="/terms"
          style={{ color: "#46eaa6", textDecoration: "underline" }}
        >
          Terms & Conditions
        </a>{" "}
        for more details.
      </CookieConsent>
    </div>
  );
};

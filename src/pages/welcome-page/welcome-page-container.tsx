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
              Stop guessing. Monthly shows you where your money can go and why.
            </p>
          </span>
        </div>
        <div className="feature-box">
          <span>
            <h3 className="feature-box-title">Quick, intuitive budgeting</h3>
            <p className="feature-box-description">
              Add expenses in seconds, organize categories, and get an
              at-a-glance view of your month’s spending.
            </p>
          </span>
        </div>
        <div className="feature-box">
          <span>
            <h3 className="feature-box-title">
              Free to start - no bank details
            </h3>
            <p className="feature-box-description">
              Just a simple calculator to lighten your planning load; optional
              premium features may arrive later to help cover server and
              maintenance costs.
            </p>
          </span>
        </div>
        <div className="feature-box">
          <h3 className="feature-box-title">All your finances in one place</h3>
          <p className="feature-box-description">
            Track spending patterns, savings goals, investments, and overall net
            worth, without ever connecting an account.
          </p>
        </div>

        <br />
        <a className="button-start" href={signInUrl}>
          Get Started
        </a>
        <br />
        <br />
      </div>

      <footer
        style={{
          padding: "20px",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <div style={{ fontSize: "14px", color: "#666" }}>
          <a
            href="/about"
            style={{
              color: "#666",
              textDecoration: "none",
              marginRight: "20px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.textDecoration = "underline")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.textDecoration = "none")
            }
          >
            About
          </a>
          <span style={{ marginRight: "20px" }}>•</span>
          <a
            href="/privacy"
            style={{
              color: "#666",
              textDecoration: "none",
              marginRight: "20px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.textDecoration = "underline")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.textDecoration = "none")
            }
          >
            Privacy Policy
          </a>
          <span style={{ marginRight: "20px" }}>•</span>
          <a
            href="/terms"
            style={{
              color: "#666",
              textDecoration: "none",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.textDecoration = "underline")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.textDecoration = "none")
            }
          >
            Terms & Conditions
          </a>
        </div>
      </footer>

      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName={COOKIE_CONSENT_KEY}
        style={{
          background: "rgba(43, 55, 59, 0.9)",
          fontSize: "14px",
          padding: "8px",
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

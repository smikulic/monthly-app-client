import CookieConsent from "react-cookie-consent";
import { handleAnalyticsConsent, COOKIE_CONSENT_KEY } from "@/utils/mixpanel";
// import { FeatureGrid } from "./feature-grid";
import ProductDemoImg from "../../assets/product-demo.png";
import { InstallGuide } from "@/features/pwa/install-guide";
import { tokens } from "@/theme/tokens";
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
            style={{ stroke: "none", fill: tokens.accent.main, opacity: 0.18 }}
          />
          <path
            d="M0,220 C170,220 750,0 1000,140 L1000,00 L0,0 Z"
            style={{ stroke: "none", fill: tokens.accent.main, opacity: 0.1 }}
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
            <span>The budget your </span>
            <br />
            <span>whole household shares</span>
          </h1>
          <img
            className="product-demo-image"
            src={ProductDemoImg}
            alt="Monthly Product Demo"
          />
        </div>

        {/* <p className="subhead">
          Shared envelopes for everyone under one roof - without handing anyone
          your bank login.
        </p> */}

        <div className="feature-box">
          <h3 className="feature-box-title">Share only what you choose</h3>
          <p className="feature-box-description">
            Pick which categories your partner, family or flatmates can see.
            Every shared expense records who paid, and switching between All,
            Personal and each group takes one tap. Your personal budget stays
            private.
          </p>
        </div>
        <div className="feature-box">
          <h3 className="feature-box-title">
            Budgets that change without rewriting history
          </h3>
          <p className="feature-box-description">
            Raise groceries when someone moves in, and last year stays exactly
            as it was. Most apps make you overwrite the old figure or start a
            new category and lose the history.
          </p>
        </div>
        <div className="feature-box">
          <h3 className="feature-box-title">Rollover, or just this month</h3>
          <p className="feature-box-description">
            Unspent budget carries into next month, so an underspent January
            covers a heavy February. One toggle switches between what is left
            overall and what this month alone allows.
          </p>
        </div>
        <div className="feature-box">
          <h3 className="feature-box-title">Know what is safe to spend</h3>
          <p className="feature-box-description">
            Not sure how much is left this month? See what is safe to spend
            today, where each category is pacing, and where the month is
            projected to land - before it lands there.
          </p>
        </div>
        <div className="feature-box">
          <h3 className="feature-box-title">
            Free to start, no bank connection
          </h3>
          <p className="feature-box-description">
            No account linking and no bank details, ever. Export everything you
            enter whenever you want.
          </p>
        </div>

        {/* After the pitch, not before it: someone who has not yet decided
            what this is has no reason to put it on their home screen. Renders
            nothing on a desktop, or once installed. */}
        <InstallGuide />
      </div>

      {/* new feature presentation grid */}
      {/* <FeatureGrid /> */}

      {/* <div className="welcome-content">
        <div
          style={{
            marginTop: "20px",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: tokens.fontSize.hero,
              color: tokens.ink.primary,
              marginBottom: "20px",
              fontWeight: "500",
            }}
          >
            How to get started?
          </h2>
          <p
            style={{
              fontSize: tokens.fontSize.lg,
              color: tokens.ink.secondary,
              marginBottom: "30px",
              maxWidth: "600px",
              margin: "0 auto 30px auto",
            }}
          >
            Watch this quick 2-minute overview to see how Monthly can simplify
            your financial planning.
          </p>

          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%", // 16:9 aspect ratio
              height: 0,
              overflow: "hidden",
              maxWidth: "800px",
              margin: "0 auto",
              backgroundColor: tokens.hairline,
              borderRadius: `${tokens.radius.md}px`,
              boxShadow: "0 8px 32px rgba(20, 18, 15, 0.08)",
            }}
          >
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "8px",
              }}
              src="https://www.youtube.com/embed/aeRSCK--kls"
              title="How to get started with Monthly"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <br />
        <a className="button-start" href={signInUrl}>
          Get Started
        </a>
        <br />
        <br />
      </div> */}

      <footer
        style={{
          padding: "20px",
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <div
          style={{ fontSize: tokens.fontSize.sm, color: tokens.ink.secondary }}
        >
          <a
            href="/about"
            style={{
              color: tokens.ink.secondary,
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
              color: tokens.ink.secondary,
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
              color: tokens.ink.secondary,
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
          background: tokens.ink.primary,
          fontSize: tokens.fontSize.sm,
          padding: "5px",
        }}
        buttonStyle={{
          backgroundColor: tokens.accent.main,
          color: tokens.accent.contrastText,
          fontSize: tokens.fontSize.sm,
          padding: "8px 18px",
          borderRadius: "4px",
          fontWeight: "500",
        }}
        declineButtonStyle={{
          backgroundColor: "transparent",
          color: tokens.ground,
          fontSize: tokens.fontSize.sm,
          padding: "8px 18px",
          borderRadius: "4px",
          border: `1px solid ${tokens.ground}`,
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
          style={{ color: tokens.section[4], textDecoration: "underline" }}
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          href="/terms"
          style={{ color: tokens.section[4], textDecoration: "underline" }}
        >
          Terms & Conditions
        </a>{" "}
        for more details.
      </CookieConsent>
    </div>
  );
};

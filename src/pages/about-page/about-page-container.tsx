import React from "react";

export const AboutPageContainer = () => {
  return (
    <div
      className="aboutPage"
      style={{
        padding: "32px",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Subtle background accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "linear-gradient(135deg, #41efcd 0%, #96fcd2 100%)",
          opacity: 0.03,
          zIndex: -1,
        }}
      ></div>
      <h1
        style={{
          color: "#333",
          fontSize: "42px",
          textAlign: "center",
          marginBottom: "40px",
          fontWeight: "600",
        }}
      >
        About Monthly
      </h1>

      <h2
        style={{
          color: "#555",
          fontSize: "26px",
          marginBottom: "16px",
          fontWeight: "500",
          borderBottom: "2px solid #41efcd",
          paddingBottom: "8px",
          display: "inline-block",
        }}
      >
        Hi, I'm a Budgeting Enthusiast!
      </h2>
      <p>
        Welcome to Monthly! I'm passionate about personal finance and have
        always been fascinated by how simple tracking and awareness can
        transform our financial lives. What started as spreadsheets and
        notebooks has evolved into this app that I'm excited to share with you.
      </p>

      <h2
        style={{
          color: "#555",
          fontSize: "26px",
          marginBottom: "16px",
          fontWeight: "500",
          borderBottom: "2px solid #41efcd",
          paddingBottom: "8px",
          display: "inline-block",
        }}
      >
        Why I Built Monthly
      </h2>
      <p>
        Over the years, I've watched friends and family struggle with complex
        budgeting apps that felt overwhelming or required too much personal
        information. Many would start with enthusiasm but give up after a few
        weeks because the tools were just too complicated.
      </p>
      <p>
        I realized what people really needed wasn't another sophisticated
        financial platform – they needed something simple, private, and focused
        on the basics: tracking expenses, setting budgets, and getting a clear
        picture of their financial landscape.
      </p>
      <p>
        That's when I decided to build Monthly. I wanted to create the app I
        wished existed – one that my friends and family would actually use and
        stick with.
      </p>

      <h2
        style={{
          color: "#555",
          fontSize: "26px",
          marginBottom: "16px",
          fontWeight: "500",
          borderBottom: "2px solid #41efcd",
          paddingBottom: "8px",
          display: "inline-block",
        }}
      >
        My Mission
      </h2>
      <p>
        My mission with Monthly is simple:{" "}
        <strong style={{ color: "#2c5530" }}>
          to help people take control of their finances without the complexity
          or privacy concerns of traditional finance apps.
        </strong>
      </p>
      <p>I believe that:</p>
      <ul>
        <li>
          <strong style={{ color: "#2c5530" }}>
            Financial tracking should be simple
          </strong>{" "}
          – You shouldn't need an accounting degree to understand where your
          money goes
        </li>
        <li>
          <strong style={{ color: "#2c5530" }}>Privacy matters</strong> – Your
          financial data is yours alone. Monthly doesn't require bank
          connections or sensitive information
        </li>
        <li>
          <strong style={{ color: "#2c5530" }}>
            Free tools can be powerful
          </strong>{" "}
          – Everyone deserves access to financial planning tools, regardless of
          their budget
        </li>
        <li>
          <strong style={{ color: "#2c5530" }}>
            Small steps lead to big changes
          </strong>{" "}
          – Just tracking your expenses can be the first step toward financial
          freedom
        </li>
      </ul>

      <h2
        style={{
          color: "#555",
          fontSize: "26px",
          marginBottom: "16px",
          fontWeight: "500",
          borderBottom: "2px solid #41efcd",
          paddingBottom: "8px",
          display: "inline-block",
        }}
      >
        What Makes Monthly Different
      </h2>
      <p>Monthly is built with simplicity at its core:</p>
      <ul>
        <li>No bank account connections required</li>
        <li>No complicated features you'll never use</li>
        <li>
          Just straightforward expense tracking, budgeting, and financial
          overview
        </li>
      </ul>

      <h2
        style={{
          color: "#555",
          fontSize: "26px",
          marginBottom: "16px",
          fontWeight: "500",
          borderBottom: "2px solid #41efcd",
          paddingBottom: "8px",
          display: "inline-block",
        }}
      >
        Join Me on This Journey
      </h2>
      <p>
        Whether you're just starting to think about budgeting or you're looking
        for a simpler way to track your finances, I'm thrilled you're here.
        Monthly is more than just an app – it's a community of people taking
        control of their financial future, one expense at a time.
      </p>
      <p>
        I'm constantly working to improve Monthly based on feedback from users
        like you. If you have suggestions, questions, or just want to share your
        budgeting success story, I'd love to hear from you! So please,{" "}
        <a
          data-testid="footer"
          href="https://forms.gle/a59QBuddeMJf2S64A"
          target="_blank"
          rel="noreferrer"
          style={{
            color: "#2c5530",
            textDecoration: "underline",
            fontWeight: "500",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#41efcd";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#2c5530";
          }}
        >
          Leave a feedback or suggestion here :)
        </a>
      </p>
      <p>
        Here's to your financial journey – may it be clearer, simpler, and more
        empowering with Monthly by your side.
      </p>
    </div>
  );
};

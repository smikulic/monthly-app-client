import React from "react";
import useEmblaCarousel from "embla-carousel-react";

import NetWorthImg from "../../assets/monthly-demo-net-worth.png";
import SavingGoalsImg from "../../assets/monthly-demo-saving-goals.png";
import SpendingChartImg from "../../assets/monthly-demo-chart.png";
import RolloverImg from "../../assets/monthly-demo-rollover.png";
import { PrevButton, NextButton, usePrevNextButtons } from "./arrow-buttons";

export const FeatureGrid: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const features = [
    {
      image: RolloverImg,
      alt: "Rollover budgeting screenshot",
      title: "Rollover Budgeting",
      description:
        "Stay on track even when life gets unpredictable. One‑off expenses don’t derail your budget: Monthly lets unused budget roll over and balances overspending across upcoming months.",
    },
    {
      image: SpendingChartImg,
      alt: "Spending breakdown screenshot",
      title: "Spending Breakdown",
      description:
        "Spot trends and overspending quickly. The intelligent spending chart shows where your money goes by category, highlighting your biggest spenders to help you adjust.",
    },
    {
      image: SavingGoalsImg,
      alt: "Saving goals screenshot",
      title: "Saving Goals",
      description:
        "Plan bigger purchases with confidence. Set a target and Monthly calculates how much you need to save each month, then tracks your progress until you hit your goal.",
    },
    {
      image: NetWorthImg,
      alt: "Net worth screenshot",
      title: "Net Worth Tracking",
      description:
        "See your entire financial picture at a glance. Monthly adds up your accounts and investments so you always know your total net worth and how your money is distributed.",
    },
  ];

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {features.map((feature, index) => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">
                <div
                  key={feature.title}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "100%",
                    // border: "2px solid",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    padding: "12px",
                  }}
                >
                  <div
                    style={{
                      height: "330px",
                      paddingBottom: "20px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={feature.image}
                      alt={feature.alt}
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      height: "120px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "18px",
                        margin: 0,
                        marginTop: "8px",
                        fontWeight: 600,
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "16px",
                        fontStyle: "italic",
                        fontWeight: "400",
                        marginTop: "8px",
                        color: "#767676",
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </section>
  );
};

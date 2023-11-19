// import accounting from "accounting";

export const formatAmount = (amount: number, userCurrency?: string): string => {
  let intlCurrency = Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });

  if (userCurrency === "USD") {
    intlCurrency = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  }

  if (userCurrency === "GBP") {
    intlCurrency = Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    });
  }

  if (userCurrency === "CAD") {
    intlCurrency = Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    });
  }

  return intlCurrency.format(amount);

  // return accounting.formatMoney(amount, {
  //   symbol: "€",
  //   format: "%v %s",
  //   precision: 0,
  // });
};

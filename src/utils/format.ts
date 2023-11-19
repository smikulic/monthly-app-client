// import accounting from "accounting";

export const formatAmount = (amount: number, userCurrency?: string): string => {
  let intlCurrency = Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: "EUR",
  });

  if (userCurrency === "USD") {
    intlCurrency = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  if (userCurrency === "GBP") {
    intlCurrency = Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    });
  }

  if (userCurrency === "CAD") {
    intlCurrency = Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    });
  }

  return intlCurrency.format(amount);

  // return accounting.formatMoney(amount, {
  //   symbol: "€",
  //   format: "%v %s",
  //   precision: 0,
  // });
};

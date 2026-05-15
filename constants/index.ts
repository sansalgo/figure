import type { ColorVariants } from "@/types";
import type { Icon } from "@phosphor-icons/react";
import {
  CurrencyBtcIcon,
  CurrencyCnyIcon,
  CurrencyDollarIcon,
  CurrencyEthIcon,
  CurrencyEurIcon,
  CurrencyGbpIcon,
  CurrencyInrIcon,
  CurrencyJpyIcon,
  CurrencyKrwIcon,
  CurrencyKztIcon,
  CurrencyNgnIcon,
  CurrencyRubIcon,
} from "@phosphor-icons/react";

export const currencies = [
  "DOLLAR",
  "EURO",
  "POUND",
  "YEN",
  "RUPEE",
  "WON",
  "CNY",
  "RUB",
  "NGN",
  "KZT",
  "BTC",
  "ETH",
];

export const currencyIcons: Record<string, Icon> = {
  DOLLAR: CurrencyDollarIcon,
  EURO: CurrencyEurIcon,
  POUND: CurrencyGbpIcon,
  YEN: CurrencyJpyIcon,
  RUPEE: CurrencyInrIcon,
  WON: CurrencyKrwIcon,
  CNY: CurrencyCnyIcon,
  RUB: CurrencyRubIcon,
  NGN: CurrencyNgnIcon,
  KZT: CurrencyKztIcon,
  BTC: CurrencyBtcIcon,
  ETH: CurrencyEthIcon,
};

export const currencyNames: Record<string, string> = {
  DOLLAR: "Dollar",
  EURO: "Euro",
  POUND: "Pound",
  YEN: "Yen",
  RUPEE: "Rupee",
  WON: "Won",
  CNY: "Yuan",
  RUB: "Ruble",
  NGN: "Naira",
  KZT: "Tenge",
  BTC: "Bitcoin",
  ETH: "Ethereum",
};

export const colors: Record<string, ColorVariants> = {
  DEFAULT: {
    V0: "rgb(255, 255, 255)",
    V1: "rgba(84, 72, 49, 0.15)",
    V2: "rgb(50, 48, 44)",
  },
  GRAY: {
    V0: "rgb(248, 248, 247)",
    V1: "rgba(84, 72, 49, 0.15)",
    V2: "rgba(71, 70, 68, 0.6)",
  },
  BROWN: {
    V0: "rgb(244, 238, 238)",
    V1: "rgba(210, 162, 141, 0.35)",
    V2: "rgba(156, 76, 40, 0.68)",
  },
  ORANGE: {
    V0: "rgb(251, 236, 221)",
    V1: "rgba(224, 124, 57, 0.27)",
    V2: "rgba(217, 95, 13, 0.82)",
  },
  YELLOW: {
    V0: "rgb(251, 243, 219)",
    V1: "rgba(236, 191, 66, 0.39)",
    V2: "rgba(192, 125, 0, 0.82)",
  },
  GREEN: {
    V0: "rgb(237, 243, 236)",
    V1: "rgba(123, 183, 129, 0.27)",
    V2: "rgba(66, 133, 90, 0.82)",
  },
  BLUE: {
    V0: "rgb(231, 243, 248)",
    V1: "rgba(93, 165, 206, 0.27)",
    V2: "rgba(54, 129, 177, 0.82)",
  },
  PURPLE: {
    V0: "rgb(248, 243, 252)",
    V1: "rgba(168, 129, 197, 0.27)",
    V2: "rgba(148, 103, 182, 0.82)",
  },
  PINK: {
    V0: "rgb(252, 241, 246)",
    V1: "rgba(225, 136, 179, 0.27)",
    V2: "rgba(196, 84, 138, 0.82)",
  },
  RED: {
    V0: "rgb(253, 235, 236)",
    V1: "rgba(244, 171, 159, 0.4)",
    V2: "rgba(215, 38, 21, 0.68)",
  },
};

export const colorNames = [
  "DEFAULT",
  "GRAY",
  "BROWN",
  "ORANGE",
  "YELLOW",
  "GREEN",
  "BLUE",
  "PURPLE",
  "PINK",
  "RED",
];

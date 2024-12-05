import type { LocationsType } from "~/src/utils/types";

export const airportsHubDefaults: LocationsType[] = [
  {
    country: "Germany",
    code: "DE",
    locations: [
      { name: "Bayern", id: 978 },
      { name: "Berlin", id: 979 },
      { name: "Hamburg", id: 941 },
      { name: "Sachsen-Anhalt", id: 989 },
      { name: "Baden-Württemberg", id: 977 },
    ],
  },
  {
    country: "United Kingdom",
    code: "GB",
    locations: [
      { name: "City of London", id: 98367 },
      { name: "Edinburgh", id: 98642 },
      { name: "Liverpool", id: 98553 },
      { name: "Manchester", id: 98554 },
      { name: "Glasgow", id: 98664 },
    ],
  },
  {
    country: "France",
    code: "FR",
    locations: [
      { name: "Paris", id: 53642 },
      { name: "Nantes", id: 98883 },
      { name: "Nice", id: 79775 },
      { name: "Montreuil", id: 99025 },
      { name: "Lyon", id: 79460 },
    ],
  },
  {
    country: "Spain",
    code: "ES",
    locations: [
      { name: "Madrid", id: 53507 },
      { name: "Barcelona", id: 53497 },
      { name: "Valencia", id: 53513 },
      { name: "Sevilla", id: 53461 },
      { name: "Málaga", id: 53460 },
    ],
  },
  {
    country: "Italy",
    code: "IT",
    locations: [
      { name: "Rome", id: 98904 },
      { name: "Milano", id: 55147 },
      { name: "Genova", id: 55122 },
      { name: "Napoli", id: 55102 },
      { name: "Florence", id: 55196 },
    ],
  },
  {
    country: "Netherlands",
    code: "NL",
    locations: [
      { name: "Amsterdam", id: 55638 },
      { name: "Rotterdam", id: 55778 },
    ],
  },
  {
    country: "Belgium",
    code: "BE",
    locations: [
      { name: "Brussel", id: 65891 },
      { name: "Gent", id: 65903 },
    ],
  },
  {
    country: "United States of America",
    code: "US",
    locations: [
      { name: "California", id: 3481 },
      { name: "Montana", id: 3508 },
      { name: "New York", id: 3514 },
      { name: "Arizona", id: 3471 },
      { name: "Texas", id: 3524 },
      { name: "Colorado", id: 3482 },
      { name: "Tennessee", id: 3523 },
      { name: "Virginia", id: 3527 },
    ],
  },
];

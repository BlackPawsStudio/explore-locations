import type { LocationsType } from "~/src/utils/types";
import { drivingHubDefaults } from "./drivingHubDefaults";
import { flyingHubDefaults } from "./flyingHubDefaults";

export const homePageDefaults = {
  "Airports By Country": [
    {
      country: "United States of America",
      code: "US",
      id: 248,
      locations: [
        { name: "California", id: 3481 },
        { name: "Florida", id: 3477 },
        { name: "New York", id: 3514 },
        { name: "Washington", id: 3528 },
        { name: "Texas", id: 3524 },
      ],
    },
    {
      country: "United Kingdom",
      code: "GB",
      id: 247,
      locations: [
        { name: "England", id: 1251 },
        { name: "Scotland", id: 1249 },
        { name: "Wales", id: 1250 },
      ],
    },
    {
      country: "Spain",
      code: "ES",
      id: 225,
      locations: [
        { name: "Barcelona", id: 53497 },
        { name: "Madrid", id: 53507 },
        { name: "Valencia", id: 53513 },
      ],
    },
    {
      country: "Italy",
      code: "IT",
      id: 119,
      locations: [
        { name: "Rome", id: 98904 },
        { name: "Milano", id: 55147 },
      ],
    },
    {
      country: "Germany",
      code: "DE",
      id: 106,
      locations: [
        { name: "Bayern", id: 978 },
        { name: "Berlin", id: 979 },
        { name: "Hessen", id: 948 },
      ],
    },
    {
      country: "France",
      code: "FR",
      id: 99,
      locations: [{ name: "Paris", id: 53642 }],
    },
    { country: "Portugal", code: "PT", id: 206, locations: [] },
    { country: "Ireland", code: "IE", id: 142, locations: [] },
    { country: "Belgium", code: "BE", id: 37, locations: [] },
    { country: "Netherlands", code: "NL", id: 172, locations: [] },
    { country: "Austria", code: "AT", id: 22, locations: [] },
    { country: "Switzerland", code: "CH", id: 231, locations: [] },
    { country: "Slovenia", code: "SI", id: 219, locations: [] },
    { country: "Romania", code: "RO", id: 208, locations: [] },
    { country: "Greece", code: "GR", id: 112, locations: [] },
    { country: "Turkey", code: "TR", id: 241, locations: [] },
    { country: "Czech Republic", code: "CZ", id: 80, locations: [] },
    { country: "Poland", code: "PL", id: 205, locations: [] },
    { country: "Norway", code: "NO", id: 85, locations: [] },
    { country: "Sweden", code: "SE", id: 228, locations: [] },
    { country: "Finland", code: "FI", id: 98, locations: [] },
    { country: "Japan", code: "JP", id: 123, locations: [] },
    { country: "United Arab Emirates", code: "AE", id: 246, locations: [] },
    { country: "Brazil", code: "BR", id: 49, locations: [] },
    { country: "Argentina", code: "AR", id: 18, locations: [] },
    { country: "Australia", code: "AU", id: 21, locations: [] },
  ] as LocationsType[],
  "Popular Flying Routes": flyingHubDefaults,
  "Popular Driving Routes": drivingHubDefaults,
};

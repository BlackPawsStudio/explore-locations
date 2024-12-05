import type { LocationsType } from "~/src/utils/types";

export const drivingHubDefaults: LocationsType[] = [
  {
    country: "Germany",
    code: "DE",
    locations: [
      { name: "Berlin to Munich", id: 97650 },
      { name: "Berlin to Stuttgart", id: 99735 },
      { name: "Munich to Stuttgart", id: 60201 },
      { name: "Stuttgart to Potsdam", id: 98867 },
      { name: "Dortmund to Brussels ", id: 68676 },
    ],
  },
  {
    country: "United Kingdom",
    code: "GB",
    locations: [
      { name: "Brighton to City of London", id: 35776 },
      { name: "London to Manchester", id: 181045 },
      { name: "London to Edinburgh", id: 101095 },
      { name: "Birmingham to Edinburgh", id: 187482 },
      { name: "London to Liverpool", id: 181968 },
    ],
  },
  {
    country: "France",
    code: "FR",
    locations: [
      { name: "Paris to Marseille", id: 104916 },
      { name: "Lyon to Paris", id: 90102 },
      { name: "Paris to Brussels", id: 75996 },
      { name: "Paris to Nantes", id: 83197 },
      { name: "Paris to Basel", id: 96780 },
    ],
  },
  {
    country: "Spain",
    code: "ES",
    locations: [
      { name: "Barcelona to Madrid", id: 99084 },
      { name: "Barcelona to Valencia", id: 79422 },
      { name: "Malaga to Madrid", id: 189671 },
      { name: "Madrid to Valencia", id: 80293 },
      { name: "Madrid to Bilbao", id: 184244 },
    ],
  },
  {
    country: "Italy",
    code: "IT",
    locations: [
      { name: "Milano to Rome", id: 97269 },
      { name: "Rome to Venice", id: 94930 },
      { name: "Milano to Napoli", id: 104907 },
      { name: "Rome to Palermo", id: 109239 },
      { name: "Rome to Turin", id: 102308 },
    ],
  },
  {
    country: "Netherlands",
    code: "NL",
    locations: [
      { name: "Rotterdam to Amsterdam", id: 455 },
      { name: "Amsterdam to Groningen", id: 52568 },
      { name: "Amsterdam to Brussels", id: 58018 },
      { name: "Amsterdam to Groningen", id: 52568 },
      { name: "Amsterdam to Paris", id: 93681 },
    ],
  },
  {
    country: "Belgium",
    code: "BE",
    locations: [
      { name: "Paris to Brussels", id: 75996 },
      { name: "Amsterdam to Brussels", id: 58018 },
      { name: "Brussels to Vienna", id: 113014 },
      { name: "Brussels to London", id: 182876 },
      { name: "Brussels to Vienna", id: 113014 },
    ],
  },
  {
    country: "United States of America",
    code: "US",
    locations: [
      { name: "Orlando to Miami", id: 82607 },
      { name: "San Francisco to San Jose del Cabo", id: 133324 },
      { name: "Portland to Seattle", id: 70074 },
      { name: "San Francisco to Tijuana", id: 106738 },
      { name: "New York City to Niagara Falls", id: 100869 },
    ],
  },
  {
    country: "Canada",
    code: "CA",
    locations: [
      { name: "Montreal to Ottawa", id: 170140 },
      { name: "Ottawa to Toronto", id: 88960 },
      { name: "Seattle to Vancouver", id: 61198 },
      { name: "Toronto to Vancouver", id: 214601 },
      { name: "Montreal to Baie-Comeau", id: 101296 },
    ],
  },
];

import type { ReactNode } from "react";

export type CoordinatesType = [number, number][][][];
export interface AirportItem {
  id: number;
  Name: string;
  NameEn: string;
  Type: AirportType;
  IATA: string;
  ICAO: string;
  City: string;
  Country: string;
  CenterX: number;
  CenterY: number;
  Distance?: number;
  Passengers: number;
  IntroEn: string;
  SeoTitleEn: string;
  SeoDescriptionEn: string;
  TimezoneD: string;
  Geometry: GeometryType;
  RegionId: number;
}

export interface GeometryType {
  type: string;
  coordinates: CoordinatesType;
}

export interface RegionType {
  id: number;
  Distance?: number;
  Name: string;
  Type: string;
  IdParent: string;
  Geometry: GeometryType | null;
  CenterX?: number;
  CenterY?: number;
  closeAirportsCount?: number;
  // Code: string;
  // Country: string;
  // CountryI2: number;
  // TypeLocal: string;
  // TypeEn: string;
  // Points2: string;
}

export type AirportType = "All" | "International" | "Domestic" | "Local";

export interface FlightDistanceType {
  id: number;
  LengthKm: number;
  LengthMiles: number;
  FlightDuration: string;
  OriginCityName: string;
  DestinationCityName: string;
  OriginAirportId: number;
  DestinationAirportId: number;
}

export interface DrivingDistanceType {
  id: number;
  DistanceKm: number;
  DistanceMiles: number;
  FlightDistance: number;
  FlightDistanceMiles: number;
  DrivingTime: string;
  RegionFromCityName: string;
  RegionToCityName: string;
  RegionFromCityId: string;
  RegionToCityId: string;
  CountryFromName: string;
  CountryToName: string;
  OriginCenterX: number;
  OriginCenterY: number;
  DestinationCenterX: number;
  DestinationCenterY: number;
  RegionFromId: number;
  RegionToId: number;
}

export interface CityType {
  id: number;
  CenterX: number;
  CenterY: number;
  Name: string;
  Type: string;
  NameAlt: string;
  Country: string;
  ISO2: string;
  ISO3: string;
  ParentADM: string;
  Capital: string;
  Population: string;
}

export interface LocationsType {
  country: string;
  code: string;
  id?: number;
  locations: {
    name: string;
    id: number;
  }[];
}

export interface AirportsCountType {
  international: number;
  domestic: number;
  local: number;
  all: number;
}

export interface FaqType {
  question: string;
  answer: ReactNode | ReactNode[];
}

export interface CountryLocationType {
  name: string;
  id: number;
  code: string;
}

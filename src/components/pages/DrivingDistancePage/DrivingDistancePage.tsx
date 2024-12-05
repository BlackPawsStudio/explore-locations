import { Footer } from "../../Footer";
import { Header } from "../../Header";
import { DescriptionSection } from "./subcomponents/DescriptionSection";
import { InfoSection } from "./subcomponents/InfoSection";
import { MapSection } from "./subcomponents/MapSection";
import { RouterSection } from "./subcomponents/RouterSection";
import { CitiesSection } from "./subcomponents/CitiesSection";
import { RelatedFlightsSection } from "./subcomponents/RelatedFlightsSection/RelatedFlightsSection";
import { MoreSection } from "./subcomponents/MoreSection";
import { FAQSection } from "../../shared/FAQSection";
import type { CityType, DrivingDistanceType } from "~/src/utils/types";
import Head from "next/head";
import { api } from "~/src/utils/api";
import { Loader } from "../../shared/Loader/Loader";
import { useMemo } from "react";

interface DrivingDistancePageProps {
  drivingDistanceData: DrivingDistanceType;
  originCity: CityType | null;
  destinationCity: CityType | null;
}

export const DrivingDistancePage = ({
  drivingDistanceData,
  originCity,
  destinationCity,
}: DrivingDistancePageProps) => {
  const {
    id,
    CountryFromName,
    CountryToName,
    DestinationCenterX,
    DestinationCenterY,
    DistanceKm,
    DistanceMiles,
    FlightDistance,
    FlightDistanceMiles,
    DrivingTime,
    OriginCenterX,
    OriginCenterY,
    RegionFromCityName,
    RegionToCityName,
    RegionFromId,
    RegionToId,
  } = drivingDistanceData;
  // provide country id
  const { data: countryCodesData } =
    api.countryCodeRouter.getCountryCodes.useQuery({
      fromId: RegionFromId,
      toId: RegionToId,
    });

  const countryFromCode = useMemo(
    () => (countryCodesData ? countryCodesData.countryFromCode : null),
    [countryCodesData]
  );
  const countryToCode = useMemo(
    () => (countryCodesData ? countryCodesData.countryToCode : null),
    [countryCodesData]
  );

  const { data: relatedDistances, isLoading: isRelatedDistancesLoading } =
    api.drivingRoutePageClient.getRelatedDistances.useQuery({
      nameOrigin: RegionToCityName,
      nameDestination: RegionFromCityName,
      id: id,
    });

  return (
    <>
      <Head>
        <title>{`Distance from ${RegionFromCityName} to ${RegionToCityName} - ExploreLocations.com`}</title>
        <meta
          name="description"
          content={`The driving distance from ${RegionFromCityName} to ${RegionToCityName} is ${DistanceKm.toLocaleString(
            "en-US"
          )} kilometers / ${DistanceMiles.toLocaleString(
            "en-US"
          )} miles. Check the route on the map and explore everything about it.`}
        />
      </Head>
      <Header />
      <main className="mb-5 min-h-screen lg:mb-10">
        <RouterSection />
        <DescriptionSection
          from={RegionFromCityName}
          to={RegionToCityName}
          time={DrivingTime}
          distance={DistanceKm}
          distanceMiles={DistanceMiles}
          countryFromCode={countryFromCode}
          countryToCode={countryToCode}
        />
        <MapSection
          from={RegionFromCityName}
          to={RegionToCityName}
          originX={OriginCenterX}
          originY={OriginCenterY}
          destinationX={DestinationCenterX}
          destinationY={DestinationCenterY}
        />
        <InfoSection
          countryFrom={CountryFromName}
          countryTo={CountryToName}
          time={DrivingTime}
          distance={DistanceKm}
          distanceMiles={DistanceMiles}
          flightKm={FlightDistance}
          flightMiles={FlightDistanceMiles}
          from={RegionFromCityName}
          to={RegionToCityName}
          originX={OriginCenterX}
          originY={OriginCenterY}
          destinationX={DestinationCenterX}
          destinationY={DestinationCenterY}
        />
        <CitiesSection
          originX={OriginCenterX}
          originY={OriginCenterY}
          destinationX={DestinationCenterX}
          destinationY={DestinationCenterY}
          countryFrom={CountryFromName}
          countryTo={CountryToName}
          from={RegionFromCityName}
          to={RegionToCityName}
          dataFrom={originCity}
          dataTo={destinationCity}
          countryFromCode={countryFromCode}
          countryToCode={countryToCode}
          fromId={RegionFromId}
          toId={RegionToId}
        />
        <FAQSection />
        {isRelatedDistancesLoading ? (
          <Loader width={60} />
        ) : (
          relatedDistances && (
            <RelatedFlightsSection
              fromCity={RegionFromCityName}
              toCity={RegionToCityName}
              relatedDestinationDistances={
                relatedDistances.relatedOriginDistances
              }
              relatedOriginDistances={
                relatedDistances.relatedDestinationDistances
              }
            />
          )
        )}
        <MoreSection country={RegionFromCityName} id={RegionFromId} />
        {CountryFromName !== CountryToName && (
          <MoreSection country={RegionToCityName} id={RegionToId} />
        )}
      </main>
      <Footer />
    </>
  );
};

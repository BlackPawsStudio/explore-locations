import { Footer } from "../../Footer";
import { Header } from "../../Header";
import { FAQSection } from "../../shared/FAQSection";
import { DescriptionSection } from "./subcomponents/DescriptionSection";
import { InfoSection } from "./subcomponents/InfoSection";
import { MapSection } from "./subcomponents/MapSection";
import { RouterSection } from "./subcomponents/RouterSection";
import { AirportsSection } from "./subcomponents/AirportsSection";
import { RelatedFlightsSection } from "./subcomponents/RelatedFlightsSection/RelatedFlightsSection";
import { MoreSection } from "./subcomponents/MoreSection";
import type { AirportItem, FlightDistanceType } from "~/src/utils/types";
import Head from "next/head";
import { useMemo } from "react";
import { api } from "~/src/utils/api";
import { Loader } from "../../shared/Loader/Loader";

interface FlyingDistancePageProps {
  data: FlightDistanceType;
  originAirport: AirportItem;
  destinationAirport: AirportItem;
}

export const FlyingDistancePage = ({
  data,
  originAirport,
  destinationAirport,
}: FlyingDistancePageProps) => {
  const { data: countryCodesData } =
    api.countryCodeRouter.getCountryCodes.useQuery({
      fromId: originAirport.RegionId,
      toId: destinationAirport.RegionId,
    });

  const countryFromCode = useMemo(
    () => (countryCodesData ? countryCodesData.countryFromCode : null),
    [countryCodesData]
  );
  const countryToCode = useMemo(
    () => (countryCodesData ? countryCodesData.countryToCode : null),
    [countryCodesData]
  );

  const { data: relatedAirports, isLoading: isRelatedAirportsLoading } =
    api.flyingRoutePageClient.getRelatedDistances.useQuery({
      OriginCityName: data.OriginCityName,
      DestinationCityName: data.DestinationCityName,
      id: data.id,
    });

  const { data: airportsAround, isLoading: isAirportsAroundLoading } =
    api.flyingRoutePageClient.getAirportAround.useQuery({
      origin: {
        CenterX: originAirport.CenterX,
        CenterY: originAirport.CenterY,
        id: originAirport.id,
      },
      destination: {
        CenterX: destinationAirport.CenterX,
        CenterY: destinationAirport.CenterY,
        id: destinationAirport.id,
      },
    });

  return (
    <>
      <Head>
        <title>{`${originAirport.City} to ${destinationAirport.City} Flight Time`}</title>
        <meta
          name="description"
          content={`Explore how long is the flight time, distance, and route between ${originAirport.City}, ${originAirport.Country} and ${destinationAirport.City}, ${destinationAirport.Country}`}
        />
      </Head>
      <Header />
      <main className="mb-5 min-h-screen lg:mb-10">
        <RouterSection />
        <DescriptionSection
          OriginCityName={originAirport.City}
          DestinationCityName={destinationAirport.City}
          OriginCountryName={originAirport.Country}
          DestinationCountryName={destinationAirport.Country}
          FlightDuration={data.FlightDuration}
          DistanceKm={data.LengthKm}
          DistanceMiles={data.LengthMiles}
          countryFromCode={countryFromCode}
          countryToCode={countryToCode}
        />
        <MapSection
          OriginCenterX={originAirport.CenterX}
          OriginCenterY={originAirport.CenterY}
          DestinationCenterX={destinationAirport.CenterX}
          DestinationCenterY={destinationAirport.CenterY}
          FlightDuration={data.FlightDuration}
          LengthKm={data.LengthKm}
          OriginCityName={originAirport.City}
          DestinationCityName={destinationAirport.City}
        />
        <InfoSection
          FlightDuration={data.FlightDuration}
          DistanceKm={data.LengthKm}
          DistanceMiles={data.LengthMiles}
          airportsAroundOrigin={
            airportsAround ? airportsAround.airportsAroundOrigin : null
          }
          airportsAroundDestination={
            airportsAround ? airportsAround.airportsAroundDestination : null
          }
          originAirport={originAirport}
          destinationAirport={destinationAirport}
          countryFromCode={countryFromCode}
          countryToCode={countryToCode}
          isLoading={isAirportsAroundLoading}
        />
        <AirportsSection
          originAirport={originAirport}
          destinationAirport={destinationAirport}
          countryFromCode={countryFromCode}
          countryToCode={countryToCode}
        />
        <FAQSection />
        {isRelatedAirportsLoading ? (
          <Loader width={60} />
        ) : relatedAirports ? (
          <RelatedFlightsSection
            originCountry={data.OriginCityName}
            destinationCountry={data.DestinationCityName}
            relatedOriginAirports={relatedAirports.relatedOriginAirports}
            relatedDestinationAirports={
              relatedAirports.relatedDestinationAirports
            }
          />
        ) : (
          <></>
        )}
        <MoreSection country={originAirport.City} id={originAirport.RegionId} />
        <MoreSection
          country={destinationAirport.City}
          id={destinationAirport.RegionId}
        />
      </main>
      <Footer />
    </>
  );
};

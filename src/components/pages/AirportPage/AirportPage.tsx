import Head from "next/head";
import { api } from "~/src/utils/api";
import type { AirportItem, RegionType } from "~/src/utils/types";
import { Footer } from "../../Footer/Footer";
import { Header } from "../../Header";
import { Loader } from "../../shared/Loader/Loader";
import { AirportsAroundSection } from "./subcomponents/AirportsAroundSection/AirportsAroundSection";
import { AllAirportsSection } from "./subcomponents/AllAirportsSection";
import { DescriptionSection } from "./subcomponents/DescriptionSection";
import { InfoSection } from "./subcomponents/InfoSection";
import { MapSection } from "./subcomponents/MapSection";
import { RouterSection } from "./subcomponents/RouterSection";
import { useMemo } from "react";
import { getCountryCode } from "~/src/utils/getCountryCode";

interface IHomePage {
  airport: AirportItem;
  regionTree: RegionType[];
}

export const AirportPage = ({ airport, regionTree }: IHomePage) => {
  const { data: airportsAround, isLoading: isAirportsAroundLoading } =
    api.airportPageClient.getAirportsAround.useQuery({
      CenterX: airport.CenterX,
      CenterY: airport.CenterY,
      id: airport.id,
    });

  const regionId = useMemo(
    () => regionTree.find((el) => el.id === airport.RegionId)?.id,
    [airport.RegionId, regionTree]
  );

  const { data: regions, isLoading: isRegionsLoading } =
    api.airportPageClient.getChildRegions.useQuery(regionId || 0);

  const countryCode = useMemo(
    () => (regionTree[1] ? getCountryCode(regionTree[1].id) : null),
    [regionTree]
  );
  return (
    <>
      <Head>
        <title>{airport.NameEn}</title>
        <meta name="description" content={airport.SeoDescriptionEn} />
      </Head>
      <Header />
      <main className="mb-5 min-h-screen lg:mb-10">
        <RouterSection regionTree={regionTree} name={airport.NameEn} />
        <DescriptionSection
          name={airport.NameEn}
          description={airport.IntroEn}
        />
        <MapSection
          name={airport.NameEn}
          description={airport.SeoDescriptionEn}
          position={{ lng: airport.CenterX, lat: airport.CenterY }}
          polygon={airport.Geometry.coordinates}
        />
        <InfoSection airportInfo={airport} />

        <AirportsAroundSection
          airport={airport}
          description={airport.SeoDescriptionEn}
          airportsAround={airportsAround}
          isAirportsAroundLoading={isAirportsAroundLoading}
        />
        {isRegionsLoading ? (
          <Loader width={60} />
        ) : regionTree[1] && regions && regions.length ? (
          <AllAirportsSection
            regions={regions}
            country={regionTree[1]}
            countryCode={countryCode}
          />
        ) : (
          <></>
        )}
        {/* <PopularFlightsSection name={airport.Name} /> */}
      </main>
      <Footer />
    </>
  );
};

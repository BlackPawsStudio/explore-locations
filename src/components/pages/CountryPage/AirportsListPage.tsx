import type {
  AirportItem,
  AirportsCountType,
  RegionType,
} from "~/src/utils/types";
import { Footer } from "../../Footer";
import { Header } from "../../Header";
import { AirportsByCountrySection } from "./subcomponents/AirportsByCountrySection";
import { DescriptionSection } from "./subcomponents/DescriptionSection";
import { FAQSection } from "../../shared/FAQSection";
import { ListSection } from "./subcomponents/ListSection";
import { MapSection } from "./subcomponents/MapSection";
import { RouterSection } from "./subcomponents/RouterSection";
import { useMemo, useState } from "react";
import Head from "next/head";
import { AirportsAroundListSection } from "./subcomponents/AirportsAroundListSection";
import { getFaqCountryData } from "~/src/data/faq";
import { Loader } from "../../shared/Loader/Loader";

interface CountryPageProps {
  currentRegion: RegionType;
  regionTree: RegionType[];
  airportsAroundRegion: AirportItem[];
  airportsCount: {
    airportsInside: AirportsCountType;
    airportsAround: AirportsCountType;
  };
  sameLevelRegions: RegionType[];
  childRegions: RegionType[];
  countryCode: string | null;
}

export const CountryPage = ({
  currentRegion,
  regionTree,
  airportsAroundRegion,
  airportsCount,
  countryCode,
  childRegions,
  sameLevelRegions,
}: CountryPageProps) => {
  const [airports, setAirports] = useState<AirportItem[]>([]);
  const [isAirportsLoading, setIsAirportsLoading] = useState<boolean>(false);

  const markersCenter = useMemo(() => {
    const coords = {
      lat: 0,
      lng: 0,
    };
    airportsAroundRegion.forEach((el) => {
      coords.lat += el.CenterY;
      coords.lng += el.CenterX;
    });
    coords.lat = airportsAroundRegion.length
      ? coords.lat / airportsAroundRegion.length
      : 0;
    coords.lng = airportsAroundRegion.length
      ? coords.lng / airportsAroundRegion.length
      : 0;
    return coords;
  }, [airportsAroundRegion]);

  const faqQuestions = useMemo(
    () =>
      getFaqCountryData({
        region: currentRegion,
        airportsInRegion: airports.filter(
          (el) => el.Type === "International".toLowerCase()
        ),
        airportAroundRegion: airportsAroundRegion.filter(
          (el) => el.Type === "International".toLowerCase()
        ),
        mostPopularAirport: airports[0],
        closestAirport: airportsAroundRegion[0],
      }),
    [airports, airportsAroundRegion, currentRegion]
  );

  return (
    <>
      <Head>
        <title>
          {`List of Airports in ${currentRegion.Type !== "country" ? "and around" : ""} ${currentRegion.Name} - ExploreLocations.com`}
        </title>
        <meta
          name="description"
          content={`
            List of all major and international airports ${
              currentRegion.Type === "country" ? "from" : "in and around"
            } ${
            currentRegion.Name
          }, as well as domestic and small local airports. Explore them on the map.`}
        />
      </Head>
      <Header />
      <main className="mb-5 min-h-screen lg:mb-10">
        {currentRegion && (
          <>
            <RouterSection regionTree={regionTree} />
            <DescriptionSection
              region={currentRegion}
              airportsCount={{
                all:
                  airportsCount.airportsAround.all +
                  airportsCount.airportsInside.all,
                international:
                  airportsCount.airportsAround.international +
                  airportsCount.airportsInside.international,
                domestic:
                  airportsCount.airportsAround.domestic +
                  airportsCount.airportsInside.domestic,
                local:
                  airportsCount.airportsAround.local +
                  airportsCount.airportsInside.local,
              }}
              country={regionTree[1]?.Name || ""}
            />
            {isAirportsLoading ? (
              <Loader width={60} />
            ) : (
              <MapSection
                region={currentRegion}
                airports={airports.concat(airportsAroundRegion)}
                country={regionTree[1]?.Name || ""}
                center={airportsAroundRegion.length ? markersCenter : undefined}
              />
            )}
            {currentRegion.Type !== "city" && (
              <ListSection
                setAirports={setAirports}
                region={currentRegion}
                airports={airports}
                airportsCount={airportsCount.airportsInside}
                regionTree={regionTree}
                countryCode={countryCode}
                setIsAirportsLoading={setIsAirportsLoading}
              />
            )}
            {airportsAroundRegion.length === 0 ? (
              <></>
            ) : (
              <AirportsAroundListSection
                center={markersCenter}
                airports={airportsAroundRegion}
                regionTree={regionTree}
                region={currentRegion}
                countryCode={countryCode}
              />
            )}
            <FAQSection region={currentRegion} questionsData={faqQuestions} />
            {sameLevelRegions && sameLevelRegions.length ? (
              <AirportsByCountrySection
                regions={sameLevelRegions}
                countryCode={countryCode}
                country={regionTree[1]?.Name || ""}
              />
            ) : (
              <></>
            )}
            {childRegions && childRegions.length ? (
              <AirportsByCountrySection
                regions={childRegions}
                countryCode={countryCode}
                country={currentRegion.Name}
                isIn
              />
            ) : (
              <></>
            )}
            {/* <MoreSection country={regionTree[1]?.Name || ""} /> */}
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

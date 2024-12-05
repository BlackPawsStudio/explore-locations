import type { GetServerSideProps, NextPage } from "next";
import type {
  AirportItem,
  AirportsCountType,
  RegionType,
} from "~/src/utils/types";
import { CountryPage } from "~/src/components/pages/CountryPage";
import {
  getRegions,
  getAirportsAroundRegion,
  getAirportsCountData,
  getRegionTree,
  getSameLevelRegions,
  getChildRegions,
} from "~/src/utils/sqlQueries/regions";
import { getCountryCode } from "~/src/utils/getCountryCode";

interface RegionsPageProps {
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

const RegionsPage: NextPage<RegionsPageProps> = ({
  currentRegion,
  regionTree,
  // airportsInRegion,
  airportsAroundRegion,
  airportsCount,
  countryCode,
  childRegions,
  sameLevelRegions,
}) => {
  return (
    <CountryPage
      currentRegion={currentRegion}
      regionTree={regionTree}
      airportsAroundRegion={airportsAroundRegion}
      airportsCount={airportsCount}
      countryCode={countryCode}
      childRegions={childRegions}
      sameLevelRegions={sameLevelRegions}
    />
  );
};

export default RegionsPage;
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<RegionsPageProps> = async (
  context
) => {
  // const regionName =
  //   typeof context.params?.guides === "string"
  //     ? context.params.guides
  //         .split("-")
  //         .map((el) => el.toLowerCase())
  //         .join(" ")
  //     : "";

  const regionId = context.params && (context.params.id as string);

  const currentRegion = (
    await getRegions()
    // await getRegions(`WHERE "id" = '${regionId || ""}'`)
  )[0];

  console.log(currentRegion)

  if (currentRegion.Geometry) {
    const reversedPolygon = currentRegion.Geometry.coordinates.map((el) =>
      el.map((el) => el.map<[number, number]>((el) => [el[1], el[0]]))
    );

    currentRegion.Geometry = {
      type: currentRegion.Geometry.type,
      coordinates: reversedPolygon,
    };
  }

  const regionTree = (await getRegionTree(regionId || "")).reverse();

  const countryCode = regionTree[1] ? getCountryCode(regionTree[1].id) : null;

  const airportsInside = await getAirportsCountData(regionId || "");

  const airportsAroundRegion =
    currentRegion.Type !== "country" && airportsInside.international < 5
      ? await getAirportsAroundRegion(regionId || "")
      : [];

  const sameLevelRegions = await getSameLevelRegions(
    currentRegion.Type,
    +currentRegion.IdParent
  );

  const childRegions = await getChildRegions(`${currentRegion.id}`);

  return {
    props: {
      currentRegion,
      regionTree,
      airportsAroundRegion,
      airportsCount: {
        airportsInside,
        airportsAround: {
          all: airportsAroundRegion.length,
          international: airportsAroundRegion.filter(
            (el) => el.Type === "International".toLowerCase()
          ).length,
          domestic: airportsAroundRegion.filter(
            (el) => el.Type === "Domestic".toLowerCase()
          ).length,
          local: airportsAroundRegion.filter(
            (el) => el.Type === "Local".toLowerCase()
          ).length,
        },
      },
      sameLevelRegions,
      childRegions,
      countryCode,
    },
  };
};

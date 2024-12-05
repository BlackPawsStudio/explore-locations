import type { GetServerSideProps, NextPage } from "next";
import { AirportPage } from "~/src/components/pages/AirportPage";
import type { AirportItem, RegionType } from "~/src/utils/types";
import { getAirports } from "~/src/utils/sqlQueries/airports";
import { getRegions, getRegionTree } from "~/src/utils/sqlQueries/regions";

interface AirportPageProps {
  airport: AirportItem;
  regionTree: RegionType[];
}

const Airport: NextPage<AirportPageProps> = ({ airport, regionTree }) => {
  return <AirportPage regionTree={regionTree} airport={airport} />;
};

export default Airport;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<AirportPageProps> = async (
  context
) => {
  const airportId = context.params && (context.params.id as string);
  // const airportName =
  //   context.params && Array.isArray(context.params.airport)
  //     ? context.params.airport
  //         .flat()
  //         .map((el) => el.toLowerCase())
  //         .join("/")
  //         .split("_")
  //         .join(" ")
  //     : "";

  const airport = (await getAirports(`WHERE "id" = ${airportId || ""}`))[0];

  if (airport.Geometry) {
    const reversedPolygon = airport.Geometry.coordinates.map((el) =>
      el.map((el) => el.map<[number, number]>((el) => [el[1], el[0]]))
    );

    airport.Geometry = {
      type: airport.Geometry.type,
      coordinates: reversedPolygon,
    };
  }

  const airportRegion = (
    await getRegions(`
    WHERE id = ${airport.RegionId} 
    `)
  )[0];

  const regionTree = (await getRegionTree(`${airportRegion.id}`)).reverse();

  return {
    props: {
      airport,
      regionTree,
    },
  };
};

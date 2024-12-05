import type { GetServerSideProps, NextPage } from "next";
import { FlyingDistancePage } from "~/src/components/pages/FlyingDistancePage";
import { getAirports } from "~/src/utils/sqlQueries/airports";
import { getFlightRoute } from "~/src/utils/sqlQueries/flightRoutes";
import type { AirportItem, FlightDistanceType } from "~/src/utils/types";

interface DistancesPageData {
  flightDistanceData: FlightDistanceType;
  originAirport: AirportItem;
  destinationAirport: AirportItem;
}

const Distance: NextPage<DistancesPageData> = ({
  flightDistanceData,
  originAirport,
  destinationAirport,
}) => {
  return (
    <FlyingDistancePage
      data={flightDistanceData}
      originAirport={originAirport}
      destinationAirport={destinationAirport}
    />
  );
};

export default Distance;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<DistancesPageData> = async (
  context
) => {
  // const directions = Array.isArray(context.query.directions)
  //   ? context.query.directions.map((el) =>
  //       el.toLowerCase().split("_").join(" ")
  //     )
  //   : ["", ""];

  const routeId = context.params && (context.params.id as string);

  const flightDistanceData = (await getFlightRoute(routeId || ""))[0];

  const originAirport = (
    await getAirports(`WHERE "id" = '${flightDistanceData.OriginAirportId}'`)
  )[0];
  const destinationAirport = (
    await getAirports(
      `WHERE "id" = '${flightDistanceData.DestinationAirportId}'`
    )
  )[0];

  return {
    props: {
      flightDistanceData,
      originAirport,
      destinationAirport,
    },
  };
};

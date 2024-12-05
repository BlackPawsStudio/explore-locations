import type { GetServerSideProps, NextPage } from "next";
import { getCities } from "~/src/utils/sqlQueries/cities";
import { getDrivingRoute } from "~/src/utils/sqlQueries/drivingRoutes";
import type { CityType, DrivingDistanceType } from "~/src/utils/types";
import { DrivingDistancePage } from "../../../../components/pages/DrivingDistancePage";

interface DrivingDistancesPageProps {
  drivingDistanceData: DrivingDistanceType;
  originCity: CityType | null;
  destinationCity: CityType | null;
}

const DrivingDistance: NextPage<DrivingDistancesPageProps> = ({
  drivingDistanceData,
  originCity,
  destinationCity,
}) => {
  return (
    <DrivingDistancePage
      drivingDistanceData={drivingDistanceData}
      originCity={originCity}
      destinationCity={destinationCity}
    />
  );
};

export default DrivingDistance;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<
  DrivingDistancesPageProps
> = async (context) => {
  // const directions = Array.isArray(context.query.directions)
  //   ? context.query.directions.map((el) =>
  //       el.toLowerCase().split("_").join(" ")
  //     )
  //   : ["", ""];

  const routeId = context.params && (context.params.id as string);

  const drivingDistanceData = (await getDrivingRoute(routeId || ""))[0];

  console.log(
    drivingDistanceData
  );

  const originCity =
    (
      await getCities(
        `ON c."id" = r."IdOriginal" AND r."id" = '${drivingDistanceData.RegionFromId}'`
      )
    )[0] || null;

    console.log(originCity)

  if (originCity) {
    originCity.Population = String(originCity.Population);
  }

  const destinationCity =
    (
      await getCities(
        `ON c."id" = r."IdOriginal" AND r."id" = '${drivingDistanceData.RegionToId}'`
      )
    )[0] || null;

  if (destinationCity) {
    destinationCity.Population = String(destinationCity.Population);
  }

  return {
    props: {
      drivingDistanceData,
      originCity,
      destinationCity,
    },
  };
};

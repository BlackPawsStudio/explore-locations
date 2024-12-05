import type { GetServerSideProps } from "next";
import { prisma } from "~/src/server/db";
import type { DrivingDistanceType } from "~/src/utils/types";

const GetCountryIDPage = ({ id }: { id: DrivingDistanceType[] }) => {
  return (
    <div className="flex flex-col">
      {id.map((el, idx) => (
        <div key={idx}>
          {`{
            name: '${el.RegionFromCityName} to ${el.RegionToCityName}',
            id: ${el.id} 
          }`}
        </div>
      ))}
    </div>
  );
};

export default GetCountryIDPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const directions = Array.isArray(context.query.directions)
    ? context.query.directions.map((el) =>
        el.toLowerCase().split("_").join(" ")
      )
    : ["", ""];

  const id = await prisma.$queryRawUnsafe<[{ id: number }]>(
    `SELECT "RegionFromCityName", "RegionToCityName", "id" FROM "DrivingRoutes" WHERE LOWER("RegionFromCityName") LIKE '${
      directions[0]?.toLowerCase() || ""
    }%' OR LOWER("RegionToCityName") LIKE '${
      directions[0]?.toLowerCase() || ""
    }%'`
  );

  return {
    props: {
      id: id,
    },
  };
};

import type { GetServerSideProps } from "next";
import { prisma } from "~/src/server/db";
import type { FlightDistanceType } from "~/src/utils/types";

const GetCountryIDPage = ({ id }: { id: FlightDistanceType[] }) => {
  return (
    <div className="flex flex-col">
      {id.map((el, idx) => (
        <div key={idx}>
          {`{
            name: '${el.OriginCityName} to ${el.DestinationCityName}',
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
    `SELECT "OriginCityName", "DestinationCityName", "id" FROM "FlyingRoutes" WHERE LOWER("OriginCityName") LIKE '${
      directions[0] || ""
    }%' OR LOWER("DestinationCityName") LIKE '${
      directions[0] || ""
    }%'`
  );

  return {
    props: {
      id: id,
    },
  };
};

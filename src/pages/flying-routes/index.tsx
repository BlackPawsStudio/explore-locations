import type { NextPage } from "next";
import { FlyingHubPage } from "~/src/components/pages/FlyingHubPage";

const FlyingHub: NextPage = () => {
  return <FlyingHubPage />;
};

export default FlyingHub;

// eslint-disable-next-line @typescript-eslint/require-await
// export const getStaticProps: GetStaticProps = async () => {
//   const topRegions = await getRegions(`ORDER BY "Type" DESC LIMIT 20`);

//   const topLocations = [];

//   for (let i = 0; i < topRegions.length; i++) {
//     const locations = await getFLyingLocationsData(
//       `ON r."OriginCountryName" = '${topRegions[i]?.Name || ""}' LIMIT 5`
//     );
//     topLocations.push({
//       country: topRegions[i]?.Name || "",
//       code: topRegions[i]?.Name || "",
//       locations: locations.map((el) => ({
//         from: el.OriginCityName,
//         to: el.DestinationCityName,
//       })),
//     });
//   }
//   return {
//     props: {
//       topLocations,
//     },
//   };
// };

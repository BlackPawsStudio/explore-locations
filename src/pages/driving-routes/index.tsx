import type { NextPage } from "next";
import { DrivingHubPage } from "~/src/components/pages/DrivingHubPage";

const DrivingHub: NextPage = () => {
  return <DrivingHubPage />;
};

export default DrivingHub;

// export const getStaticProps: GetStaticProps<DrivingHubPageProps> = async () => {
//   const topRegions = await getRegions(`ORDER BY "Type" DESC LIMIT 20`);

//   const topLocations = [];

//   for (let i = 0; i < topRegions.length; i++) {
//     const locations = await getDrivingLocationsData(
//       `ON r."CountryFromName" = '${topRegions[i]?.Name || ""}' LIMIT 5`
//     );
//     topLocations.push({
//       country: topRegions[i]?.Name || "",
//       code: topRegions[i]?.Name || "",
//       locations: locations.map((el) => ({
//         from: el.RegionFromCityName,
//         to: el.RegionToCityName,
//       })),
//     });
//   }
//   return {
//     props: {
//       topLocations: topLocations,
//     },
//   };
// };

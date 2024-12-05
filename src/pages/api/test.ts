import { prisma } from "~/src/server/db";

const a = async () => {
  // const a = await getAirportsAmount(2);
  const a = await prisma.$queryRawUnsafe(
    // `SELECT "Name", "id" FROM "Regions" WHERE "Type" = 'admin_region' AND "IdParent" = '247'`
    `SELECT cr."Name", cr."id", r."Name" as "PName"
     FROM "Regions" cr INNER JOIN "Regions" r
     ON r."id" = cr."IdParent" AND cr."Name" LIKE 'Hessen'`
  );
  console.log(a);
};

export default a;

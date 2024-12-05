import { countriesDefaults } from "../data/hubPagesDefaults/countriesDefaults";

export const getCountryCode = (id: number) => {
  return (
    countriesDefaults
      .map((el) => el.locations)
      .flat()
      .find((el) => el.id === id)?.code || null
  );
};

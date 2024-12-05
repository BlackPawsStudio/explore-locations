import type { CityType } from "~/src/utils/types";
import { CitySection } from "./CitySection";

interface InfoSectionProps {
  originX: number;
  originY: number;
  destinationX: number;
  destinationY: number;
  from: string;
  to: string;
  countryTo: string;
  countryFrom: string;
  dataFrom: CityType | null;
  dataTo: CityType | null;
  countryFromCode: string | null;
  countryToCode: string | null;
  fromId: number;
  toId: number;
}

export const CitiesSection = ({
  originX,
  originY,
  destinationX,
  destinationY,
  from,
  to,
  countryTo,
  countryFrom,
  dataFrom,
  dataTo,
  countryFromCode,
  countryToCode,
  fromId,
  toId,
}: InfoSectionProps) => {
  return (
    <section className="mx-3 grid grid-flow-col grid-cols-1 grid-rows-[repeat(16,auto)] gap-x-5 lg:container lg:grid-cols-2 lg:grid-rows-[repeat(8,auto)]">
      <CitySection
        id={fromId}
        x={originX}
        y={originY}
        name={from}
        country={countryFrom}
        data={dataFrom}
        countryCode={countryFromCode}
      />
      <CitySection
        id={toId}
        x={destinationX}
        y={destinationY}
        name={to}
        country={countryTo}
        data={dataTo}
        countryCode={countryToCode}
      />
    </section>
  );
};

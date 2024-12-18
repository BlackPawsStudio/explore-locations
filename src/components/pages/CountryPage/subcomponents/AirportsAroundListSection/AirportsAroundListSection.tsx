import { SearchIcon } from "~/src/assets";
import type { AirportItem as AirportType, RegionType } from "~/src/utils/types";
import { AirportItem } from "../AirportItem";

interface ListSectionProps {
  region: RegionType;
  airports: AirportType[];
  regionTree: RegionType[];
  center: { lat: number; lng: number };
  countryCode: string | null;
}

export const AirportsAroundListSection = ({
  region,
  airports,
  regionTree,
  center,
  countryCode,
}: ListSectionProps) => {
  return (
    <section className="container">
      <h3 className="mx-3 mb-5 text-lg font-bold tracking-wide lg:text-3xl">
        Airports near <span className="text-buttonBg">{region.Name}</span>- (200
        km / 124 miles radius)
      </h3>
      <div className="flex flex-col justify-center gap-2 px-3 lg:flex-row lg:justify-between lg:px-0">
        <div className="flex gap-2">
          <input
            className="w-72 rounded-md px-4 py-3 tracking-wider lg:py-4"
            placeholder="Airport name"
          />
          <button className="flex w-[3.4rem] items-center justify-center rounded-md bg-redBg">
            <SearchIcon className="text-white" />
          </button>
        </div>
      </div>
      <div className="my-5 flex flex-col gap-3">
        {airports.map((el, idx) => (
          <AirportItem
            key={idx}
            data={el}
            countryCode={countryCode}
            center={center}
            regionName={region.Name}
            country={
              regionTree[
                regionTree.findIndex((el) => el.Name === region.Name) - 1
              ]?.Name || null
            }
          />
        ))}
      </div>
    </section>
  );
};

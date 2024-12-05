import clsx from "clsx";
import type { RegionType } from "~/src/utils/types";
import { ReactCountryFlag } from "react-country-flag";
import Link from "next/link";

interface AllAirportsSectionProps {
  regions: RegionType[];
  country: RegionType;
  countryCode: string | null;
}

export const AllAirportsSection = ({
  regions,
  country,
  countryCode,
}: AllAirportsSectionProps) => {
  return (
    <section className="container mt-5 rounded-md bg-white py-1 shadow-md lg:py-6">
      <h3 className="mb-3 px-5 font-bold leading-8 tracking-wider lg:mb-11 lg:px-8 lg:text-3xl">
        Explore Airports in {regions[0]?.Name}
      </h3>
      <div className="grid grid-cols-1 grid-rows-6 gap-x-24 gap-y-4 px-4 pb-1 lg:grid-cols-2 lg:px-8">
        {regions.map((el, idx) => (
          <div
            className={clsx(
              "flex gap-3 lg:gap-2",
              idx !== regions.length - 2 &&
                idx !== regions.length - 1 &&
                "border-b border-grayBg pb-3"
            )}
            key={el.id}
          >
            <div className="h-5 w-7">
              {countryCode && (
                <ReactCountryFlag
                  countryCode={countryCode}
                  svg
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  className="shadow-[0_0_2px_2px_lightgrey]"
                />
              )}
            </div>
            <Link
              href={`/airports/${el.id}/${el.Name.replaceAll(
                " ",
                "_"
              ).toLowerCase()}`}
              className="text-buttonBg"
            >
              {el.Name}
            </Link>
            {el.closeAirportsCount ? `(${el.closeAirportsCount} airports)` : ""}
          </div>
        ))}
      </div>
      <div className="flex">
        <Link
          href={`/airports/${country.id}/${country.Name.replaceAll(
            " ",
            "_"
          ).toLowerCase()}`}
          className="mx-auto mt-6 rounded-md bg-buttonBg px-16 py-3 text-lg text-white"
        >
          Airports in {regions[0]?.Name}
        </Link>
      </div>
    </section>
  );
};

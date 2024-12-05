import clsx from "clsx";
import type { RegionType } from "~/src/utils/types";
import { ReactCountryFlag } from "react-country-flag";
import Link from "next/link";
import { getCountryCode } from "~/src/utils/getCountryCode";

interface AirportsByCountrySectionProps {
  regions: RegionType[];
  countryCode: string | null;
  country: string;
  isIn?: boolean;
}

export const AirportsByCountrySection = ({
  regions,
  countryCode,
  country,
  isIn,
}: AirportsByCountrySectionProps) => {
  return (
    <section className="container mt-5 rounded-md bg-white py-1 shadow-md lg:py-6">
      <h3 className="mb-3 px-5 font-bold leading-8 tracking-wider lg:mb-11 lg:px-8 lg:text-3xl">
        Explore Airports {isIn ? "in" : "around"} {country}
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
            <div className="h-5 w-7 overflow-hidden rounded-md lg:h-7 lg:w-7">
              {countryCode ? (
                <ReactCountryFlag
                  countryCode={getCountryCode(el.id) || countryCode}
                  svg
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  className="shadow-[0_0_2px_2px_lightgrey]"
                />
              ) : (
                el.Type === "country" && (
                  <ReactCountryFlag
                    countryCode={getCountryCode(el.id) || ""}
                    svg
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    className="shadow-[0_0_2px_2px_lightgrey]"
                  />
                )
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
    </section>
  );
};

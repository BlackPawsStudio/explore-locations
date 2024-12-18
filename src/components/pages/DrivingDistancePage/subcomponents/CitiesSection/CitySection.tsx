import clsx from "clsx";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import ReactCountryFlag from "react-country-flag";
import {
  CityColoredIcon,
  PassengersIcon,
  ArrowRightIcon,
  ClockIcon,
} from "~/src/assets";
import { api } from "~/src/utils/api";
import type { CityType } from "~/src/utils/types";

interface CitySectionProps {
  x: number;
  y: number;
  name: string;
  country: string;
  data: CityType | null;
  countryCode: string | null;
  id: number;
}

export const CitySection = ({
  x,
  y,
  country,
  name,
  data,
  countryCode,
  id,
}: CitySectionProps) => {
  const ClientMap = useMemo(
    () =>
      dynamic(() => import("~/src/components/shared/Map/MapContainer"), {
        ssr: false,
      }),
    []
  );

  const { data: timezoneData } =
    api.drivingRoutePageClient.getTimezones.useQuery(id);

  const airportData = useMemo(
    () => ({
      city: {
        value: "City",
        icon: <CityColoredIcon />,
      },
      population: {
        value: data?.Population
          ? `${(+data.Population).toLocaleString("en-US")}`
          : null,
        icon: <PassengersIcon />,
      },
      country: {
        value: data?.Country || country,
        icon: (
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
        ),
      },
      iata: {
        value: data ? (
          <span className="text-buttonBg">
            {data.Country} / {data.Name}
          </span>
        ) : null,
        icon: <ArrowRightIcon />,
      },
      timezone: {
        value: timezoneData ? timezoneData[0].TimezoneD : "",
        icon: <ClockIcon />,
      },
    }),
    [country, countryCode, data, timezoneData]
  );
  return (
    <>
      <h2 className="relative z-0 w-full rounded-[0.4rem_0.4rem_0_0] bg-white px-3 pb-4 pt-1 text-lg font-bold tracking-wide lg:px-8 lg:pb-5 lg:pt-11 lg:text-3xl">
        {name}
      </h2>
      <div className="h-56 w-full bg-white px-3 lg:h-64 lg:px-8 lg:pb-6">
        <ClientMap
          position={[y, x]}
          mainMarkers={[[y, x]]}
          zoom={11}
          isMuseum
          shouldRemap
        />
      </div>
      {Object.values(airportData).map((el, idx) => (
        <div
          className={clsx(
            "flex w-full items-center gap-3 bg-white px-3 lg:px-8",
            "border-b border-grayText py-[0.84rem] lg:py-5"
          )}
          key={idx}
        >
          {el.value && (
            <>
              {el.icon}
              <span>{el.value}</span>
            </>
          )}{" "}
        </div>
      ))}
      <div className="mb-6 w-full rounded-[0_0_0.4rem_0.4rem] bg-white px-3 pb-4 pt-3 lg:px-8 lg:pb-7">
        {/* <Link
          className="block w-full rounded-md bg-buttonBg py-3 text-center text-lg text-white"
          href={`/airports/${data?.id || ""}/${
            name.replaceAll(" ", "_").toLowerCase() || ""
          }`}
        >
          Explore city
        </Link> */}
      </div>
    </>
  );
};

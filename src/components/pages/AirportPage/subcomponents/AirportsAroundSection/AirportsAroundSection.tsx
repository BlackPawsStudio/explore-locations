import clsx from "clsx";
import dynamic from "next/dynamic";
import { InfoIcon, MarkersIcon } from "~/src/assets";
import MarkerIcon from "~/src/assets/images/icons/marker.svg";
import type { AirportItem } from "~/src/utils/types";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Loader } from "~/src/components/shared/Loader/Loader";

interface AirportsAroundSectionProps {
  airport: AirportItem;
  description: string;
  airportsAround?: AirportItem[];
  isAirportsAroundLoading: boolean;
}

export const AirportsAroundSection = ({
  airport,
  airportsAround,
  description,
  isAirportsAroundLoading,
}: AirportsAroundSectionProps) => {
  const ClientMap = useMemo(
    () =>
      dynamic(() => import("../../../../shared/Map/MapContainer"), {
        ssr: false,
      }),
    []
  );

  const [selectedAirport, setSelectedAirport] = useState<AirportItem | null>(
    null
  );

  const markersCenter = useMemo(() => {
    const coords = {
      lat: 0,
      lng: 0,
    };
    if (airportsAround) {
      airportsAround.forEach((el) => {
        coords.lat += el.CenterY;
        coords.lng += el.CenterX;
      });
      coords.lat = coords.lat / airportsAround.length;
      coords.lng = coords.lng / airportsAround.length;
      return coords;
    } else
      return {
        lat: 0,
        lng: 0,
      };
  }, [airportsAround]);

  return (
    <section
      className="container mb-5 bg-white pb-6 pt-3 lg:rounded-md lg:px-7 lg:pb-0 lg:pt-6"
      id="airports-nearby"
    >
      <h3 className="px-3 text-lg font-bold tracking-wide lg:text-3xl lg:tracking-wider">
        International Airports Near{" "}
        <span className="text-buttonBg">{airport.NameEn}</span>
      </h3>
      {isAirportsAroundLoading ? (
        <Loader width={60} />
      ) : airportsAround && airportsAround.length ? (
        <>
          <div className="relative z-0 mt-3 h-[29.6rem] w-full lg:mb-6 lg:mt-6">
            <div className="relative z-0 h-full">
              <ClientMap
                position={markersCenter}
                mainMarkers={[[airport.CenterY, airport.CenterX]]}
                bounds={airportsAround.map((el) => [el.CenterY, el.CenterX])}
                airportsAround={airportsAround}
                setSelectedAirport={setSelectedAirport}
                selectedAirport={selectedAirport}
              />
            </div>
            {selectedAirport && (
              <div className="absolute right-5 top-7 z-10 hidden w-[20.8rem] rounded-md bg-white p-4 lg:block">
                <div className="mb-4 flex items-center gap-3">
                  <MarkerIcon className="w-10 text-redBg" />
                  <div className="text-lg font-bold leading-5 tracking-tight">
                    {selectedAirport?.NameEn}
                  </div>
                </div>
                <div className="mb-5 flex items-start gap-3">
                  <MarkersIcon className="h-8 w-8" />
                  <p className="leading-7 tracking-wider">
                    <>
                      <span className="font-bold">
                        {selectedAirport?.Distance}km
                      </span>{" "}
                      away from {name}
                    </>
                  </p>
                </div>
                {description && (
                  <div className="flex items-start gap-3">
                    <InfoIcon className="h-8 w-8" />
                    <p className="leading-7 tracking-wider">
                      {description.split(" ").length > 20
                        ? description.split(" ").slice(0, 20).join(" ") + "..."
                        : description}
                    </p>
                  </div>
                )}
                <Link
                  className="mt-4 block w-full rounded-md bg-buttonBg py-3 text-center text-lg text-white"
                  href={`/airport/${selectedAirport?.id}/${
                    selectedAirport?.NameEn.replaceAll(
                      " ",
                      "_"
                    ).toLowerCase() || ""
                  }`}
                >
                  Explore airport
                </Link>
              </div>
            )}
          </div>
          <div className="grid grid-rows-5 gap-x-20 px-3 pb-4 lg:grid-cols-2">
            {airportsAround.map((el, index) => (
              <div
                key={index}
                className={clsx(
                  "pt-4 lg:text-xl lg:tracking-tighter",
                  index !== airportsAround.length - 2 &&
                    index !== airportsAround.length - 1 &&
                    "border-b border-grayBg py-4"
                )}
              >
                <Link
                  href={`/airport/${el.id}/${el.NameEn.replaceAll(
                    " ",
                    "_"
                  ).toLowerCase()}`}
                  className="text-buttonBg"
                >
                  {el.NameEn}
                </Link>{" "}
                ({el.Distance} km away)
              </div>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}
    </section>
  );
};

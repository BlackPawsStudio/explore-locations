import dynamic from "next/dynamic";
import { useMemo } from "react";

interface MapSectionProps {
  OriginCenterX: number;
  OriginCenterY: number;
  DestinationCenterX: number;
  DestinationCenterY: number;
  FlightDuration: string;
  LengthKm: number;
  OriginCityName: string;
  DestinationCityName: string;
}

export const MapSection = ({
  OriginCenterX,
  OriginCenterY,
  DestinationCenterX,
  DestinationCenterY,
  // FlightDuration,
  // LengthKm,
  OriginCityName,
  DestinationCityName,
}: MapSectionProps) => {
  const ClientMap = useMemo(
    () =>
      dynamic(() => import("~/src/components/shared/Map/MapContainer"), {
        ssr: false,
      }),
    []
  );

  const middleCoords = useMemo(() => {
    const srcLatRad = OriginCenterY * (Math.PI / 180);
    const dstLatRad = DestinationCenterY * (Math.PI / 180);
    const middleLatRad = Math.atan(
      Math.sinh(
        Math.log(
          Math.sqrt(
            (Math.tan(dstLatRad) + 1 / Math.cos(dstLatRad)) *
              (Math.tan(srcLatRad) + 1 / Math.cos(srcLatRad))
          )
        )
      )
    );
    const middleLat = middleLatRad * (180 / Math.PI);
    const middleLng = (OriginCenterX + DestinationCenterX) / 2;
    return {
      lat: middleLat,
      lng: middleLng,
    };
  }, [OriginCenterX, OriginCenterY, DestinationCenterX, DestinationCenterY]);

  return (
    <section className="container mb-3 bg-white pt-3 lg:mb-5 lg:rounded-md lg:pt-4 lg:shadow-md">
      <h3 className="mb-2 px-3 text-lg font-bold tracking-wide lg:mb-7 lg:px-7 lg:text-3xl lg:tracking-wider">
        Flying route from {OriginCityName} to {DestinationCityName} on the map
      </h3>
      <div className="relative">
        {/* <div className="absolute right-3 top-9 z-30 w-[15.5rem] rounded-md bg-white p-4 lg:right-11 lg:top-[4.4rem] lg:h-[16rem] lg:w-[21rem]">
          <div className="mb-4 flex items-center gap-3">
            <MarkerIcon className="w-10 text-redBg" />
            <div className="text-md font-bold leading-5 tracking-tight lg:text-lg">
              {OriginCityName} to {DestinationCityName}
            </div>
          </div>
          <div className="mb-4 leading-8 tracking-wider">
            Distance between <span className="font-bold">{OriginCityName}</span>{" "}
            and <span className="font-bold">{DestinationCityName}</span> is{" "}
            {LengthKm} kilometers
          </div>
          <div className=" leading-8 tracking-wider">
            Average flight time is{" "}
            <span className="font-bold">{FlightDuration}</span>
          </div>
        </div> */}
        <div className="relative z-0 h-[29rem] w-full pb-6 lg:h-[30.5rem] lg:px-7">
          <ClientMap
            position={middleCoords}
            mainMarkers={[
              [OriginCenterY, OriginCenterX],
              [DestinationCenterY, DestinationCenterX],
            ]}
            polyline={[
              [OriginCenterY, OriginCenterX],
              [DestinationCenterY, DestinationCenterX],
            ]}
            bounds={[
              [OriginCenterY, OriginCenterX],
              [DestinationCenterY, DestinationCenterX],
            ]}
            shouldRemap
          />
        </div>
      </div>
    </section>
  );
};

import Link from "next/link";
import type { FlightDistanceType } from "~/src/utils/types";

interface RelatedFlightProps {
  country: string;
  relatedAirports: FlightDistanceType[];
}

export const RelatedFlight = ({
  country,
  relatedAirports,
}: RelatedFlightProps) => {
  return (
    <div className="w-full rounded-md bg-white px-3 pb-5 pt-2 lg:w-1/2 lg:px-8 lg:pb-7 lg:pt-9">
      <h3 className="text-xl font-bold lg:mb-7 lg:text-3xl">
        Related Flying Distances from {country}
      </h3>
      <div className="mb-4 hidden justify-between lg:flex">
        <div className="text-xl font-bold">Cities</div>
        <div className="text-xl font-bold">Distance</div>
      </div>
      {relatedAirports.map((el, idx) => (
        <div
          key={idx}
          className="flex justify-between border-b border-grayText py-[0.85rem] lg:py-4"
        >
          <Link
            href={`/flying-route/${el.id}/${el.OriginCityName.replaceAll(
              " ",
              "_"
            ).toLowerCase()}/${el.DestinationCityName.replaceAll(
              " ",
              "_"
            ).toLowerCase()}`}
            className="text-buttonBg"
          >
            {el.OriginCityName} to {el.DestinationCityName}
          </Link>
          <div>{el.LengthKm.toLocaleString("en-US")} km</div>
        </div>
      ))}
    </div>
  );
};

import Link from "next/link";
import type { DrivingDistanceType } from "~/src/utils/types";

interface RelatedFlightProps {
  city: string;
  relatedDistances: DrivingDistanceType[];
}

export const RelatedFlight = ({
  city,
  relatedDistances,
}: RelatedFlightProps) => {
  return (
    <>
      <h3 className="w-full rounded-md bg-white px-3 pt-2 text-xl font-bold lg:px-8 lg:pb-7 lg:pt-9 lg:text-3xl">
        Driving Distances From {city}
      </h3>
      <div className="hidden w-full justify-between bg-white px-3 pb-4 lg:flex lg:px-8">
        <div className="text-xl font-bold">Driving Routes</div>
        <div className="text-xl font-bold">Length</div>
      </div>
      <div className="mb-5 flex w-full flex-col bg-white px-3 pb-5 lg:px-8 lg:pb-7">
        {relatedDistances.map((el, idx) => (
          <div
            key={idx}
            className="flex justify-between border-b border-grayText py-[0.85rem] lg:py-4"
          >
            <Link
              href={`/driving-route/${el.id}/${el.RegionFromCityName.replaceAll(
                " ",
                "_"
              ).toLowerCase()}/${el.RegionToCityName.replaceAll(
                " ",
                "_"
              ).toLowerCase()}`}
              className="text-buttonBg"
            >
              {el.RegionFromCityName} to {el.RegionToCityName}
            </Link>
            <div>{el.DistanceKm.toLocaleString("en-US")} km</div>
          </div>
        ))}
      </div>
    </>
  );
};

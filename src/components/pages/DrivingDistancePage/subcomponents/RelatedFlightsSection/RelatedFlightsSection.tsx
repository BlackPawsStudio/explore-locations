import type { DrivingDistanceType } from "~/src/utils/types";
import { RelatedFlight } from "./RelatedFlight";

interface RelatedFlightsSectionProps {
  fromCity: string;
  toCity: string;
  relatedOriginDistances: DrivingDistanceType[];
  relatedDestinationDistances: DrivingDistanceType[];
}

export const RelatedFlightsSection = ({
  fromCity,
  toCity,
  relatedDestinationDistances,
  relatedOriginDistances,
}: RelatedFlightsSectionProps) => {
  return (
    <section className="container px-3 lg:px-0 grid grid-flow-col grid-cols-1 grid-rows-[repeat(6,auto)] gap-x-5 lg:grid-cols-2 lg:grid-rows-[repeat(3,auto)]">
      <RelatedFlight
        city={fromCity}
        relatedDistances={relatedOriginDistances}
      />
      <RelatedFlight
        city={toCity}
        relatedDistances={relatedDestinationDistances}
      />
    </section>
  );
};

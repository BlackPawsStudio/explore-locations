import Link from "next/link";
import ReactCountryFlag from "react-country-flag";
import { Loader } from "~/src/components/shared/Loader/Loader";
import { SearchModule } from "~/src/components/shared/SearchModule";
import type { AirportItem } from "~/src/utils/types";

interface InfoSectionProps {
  FlightDuration: string;
  DistanceKm: number;
  DistanceMiles: number;
  airportsAroundOrigin: AirportItem[] | null;
  airportsAroundDestination: AirportItem[] | null;
  originAirport: AirportItem;
  destinationAirport: AirportItem;
  countryFromCode: string | null;
  countryToCode: string | null;
  isLoading: boolean;
}

export const InfoSection = ({
  FlightDuration,
  DistanceMiles,
  DistanceKm,
  airportsAroundOrigin,
  airportsAroundDestination,
  originAirport,
  destinationAirport,
  countryFromCode,
  countryToCode,
  isLoading,
}: InfoSectionProps) => {
  return (
    <section className="container mb-4 grid grid-cols-1 grid-rows-[auto_auto] gap-5 lg:grid-cols-[2fr,1fr] lg:grid-rows-1">
      <div className="flex flex-col gap-3">
        <div className="bg-white px-3 pb-5 pt-4 lg:rounded-md lg:px-8 lg:py-5">
          <div className="mb-4 flex items-center gap-2 lg:gap-5">
            <h3 className="text-lg font-bold tracking-[0.08em] lg:text-3xl">
              What&apos;s the flight time from {originAirport.City} to{" "}
              {destinationAirport.City}?
            </h3>
          </div>
          <ul className="flex flex-col gap-3">
            <li className="leading-8 tracking-wide">
              The flight duration from {originAirport.City} to{" "}
              {destinationAirport.City} is {FlightDuration}.
            </li>
            <li>
              The flight time depends on the aircraft cruising speed, weather
              conditions and wind. To calculate it, we have used the average
              flight speed of commercial airplanes which is 500 mph, or around
              804 km/h.
            </li>
            <li className="leading-8  tracking-wide">
              <h3 className="text-lg font-bold tracking-[0.08em] lg:text-3xl">
                What&apos;s the flight distance between {originAirport.City} and{" "}
                {destinationAirport.City}?
              </h3>
            </li>
            <li className="leading-8  tracking-wide">
              The flight distance between {originAirport.City} and{" "}
              {destinationAirport.City} is{" "}
              {DistanceMiles.toLocaleString("en-US")} miles, which is the
              equivalent of {DistanceKm.toLocaleString("en-US")} kilometers.
            </li>
            <li className="leading-8  tracking-wide">
              In the calculation, we have assumed a straight line ( as the crow
              flies ), but the distance might differ, especially if you have a
              stopover.
            </li>
            {isLoading ? (
              <Loader width={60} />
            ) : airportsAroundOrigin && airportsAroundOrigin.length ? (
              <li className="leading-8 tracking-wide">
                <h4 className="font-bold tracking-[0.08em] lg:text-3xl">
                  International Airports near {originAirport.City},{" "}
                  {originAirport.Country}
                </h4>
                Closest International Airports to {originAirport.City}:
                <ul className="flex list-inside list-disc flex-col">
                  {airportsAroundOrigin.map((el, idx) => (
                    <li key={idx}>
                      <Link
                        className="text-buttonBg"
                        href={`/airport/${el.id}/${el.NameEn.replaceAll(
                          " ",
                          "_"
                        ).toLowerCase()}`}
                      >
                        {el.NameEn}
                      </Link>{" "}
                      - {el.Distance} km /{" "}
                      {Math.trunc((el.Distance || 0) * 0.62)} miles away
                      {countryFromCode && (
                        <ReactCountryFlag
                          countryCode={countryFromCode}
                          svg
                          style={{
                            marginLeft: "10px",
                            width: "30px",
                            height: "20px",
                          }}
                          className="shadow-[0_0_2px_2px_lightgrey]"
                        />
                      )}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/airport/${
                    originAirport.id
                  }/${originAirport.NameEn.replaceAll(
                    " ",
                    "_"
                  ).toLowerCase()}#airports-nearby`}
                  className="text-buttonBg"
                >
                  Explore more airports near {originAirport.NameEn}
                </Link>
              </li>
            ) : (
              <></>
            )}
            {isLoading ? (
              <Loader width={60} />
            ) : airportsAroundDestination &&
              airportsAroundDestination.length ? (
              <li className="leading-8 tracking-wide">
                <h4 className="font-bold tracking-[0.08em] lg:text-3xl">
                  International Airports near {destinationAirport.City},{" "}
                  {destinationAirport.City}
                </h4>
                Closest International Airports to {destinationAirport.City}:
                <ul className="flex list-inside list-disc flex-col">
                  {airportsAroundDestination.map((el, idx) => (
                    <li key={idx}>
                      <Link
                        className="text-buttonBg"
                        href={`/airport/${el.id}/${el.NameEn.replaceAll(
                          " ",
                          "_"
                        ).toLowerCase()}`}
                      >
                        {el.NameEn}
                      </Link>{" "}
                      - {el.Distance} km /{" "}
                      {Math.trunc((el.Distance || 0) * 0.62)} miles away
                      {countryToCode && (
                        <ReactCountryFlag
                          countryCode={countryToCode}
                          svg
                          style={{
                            marginLeft: "10px",
                            width: "30px",
                            height: "20px",
                          }}
                          className="shadow-[0_0_2px_2px_lightgrey]"
                        />
                      )}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/airport/${
                    destinationAirport.id
                  }/${destinationAirport.NameEn.replaceAll(
                    " ",
                    "_"
                  ).toLowerCase()}#airports-nearby`}
                  className="text-buttonBg"
                >
                  Explore more airports near {destinationAirport.NameEn}
                </Link>
              </li>
            ) : (
              <></>
            )}
          </ul>
        </div>
        <SearchModule
          title="Explore other flying routes"
          placeholder="Search flying routes"
          defaultFilter="flying-route"
        />
      </div>
    </section>
  );
};

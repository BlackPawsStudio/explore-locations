import { PlanetIcon } from "~/src/assets";
import { SectionDropdown } from "../SectionDropdown";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import Link from "next/link";

interface CountryLocationsSectionProps {
  name: string;
  locations: { name: string; id: number; code: string }[];
  defaultOpen?: boolean;
}

export const CountryLocationsSection = ({
  name,
  locations,
  defaultOpen,
}: CountryLocationsSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);
  return (
    <SectionDropdown
      button={
        <div
          className="mb-5 flex w-full cursor-pointer justify-between lg:pt-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex gap-3">
            <PlanetIcon className="mt-2 h-10 w-10 lg:mt-0 lg:h-14 lg:w-14" />
            <div className="flex flex-col lg:gap-3">
              <h2 className="leading-0 text-lg font-bold lg:text-3xl lg:leading-5">
                {name}
              </h2>
              <h4>See Top {locations.length} Locations</h4>
            </div>
          </div>
          <div className="whitespace-nowrap text-lg text-buttonBg">
            Show {isOpen ? "less" : "more"}
          </div>
        </div>
      }
      isOpen={isOpen}
    >
      <div className="grid-col-1 grid gap-x-6 gap-y-4 lg:grid-cols-3">
        {locations.map((el, idx) => (
          <div className="relative flex w-full gap-2 lg:gap-4" key={idx}>
            <div className="h-8 w-11 overflow-hidden rounded-md">
              <ReactCountryFlag
                countryCode={el.code}
                svg
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="shadow-[0_0_2px_2px_lightgrey]"
              />
            </div>
            <Link
              href={`/airports/${el.id}/${el.name
                .toLowerCase()
                .replaceAll(" ", "_")}`}
              className="flex flex-col items-start"
            >
              <h4 className="text-buttonBg">{el.name}</h4>
            </Link>
          </div>
        ))}
      </div>
    </SectionDropdown>
  );
};

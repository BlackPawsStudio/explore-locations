import { Transition } from "@headlessui/react";
import { iso1A2Code } from "@rapideditor/country-coder";
import clsx from "clsx";
import Link from "next/link";
import { Fragment, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { CarIcon } from "~/src/assets";
import type { LocationsType } from "~/src/utils/types";
import type { categories } from "../SearchModule";

interface TopLocationProps {
  location: LocationsType;
  type: (typeof categories)[number];
  defaultOpen?: boolean;
}

export const TopLocation = ({
  location,
  type,
  defaultOpen,
}: TopLocationProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen || false);
  return (
    <div className="h-fit rounded-md border border-grayText bg-grayBg px-4 py-1 lg:px-3 lg:py-3">
      {location.locations.length ? (
        <>
          <div
            className={"w-full cursor-pointer"}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="relative flex w-full gap-2 lg:gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-11 overflow-hidden rounded-md">
                  <ReactCountryFlag
                    countryCode={iso1A2Code(location.code) || ""}
                    svg
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    className="shadow-[0_0_2px_2px_lightgrey]"
                  />
                </div>
                <Link
                  href={
                    location.id
                      ? `/airports/${location.id}/${location.country
                          .replaceAll(" ", "_")
                          .toLowerCase()}`
                      : {}
                  }
                  className="flex flex-col items-start"
                >
                  <h4 className="text-buttonBg">{location.country}</h4>
                </Link>
              </div>
              <div
                className={clsx(
                  "absolute right-1 top-2 h-3 w-3 rotate-45 border-2 border-transparent border-b-grayColor border-r-grayColor transition-all",
                  isOpen && "rotate-[225deg]"
                )}
              />
            </div>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            show={isOpen}
          >
            <div className="mt-4 flex flex-col px-1">
              <h5 className="text-lg font-bold">
                {location.locations.length} most popular distances
              </h5>
              {location.locations.map((el, idx) => (
                <Link
                  href={`/${type}/${el.id}/${el.name
                    .toLowerCase()
                    .replaceAll(" to ", "/")}`}
                  key={idx}
                  className={clsx(
                    "flex items-center gap-3 border-grayColor py-[0.9rem]",
                    idx !== 0 && "border-t"
                  )}
                >
                  <CarIcon />
                  <h6 className="text-lg text-buttonBg">{el.name}</h6>
                </Link>
              ))}
            </div>
          </Transition>
        </>
      ) : (
        <div
          className="relative flex w-full gap-2 lg:gap-4"
          onClick={(e) => !location.id && e.preventDefault()}
        >
          <div className="h-8 w-11 overflow-hidden rounded-md">
            <ReactCountryFlag
              countryCode={iso1A2Code(location.code) || ""}
              svg
              style={{
                width: "100%",
                height: "100%",
              }}
              className="shadow-[0_0_2px_2px_lightgrey]"
            />
          </div>
          <Link
            href={
              location.id
                ? `/airports/${location.id}/${location.country
                    .replaceAll(" ", "_")
                    .toLowerCase()}`
                : {}
            }
            className="flex flex-col items-start"
          >
            <h4 className="text-buttonBg">{location.country}</h4>
          </Link>
        </div>
      )}
    </div>
  );
};

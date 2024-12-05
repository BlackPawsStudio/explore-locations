import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import { Fragment, useState } from "react";
import { MedalIcon } from "~/src/assets";
import { TopLocation } from "~/src/components/shared/TopLocation";
import { homePageDefaults } from "~/src/data/hubPagesDefaults/homepageDefaults";

export const MostPopularSection = () => {
  const [selectedType, setSelectedType] = useState<keyof typeof homePageDefaults>("Airports By Country");
  return (
    <section className="container mb-1 lg:mb-5">
      <h2 className="mb-2 hidden text-center text-[2.05rem] font-bold lg:block">
        Start Exploring
      </h2>
      <h3 className="mb-[3.7rem] hidden text-center text-lg lg:block">
        Get started with your exploration and get ready for your next adventure.
      </h3>
      <nav className="hidden lg:block">
        <ul className="flex">
          {(Object.keys(homePageDefaults) as (keyof typeof homePageDefaults)[]).map((el, idx) => (
            <li
              className={clsx(
                "flex cursor-pointer items-center gap-2 rounded-[0.375rem_0.375rem_0_0] px-5 py-4 text-lg",
                selectedType === el && "bg-white"
              )}
              onClick={() => setSelectedType(el)}
              key={idx}
            >
              <MedalIcon
                className={clsx(selectedType !== el && "hidden", "h-5 w-5")}
              />
              {el}
            </li>
          ))}
        </ul>
      </nav>
      <Listbox value={selectedType} onChange={setSelectedType}>
        <div className="relative mb-2 lg:hidden">
          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white px-4 py-3 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 lg:py-4">
            {({ open }) => (
              <>
                <span className="px-3">{selectedType}</span>
                <div
                  className={clsx(
                    "absolute right-8 top-1/2 ml-1 h-3 w-3 -translate-y-1/2 rotate-45 border-2 border-transparent border-b-grayColor border-r-grayColor transition-all",
                    open && "rotate-[225deg]"
                  )}
                />
              </>
            )}
          </Listbox.Button>
          <Transition
            as={Fragment}
            enter="transition ease-in duration-100"
            leave="transition ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {(Object.keys(homePageDefaults) as (keyof typeof homePageDefaults)[]).map((option, idx) => (
                <Listbox.Option
                  key={idx}
                  className={clsx("relative items-center px-7 tracking-wider")}
                  value={option}
                  onClick={() => setSelectedType(option)}
                >
                  {option}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      <div className="rounded-md bg-white px-4 pb-7 pt-5 lg:px-7">
        <h4 className="mb-4 lg:mb-6">See our Top {homePageDefaults[selectedType].length} Locations</h4>
        <div className="mb-7 grid gap-x-5 gap-y-3 lg:grid-cols-3">
          {homePageDefaults[selectedType].map((el, idx) => (
            <TopLocation
              key={idx}
              location={el}
              type={
                selectedType === 'Airports By Country' ? 'airports' : 
                selectedType === 'Popular Flying Routes' ? 'flying-route' : 'driving-route' 
              }
              defaultOpen={idx < 6}
            />
          ))}
        </div>
        <div className="w-full text-center">
        <Link href={selectedType === 'Airports By Country' ? '/airports' : 
                selectedType === 'Popular Flying Routes' ? '/flying-routes' : '/driving-routes'} className="rounded-md bg-buttonBg px-10 py-3 text-lg text-white w-fit mx-auto">
          Browse more {selectedType === 'Airports By Country' ? 'countries' : 
                selectedType === 'Popular Flying Routes' ? 'flying routes' : 'driving routes'}
        </Link>
        </div>
      </div>
    </section>
  );
};

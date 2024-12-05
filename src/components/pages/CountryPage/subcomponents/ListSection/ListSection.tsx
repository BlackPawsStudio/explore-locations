import { MarkerIcon } from "~/src/assets";
import {
  useState,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import clsx from "clsx";
import { Listbox, Transition } from "@headlessui/react";
import type {
  AirportItem as AirportType,
  AirportsCountType,
  RegionType,
} from "~/src/utils/types";
import { api } from "~/src/utils/api";
import { useRouter } from "next/router";
import { Pagination } from "./Pagination";
import { AirportItem } from "../AirportItem";
import { SearchModule } from "~/src/components/shared/SearchModule";
import { Loader } from "~/src/components/shared/Loader/Loader";

interface ListSectionProps {
  airports: AirportType[];
  region: RegionType;
  regionTree: RegionType[];
  airportsCount: AirportsCountType;
  countryCode: string | null;
  setAirports: (airports: AirportType[]) => void;
  setIsAirportsLoading: (set: boolean) => void;
}

const paginationLimit = 20;

export const ListSection = ({
  region,
  airports,
  regionTree,
  airportsCount,
  countryCode,
  setAirports,
  setIsAirportsLoading,
}: ListSectionProps) => {
  const sortOptions = useMemo(() => {
    return {
      all: <>All</>,
      international: airportsCount.international ? (
        <>
          <MarkerIcon className="h-5 w-5 text-redText" />
          International
        </>
      ) : null,
      domestic: airportsCount.domestic ? (
        <>
          <MarkerIcon className="h-5 w-5 text-buttonBg" />
          Domestic
        </>
      ) : null,
      local: airportsCount.local ? (
        <>
          <MarkerIcon className="h-5 w-5 text-grayColor" />
          Local
        </>
      ) : null,
    };
  }, [airportsCount]);

  const [sortOption, setSortOption] = useState("all");

  const router = useRouter();

  const [currentRow, setCurrentRow] = useState(
    router.query.page ? +router.query.page - 1 : 0
  );

  const { data, isLoading, refetch } = api.airport.getAirportsSort.useQuery({
    type: sortOption,
    offset: currentRow * paginationLimit,
    limit: paginationLimit,
    regionId: (router.query.id as string) || "",
  });

  //  passing loading data to the parent
  useEffect(() => {
    if (!isLoading) setIsAirportsLoading(isLoading);
  }, [isLoading, setIsAirportsLoading, data]);

  //  calculation of how many pages will be displayed according to airports amount
  const pagesOffset = useMemo(() => {
    const airportsAmount =
      sortOption === "International".toLowerCase()
        ? airportsCount.international
        : sortOption === "Domestic".toLowerCase()
        ? airportsCount.domestic
        : sortOption === "Local".toLowerCase()
        ? airportsCount.local
        : airportsCount.all;
    return (
      Math.floor(airportsAmount / paginationLimit) +
      (airportsAmount % paginationLimit === 0 ? 0 : 1)
    );
  }, [
    airportsCount.all,
    airportsCount.domestic,
    airportsCount.international,
    airportsCount.local,
    sortOption,
  ]);

  const scrollToTop = useCallback(() => {
    if (listTop.current)
      void window.scrollTo({
        left: 0,
        top: listTop.current.offsetTop,
        behavior: "smooth",
      });
  }, []);

  //  passing new data to the parent
  useEffect(() => {
    if (data) {
      setAirports(data);
    }
  }, [data, setAirports]);

  //  element to scroll to when data changes
  const listTop = useRef<HTMLHeadingElement | null>(null);

  const [updatedRoute, setUpdatedRoute] = useState(router.asPath);

  useEffect(() => {
    if (!router.asPath.includes("[")) {
      setUpdatedRoute(router.asPath.split("?")[0] || "");
    }
  }, [router]);

  useEffect(() => {
    setSortOption("all");
    setCurrentRow(0);
    void router.push(
      {
        pathname: router.pathname,
        query: {
          guides: router.query.guides,
          id: router.query.id,
        },
      },
      router.pathname,
      { shallow: true }
    );
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedRoute]);

  //  update ?page= query in the url according to current pagination page
  useEffect(() => {
    void refetch();
    if (currentRow !== 0) {
      void router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            page: `${currentRow + 1}`,
            id: router.query.id,
            guides: router.query.guides,
          },
        },
        undefined,
        { shallow: true }
      );
    } else {
      void router.push(
        {
          pathname: router.pathname,
          query: {
            guides: router.query.guides,
            id: router.query.id,
          },
        },
        router.pathname,
        { shallow: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRow]);

  //  set pagination page to the first one on change of sortOption
  useEffect(() => {
    setCurrentRow(0);
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption]);

  return (
    <section className="container">
      <h3
        className="mx-3 mb-5 text-lg font-bold tracking-wide lg:text-3xl"
        ref={listTop}
      >
        List of Airports in <span className="text-buttonBg">{region.Name}</span>
      </h3>
      {isLoading ? (
        <Loader width={60} />
      ) : data && data.length ? (
        <>
          <div className="flex flex-col justify-center gap-2 px-3 lg:flex-row lg:justify-between lg:px-0">
            <div className="w-full">
              <SearchModule
                noBorder
                placeholder="Airport name"
                defaultFilter="airport"
              />
            </div>
            <>
              <Listbox value={sortOption} onChange={setSortOption}>
                <div className="relative mt-1 lg:hidden">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white px-4 py-3 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 lg:py-4">
                    {({ open }) => (
                      <>
                        <span className="relative flex items-center gap-2 tracking-wider">
                          {sortOption} Airport Types
                        </span>
                        <div
                          className={clsx(
                            "absolute right-6 top-1/2 ml-1 h-3 w-3 -translate-y-1/2 rotate-45 border-2 border-transparent border-b-grayColor border-r-grayColor transition-all",
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
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {Object.entries(sortOptions).map(
                        (option, index) =>
                          option[1] && (
                            <Listbox.Option
                              key={index}
                              className={clsx(
                                "relative flex items-center gap-2 px-4 tracking-wider",
                                sortOption === option[0] && "font-bold"
                              )}
                              value={option[0]}
                              onClick={() => {
                                scrollToTop();
                                setSortOption(option[0]);
                              }}
                            >
                              {sortOption.toLowerCase() === option[0] && (
                                <div className="absolute bottom-0 left-0 h-full w-[0.3rem] rounded-[0_0.3rem_0.3rem_0] bg-redBg" />
                              )}
                              {option[1]}
                            </Listbox.Option>
                          )
                      )}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
              <div className="hidden gap-2 lg:flex">
                {Object.entries(sortOptions).map(
                  (option, index) =>
                    option[1] && (
                      <button
                        onClick={() => {
                          scrollToTop();
                          setSortOption(option[0]);
                        }}
                        key={index}
                        className={clsx(
                          "relative flex h-full items-center gap-2 rounded-md bg-white px-4 tracking-wider shadow-sm",
                          sortOption === option[0] && "font-bold"
                        )}
                      >
                        {sortOption === option[0] && (
                          <div className="absolute bottom-0 left-0 h-[0.3rem] w-full rounded-[0_0_0.3rem_0.3rem] bg-redBg" />
                        )}
                        {option[1]}
                      </button>
                    )
                )}
              </div>
            </>
          </div>
          <div className="my-5 flex flex-col gap-3">
            {airports.map((el, idx) => (
              // <RouteItem key={idx} />
              <AirportItem
                key={idx}
                data={el}
                countryCode={countryCode}
                regionName={region.Name}
                country={
                  regionTree[
                    regionTree.findIndex((el) => el.Name === region.Name) - 1
                  ]?.Name || null
                }
                distance={el.Distance}
              />
            ))}

            {pagesOffset > 1 && (
              <Pagination
                pagesOffset={pagesOffset}
                currentRow={currentRow}
                setCurrentRow={(number) => {
                  setCurrentRow(number);
                  scrollToTop();
                }}
              />
            )}
          </div>
        </>
      ) : (
        <div className="container mb-6 rounded-md bg-white px-3 py-6 text-lg font-bold tracking-wide shadow-md">
          There are no International or Domestic airports in {region.Name}, but
          below you can find airports located on a 200 km buffer around the
          region
        </div>
      )}
    </section>
  );
};

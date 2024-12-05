import clsx from "clsx";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { CarMarkerIcon, MuseumMarkerIcon, SearchIcon } from "~/src/assets";
import { MarkerIcon } from "~/src/assets";
import { api } from "~/src/utils/api";
import _ from "lodash";
import { Loader } from "../Loader/Loader";

interface SearchModuleProps {
  title?: string;
  placeholder?: string;
  defaultFilter?: (typeof categories)[number];
  noBorder?: boolean;
}

export const categories = [
  "all",
  "airport",
  "flying-route",
  "driving-route",
  "airports",
] as const;

export const SearchModule = ({
  title,
  placeholder,
  defaultFilter,
  noBorder,
}: SearchModuleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState(defaultFilter || "all");

  const [searchString, setSearchString] = useState("");

  const { data, isLoading, refetch } = api.search.searchAll.useQuery(
    {
      searchString,
      type: category,
    },
    { enabled: false }
  );

  const debounce = useMemo(
    () =>
      _.debounce(
        () => {
          void refetch();
        },
        1000,
        {
          trailing: true,
        }
      ),
    [refetch]
  );

  useEffect(() => {
    debounce();
  }, [debounce, searchString, category]);

  return (
    <div className="mx-3 h-fit rounded-md bg-white lg:mx-0">
      {title && (
        <div className="rounded-[0.375rem_0.375rem_0_0] bg-redBg px-8 py-5 text-xl font-bold text-white">
          {title}
        </div>
      )}
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={clsx(
          "relative z-[1100] text-lg",
          !noBorder && "px-8 pb-5 pt-7 lg:pb-7"
        )}
      >
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchString(e.target.value)
          }
          className={clsx(
            "w-full rounded-md py-4 pl-3 pr-24 italic",
            noBorder ? "bg-white" : "bg-grayBg"
          )}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
        />
        <SearchIcon className="absolute right-14 top-1/2 -translate-y-1/2 text-red-500" />
        <div
          className={clsx(
            "absolute left-1/2 top-[5.6rem] z-[1200] max-h-0 w-[calc(100vw-24px)] -translate-x-1/2 overflow-hidden rounded-md bg-white px-2 py-0 transition-all duration-[400ms] lg:w-[calc(100%-4rem)]",
            isOpen && "max-h-[100rem] pt-3 shadow-sm"
          )}
        >
          <div className="flex gap-3 overflow-x-auto whitespace-nowrap border-b-2 border-l-grayBg px-3">
            {categories.map((el, idx) => (
              <div
                key={idx}
                className="relative cursor-pointer py-2"
                onClick={() => setCategory(el)}
              >
                {el === "airports"
                  ? "Airports guides"
                  : el === "driving-route"
                  ? "Driving routes"
                  : el === "flying-route"
                  ? "Flying routes"
                  : `${el[0]?.toUpperCase() || ""}${el.substring(
                      1,
                      el.length
                    )}`}
                <div
                  className={clsx(
                    category === el && "opacity-100",
                    "absolute bottom-0 left-1/2 w-full -translate-x-1/2 rounded-[2rem_2rem_0_0] border-0 border-t-4 border-redText opacity-0 transition-all"
                  )}
                />
              </div>
            ))}
          </div>
          <div className="my-1 flex max-h-96 flex-col overflow-auto">
            {isLoading ? (
              <Loader />
            ) : data && data.length ? (
              data.map((el, idx) => (
                <Link
                  href={`/${el.type}/${el.id}/${el.name
                    .toLowerCase()
                    .replaceAll(" - ", "/")
                    .replaceAll(" ", "_")}`}
                  key={idx}
                  className="flex w-full gap-3 border-b-[1px] px-2 py-3 hover:bg-grayBg"
                >
                  {el.type === "driving-route" ? (
                    <CarMarkerIcon className="h-10 w-7" />
                  ) : el.type === "flying-route" ? (
                    <MarkerIcon className="w-7 text-buttonBg" />
                  ) : el.type === "airports" ? (
                    <MuseumMarkerIcon className="h-10 w-7" />
                  ) : (
                    <MarkerIcon className="w-7 text-redBg" />
                  )}
                  <div className="flex flex-col text-base">
                    <div className="font-semibold">{el.name}</div>
                    <div className="text-gray-500">
                      {el.type === "airports"
                        ? "Guide"
                        : `${
                            el.type[0]?.toUpperCase() || ""
                          }${el.type.substring(1, el.type.length)}`.replaceAll(
                            "-",
                            " "
                          )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="mx-auto py-5">Nothing found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

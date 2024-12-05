import Link from "next/link";
import { PinIcon } from "~/src/assets";
import type { RegionType } from "~/src/utils/types";

interface RouterSectionProps {
  regionTree: RegionType[];
  name: string;
}

export const RouterSection = ({ regionTree, name }: RouterSectionProps) => {
  return (
    <div className="overflow-x-auto">
      <section className="container mb-5 mt-6 flex min-w-fit whitespace-nowrap px-3">
        <PinIcon className="mr-1 h-6 w-6" />
        <div className="flex gap-4 text-sm text-grayColor">
          {regionTree.map((item, index) => (
            <span key={index} className="flex gap-4">
              {item && (
                <>
                  <div> / </div>
                  <Link
                    href={`/airports/${item.id}/${item.Name.replaceAll(
                      " ",
                      "_"
                    ).toLowerCase()}`}
                    className={"hover:text-buttonBg"}
                  >
                    {item.Name}
                  </Link>
                </>
              )}
            </span>
          ))}
          <>
            <div> / </div>
            {name}
          </>
        </div>
      </section>
    </div>
  );
};

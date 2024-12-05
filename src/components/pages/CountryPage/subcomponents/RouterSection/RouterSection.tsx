import Link from "next/link";
import { PinIcon } from "~/src/assets";
import type { RegionType } from "~/src/utils/types";

interface RouterSectionProps {
  regionTree: RegionType[];
}

export const RouterSection = ({ regionTree }: RouterSectionProps) => {
  return (
    <div className="overflow-x-auto">
      <section className="container mb-5 mt-6 flex min-w-fit whitespace-nowrap px-3">
        <PinIcon className="mr-1 h-6 w-6" />
        <div className="flex gap-4 text-sm text-grayColor">
          <div className="flex gap-4 hover:text-buttonBg">
            <div> / </div>
            <Link href={"/airports"}>Airports</Link>
          </div>
          {regionTree.map((item, index) => (
            <div key={index} className="flex gap-4 hover:text-buttonBg">
              <div> / </div>
              <Link
                href={`/airports/${item.id}/${item.Name.replaceAll(
                  " ",
                  "_"
                ).toLowerCase()}`}
              >
                {item.Name}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

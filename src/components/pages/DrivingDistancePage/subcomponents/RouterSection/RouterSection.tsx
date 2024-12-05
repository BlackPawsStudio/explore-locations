import Link from "next/link";
import { PinIcon } from "~/src/assets";

export const RouterSection = () => {
  return (
    <section className="container mb-5 mt-6 flex px-3">
      <PinIcon className="mr-1 h-6 w-6" />
      <div className="flex gap-4 text-sm text-grayColor">
        <div> / </div>
        <Link href="/driving-routes">Driving Distances & Routes</Link>
      </div>
    </section>
  );
};

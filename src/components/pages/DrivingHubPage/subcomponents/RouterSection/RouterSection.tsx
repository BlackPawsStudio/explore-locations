import { Fragment } from "react";
import { PinIcon } from "~/src/assets";

export const RouterSection = () => {
  const route = ["Driving hub"];
  return (
    <section className="container mb-5 mt-6 flex px-3">
      <PinIcon className="mr-1 h-6 w-6" />
      <div className="flex gap-4 text-sm text-grayColor">
        {route.map((item, index) => (
          <Fragment key={index}>
            <div> / </div>
            {item}
          </Fragment>
        ))}
      </div>
    </section>
  );
};

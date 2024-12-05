import { SearchModule } from "~/src/components/shared/SearchModule";

export const DescriptionSection = () => (
  <section className="relative mb-6 w-full bg-gradientLeft px-5 lg:mb-9">
    <div className="container pb-4 pt-7 lg:pb-[5.4rem] lg:pt-[5.5rem]">
      <h2 className="relative z-10 mb-10 hidden text-center text-[4.4rem] font-bold leading-[5rem] tracking-wide text-white lg:block">
        Explore and discover airports, popular flying routes and scenic driving
        routes
      </h2>
      <h2 className="relative z-10 mb-7 px-5 text-center text-[2.5rem] font-bold leading-[3rem] tracking-wide text-white lg:hidden">
        You&apos;ll never travel without our trip planner again
      </h2>
      <h3 className="mb-9 text-center leading-7 tracking-wider text-white lg:mb-16">
        ExploreLocations.com helps you find the right airport for your next
        travel, anywhere in the world. You can also discover the most popular
        flying and driving routes, and get the right insights so you can plan
        your adventure like a PRO.
      </h3>
      <SearchModule placeholder="Popular locations" />
    </div>
  </section>
);

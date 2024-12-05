import type { LocationsType } from "~/src/utils/types";
import { Footer } from "../../Footer";
import { Header } from "../../Header";
import { DescriptionSection } from "./subcomponents/DescriptionSection";
import { RouterSection } from "./subcomponents/RouterSection";
import { TopLocationsSection } from "../../shared/TopLocationsSection";
import { CountryLocationsSection } from "./subcomponents/CountryLocationsSection";
import Head from "next/head";
import { drivingHubDefaults } from "~/src/data/hubPagesDefaults";

interface DrivingHubPageProps {
  countryLocations?: LocationsType[];
  countryName?: string;
}

export const DrivingHubPage = ({
  countryLocations,
  countryName,
}: DrivingHubPageProps) => {
  return (
    <>
      <Head>
        <title>{"Explore Popular Driving Routes"}</title>
        <meta name="description" content={"SEO description"} />
      </Head>
      <Header />
      <main className="mb-6 min-h-screen">
        <RouterSection />
        <DescriptionSection />
        <TopLocationsSection
          locations={drivingHubDefaults}
          defaultOpen
          type="driving-route"
          numberOfTabsOpen={100}
        />
        {countryLocations && (
          <CountryLocationsSection
            countryLocations={countryLocations}
            countryName={countryName}
            defaultOpen
          />
        )}
      </main>
      <Footer />
    </>
  );
};

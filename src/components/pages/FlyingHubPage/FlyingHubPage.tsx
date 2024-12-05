import Head from "next/head";
import { flyingHubDefaults } from "~/src/data/hubPagesDefaults";
import type { LocationsType } from "~/src/utils/types";
import { Footer } from "../../Footer";
import { Header } from "../../Header";
import { TopLocationsSection } from "../../shared/TopLocationsSection";
import { CountryLocationsSection } from "./subcomponents/CountryLocationsSection";
import { DescriptionSection } from "./subcomponents/DescriptionSection";
import { RouterSection } from "./subcomponents/RouterSection";

interface FlyingHubPageProps {
  countryLocations?: LocationsType[];
  countryName?: string;
}

export const FlyingHubPage = ({
  countryLocations,
  countryName,
}: FlyingHubPageProps) => {
  return (
    <>
      <Head>
        <title>{"Explore Popular Flying Routes"}</title>
        <meta name="description" content={"SEO description"} />
      </Head>
      <Header />
      <main className="mb-6 min-h-screen">
        <RouterSection />
        <DescriptionSection />
        <TopLocationsSection
          locations={flyingHubDefaults}
          defaultOpen
          type="flying-route"
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
